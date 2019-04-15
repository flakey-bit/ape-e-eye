import * as moment from "moment";
import * as angular from "angular";

import "angular-route";
import "angular-animate";
import "angular-toastr";
import "angular-toastr/dist/angular-toastr.min.css";
import "font-awesome/css/font-awesome.css";
import "angular-ui-validate";
import "../vendor/ui-codemirror-0.3.0";

export const Ng1AppModule = angular.module('app', ['ngRoute',
                        'ngAnimate',
                        'ui.validate',
                        'ui.codemirror',
                        'toastr'])
    .config(function($routeProvider) {
        $routeProvider.otherwise({redirectTo: "/currentSearches"});
    });

import "widgets/modal-dialog-widget";
import "widgets/standard-button-widget";
import "./current-searches-view";
import "./search-groups-view";