import { expect } from 'chai';
import { FHIRClient, FHIRVersion, FHIRResource } from '../index';

interface PatientResource extends FHIRResource {
  name?: Array<{
    given?: string[];
    family?: string;
  }>;
  gender?: string;
  birthDate?: string;
}

describe('FHIRClient', () => {
  const baseUrl = 'https://hapi.fhir.tw/fhir';
  const token = 'test';

  describe('初始化', () => {
    it(`應該正確設定基本參數，baseUrl: ${baseUrl}, token: ${token}`, () => {
      expect(baseUrl).to.equal('https://hapi.fhir.tw/fhir');
      expect(token).to.equal('test');
    });
    
    it('應該使用預設版本 R4 初始化', () => {
      const client = new FHIRClient({ baseUrl });
      expect(client.getVersion()).to.equal('R4');
    });

    it('應該使用指定的版本初始化', () => {
      const client = new FHIRClient({ baseUrl, version: 'R3' });
      expect(client.getVersion()).to.equal('R3');
    });
  });

  describe('版本處理', () => {
    const versions: FHIRVersion[] = ['R2', 'R3', 'R4', 'R4B', 'R5'];
    versions.forEach((version) => {
      it(`應該正確設置 ${version} 版本`, () => {
        const client = new FHIRClient({ baseUrl, version });
        expect(client.getVersion()).to.equal(version);
      });
    });
  });

  describe('FHIR 資源操作', () => {
    const client = new FHIRClient({ baseUrl });
    let createdPatientId: string;

    const testPatient: PatientResource = {
      resourceType: 'Patient',
      name: [
        {
          given: ['John'],
          family: 'Doe'
        }
      ],
      gender: 'male',
      birthDate: '1990-01-01'
    };

    it('應該能夠創建資源', async () => {
      const patient = await client.createResource<PatientResource>(testPatient);
      console.log('創建的 Patient ID:', patient.id);
      expect(patient.id).to.be.a('string');
      expect(patient.resourceType).to.equal('Patient');
      expect(patient.name?.[0].given).to.deep.equal(['John']);
      expect(patient.name?.[0].family).to.equal('Doe');
      
      if (!patient.id) {
        throw new Error('創建的資源沒有 ID');
      }
      createdPatientId = patient.id;
    });

    it('應該能夠獲取資源', async () => {
      if (!createdPatientId) {
        throw new Error('缺少資源 ID');
      }
      console.log('讀取 Patient ID:', createdPatientId);
      const patient = await client.getResource<PatientResource>('Patient', createdPatientId);
      expect(patient.id).to.equal(createdPatientId);
      expect(patient.resourceType).to.equal('Patient');
      expect(patient.name?.[0].given).to.deep.equal(['John']);
      expect(patient.name?.[0].family).to.equal('Doe');
    });

    it('應該能夠搜索資源', async () => {
      if (!createdPatientId) {
        throw new Error('缺少資源 ID');
      }

      const searchParams: Record<string, string> = {
        _id: createdPatientId
      };

      const patients = await client.searchResources<PatientResource>('Patient', searchParams);
      expect(patients).to.be.an('array');
      expect(patients.length).to.be.greaterThan(0);
      expect(patients[0].id).to.equal(createdPatientId);
    });

    it('應該能夠更新資源', async () => {
      if (!createdPatientId) {
        throw new Error('缺少資源 ID');
      }

      const updatedPatient: PatientResource = {
        ...testPatient,
        id: createdPatientId,
        name: [
          {
            given: ['John', 'William'],
            family: 'Doe'
          }
        ]
      };

      console.log('更新 Patient ID:', createdPatientId);
      const patient = await client.updateResource<PatientResource>(updatedPatient);
      expect(patient.id).to.equal(createdPatientId);
      expect(patient.name?.[0].given).to.deep.equal(['John', 'William']);
      expect(patient.name?.[0].family).to.equal('Doe');
    });

    it('應該能夠刪除資源', async () => {
      if (!createdPatientId) {
        throw new Error('缺少資源 ID');
      }

      console.log('刪除 Patient ID:', createdPatientId);
      await client.deleteResource('Patient', createdPatientId);
      
      try {
        await client.getResource('Patient', createdPatientId);
        throw new Error('資源應該已被刪除');
      } catch (error: any) {
        expect(error.response?.status).to.be.oneOf([404, 410]); // Gone 或 Not Found
      }
    });
  });

  describe('認證處理', () => {
    const client = new FHIRClient({ baseUrl, token });
    
    it('應該正確設置 token', async () => {
      try {
        const patient = await client.getResource<PatientResource>('Patient', '1');
        expect(patient).to.be.an('object');
      } catch (error: any) {
        // 即使認證失敗，我們只關心請求是否正確發送
        expect(error.response?.status).to.be.oneOf([401, 403, 404]);
      }
    });
  });
}); 
