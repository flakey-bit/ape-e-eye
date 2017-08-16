import { ValidationErrorsWidgetController } from "./validation-errors-widget.controller";

export var ValidationErrorsWidgetComponentConfig: angular.IComponentOptions = {
    controller: ValidationErrorsWidgetController,
    bindings: {
        'validationErrors': '<',
        'visible' : '<'
    },
    transclude: true,
    template: require('./validation-errors-widget.html')
};
