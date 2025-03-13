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
  private abortController: AbortController;

  constructor(config: FHIRClientConfig) {
    this.version = config.version || 'R4';

    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/fhir+json',
        ...(config.token && { Authorization: `Bearer ${config.token}` }),
      },
    });

    this.abortController = new AbortController();
  }

  getVersion(): FHIRVersion {
    return this.version;
  }

  async get<T extends FHIRResource>(resourceType: string, idOrParams?: string | Record<string, any>, params?: Record<string, any>): Promise<T | T[]> {
    if (typeof idOrParams === 'string') {
      const response = await this.client.get<T>(`/${resourceType}/${idOrParams}`, {
        params,
        signal: this.abortController.signal
      });
      return response.data;
    } else {
      const response = await this.client.get<{ entry: Array<{ resource: T }> }>(`/${resourceType}`, {
        params: idOrParams,
        signal: this.abortController.signal
      });
      return response.data.entry.map(entry => entry.resource);
    }
  }

  async post<T extends FHIRResource>(resource: T): Promise<T> {
    const response = await this.client.post<T>(`/${resource.resourceType}`, resource, {
      signal: this.abortController.signal
    });
    return response.data;
  }

  async put<T extends FHIRResource>(resource: T): Promise<T> {
    if (!resource.id) {
      throw new Error('Resource must have an ID to be updated');
    }
    const response = await this.client.put<T>(`/${resource.resourceType}/${resource.id}`, resource, {
      signal: this.abortController.signal
    });
    return response.data;
  }

  async delete(resourceType: string, id: string): Promise<void> {
    await this.client.delete(`/${resourceType}/${id}`, {
      signal: this.abortController.signal
    });
  }

  async close(): Promise<void> {
    this.abortController.abort();
  }
}
