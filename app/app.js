(function() {
    "use strict";

    require('moment');
    require('angular');
    require('angular-route');
    require('angular-animate');
    require('angular-toastr');
    require('angular-toastr/dist/angular-toastr.min.css');
    require('font-awesome/css/font-awesome.css');
    require('angular-ui-validate');
    require('../vendor/ui-codemirror-0.3.0');

    angular.module('app', ['ngRoute',
                           'ngAnimate',
                           'ui.validate',
                           'ui.codemirror',
                           'toastr'])
        .config(function($routeProvider) {
            $routeProvider.otherwise({redirectTo: "/currentSearches"});
        });

    require('widgets/modal-dialog-widget');
    require('widgets/standard-button-widget');
    require('./current-searches-view');
    require('./search-groups-view');
}())
