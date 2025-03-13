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
    get<T extends FHIRResource>(resourceType: string, idOrParams?: string | Record<string, any>, params?: Record<string, any>): Promise<T | T[]>;
    post<T extends FHIRResource>(resource: T): Promise<T>;
    put<T extends FHIRResource>(resource: T): Promise<T>;
    delete(resourceType: string, id: string): Promise<void>;
}
export {};
