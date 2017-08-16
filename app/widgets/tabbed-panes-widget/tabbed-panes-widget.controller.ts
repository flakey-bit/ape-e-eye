import {TabbedPanesWidgetTabPaneController} from "./tabbed-panes-widget-tab-pane.controller";

export class TabbedPanesWidgetController implements angular.IController {
    public panes: TabbedPanesWidgetTabPaneController[];

    constructor() {
        this.panes = [];
    }

    public select(requestedPane: TabbedPanesWidgetTabPaneController): void {
        for (let pane of this.panes) {
            pane.setSelected(false);
        };

        requestedPane.setSelected(true);
    }

    public addPane(pane: TabbedPanesWidgetTabPaneController): void {
        if (this.panes.length === 0) {
            this.select(pane);
        }

        this.panes.push(pane);
    };
}
