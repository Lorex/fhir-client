type FHIRVersion = 'R2' | 'R3' | 'R4' | 'R4B' | 'R5';
interface FHIRClientConfig {
    baseUrl: string;
    token?: string;
    version?: FHIRVersion;
}
interface FHIRResource {
    resourceType: string;
    id?: string;
    meta?: {
        versionId?: string;
        lastUpdated?: string;
    };
}
declare class FHIRClient {
    private client;
    private version;
    private abortController;
    constructor(config: FHIRClientConfig);
    getVersion(): FHIRVersion;
    get<T extends FHIRResource>(resourceType: string, idOrParams?: string | Record<string, any>, params?: Record<string, any>): Promise<T | T[]>;
    post<T extends FHIRResource>(resource: T): Promise<T>;
    put<T extends FHIRResource>(resource: T): Promise<T>;
    delete(resourceType: string, id: string): Promise<void>;
    close(): Promise<void>;
}

export { FHIRClient, type FHIRResource, type FHIRVersion };
