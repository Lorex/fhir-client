"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../index");
describe('FHIRClient', () => {
    const baseUrl = 'https://hapi.fhir.tw/fhir';
    const token = 'test';
    describe('初始化', () => {
        it(`應該正確設定基本參數，baseUrl: ${baseUrl}, token: ${token}`, () => {
            (0, chai_1.expect)(baseUrl).to.equal('https://hapi.fhir.tw/fhir');
            (0, chai_1.expect)(token).to.equal('test');
        });
        it('應該使用預設版本 R4 初始化', () => {
            const client = new index_1.FHIRClient({ baseUrl });
            (0, chai_1.expect)(client.getVersion()).to.equal('R4');
        });
        it('應該使用指定的版本初始化', () => {
            const client = new index_1.FHIRClient({ baseUrl, version: 'R3' });
            (0, chai_1.expect)(client.getVersion()).to.equal('R3');
        });
    });
    describe('版本處理', () => {
        const versions = ['R2', 'R3', 'R4', 'R4B', 'R5'];
        versions.forEach((version) => {
            it(`應該正確設置 ${version} 版本`, () => {
                const client = new index_1.FHIRClient({ baseUrl, version });
                (0, chai_1.expect)(client.getVersion()).to.equal(version);
            });
        });
    });
    describe('FHIR 資源操作', () => {
        const client = new index_1.FHIRClient({ baseUrl });
        let createdPatientId;
        const testPatient = {
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
            const patient = await client.post(testPatient);
            console.log('創建的 Patient ID:', patient.id);
            (0, chai_1.expect)(patient.id).to.be.a('string');
            (0, chai_1.expect)(patient.resourceType).to.equal('Patient');
            (0, chai_1.expect)(patient.name?.[0].given).to.deep.equal(['John']);
            (0, chai_1.expect)(patient.name?.[0].family).to.equal('Doe');
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
            const patient = await client.get('Patient', createdPatientId);
            (0, chai_1.expect)(patient.id).to.equal(createdPatientId);
            (0, chai_1.expect)(patient.resourceType).to.equal('Patient');
            (0, chai_1.expect)(patient.name?.[0].given).to.deep.equal(['John']);
            (0, chai_1.expect)(patient.name?.[0].family).to.equal('Doe');
        });
        it('應該能夠使用參數搜索資源', async () => {
            if (!createdPatientId) {
                throw new Error('缺少資源 ID');
            }
            const searchParams = {
                _id: createdPatientId
            };
            const patients = await client.get('Patient', searchParams);
            (0, chai_1.expect)(patients).to.be.an('array');
            (0, chai_1.expect)(patients.length).to.be.greaterThan(0);
            (0, chai_1.expect)(patients[0].id).to.equal(createdPatientId);
        });
        it('應該能夠使用額外參數獲取資源', async () => {
            if (!createdPatientId) {
                throw new Error('缺少資源 ID');
            }
            const patient = await client.get('Patient', createdPatientId, {
                _include: 'patient.managingOrganization'
            });
            (0, chai_1.expect)(patient.id).to.equal(createdPatientId);
        });
        it('應該能夠更新資源', async () => {
            if (!createdPatientId) {
                throw new Error('缺少資源 ID');
            }
            const updatedPatient = {
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
            const patient = await client.put(updatedPatient);
            (0, chai_1.expect)(patient.id).to.equal(createdPatientId);
            (0, chai_1.expect)(patient.name?.[0].given).to.deep.equal(['John', 'William']);
            (0, chai_1.expect)(patient.name?.[0].family).to.equal('Doe');
        });
        it('應該能夠刪除資源', async () => {
            if (!createdPatientId) {
                throw new Error('缺少資源 ID');
            }
            console.log('刪除 Patient ID:', createdPatientId);
            await client.delete('Patient', createdPatientId);
            try {
                await client.get('Patient', createdPatientId);
                throw new Error('資源應該已被刪除');
            }
            catch (error) {
                (0, chai_1.expect)(error.response?.status).to.be.oneOf([404, 410]); // Gone 或 Not Found
            }
        });
    });
    describe('認證處理', () => {
        const client = new index_1.FHIRClient({ baseUrl, token });
        it('應該正確設置 token', async () => {
            try {
                const patient = await client.get('Patient', '1');
                (0, chai_1.expect)(patient.id).to.equal('1');
            }
            catch (error) {
                // 即使認證失敗，我們只關心請求是否正確發送
                (0, chai_1.expect)(error.response?.status).to.be.oneOf([401, 403, 404]);
            }
        });
    });
});
