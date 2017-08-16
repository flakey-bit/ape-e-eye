import { SearchDefinition } from '../persistence/search-definition';
import { SearchGroupDefinition } from '../persistence/search-group-definition';
import { SearchViewDefinition } from '../persistence/search-view-definition';
import { SearchViewRepository } from "../persistence/search-view-repository.service";

import * as moment from 'moment';

export interface SearchExecutorServiceDataUpdatedCallback {
    (event: SearchDataUpdateEvent): void;
}

export interface SearchResult {
    Definition: SearchDefinition;
    Result: string;
}

export interface SearchDataUpdateEvent {
    UpdatedSearches: SearchResult[];
}

// TODO: Refactor to use webworker(s)
export class SearchExecutorService {
    private _injector: angular.auto.IInjectorService;
    private _toastr: angular.toastr.IToastrService;
    private _log: angular.ILogService;
    private _searchViewRepository: SearchViewRepository;
    private _loadedView: SearchViewDefinition;
    private _running: boolean;
    private _searchGroups: ExecutorSearchGroup[];
    private _subscribers: SearchExecutorServiceDataUpdatedCallback[];
    private _searchResultCache: Map<SearchDefinition, string>;

    constructor($log: angular.ILogService, $injector: angular.auto.IInjectorService, searchViewRepository: SearchViewRepository, toastr: angular.toastr.IToastrService) {
        this._log = $log;
        this._injector = $injector;
        this._searchViewRepository = searchViewRepository;
        this._loadedView = null;
        this._searchGroups = [];
        this._subscribers = [];
        this._toastr = toastr;
        this._searchResultCache = new Map<SearchDefinition, string>();
    }

    public ensureInitialized(): SearchViewDefinition {
        if (this._loadedView) {
            return this._loadedView;
        }

        var viewName = this._searchViewRepository.getDefaultViewName();
        this._loadedView = this._searchViewRepository.loadView(viewName);
        this._updateExecutionGroups(this._loadedView);
        this.start();
        return this._loadedView;
    }

    public start(): void {
        if (!this._running) {
            this._log.debug("SearchExecutorService starting");

            for (const searchGroup of this._searchGroups) {
                searchGroup.start();
            }

            this._log.debug("SearchExecutorService started");
            this._running = true;
        }
    }

    public stop(): boolean {
        var wasRunning = this._running;
        if (this._running) {
            this._log.debug("SearchExecutorService stopping");

            for (const searchGroup of this._searchGroups) {
                searchGroup.stop();
            }

            this._log.debug("SearchExecutorService stopped");
            this._running = false;
        }

        return wasRunning;
    }

    public get isRunning(): boolean {
        return !!this._running;
    }

    // Replaces the current view based on the provided search definitions
    public updateViewDefinition(view: SearchViewDefinition): void {
        if (this._running) {
            throw new Error("Invalid Operation");
        }

        this._updateExecutionGroups(view);
        this._searchViewRepository.saveView(view);
    }

    public subscribe(callback: SearchExecutorServiceDataUpdatedCallback) {
        this._subscribers.push(callback);

        // Provide the subscriber with the latest search results we have cached
        var searchResults: SearchResult[] = [];
        this._searchResultCache.forEach( (value, key) => searchResults.push({
                Definition: key,
                Result: value
            }));

        callback({UpdatedSearches: searchResults});
    }

    private _updateExecutionGroups(view: SearchViewDefinition): void {
        // Merge search groups. The idea here is to avoid creating a new
        // ExecutorSearchGroup / CopmileSearch instances (instead, prefering)
        // to update/reuse existing ones.
        var searchGroupsWorking: ExecutorSearchGroup[] = [];
        for (let newSearchGroup of view.groups) {

            var existingSearchGroup = this._findExistingSearchGroup(newSearchGroup);
            if (existingSearchGroup != null) {
                this._log.debug("Found existing search group: " + existingSearchGroup.definition.baseUrl);
                existingSearchGroup.mergeWith(newSearchGroup);
                searchGroupsWorking.push(existingSearchGroup);
            } else {
                this._log.debug("Had to create new search group: " + newSearchGroup.baseUrl);
                var searchGroup = this._injector.instantiate(ExecutorSearchGroup, {
                    definition: newSearchGroup,
                    successHandler: this._onSearchSuccess,
                    errorHandler: this._onSearchError
                });

                searchGroupsWorking.push(searchGroup);
            }
        }

        this._searchGroups = searchGroupsWorking;
    }

    private _findExistingSearchGroup(groupDefinition: SearchGroupDefinition): ExecutorSearchGroup {
        for (let existingSearchGroup of this._searchGroups) {
            if (existingSearchGroup.definition === groupDefinition) {
                return existingSearchGroup;
            }
        }

        return null;
    }

    // Callback we supply to our ExecutorSearchGroup children
    private _onSearchSuccess: SearchExecutorGroupSuccessHandler = (searchDefinition: SearchDefinition, result: string) => {
        var event = {
            UpdatedSearches: [
                {
                    Definition: searchDefinition,
                    Result: result
                }
            ]
        }

        for (const callback of this._subscribers) {
            callback(event);
        }

        this._searchResultCache.set(searchDefinition, result);
    }

    private _onSearchError: SearchExecutorGroupErrorHandler = (searchDefinition: SearchDefinition, errorMessage: string, exception?: Error) => {
        if (exception && exception.message) {
            errorMessage += " - " + exception.message;
        }
        this._toastr.error('<strong>While exceuting search:</strong> <em>' + searchDefinition.friendlyName+'</em> ' + errorMessage, 'Error', {allowHtml: true});
    }
}

interface SearchExecutorGroupSuccessHandler {
    (definition: SearchDefinition, result: string): void;
}

interface SearchExecutorGroupErrorHandler {
    (definition: SearchDefinition, errorMessage: string, exception?: Error): void;
}

class ExecutorSearchGroup {
    private _httpService: angular.IHttpService;
    private _intervalService: angular.IIntervalService;
    private _timeoutService: angular.ITimeoutService;
    private _log: angular.ILogService;
    private _sce: angular.ISCEService;
    private _successHandler: SearchExecutorGroupSuccessHandler;
    private _errorHandler: SearchExecutorGroupErrorHandler;
    private _definition: SearchGroupDefinition;
    private _searches: CompiledSearch[];
    private _cancelPromise: angular.IPromise<any>;
    private _executingSearch: boolean;
    private _lastSearchIndex: number;
    private _lastSearchCompleted: moment.Moment;
    private _searchingStopped: moment.Moment;

    constructor($http: angular.IHttpService,
                $interval: angular.IIntervalService,
                $timeout: angular.ITimeoutService,
                $log: angular.ILogService,
                $sce: angular.ISCEService,
                successHandler: SearchExecutorGroupSuccessHandler,
                errorHandler: SearchExecutorGroupErrorHandler,
                definition: SearchGroupDefinition) {
        this._httpService = $http;
        this._intervalService = $interval;
        this._timeoutService = $timeout;
        this._log = $log;
        this._sce = $sce;
        this._successHandler = successHandler;
        this._errorHandler = errorHandler;
        this._definition = definition;
        this._searches = definition.searches.map(function(searchDefn) {
            return CompiledSearch.CreateFromDefinition(searchDefn);
        });
        this._cancelPromise = null;
        this._executingSearch = false;
        this._lastSearchIndex = this._searches.length - 1;
    }

    public get definition(): SearchGroupDefinition {
        return this._definition;
    }

    public mergeWith(updatedDefinition: SearchGroupDefinition): void {
        if (this._definition !== updatedDefinition) {
            throw new Error("Invalid operation");
        }

        var searchesWorking: CompiledSearch[] = [];
        for (let newSearch of updatedDefinition.searches) {
            var existingSearch = this._findExistingSearch(newSearch);
            if (existingSearch !== null) {
                this._log.debug("Reused existing search:", newSearch.friendlyName);
                existingSearch.updateFromDefinition(newSearch);
                searchesWorking.push(existingSearch);
            } else {
                this._log.debug("Had to create new search:", newSearch.friendlyName);
                searchesWorking.push(CompiledSearch.CreateFromDefinition(newSearch));
            }
        }

        this._searches = searchesWorking;
        this._lastSearchIndex = this._lastSearchIndex % this._searches.length;
    }

    public start(): void {
        var definitionMinimumPeriod = this._definition.minimumPeriod || 10;
        var intitialDelay = 0;
        if (this._searchingStopped && this._lastSearchCompleted) {
            var elapsed = moment.duration(this._searchingStopped.diff(this._lastSearchCompleted)).asMilliseconds();
            intitialDelay = definitionMinimumPeriod * 1000 - elapsed;
            this._log.debug("Using initial delay of ", intitialDelay, "ms for search group", this.definition.baseUrl);
        }
        this._timeoutService(this._doWork, intitialDelay);
        this._cancelPromise = this._intervalService(this._doWork, definitionMinimumPeriod * 1000);
    }

    public stop(): void {
        this._intervalService.cancel(this._cancelPromise);
        this._searchingStopped = moment();
        this._cancelPromise = null;
    }

    public toString(): string {
        return this._definition.baseUrl + ", delay: " + this._definition.minimumPeriod;;
    }

    private _findExistingSearch(definition: SearchDefinition) {
        for (let search of this._searches) {
            if (search.definition === definition) {
                return search;
            }
        }

        return null;
    }

    private _doWork = (): void => {
        if (this._executingSearch) {
            this._log.debug("Skipping search group ", this.toString(), "as search is in progress");
            return;
        }

        this._executeNextSearch();
    }

    private _executeNextSearch(): void {
        var nextIndex = (this._lastSearchIndex + 1) % this._searches.length;
        var search = this._searches[nextIndex];

        this._executeSearch(search);

        this._lastSearchIndex = nextIndex;
        this._log.info("Executing search: ", this.toString());
        this._executingSearch = true;
    }

    private _executeSearch(compiledSearch: CompiledSearch) {
        let opts: angular.IRequestShortcutConfig = {
        };
        if (compiledSearch.definition.jsonpCallbackParamName) {
            opts.jsonpCallbackParam = compiledSearch.definition.jsonpCallbackParamName;
            this._setRequestConfigOptions(compiledSearch, opts);
            var trustedUrl = this._sce.trustAsResourceUrl(compiledSearch.definition.url);
            this._httpService.jsonp(trustedUrl, opts).then(
                (response: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) => this.genericSuccessHandler(compiledSearch, response),
                (error: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) => this.genericErrorHandler(compiledSearch, error)
            );
        } else {
            this._setRequestConfigOptions(compiledSearch, opts);
            this._httpService.get(compiledSearch.definition.url, opts).then(
                (response: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) => this.genericSuccessHandler(compiledSearch, response),
                (error: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) => this.genericErrorHandler(compiledSearch, error)
            );
        }
    }

    private _setRequestConfigOptions(compiledSearch: CompiledSearch, options: angular.IRequestShortcutConfig) {
        if (!!compiledSearch.definition.omitDefaultTransforms) {
            options.transformResponse = function(data, headersGetter, status) {
                return data; // Identity transform
            };
        }
    }

    private genericSuccessHandler(compiledSearch: CompiledSearch, response: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) {
            var threwError = false;
            var result;
            this._executingSearch = false;
            this._lastSearchCompleted = moment();
            try {
                result = compiledSearch.handleData(response.data);
            } catch (e) {
                threwError = true;
                this._errorHandler(compiledSearch.definition, "User supplied conversion function threw an error", e);
            }

            if (!threwError) {
                if (typeof result !== "string"){
                    this._errorHandler(compiledSearch.definition, "User supplied conversion did not return a string");
                } else {
                    this._successHandler(compiledSearch.definition, result);
                }
            }
    };

    private genericErrorHandler(compiledSearch: CompiledSearch, response: angular.IHttpPromiseCallbackArg<ApiInvocationResult>) {
            this._errorHandler(compiledSearch.definition, "An unknown error occurred");
            this._executingSearch = false;
            this._lastSearchCompleted = moment();
    }
}

// All private implementation details below

class CompiledSearch {
    constructor (public definition: SearchDefinition,
                 public handleData: UserDataHandlerFunc) {}

    static CreateFromDefinition(searchDefn: SearchDefinition): CompiledSearch {
        return new CompiledSearch(searchDefn, <UserDataHandlerFunc> Function("data", searchDefn.handleData));
    }

    public updateFromDefinition(definition: SearchDefinition): void {
        this.handleData = <UserDataHandlerFunc> Function("data", definition.handleData);
    }
}

interface ApiInvocationResult {
    [key: string]: any
}

interface UserDataHandlerFunc {
    (data: ApiInvocationResult): string; // We could allow DOM nodes, too.
}
