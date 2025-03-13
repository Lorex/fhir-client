import axios from 'axios';
import * as FHIRR4 from 'fhir/r4';
import * as FHIRR3 from 'fhir/r3';
import * as FHIRR2 from 'fhir/r2';
import * as FHIRR4B from 'fhir/r4b';
import * as FHIRR5 from 'fhir/r5';
export class FHIRClient {
    constructor(config) {
        this.version = config.version || 'R4';
        // 根據版本選擇對應的 FHIR 型別定義
        switch (this.version) {
            case 'R2':
                this.fhir = FHIRR2;
                break;
            case 'R3':
                this.fhir = FHIRR3;
                break;
            case 'R4':
                this.fhir = FHIRR4;
                break;
            case 'R4B':
                this.fhir = FHIRR4B;
                break;
            case 'R5':
                this.fhir = FHIRR5;
                break;
            default:
                this.fhir = FHIRR4;
        }
        this.client = axios.create({
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
    // 取得當前版本的 FHIR 型別定義
    getFHIR() {
        return this.fhir;
    }
}
