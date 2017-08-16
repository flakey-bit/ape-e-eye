(function(){
    "use strict";

    var ModalDialogWidgetController = function(modalDialog) {
        this._dialogService = modalDialog;
        this.showing = false;
        this.dialogDetails = null;
    };

    ModalDialogWidgetController.prototype.$onInit = function() {
        // Register ourselves with the (singleton) modalDialog service
        this._dialogService.setWidget(this);
    };

    ModalDialogWidgetController.prototype.onCloseClick = function() {
        this.hide();  
    };

    ModalDialogWidgetController.prototype.hide = function () {
        this.showing = false;
    };

    ModalDialogWidgetController.prototype.show = function(title, directive, props) {
        this.dialogDetails = {
            title: title,
            directive: directive,
            props: props
        };

        this.showing = true;
    };

    module.exports = {
        ModalDialogWidgetController: ModalDialogWidgetController
    };
}())