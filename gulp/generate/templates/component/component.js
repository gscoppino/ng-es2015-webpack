import angular from 'angular';
import <%= UpperCamelCaseName %>Template from './<%= name %>.html';

class <%= UpperCamelCaseName %>Controller {
    static get $inject() { return []; }
    constructor() {
        Object.assign(this, {});
    }

    static get bindings() {
        return {};
    }
    $onInit() {}

    $onChanges(changes) {}

    $doCheck() {}

    $onDestroy() {}

    $postLink() {}
}

const <%= UpperCamelCaseName %>ComponentInjectable = '<%= lowerCamelCaseName %>',
    <%= UpperCamelCaseName %>Component = {
        template: <%= UpperCamelCaseName %>Template,
        controller: <%= UpperCamelCaseName %>Controller,
        bindings: <%= UpperCamelCaseName %>Controller.bindings
    };

export { <%= UpperCamelCaseName %>ComponentInjectable };
export default angular.module('app.components.<%= name %>', [])
    .component(<%= UpperCamelCaseName %>ComponentInjectable, <%= UpperCamelCaseName %>Component)
    .name;
