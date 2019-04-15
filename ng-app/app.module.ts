import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static";

@NgModule({
    imports: [BrowserModule, UpgradeModule ],
    declarations: [],
    entryComponents: []
  })
export class AppModule {
    constructor(private upgrade: UpgradeModule) {
    }

    public ngDoBootstrap() {
        // Need to have something here, even if it does nothing.
    }
}
