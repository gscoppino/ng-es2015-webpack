import angular from 'angular';
import 'angular-mocks';

import MockResourceFactoryService, { MockResource } from './ApiMockBackendFactory.service.js';

export { MockResource };

/**
 * @module ApiMockBackendFactoryModule
 */
export default angular.module('app.services.ApiMockBackendFactory', [
    'ngMockE2E'
])
    .service('MockResourceFactory', MockResourceFactoryService)
    .name;
