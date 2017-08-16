import { ValidationErrorsWidgetComponentConfig } from "./validation-errors-widget.component";

import * as angular from "angular";

require('./validation-errors-widget.css');

angular.module('app')
    .component('validationErrors', ValidationErrorsWidgetComponentConfig);
