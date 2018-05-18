import angular from 'angular';
import UIRouterModule from '@uirouter/angularjs';

import ConfigModule from 'app/core/config/config.module.js';
import ApiModule from 'app/core/api/api.module.js';
import StoreModule from 'app/core/store/store.module.js';
import RoutesModule from 'app/core/routes/routes.module.js';
import LoaderSpinnerModule from 'app/common/components/loader-spinner/loader-spinner.module.js';

import AppComponentTemplate from './app.component.html';
import AppComponent from './app.component.js';

/**
 * @module AppModule
 * @requires ConfigModule
 * @requires ApiModule
 * @requires StoreModule
 * @requires RoutesModule
 * @requires LoaderSpinnerModule
 * @description Provides the root component of the application and
 *   initializes all other needed modules for the application.
 */
export default angular.module('app', [
    UIRouterModule,
    ConfigModule,
    ApiModule,
    StoreModule,
    RoutesModule,
    LoaderSpinnerModule
])
    .component('app', Object.assign({ template: AppComponentTemplate }, AppComponent))
    .name;
