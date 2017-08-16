import { SearchViewRepository } from "../../app/persistence/search-view-repository.service";
import { SearchViewDefinition } from "../../app/persistence/search-view-definition";

describe("SearchViewRepository", function() {
    describe("saveView", function() {
        it("should throw an invalid operation exception if the view name is missing", function() {
            let repository = new SearchViewRepository();
            let definition: SearchViewDefinition = {
                name: undefined,
                groups: []
            }

            expect(() => repository.saveView(definition)).toThrowError("Invalid Operation");
        });
    });

    it("it should be able to round trip a view", function () {
        let repository = new SearchViewRepository();
        let definition: SearchViewDefinition = {
            name: "MyView",
            groups: [
                {
                    baseUrl: "http://www.example.com",
                    minimumPeriod: 5,
                    searches: [
                        {
                            friendlyName: "My test search",
                            url: "http://www.example.com/test-api",
                            handleData: `return data.someProperty.toString();`
                        }
                    ]
                }
            ]
        };

        repository.saveView(definition);
        let roundTrippedView = repository.loadView("MyView");
        expect(roundTrippedView.name).toBe("MyView");
        expect(roundTrippedView.groups.length).toBe(1);
        let roundTrippedGroup = roundTrippedView.groups[0];
        expect(roundTrippedGroup.baseUrl).toBe("http://www.example.com");
        expect(roundTrippedGroup.minimumPeriod).toBe(5);
        expect(roundTrippedGroup.searches.length).toBe(1);
        let roundTrippedSearch = roundTrippedGroup.searches[0];
        expect(roundTrippedSearch.friendlyName).toBe("My test search");
        expect(roundTrippedSearch.url).toBe("http://www.example.com/test-api");
        expect(roundTrippedSearch.handleData).toBe(`return data.someProperty.toString();`);
        expect(roundTrippedSearch.jsonpCallbackParamName).toBeUndefined;
        expect(roundTrippedSearch.omitDefaultTransforms).toBeUndefined;
    });
});
