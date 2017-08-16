import { EditSearchWidgetComponentConfig } from "./edit-search-widget.component";
import * as angular from "angular";

require('./edit-search-widget.css');

require('widgets/tabbed-panes-widget');
require('widgets/validation-errors-widget');

angular.module("app")
    .component('editSearchWidget', EditSearchWidgetComponentConfig);
