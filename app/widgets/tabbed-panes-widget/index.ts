import { TabbedPaneWidgetComponentConfig } from "./tabbed-panes-widget.component";
import { TabbedPanesWidgetTabPaneDirective } from "./tabbed-panes-widget-tab-pane.directive"
import * as angular from "angular";

require('./tabbed-panes-widget.css');

angular.module("app")
    .component('tabbedPaneWidget', TabbedPaneWidgetComponentConfig)
    .directive('tabbedPaneWidgetPane', TabbedPanesWidgetTabPaneDirective.factory());
