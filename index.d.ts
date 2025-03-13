import { AxiosInstance } from 'axios';

export type FHIRVersion = 'R2' | 'R3' | 'R4' | 'R4B' | 'R5';

export interface FHIRClientConfig {
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
  private client: AxiosInstance;
  private version: FHIRVersion;

  constructor(config: FHIRClientConfig);

  /**
   * 獲取當前 FHIR 客戶端使用的 FHIR 版本
   */
  getVersion(): FHIRVersion;

  /**
   * 通過資源類型和 ID 獲取特定資源
   * @param resourceType FHIR 資源類型
   * @param id 資源 ID
   */
  getResource<T extends FHIRResource>(resourceType: string, id: string): Promise<T>;

  /**
   * 搜索特定類型的資源
   * @param resourceType FHIR 資源類型
   * @param params 搜索參數
   */
  searchResources<T extends FHIRResource>(resourceType: string, params?: Record<string, string>): Promise<T[]>;

  /**
   * 創建新的 FHIR 資源
   * @param resource 要創建的資源
   */
  createResource<T extends FHIRResource>(resource: T): Promise<T>;

  /**
   * 更新現有的 FHIR 資源
   * @param resource 包含 ID 的資源
   */
  updateResource<T extends FHIRResource>(resource: T): Promise<T>;

  /**
   * 刪除 FHIR 資源
   * @param resourceType FHIR 資源類型
   * @param id 資源 ID
   */
  deleteResource(resourceType: string, id: string): Promise<void>;
} 