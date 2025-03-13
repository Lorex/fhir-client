"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FHIRClient = void 0;
const axios_1 = __importDefault(require("axios"));
class FHIRClient {
    constructor(config) {
        this.version = config.version || 'R4';
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/fhir+json',
                ...(config.token && { Authorization: `Bearer ${config.token}` }),
            },
        });
    }
    getVersion() {
        return this.version;
    }
    async getResource(resourceType, id) {
        const response = await this.client.get(`/${resourceType}/${id}`);
        return response.data;
    }
    async searchResources(resourceType, params) {
        const response = await this.client.get(`/${resourceType}`, {
            params,
        });
        return response.data.entry.map(entry => entry.resource);
    }
    async createResource(resource) {
        const response = await this.client.post(`/${resource.resourceType}`, resource);
        return response.data;
    }
    async updateResource(resource) {
        if (!resource.id) {
            throw new Error('Resource must have an ID to be updated');
        }
        const response = await this.client.put(`/${resource.resourceType}/${resource.id}`, resource);
        return response.data;
    }
    async deleteResource(resourceType, id) {
        await this.client.delete(`/${resourceType}/${id}`);
    }
}
exports.FHIRClient = FHIRClient;
