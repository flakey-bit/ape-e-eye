import * as angular from "angular";
import { CurrentSearchesController } from "./current-searches.controller";

require('app-root/search-executor');
require('app-root/persistence');

require('./current-searches.css');
require('widgets/search-widget');
require('widgets/edit-search-widget');
require('widgets/standard-button-widget');

angular.module('app')
    .config(function($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when("/currentSearches", {
            template: require('./current-searches.html'),
            controller: CurrentSearchesController,
            controllerAs: "$ctrl"
        });
    });
