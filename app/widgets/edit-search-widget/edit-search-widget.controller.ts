import { SearchDefinition } from "../../persistence/search-definition";
import { SearchViewDefinition } from "../../persistence/search-view-definition";
import { EditSearchWidgetViewModel } from "./edit-search-widget.view-model";
import { CurrentSearchesController } from "../../current-searches-view/current-searches.controller"

declare class ModalDialogService {
    closeDialog(): void;
};

export class EditSearchWidgetController implements angular.IController {
    private _currentSearchesController: CurrentSearchesController;
    private _dialogService: ModalDialogService;
    public editorOptions: CodeMirror.EditorConfiguration;

    private _searchDefinition: SearchDefinition;
    private _searchViewDefinition: SearchViewDefinition;

    private _viewModel: EditSearchWidgetViewModel;

    // Angular one-way binding from directive
    set searchDefinition(searchDefinition: SearchDefinition) {
        this._searchDefinition = searchDefinition;
    }

    // Angular one-way binding from directive
    set searchViewDefinition(searchViewDefinition: SearchViewDefinition) {
        this._searchViewDefinition = searchViewDefinition;
    }

    // Angular one-way binding from directive
    set currentSearchesController(currentSearchesController: CurrentSearchesController) {
        this._currentSearchesController = currentSearchesController;
    }

    get viewModel(): EditSearchWidgetViewModel {
        return this._viewModel;
    }

    public onCancelClick(): void {
        this._dialogService.closeDialog();
    }

    public onSaveClick(): void {
        var updatedDefinition = this._viewModel.toSearchDefinition();
        if (this._searchDefinition !== null) {
            this._currentSearchesController.updateSearch(this._searchViewDefinition, this._searchDefinition, updatedDefinition);
        } else {
            this._currentSearchesController.addSearch(this._searchViewDefinition, updatedDefinition);
        }
        this._dialogService.closeDialog();
    }

    constructor(modalDialog: ModalDialogService) {
        this._dialogService = modalDialog;
        this.editorOptions = {
            lineNumbers: true,
            mode: 'javascript',
            gutters: ["CodeMirror-lint-markers"],
            lint: true
        };
    }

    $onInit() {
        if (this._searchDefinition) {
            this._viewModel = EditSearchWidgetViewModel.createFromDefinition(this._searchDefinition);
        } else {
            this._viewModel = EditSearchWidgetViewModel.createEmpty();
        }
    }
}
