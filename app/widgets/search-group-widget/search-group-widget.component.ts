import { SearchGroupWidgetController } from "./search-group-widget.controller";

export var SearchGroupWidgetComponentConfig: angular.IComponentOptions = {
    controller: SearchGroupWidgetController,
    bindings: {
        'searchGroup': '<',
        'searchGroupUpdatedCallback': '<'
    },
    template: require('./search-group-widget.html')
};
