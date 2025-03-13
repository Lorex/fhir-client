export type FHIRVersion = 'R2' | 'R3' | 'R4' | 'R4B' | 'R5';
interface FHIRClientConfig {
    baseUrl: string;
    token?: string;
    version?: FHIRVersion;
}
export interface FHIRResource {
    resourceType: string;
    id?: string;
    meta?: {
        versionId?: string;
        lastUpdated?: string;
    };
}
export declare class FHIRClient {
    private client;
    private version;
    constructor(config: FHIRClientConfig);
    getVersion(): FHIRVersion;
    getResource<T extends FHIRResource>(resourceType: string, id: string): Promise<T>;
    searchResources<T extends FHIRResource>(resourceType: string, params?: Record<string, string>): Promise<T[]>;
    createResource<T extends FHIRResource>(resource: T): Promise<T>;
    updateResource<T extends FHIRResource>(resource: T): Promise<T>;
    deleteResource(resourceType: string, id: string): Promise<void>;
}
export {};
