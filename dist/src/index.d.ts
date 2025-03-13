import * as FHIRR4 from 'fhir/r4';
import * as FHIRR3 from 'fhir/r3';
import * as FHIRR2 from 'fhir/r2';
import * as FHIRR4B from 'fhir/r4b';
import * as FHIRR5 from 'fhir/r5';
export type FHIRVersion = 'R2' | 'R3' | 'R4' | 'R4B' | 'R5';
interface FHIRClientConfig {
    baseUrl: string;
    token?: string;
    version?: FHIRVersion;
}
export declare class FHIRClient {
    private client;
    private version;
    private fhir;
    constructor(config: FHIRClientConfig);
    getVersion(): FHIRVersion;
    getFHIR(): typeof FHIRR4 | typeof FHIRR3 | typeof FHIRR2 | typeof FHIRR4B | typeof FHIRR5;
}
export {};
