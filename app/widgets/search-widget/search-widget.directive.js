(function(){
    "use strict";

    var SearchWidgetController = require('./search-widget.controller').SearchWidgetController;

    // This is a directive rather than a component for the benefit of animations (link function)
    var SearchWidgetDirective = function($compile, $animate, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            controller: SearchWidgetController,
            controllerAs: "$ctrl",
            template: require('./search-widget.html'),
            bindToController: {
                "search": "<",
                "searchViewController": "<"
            },
            link: function(scope, el, attrs, controller, transclude) {
                var element = angular.element(el[0].getElementsByClassName("swSearchWidget"))[0];
                scope.$watch(function() { return controller.search.LastUpdated}, function(newValue, oldValue) {
                    if (oldValue && newValue.diff(oldValue, 'seconds') > 1) {
                        $animate.addClass(element, "swSearchWidgetUpdated");
                        $timeout(function() {
                            $animate.removeClass(element, "swSearchWidgetUpdated");
                        }, 2000); // Corresponds to .swSearchWidgetUpdated animation-duration
                    }
                });
            }
        };
    }

    module.exports = {
        SearchWidgetDirective: SearchWidgetDirective
    };
}())