import angular from 'angular';

import { API_BASE } from 'app/core/api/api.module.js';

import ApiMockBackendFactoryModule, { MockResource } from './ApiMockBackendFactory.module.js';

beforeEach(angular.mock.module(ApiMockBackendFactoryModule));

describe('MockResource', () => {
    let mockCollection = [{ id: 1 }], resource, nestedResource;

    it('should create a new empty collection if none is passed.', () => {
        expect(new MockResource('test').collection).toEqual([]);
    });

    it('should start at highest ID value of 0 if no collection is passed.', () => {
        expect(new MockResource('test').highestId).toBe(0);
    });

    it('should not have any nested resources by default.', () => {
        expect(new MockResource('test').nestedResources).toEqual([]);
    });

    it('should define a value that can be used to query a foreign relationship.', () => {
        expect(new MockResource('test').nestedFK).toBe('test');
        // Should convert resource name to singular if plural
        expect(new MockResource('tests').nestedFK).toBe('test');
    });

    beforeEach(() => {
        nestedResource = new MockResource('test2');
        resource = new MockResource('test', mockCollection, [nestedResource]);
    });

    it('should initialize with the given collection, if passed.', () => {
        expect(resource.collection).toEqual(mockCollection);

        // Ensure immutability
        expect(resource.collection).not.toBe(mockCollection);
    });

    it('should start highest ID at the top value in the collection passed.', () => {
        expect(resource.highestId).toBe(1);
    });

    it('should initialize with the given nested resources, if passed.', () => {
        expect(resource.nestedResources).toContain(nestedResource);
    });

    describe('_getHighestId', () => {
        it('should return the highest id in the collection of elements passed.', () => {
            expect(MockResource._getHighestId([])).toBe(0);

            expect(MockResource._getHighestId([
                { id: 0 }
            ])).toBe(0);

            expect(MockResource._getHighestId([
                { id: 1 }
            ])).toBe(1);

            expect(MockResource._getHighestId([
                { id: 1 },
                { id: 100 }
            ])).toBe(100);
        });
    });

    describe('respondToGET', () => {
        it('should return a 200 OK with the entire collection if there are no params provided.', () => {
            let response = resource.respondToGET(null, null, null, null, null);
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual(mockCollection);

            // Ensure immutability
            expect(response[1]).not.toBe(resource.collection);
        });

        it('should return a 200 OK with a filtered collection if there are params provided, but no id.', () => {
            let mockElement = { name: 'John' };
            resource.collection.push(mockElement);

            let response = resource.respondToGET(null, null, null, null, { name: 'John' });
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual([mockElement]);

            // Ensure immutability
            expect(response[1][0]).not.toBe(mockElement);
        });

        it('should return a 200 OK with the element of the specified id, if id param is provided.', () => {
            let mockElement = { id: 1 };
            resource.collection.push(mockElement);

            let response = resource.respondToGET(null, null, null, null, { id: 1 });
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual(mockElement);

            // Ensure immutability
            expect(response[1]).not.toBe(mockElement);
        });

        it('should return a 404 NOT FOUND with status message if the element of the specified id is not found.', () => {
            let response = resource.respondToGET(null, null, null, null, { id: 2 });
            expect(response[0]).toBe(404);
            expect(response[1]).toEqual(jasmine.any(String));
        });
    });

    describe('respondToPOST', () => {
        it('should return a 201 CREATED with the new element, assigning it a unique ID.', () => {
            let response = resource.respondToPOST(null, null, JSON.stringify({ description: 'A new element.' }), null, {});
            expect(response[0]).toBe(201);
            expect(response[1]).toEqual({ id: 2, description: 'A new element.' });

            // Ensure immutability
            expect(resource.collection.find((element) => element === response[1])).toBeFalsy();
        });

        it('should update the collection with the new element.', () => {
            resource.respondToPOST(null, null, JSON.stringify({ description: 'A new element.' }), null, {});
            expect(resource.collection).toContain({ id: 2, description: 'A new element.' });
        });
    });

    describe('respondToPUT', () => {
        it('should return a 200 OK with the updated element of the specified id', () => {
            resource.collection.push({ id: 2 });
            let response = resource.respondToPUT(null, null, JSON.stringify({ description: 'An updated element.' }), null, { id: 2 });
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual({ id: 2, description: 'An updated element.' });

            // Ensure immutability
            expect(resource.collection.find((element) => element === response[1])).toBeFalsy();
        });

        it('should update the collection element with the new data, ignoring any "id" property in the data.', () => {
            resource.collection.push({ id: 2 });
            resource.respondToPUT(null, null, JSON.stringify({ id: 3, description: 'An updated element.' }), null, { id: 2 });
            expect(resource.collection).toContain({ id: 2, description: 'An updated element.' });
        });

        it('should return a 404 NOT FOUND with status message if the element of the specified id is not found.', () => {
            let response = resource.respondToPUT(null, null, JSON.stringify({ description: 'An updated element' }), null, { id: 2 });
            expect(response[0]).toBe(404);
            expect(response[1]).toEqual(jasmine.any(String));
        });
    });

    describe('respondToDELETE', () => {
        it('should return a 200 OK with the deleted element of the specified id.', () => {
            resource.collection.push({ id: 2 });
            let response = resource.respondToDELETE(null, null, null, null, { id: 2 });
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual({ id: 2 });
        });

        it('should remove the element from the collection', () => {
            resource.collection.push({ id: 2 });
            resource.respondToDELETE(null, null, null, null, { id: 2 });
            expect(resource.collection).not.toContain({ id: 2 });
        });

        it('should return a 200 OK with status message if the element of the specified id is not found.', () => {
            let response = resource.respondToDELETE(null, null, null, null, { id: 2 });
            expect(response[0]).toBe(200);
            expect(response[1]).toEqual(jasmine.any(String));
        });
    });

    describe('respondToNestedGET', () => {
        let newCollection = [{ id: 1 }], newResource;
        beforeEach(() => {
            newResource = new MockResource('test2', newCollection, [resource]);
            spyOn(resource, 'respondToGET').and.callThrough();
        });

        it('should invoke the GET handler on the nested resource, passing the requested resource id as a foreign key.', () => {
            newResource.respondToNestedGET(null, null, null, null, { id: 1, nestedName: resource.name });
            expect(resource.respondToGET).toHaveBeenCalledWith(null, null, null, null, { [newResource.nestedFK]: 1 });
        });

        it('should invoke the GET handler on the nested resource, passing the requested resource id as a foreign key, and any query parameters through.', () => {
            newResource.respondToNestedGET(null, null, null, null, { id: 1, nestedName: resource.name, foo: 'bar' });
            expect(resource.respondToGET).toHaveBeenCalledWith(null, null, null, null, { [newResource.nestedFK]: 1, foo: 'bar' });
        });

        it('should invoke the GET handler on the nested resource, passing the nested id as the id, and not passing any query parameters through.', () => {
            newResource.respondToNestedGET(null, null, null, null, { id: 1, nestedName: resource.name, nestedId: 1, foo: 'bar' });
            expect(resource.respondToGET).toHaveBeenCalledWith(null, null, null, null, { id: 1 });
        });

        it('should return a 404 NOT FOUND when a resource with the nestedName is not present in its list of nested resources.', () => {
            let response = newResource.respondToNestedGET(null, null, null, null, { id: 1, nestedName: null });
            expect(resource.respondToGET).not.toHaveBeenCalled();
            expect(response[0]).toBe(404);
            expect(response[1]).toEqual(jasmine.any(String));
        });

        it('should return a 404 NOT FOUND when the nested resource with the nestedId is not associated with this resource.', () => {
            let response = newResource.respondToNestedGET(null, null, null, null, { id: 1, nestedName: resource.name, nestedId: 1 });
            expect(resource.respondToGET).toHaveBeenCalledWith(null, null, null, null, { id: 1 });
            expect(response[0]).toBe(404);
            expect(response[1]).toEqual(jasmine.any(String));
        });
    });
});

describe('MockResourceFactory', () => {
    let MockResourceFactory;

    beforeEach(angular.mock.inject(($injector) => {
        MockResourceFactory = $injector.get('MockResourceFactory');
    }));

    describe('create', () => {
        let $httpBackend, mockRespondDefinitionFn;

        beforeEach(angular.mock.inject(($injector) => {
            $httpBackend = $injector.get('$httpBackend');
            mockRespondDefinitionFn = jasmine.createSpy().and.callFake(angular.noop);
            spyOn($httpBackend, 'whenRoute').and.returnValue({ respond: mockRespondDefinitionFn });
        }));

        it('should create correct GET/POST/PUT/DELETE routes for the passed collection name and define responses.', () => {
            MockResourceFactory.create('users');
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('GET', `${API_BASE}/users/:id/:nestedName/:nestedId?`);
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('GET', `${API_BASE}/users/:id?`);
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('POST', `${API_BASE}/users`);
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('POST', `${API_BASE}/users/`);
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('PUT', `${API_BASE}/users/:id`);
            expect($httpBackend.whenRoute).toHaveBeenCalledWith('DELETE', `${API_BASE}/users/:id`);
            expect(mockRespondDefinitionFn.calls.count()).toBe(6);
        });

        it('should return the newly created MockResource.', () => {
            expect(MockResourceFactory.create('users') instanceof MockResource).toBe(true);
        });
    });
});
