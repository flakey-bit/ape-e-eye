import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static";

import { Angular2BlurbCmp } from "./components/angular2_blurb_cmp";

@NgModule({
    imports: [BrowserModule, UpgradeModule ],
    declarations: [Angular2BlurbCmp],
    entryComponents: [Angular2BlurbCmp]
  })
export class AppModule {
    constructor(private upgrade: UpgradeModule) {
    }

    public ngDoBootstrap() {
        // Need to have something here, even if it does nothing.
    }
}
