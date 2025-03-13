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
   * 獲取 FHIR 資源
   * @param resourceType FHIR 資源類型
   * @param idOrParams 資源 ID 或搜索參數
   * @param params 額外的查詢參數（僅在提供 ID 時使用）
   * @returns 當使用 ID 時返回單一資源，當使用搜索參數時返回資源陣列
   */
  get<T extends FHIRResource>(resourceType: string, idOrParams?: string | Record<string, any>, params?: Record<string, any>): Promise<T | T[]>;

  /**
   * 創建新的 FHIR 資源
   * @param resource 要創建的資源
   */
  post<T extends FHIRResource>(resource: T): Promise<T>;

  /**
   * 更新現有的 FHIR 資源
   * @param resource 包含 ID 的資源
   */
  put<T extends FHIRResource>(resource: T): Promise<T>;

  /**
   * 刪除 FHIR 資源
   * @param resourceType FHIR 資源類型
   * @param id 資源 ID
   */
  delete(resourceType: string, id: string): Promise<void>;
} 
