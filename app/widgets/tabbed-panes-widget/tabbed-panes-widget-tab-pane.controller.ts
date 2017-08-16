import { TabbedPanesWidgetController } from "./tabbed-panes-widget.controller";

export class TabbedPanesWidgetTabPaneController implements angular.IController {
    private _selected: boolean;
    private _panesController: TabbedPanesWidgetController;

    constructor() {
        this._selected = false;
    }

    public get selected() {
        return this._selected;
    }

    public set panesController(controller: TabbedPanesWidgetController) {
        this._panesController = controller;
    }

    public setSelected(value: boolean): void {
        this._selected = value;
    }

    public initialize(): void {
        this._panesController.addPane(this);
    }

    public select(): void {
        this._panesController.select(this);
    }

}
