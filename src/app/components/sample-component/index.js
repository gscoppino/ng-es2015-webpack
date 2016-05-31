import angular from 'angular';

import template from './component.html';
import controller from './component.js';

const SampleComponent = angular.module('app.components.sample', [])
    .component('sampleComponent', {
        template,
        controller
    });

export default SampleComponent.name;
