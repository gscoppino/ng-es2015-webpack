import { Http } from 'app/common/services/Http/Http.module.js';

class RESTApi extends Http {
    static get $inject() { return ['$q', '$http', 'name', 'baseUrl']; }
    constructor($q, $http, name='', baseUrl='') {
        super($q, $http);
        this.name = name;
        this.baseUrl = baseUrl;
    }

    getList() {
        let url = `${this.baseUrl}/${this.name}`;
        return super.get(url)
            .then(response => response.data);
    }

    getSublist(query={}) {
        let queryString = RESTApi._generateQueryString(query);
        let url = `${this.baseUrl}/${this.name}?${queryString}`;
        return super.get(url)
            .then(response => response.data);
    }

    get(id=null) {
        let url = `${this.baseUrl}/${this.name}/${id}`;
        return super.get(url)
            .then(response => response.data);
    }

    post(element={}) {
        let url = `${this.baseUrl}/${this.name}`;
        return super.post(url, element)
            .then(response => response.data);
    }

    put(element={ id: null }) {
        let url = `${this.baseUrl}/${this.name}/${element.id}`;
        return super.put(url, element)
            .then(response => response.data);
    }

    patch(element={ id: null }) {
        let url = `${this.baseUrl}/${this.name}/${element.id}`;
        return super.patch(url, element)
            .then(response => response.data);
    }

    delete(id=null) {
        let url = `${this.baseUrl}/${this.name}/${id}`;
        return super.delete(url)
            .then(response => response.data);
    }

    nestedGet(...path) {
        let url = `${this.baseUrl}/${this.name}/${path.join('/')}`;
        return super.get(url)
            .then(response => response.data);
    }

    nestedPost(nestedElement={}, ...path) {
        let url = `${this.baseUrl}/${this.name}/${path.join('/')}`;
        return super.post(url, nestedElement)
            .then(response => response.data);
    }

    nestedPut(nestedElement={ id: null }, ...path) {
        let url = `${this.baseUrl}/${this.name}/${path.join('/')}`;
        return super.put(url, nestedElement)
            .then(response => response.data);
    }

    nestedPatch(nestedElement={ id: null }, ...path) {
        let url = `${this.baseUrl}/${this.name}/${path.join('/')}`;
        return super.patch(url, nestedElement)
            .then(response => response.data);
    }

    nestedDelete(...path) {
        let url = `${this.baseUrl}/${this.name}/${path.join('/')}`;
        return super.delete(url)
            .then(response => response.data);
    }

    static _generateQueryString(query={}) {
        return Object
            .keys(query)
            .reduce((queryString, currentField) =>
                queryString += `${currentField}=${query[currentField]}&`,
            String())
            .slice(0, -1); // Pluck the final '&' delimiter which is not needed
    }
}

ApiFactory.$inject = ['$injector'];
function ApiFactory($injector) {
    return {
        create: (name) => {
            return $injector.instantiate(RESTApi, {
                name,
                baseUrl: this.baseUrl
            });
        }
    };
}

class ApiFactoryProvider {
    constructor() {
        this.baseUrl = '';
        this.$get = ApiFactory;
    }

    setBaseUrl(url='') {
        this.baseUrl = url;
    }
}

export default ApiFactoryProvider;
export { RESTApi };
