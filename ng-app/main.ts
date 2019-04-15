// Polyfills
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { Ng1AppModule } from '../app/app';

import {setAngularJSGlobal} from '@angular/upgrade/static';
import * as angular from "angular";
setAngularJSGlobal(angular);

window.addEventListener('load', () => {
  platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
    const upgrade = (<any>platformRef.instance).upgrade;
    upgrade.bootstrap(document.body, [Ng1AppModule.name]);
    });
});

