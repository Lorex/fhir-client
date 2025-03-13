import axios, { AxiosInstance } from 'axios';

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

export class FHIRClient {
  private client: AxiosInstance;
  private version: FHIRVersion;

  constructor(config: FHIRClientConfig) {
    this.version = config.version || 'R4';

    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/fhir+json',
        ...(config.token && { Authorization: `Bearer ${config.token}` }),
      },
    });
  }

  getVersion(): FHIRVersion {
    return this.version;
  }

  async getResource<T extends FHIRResource>(resourceType: string, id: string): Promise<T> {
    const response = await this.client.get<T>(`/${resourceType}/${id}`);
    
    return response.data;
  }

  async searchResources<T extends FHIRResource>(resourceType: string, params?: Record<string, string>): Promise<T[]> {
    const response = await this.client.get<{ entry: Array<{ resource: T }> }>(`/${resourceType}`, {
      params,
    });
    return response.data.entry.map(entry => entry.resource);
  }

  async createResource<T extends FHIRResource>(resource: T): Promise<T> {
    const response = await this.client.post<T>(`/${resource.resourceType}`, resource);
    return response.data;
  }

  async updateResource<T extends FHIRResource>(resource: T): Promise<T> {
    if (!resource.id) {
      throw new Error('Resource must have an ID to be updated');
    }
    const response = await this.client.put<T>(`/${resource.resourceType}/${resource.id}`, resource);
    return response.data;
  }

  async deleteResource(resourceType: string, id: string): Promise<void> {
    await this.client.delete(`/${resourceType}/${id}`);
  }
}
