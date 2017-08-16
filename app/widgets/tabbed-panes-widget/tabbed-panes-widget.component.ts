import { TabbedPanesWidgetController } from "./tabbed-panes-widget.controller";

export var TabbedPaneWidgetComponentConfig: angular.IComponentOptions = {
    controller: TabbedPanesWidgetController,
    template: require('./tabbed-panes-widget.html'),
    transclude: true
};
