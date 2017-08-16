import { SearchGroupDefinition } from './search-group-definition';
import { SearchDefinition } from './search-definition';
import { SearchViewDefinition } from './search-view-definition';

// Repository for search views
export class SearchViewRepository {
    public static readonly CurrentViewName: string = "current";
    private static readonly LocalStoragePrefix: string = "swSearchViewRepository";
    private static readonly ViewNamesKey: string = SearchViewRepository.LocalStoragePrefix + "__VIEW_NAMES";

    constructor() {
        if (!this._viewNameExists(SearchViewRepository.CurrentViewName)) {
            this._storeDefaultCurrentView();
        }
    }

    public getViewNames(): string[] {
        var viewNamesJson = localStorage.getItem(SearchViewRepository.ViewNamesKey);
        if (!viewNamesJson) {
            return [];
        }

        return JSON.parse(viewNamesJson);
    }

    public loadView(viewName: string): SearchViewDefinition {
        let viewKey = this._getViewKey(viewName);
        let viewJson = localStorage.getItem(viewKey);
        if (!viewJson) {
            throw Error("Data for view '" + viewName + "' was not found!");
        }

        return JSON.parse(viewJson);
    }

    public getDefaultViewName(): string {
        return SearchViewRepository.CurrentViewName;
    }

    public saveView(viewDefinition: SearchViewDefinition): void {
        let viewName = viewDefinition.name;
        if (!viewName) {
            throw new Error("Invalid Operation");
        }
        let viewKey = this._getViewKey(viewName);
        let viewJson = JSON.stringify(viewDefinition);
        localStorage.setItem(viewKey, viewJson);

        if (!this._viewNameExists(SearchViewRepository.CurrentViewName)) {
            var viewNames = this.getViewNames();
            viewNames.push(viewName);
            this._updateViewNames(viewNames);
        }
    }

    public deleteView(viewName: string) {
        let viewKey = this._getViewKey(viewName);
        localStorage.removeItem(viewKey);
        var viewNames = this.getViewNames();
        var idx = viewNames.indexOf(viewName);
        if (idx != -1) {
            viewNames.splice(idx, 1);
            this._updateViewNames(viewNames);
        }
    }

    private _viewNameExists(viewName: string) {
        return this.getViewNames().indexOf(viewName) != -1;
    }

    private _getViewKey(viewName: string) {
        return SearchViewRepository.LocalStoragePrefix + "_" + viewName;
    }

    private _updateViewNames(viewNames: string[]): void {
        var viewNamesJson = JSON.stringify(viewNames);
        localStorage.setItem(SearchViewRepository.ViewNamesKey, viewNamesJson);
    }

    private _storeDefaultCurrentView(): void {
        this.saveView(defaultCurrentView);
    }
}

var defaultCurrentView: SearchViewDefinition = {
    name: SearchViewRepository.CurrentViewName,
    groups: [
        // Fixer.IO
        {
            baseUrl: "http://api.fixer.io",
            minimumPeriod: 5,
            searches: [
                {
                    friendlyName: "USD/GBP rate",
                    url: "http://api.fixer.io/latest?base=USD&symbols=GBP",
                    handleData:
`return "The current USD/GBP rate (as at " + data.date + ") is " + data.rates.GBP;`,
                    omitDefaultTransforms: false
                }
            ]
        },
        // TZDb
        {
            baseUrl: "http://api.timezonedb.com",
            minimumPeriod: 5,
            searches: [
                {
                    friendlyName: "Time in NZ",
                    url: "http://api.timezonedb.com/v2/get-time-zone?key=THJ8LY31UZFV&by=zone&format=json&zone=Pacific/Auckland",
                    handleData:
`if (data.status !== "OK") {
    throw new Error("Unexpected status code: " + data.status+". Error message: "+data.message);
}

return "The time in NZ is currently " + data.formatted + " ("+data.abbreviation+")";`
                },
                {
                    friendlyName: "Time in London",
                    url: "http://api.timezonedb.com/v2/get-time-zone?key=THJ8LY31UZFV&by=zone&format=json&zone=Europe/London",
                    handleData:
`if (data.status !== "OK") {
    throw new Error("Unexpected status code: " + data.status+". Error message: "+data.message);
}

return "The time in London is currently " + data.formatted + " ("+data.abbreviation+")";`
                },
            ]
        },
        // Forismatic
        {
            baseUrl: "https://api.forismatic.com",
            minimumPeriod: 10,
            searches: [
                {
                    friendlyName: "Random Quote",
                    url: "https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en",
                    handleData: `return data.quoteText;`,
                    jsonpCallbackParamName: 'jsonp'
                },
            ]
        },
        // Random number generator
        {
            baseUrl: "https://qrng.anu.edu.au/API",
            minimumPeriod: 20,
            searches: [
                {
                    friendlyName: "Random Number",
                    url: "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8&#8217",
                    handleData: `return data.data[0].toString();`
                }
            ]
        }
    ]
};
