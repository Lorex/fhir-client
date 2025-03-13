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
    async get(resourceType, idOrParams, params) {
        if (typeof idOrParams === 'string') {
            const response = await this.client.get(`/${resourceType}/${idOrParams}`, {
                params
            });
            return response.data;
        }
        else {
            const response = await this.client.get(`/${resourceType}`, {
                params: idOrParams
            });
            return response.data.entry.map(entry => entry.resource);
        }
    }
    async post(resource) {
        const response = await this.client.post(`/${resource.resourceType}`, resource);
        return response.data;
    }
    async put(resource) {
        if (!resource.id) {
            throw new Error('Resource must have an ID to be updated');
        }
        const response = await this.client.put(`/${resource.resourceType}/${resource.id}`, resource);
        return response.data;
    }
    async delete(resourceType, id) {
        await this.client.delete(`/${resourceType}/${id}`);
    }
}
exports.FHIRClient = FHIRClient;
