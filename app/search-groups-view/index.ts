import * as angular from "angular";
import { SearchGroupsController } from "./search-groups.controller";

require('./search-groups.css');
require('widgets/search-group-widget');

angular.module('app')
    .config(function($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when("/searchGroups", {
            template: require('./search-groups.html'),
            controller: SearchGroupsController,
            controllerAs: "$ctrl"
        });
    });
