(function(){
    "use strict";

    var StandardButtonWidgetComponentConfig = {
        template: require('./standard-button-widget.html'),
        controller: function ($location) {
            this._location = $location;
            this.go = function () {
                if (this.href && this.href.path) {
                    this._location.path(this.href.path);
                }
            }
        },
        transclude: true,
        bindings: {
            disabled: '@',
            type: '@',
            href: '<' // Optional
        }  
    };

    module.exports = {
        StandardButtonWidgetComponentConfig: StandardButtonWidgetComponentConfig
    };
}())