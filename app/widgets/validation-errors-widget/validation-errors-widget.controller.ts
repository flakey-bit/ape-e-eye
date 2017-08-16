export class ValidationErrorsWidgetController implements angular.IController {
    private _visible: boolean;

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }
}
