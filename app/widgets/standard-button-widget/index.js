(function(){
    "use strict";

    require('./standard-button-widget.css');
    
    var StandardButtonWidgetComponentConfig = require('./standard-button-widget.component').StandardButtonWidgetComponentConfig;

    angular.module("app")
        .component('standardButton', StandardButtonWidgetComponentConfig);
}())