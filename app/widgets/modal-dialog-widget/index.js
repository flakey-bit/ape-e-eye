(function(){
    "use strict";

    require('./modal-dialog-widget.css');

    var ModalDialogService = require('./modal-dialog.service').ModalDialogService;
    var ModalDialogWidgetDirective = require('./modal-dialog-widget.directive').ModalDialogWidgetDirective;

    angular.module("app")
        .service('modalDialog', ModalDialogService)
        .directive('modaldialogwidget', ModalDialogWidgetDirective);
}())