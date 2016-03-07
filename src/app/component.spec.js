import 'angular';
import 'angular-mocks';
import AppModule from './module';
import { AppController } from './component';

beforeEach(module(AppModule.name));
describe('AppComponent ->', function () {
    describe('AppController:', function () {
        let $log, controller;
        
        beforeEach(inject(($injector) => {
            $log = $injector.get('$log');
            controller = new AppController($log);
        }));
        
        describe('login', function () {
            it('should call $log with info.', function () {
                spyOn($log, 'info').and.callThrough();
                controller.login();
                expect($log.info).toHaveBeenCalled(); 
            });
        });
    });
});