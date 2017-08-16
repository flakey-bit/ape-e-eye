import { SearchExecutorService } from "../search-executor/search-executor.service";
import { SearchGroupDefinition } from "../persistence/search-group-definition";
import { SearchViewDefinition } from '../persistence/search-view-definition';

export class SearchGroupsController implements angular.IController {
    private _searchExecutor: SearchExecutorService;
    private _currentSearchViewName: string;
    private _currentSearchView: SearchViewDefinition;

    constructor (searchExecutor: SearchExecutorService) {
        this._searchExecutor = searchExecutor;
        this._currentSearchView = this._searchExecutor.ensureInitialized();
    }

    public get searchGroups(): SearchGroupDefinition[] {
        return this._currentSearchView.groups;
    }

    public onSearchGroupUpdated = (definition: SearchGroupDefinition) => {
        var wasRunning = this._searchExecutor.stop();
        this._searchExecutor.updateViewDefinition(this._currentSearchView);
        if (wasRunning) {
            this._searchExecutor.start();
        }
    }
}
