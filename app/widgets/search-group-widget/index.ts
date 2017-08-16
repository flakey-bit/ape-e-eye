import * as angular from "angular";
import { SearchGroupWidgetComponentConfig } from "./search-group-widget.component";

require('./search-group-widget.css');
require('widgets/validation-errors-widget');

angular.module('app')
    .component('searchGroupWidget', SearchGroupWidgetComponentConfig);
