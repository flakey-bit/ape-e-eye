import { SearchDefinition } from "../../persistence/search-definition";

export class EditSearchWidgetViewModel {
    private static handleDataRegex: RegExp = /^function handleData\(data\) {\r?\n([\s|\S]*)\r?\n}$/;
    private static LineIndent: string = "    ";

    private _friendlyName: string;
    private _url: string;
    private _handleData: string;
    private _omitDefaultTransforms?: boolean;
    private _jsonpCallbackParamName?: string;
    private _isJsonP: boolean;

    public static createFromDefinition(searchDefinition: SearchDefinition): EditSearchWidgetViewModel {
        return new EditSearchWidgetViewModel(searchDefinition.friendlyName,
                                             searchDefinition.url,
                                             EditSearchWidgetViewModel.decorateHandleData(searchDefinition.handleData),
                                             searchDefinition.omitDefaultTransforms,
                                             searchDefinition.jsonpCallbackParamName);
    }

    public static createEmpty() {
        return new EditSearchWidgetViewModel(null, null, EditSearchWidgetViewModel.decorateHandleData("// Your code goes here"));
    }

    public toSearchDefinition(): SearchDefinition {
        return {
            friendlyName: this.friendlyName,
            url: this.url,
            handleData: this.undecorateHandleData(),
            omitDefaultTransforms: this.omitDefaultTransforms,
            jsonpCallbackParamName: this.jsonpCallbackParamName
        };
    }

    public validateHandleData(value: string): boolean {
        var match = EditSearchWidgetViewModel.handleDataRegex.exec(value);
        return !!match && !!match[1];
    }

    // ECMAScript properties

    public get friendlyName(): string {
        return this._friendlyName;
    }

    public get url(): string {
        return this._url;
    }

    public get handleData(): string {
        return this._handleData;
    }

    public get omitDefaultTransforms(): boolean {
        return this._omitDefaultTransforms;
    }

    public get isJsonP(): boolean {
        return this._isJsonP;
    }

    public get jsonpCallbackParamName(): string {
        if (!this._isJsonP) {
            return null;
        }
        return this._jsonpCallbackParamName;
    }

    public set friendlyName(value: string) {
        this._friendlyName = value;
    }

    public set url(value: string) {
        this._url = value;
    }

    public set handleData(value: string) {
        this._handleData = value;
    }

    public set omitDefaultTransforms(value: boolean) {
        this._omitDefaultTransforms = value;
    }

    public set isJsonP(value: boolean) {
        this._isJsonP = value;
    }

    public set jsonpCallbackParamName(value: string) {
        this._jsonpCallbackParamName = value;
    }

    // Private implementation

    private static decorateHandleData(handleData: string): string {
        // Assumptions are that the defintion we're persisted has been validated and tidied - so not much to do.
        var lines = handleData.split(/\r?\n/);
        lines = lines.map(l => l ? EditSearchWidgetViewModel.LineIndent + l : l); // Don't indent entirely empty lines.
        lines.splice(0, 0, "function handleData(data) {");
        lines.push("}");
        return lines.join("\n");
    }

    private undecorateHandleData(): string {
        var body = EditSearchWidgetViewModel.handleDataRegex.exec(this._handleData)[1];
        var lines = body.split(/\r?\n/);
        lines = lines.map(function(line) {
            if (line.substring(0, EditSearchWidgetViewModel.LineIndent.length) == EditSearchWidgetViewModel.LineIndent) {
                line = line.substring(EditSearchWidgetViewModel.LineIndent.length);
            }

            return line;
        });

        return lines.join("\n");
    }

    private constructor(friendlyName: string,
                        url: string,
                        handleData: string,
                        omitDefaultTransforms?: boolean,
                        jsonpCallbackParamName?: string) {
        this._friendlyName = friendlyName;
        this._url = url;
        this._handleData = handleData;
        this._omitDefaultTransforms = omitDefaultTransforms;
        this._jsonpCallbackParamName = jsonpCallbackParamName;
        if (jsonpCallbackParamName) {
            this._isJsonP = true;
        }
    }
}
