(function(){
    "use strict";

    require('./search-widget.css');

    var SearchWidgetDirective = require('./search-widget.directive').SearchWidgetDirective;

    angular.module("app")
        .directive('searchwidget', SearchWidgetDirective);
}())