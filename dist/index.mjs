import axios from 'axios';

class FHIRClient {
    constructor(config) {
        this.version = config.version || 'R4';
        this.client = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/fhir+json',
                ...(config.token && { Authorization: `Bearer ${config.token}` }),
            },
        });
        this.abortController = new AbortController();
    }
    getVersion() {
        return this.version;
    }
    async get(resourceType, idOrParams, params) {
        if (typeof idOrParams === 'string') {
            const response = await this.client.get(`/${resourceType}/${idOrParams}`, {
                params,
                signal: this.abortController.signal
            });
            return response.data;
        }
        else {
            const response = await this.client.get(`/${resourceType}`, {
                params: idOrParams,
                signal: this.abortController.signal
            });
            return response.data.entry.map(entry => entry.resource);
        }
    }
    async post(resource) {
        const response = await this.client.post(`/${resource.resourceType}`, resource, {
            signal: this.abortController.signal
        });
        return response.data;
    }
    async put(resource) {
        if (!resource.id) {
            throw new Error('Resource must have an ID to be updated');
        }
        const response = await this.client.put(`/${resource.resourceType}/${resource.id}`, resource, {
            signal: this.abortController.signal
        });
        return response.data;
    }
    async delete(resourceType, id) {
        await this.client.delete(`/${resourceType}/${id}`, {
            signal: this.abortController.signal
        });
    }
    async close() {
        this.abortController.abort();
    }
}

export { FHIRClient };
//# sourceMappingURL=index.mjs.map
