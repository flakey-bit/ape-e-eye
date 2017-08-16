import { EditSearchWidgetController } from "./edit-search-widget.controller";

export var EditSearchWidgetComponentConfig: angular.IComponentOptions = {
    controller: EditSearchWidgetController,
    template: require('./edit-search-widget.html'),
    bindings: {
        // One-way binding (we consider these read-only, creating our own viewmodel)
        "searchDefinition": "<",
        "searchViewDefinition": "<",
        "currentSearchesController": "<"
    }
};
