import { SearchDefinition } from "../../../app/persistence/search-definition";
import { EditSearchWidgetViewModel } from "../../../app/widgets/edit-search-widget/edit-search-widget.view-model";

describe("EditSearchWidgetViewModel", function() {
    var createSearchDefinitionWithSpecificHandleData = function (handleData: string): SearchDefinition {
        return {
            friendlyName: "My Search",
            url: "http://example.com",
            handleData: handleData
        };
    };

    describe("createFromDefinition", function() {
        it("should add the function name, argument list and braces to handle data", function() {
            let unwrappedHandleData = require('./edit-search-widget.view-model.test-resources/unwrapped_handle_data_1.txt');
            let searchDefinition: SearchDefinition = createSearchDefinitionWithSpecificHandleData("return data;");

            var vm: EditSearchWidgetViewModel = EditSearchWidgetViewModel.createFromDefinition(searchDefinition);
            let expectedHandleData = require('./edit-search-widget.view-model.test-resources/wrapped_handle_data_1.txt');

            expect(vm.handleData).toBe(expectedHandleData);
        });

        it("should preserve indentation", function() {
            let unwrappedHandleData = require('./edit-search-widget.view-model.test-resources/unwrapped_handle_data_2.txt');
            let searchDefinition: SearchDefinition = createSearchDefinitionWithSpecificHandleData(unwrappedHandleData);

            var vm: EditSearchWidgetViewModel = EditSearchWidgetViewModel.createFromDefinition(searchDefinition);
            var expectedHandleData = require('./edit-search-widget.view-model.test-resources/wrapped_handle_data_2.txt');

            expect(vm.handleData).toBe(expectedHandleData);
        });
    });

    describe("toSearchDefinition", function() {
        it("should strip the function name, argument list and braces from handle data", function () {
            let unwrappedHandleData = require('./edit-search-widget.view-model.test-resources/unwrapped_handle_data_1.txt');
            let searchDefinition: SearchDefinition = createSearchDefinitionWithSpecificHandleData("return data;");
            var vm: EditSearchWidgetViewModel = EditSearchWidgetViewModel.createFromDefinition(searchDefinition);

            var roundTrippedDefinition = vm.toSearchDefinition();
            expect(roundTrippedDefinition.handleData).toBe(unwrappedHandleData);
        })

        it("should preserve indentation", function() {
            let unwrappedHandleData = require('./edit-search-widget.view-model.test-resources/unwrapped_handle_data_2.txt');
            let searchDefinition: SearchDefinition = createSearchDefinitionWithSpecificHandleData(unwrappedHandleData);
            var vm: EditSearchWidgetViewModel = EditSearchWidgetViewModel.createFromDefinition(searchDefinition);

            var roundTrippedDefinition = vm.toSearchDefinition();
            expect(roundTrippedDefinition.handleData).toBe(unwrappedHandleData);
        });
    });
});
