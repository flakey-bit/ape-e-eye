(function(){
    "use strict";

    var ModalDialogWidgetController = require('./modal-dialog-widget.controller').ModalDialogWidgetController;

    var ModalDialogWidgetDirective = function($compile, $animate, $document, modalDialog) {
        return {
            transclude: {
                'dialogContent': '?content' 
            },
            controller: ModalDialogWidgetController,
            controllerAs: "$ctrl",
            bindToController: true,
            scope: {},
            template: require('./modal-dialog-widget.html'),            
            link: function(scope, el, attrs, controller, transclude) {
                // Dispel with the ESC key for convenience.
                $document.bind('keyup', function(e) {
                    if (e.which === 27) {
                        modalDialog.closeDialog();
                        scope.$digest();
                    }
                });

                el.addClass('swModalWidgetRoot');
                scope.$watch(function() { return controller.showing}, function(newShowingVal) {
                    if (newShowingVal) {
                        $animate.addClass(el, 'swModalWidgetRootShowing').then(function() {
                            el.removeClass('swModalWidgetRootHidden');
                        });
                    }  else {
                        $animate.removeClass(el, 'swModalWidgetRootShowing').then(function() {
                            el.addClass('swModalWidgetRootHidden');
                        });
                    }
                });

                scope.$watch(function() { return controller.dialogDetails }, function(updatedDetails) {
                    if (!controller.dialogDetails)
                        return;

                    // The displayed dialog has changed. Remove any (non-angular) properties
                    // from the scope prior to adding the new properties (prevent leakage)
                    for (const propName in scope) {
                        if (propName.substring(0, 1) != "$" && scope.hasOwnProperty(propName)) {
                            delete scope[propName];
                        }
                    }

                    var props = controller.dialogDetails.props;
                    for (const propName in props) {
                        if (props.hasOwnProperty(propName)) {
                            scope[propName] = props[propName];
                        }
                    }

                    var publicLinkFn = $compile(controller.dialogDetails.directive);

                    publicLinkFn(scope, function(cloned, scope) {
                        // Dirty, dirty jQuery.
                        var insertionPoint = angular.element(el[0].getElementsByClassName("swModalDialogWidgetContent"));
                        while (insertionPoint[0].hasChildNodes()) {
                            insertionPoint[0].removeChild(insertionPoint[0].lastChild);
                        }
                        insertionPoint.append(cloned);
                    });
                });
            }
        };
    };

    module.exports = {
        ModalDialogWidgetDirective: ModalDialogWidgetDirective
    };
}())