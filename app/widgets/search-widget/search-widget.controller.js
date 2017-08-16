(function(){
    var SearchWidgetController = function() {
    };

    SearchWidgetController.prototype.$onInit = function() {
    };

    SearchWidgetController.prototype.editClick = function() {
        this.searchViewController.editSearch(this.search);
    };

    SearchWidgetController.prototype.deleteClick = function() {
        this.searchViewController.deleteSearch(this.search);
    };

    module.exports = {
        SearchWidgetController: SearchWidgetController
    };
}())