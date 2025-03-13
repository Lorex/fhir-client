"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FHIRClient = void 0;
const axios_1 = __importDefault(require("axios"));
const FHIRR4 = __importStar(require("fhir/r4"));
const FHIRR3 = __importStar(require("fhir/r3"));
const FHIRR2 = __importStar(require("fhir/r2"));
const FHIRR4B = __importStar(require("fhir/r4b"));
const FHIRR5 = __importStar(require("fhir/r5"));
class FHIRClient {
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
    // 取得當前版本的 FHIR 型別定義
    getFHIR() {
        return this.fhir;
    }
}
exports.FHIRClient = FHIRClient;
