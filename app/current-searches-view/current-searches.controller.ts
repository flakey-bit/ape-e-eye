import { SearchExecutorService, SearchDataUpdateEvent, SearchExecutorServiceDataUpdatedCallback } from "../search-executor/search-executor.service";
import { SearchDefinition } from "../persistence/search-definition";
import { SearchGroupDefinition } from "../persistence/search-group-definition";
import { SearchViewDefinition } from '../persistence/search-view-definition';
import * as moment from 'moment';

interface props {
     [selector: string]: any;
}

declare class ModalDialogService {
    showDialog(title: string, dialogContent: string, props?: props): void;
};

class SearchViewModel {
    LastResult: string;
    LastUpdated: moment.Moment;

    constructor(public Definition: SearchDefinition) {}

    public setResult(result: string) {
        this.LastResult = result;
        this.LastUpdated = moment();
    }
}

export class CurrentSearchesController implements angular.IController {
    private static readonly defaultMinimumPeriod = 15;

    private _searchExecutor: SearchExecutorService;
    private _dialogService: ModalDialogService;
    private _searches: SearchViewModel[];
    private _currentSearchView: SearchViewDefinition;

    constructor (searchExecutor: SearchExecutorService,
                 modalDialog: ModalDialogService) {
        this._dialogService = modalDialog;
        this._searchExecutor = searchExecutor;

        this._currentSearchView = this._searchExecutor.ensureInitialized();

        var allSearches = [];
        for (const searchGroupDefn of this._currentSearchView.groups) {
            for (const searchDefn of searchGroupDefn.searches) {
                allSearches.push(new SearchViewModel(searchDefn));
            }
        }

        this._searches = allSearches;

        // Register with the search data service to be notified of changes to our searches.
        this._searchExecutor.subscribe(this.onSearchDataUpdated);
    }

    public editSearch(search: SearchViewModel) {
        var title = "Editing search: " + search.Definition.friendlyName;
        var dialogContent = require('./edit-search-dialog.html');
        // These are bound one-way (not mutated directly)
        this._dialogService.showDialog(title, dialogContent, {
            searchDefinition: search.Definition,
            searchViewDefinition: this._currentSearchView,
            currentSearchesController: this,
        });
    }

    public updateSearch(view: SearchViewDefinition, existingSearch: SearchDefinition, updatedSearch: SearchDefinition) {
        var wasRunning = this._searchExecutor.stop();
        existingSearch.friendlyName = updatedSearch.friendlyName;
        existingSearch.handleData = updatedSearch.handleData;
        existingSearch.url = updatedSearch.url;
        existingSearch.omitDefaultTransforms = updatedSearch.omitDefaultTransforms;
        existingSearch.jsonpCallbackParamName = updatedSearch.jsonpCallbackParamName;
        this._searchExecutor.updateViewDefinition(this._currentSearchView);
        if (wasRunning) {
            this._searchExecutor.start();
        }
    }

    public deleteSearch(search: SearchViewModel) {
        // Remove the view model for the search
        for (var i=0; i<this._searches.length; i++) {
            if (this._searches[i] === search) {
                this._searches.splice(i, 1);
                break;
            }
        }

        var existing = this._findSearchGroupIndexForSearch(search.Definition);
        if (existing) {
            var wasRunning = this._searchExecutor.stop();
            var group = this._currentSearchView.groups[existing.groupIndex];
            group.searches.splice(existing.searchIndex, 1);
            if (group.searches.length == 0) {
                this._currentSearchView.groups.splice(existing.groupIndex, 1);
            }

            this._searchExecutor.updateViewDefinition(this._currentSearchView);
            if (wasRunning) {
                this._searchExecutor.start();
            }
        }
    }

    public onAddButtonClicked() {
        var title = "Add new search";
        var dialogContent = require('./edit-search-dialog.html');
        // These are bound one-way (not mutated directly)
        this._dialogService.showDialog(title, dialogContent, {
            searchDefinition: null,
            searchViewDefinition: this._currentSearchView,
            currentSearchesController: this,
        });
    }

    public addSearch(view: SearchViewDefinition, search: SearchDefinition) {
        var wasRunning = this._searchExecutor.stop();

        var groupForSearch: SearchGroupDefinition = this._findGroupForSearch(search, this._currentSearchView);
        if (groupForSearch === null) {
            groupForSearch = this._addGroupForSearch(search, this._currentSearchView);
        }

        groupForSearch.searches.push(search);

        this._searchExecutor.updateViewDefinition(this._currentSearchView);
        this._searches.push(new SearchViewModel(search));
        if (wasRunning) {
            this._searchExecutor.start();
        }
    }

    public toggleSearchExecutor(): void {
        if (this._searchExecutor.isRunning) {
            this._searchExecutor.stop();
        } else {
            this._searchExecutor.start();
        }
    }

    public get searches(): SearchViewModel[] {
        return this._searches;
    }

    public get executorIsRunning(): boolean {
        return this._searchExecutor.isRunning;
    }

    // Private implementation

    private _findSearchGroupIndexForSearch(needle: SearchDefinition): LocateSearchResult {
        for (let groupIndex=0; groupIndex < this._currentSearchView.groups.length; groupIndex++) {
            let group = this._currentSearchView.groups[groupIndex];
            for (let searchIndex=0; searchIndex<group.searches.length; searchIndex++) {
                if (group.searches[searchIndex] === needle) {
                    return {
                        groupIndex: groupIndex,
                        searchIndex: searchIndex
                    };
                }
            }
        }

        return null;
    }

    private onSearchDataUpdated: SearchExecutorServiceDataUpdatedCallback = (event: SearchDataUpdateEvent): void => {
        for (const updatedSearch of event.UpdatedSearches) {
            // Not an efficent approach.
            for (const searchViewModel of this._searches) {
                if (searchViewModel.Definition === updatedSearch.Definition) {
                    searchViewModel.setResult(updatedSearch.Result);
                }
            }
        }
    }

    private _findGroupForSearch(search: SearchDefinition, view: SearchViewDefinition): SearchGroupDefinition {
        var baseUrl = this._getBaseUrl(search.url);
        for (let group of view.groups) {
            if (group.baseUrl === baseUrl) {
                return group;
            }
        }

        return null;
    }

    private _addGroupForSearch(search: SearchDefinition, view: SearchViewDefinition): SearchGroupDefinition {
        var group: SearchGroupDefinition = {
            baseUrl: this._getBaseUrl(search.url),
            minimumPeriod: CurrentSearchesController.defaultMinimumPeriod,
            searches: []
        }

        view.groups.push(group);
        return group;
    }

    private _getBaseUrl(url: string): string {
        var anchor = document.createElement('a');
        anchor.href = url;
        return anchor.protocol + "//" + anchor.hostname + (anchor.port !== undefined ? ":" + anchor.port : "")
    }
}

interface LocateSearchResult {
    groupIndex: number,
    searchIndex: number
}
