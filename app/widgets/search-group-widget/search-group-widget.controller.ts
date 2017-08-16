import { SearchGroupDefinition } from "../../persistence/search-group-definition";

interface SearchGroupUpdatedCallback {
    (definition: SearchGroupDefinition): void
};

export class SearchGroupWidgetController implements angular.IController {
    private _callback: SearchGroupUpdatedCallback;
    private _searchGroup: SearchGroupDefinition;

    // One-way angular binding
    public set searchGroup(value: SearchGroupDefinition) {
        this._searchGroup = value;
    }

    // One-way angular binding
    public set searchGroupUpdatedCallback(callback: SearchGroupUpdatedCallback) {
        this._callback = callback;
    }

    public get searchGroup(): SearchGroupDefinition {
        return this._searchGroup;
    }

    public invokeSearchGroupUpdatedCallback(): void {
        if (this._callback)
            this._callback(this._searchGroup);
    }
}
