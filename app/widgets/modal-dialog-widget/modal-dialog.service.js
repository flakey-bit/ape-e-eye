(function(){
    var ModalDialogService = function() {
        this._controller = null;
    };

    ModalDialogService.prototype.setWidget = function(controller){
        if (this._controller !== null) {
            throw new Error("Controller has already been set");
        }

        if (!controller) {
            throw new Error("Controller must be provided");
        }

        this._controller = controller;
    };

    ModalDialogService.prototype.showDialog = function(title, newDirective, props) {
        if (this._controller === null) {
            throw new Error("ModalDialogWidgetController has not registered, is there a modaldialogwidget on the page?");
        }

        this._controller.show(title, newDirective, props);
    };

    ModalDialogService.prototype.closeDialog = function () {
        this._controller.hide();
    };

    module.exports = {
        ModalDialogService: ModalDialogService
    };
}())