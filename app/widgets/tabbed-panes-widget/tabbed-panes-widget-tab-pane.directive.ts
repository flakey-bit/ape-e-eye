import { TabbedPanesWidgetTabPaneController } from "./tabbed-panes-widget-tab-pane.controller";
import { TabbedPanesWidgetController } from "./tabbed-panes-widget.controller";

interface RequiedControllers {
    [key: string]: angular.IController;
}

// This needs to be a directive due to how it fiddles with the offset height of the content node.
export class TabbedPanesWidgetTabPaneDirective implements angular.IDirective {
    constructor(private $compile: angular.ICompileService) {
    }

    public controller = TabbedPanesWidgetTabPaneController;
    public controllerAs = "$ctrl";
    public template: string = require('./tabbed-panes-widget-tab-pane.html');
    public transclude = true;
    public require = {
        thisPane: "tabbed-pane-widget-pane",
        tabbedPaneWidgetController: "^tabbed-pane-widget"
    };
    public scope = {
        title: '@'
    }

    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: RequiedControllers) => {
        let $ctrl = controllers["thisPane"] as TabbedPanesWidgetTabPaneController;
        $ctrl.panesController = controllers.tabbedPaneWidgetController as TabbedPanesWidgetController;
        $ctrl.initialize();

        scope.$watch(function() { return $ctrl.selected}, function(newSelectedVal) {
            var contentNode: HTMLElement = <HTMLElement> element[0].getElementsByClassName("swTabbedPanesWidgetTabPaneContent")[0];
            var wrapperNode: HTMLElement = <HTMLElement> element[0].getElementsByClassName("swTabbedPanesWidgetTabPane")[0];
            if (newSelectedVal) {
                wrapperNode.style.height = contentNode.offsetHeight + "px";
            }  else {
                wrapperNode.style.height = "0px";
            }
        });
    }

    static factory(): ng.IDirectiveFactory {
        const directive = ($compile: angular.ICompileService) => new TabbedPanesWidgetTabPaneDirective($compile);
        directive.$inject = ['$compile'];
        return directive;
    }
}
