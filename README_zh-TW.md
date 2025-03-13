# FHIR Client

[![npm version](https://badge.fury.io/js/@fhir-uck%2Ffhir-client.svg)](https://badge.fury.io/js/@fhir-uck%2Ffhir-client)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) 
[![HitCount](https://hits.dwyl.com/Lorex/@fhir-uck/fhir-client.svg?style=flat-square)](https://hits.dwyl.com/Lorex/@fhir-uck/fhir-client)
[![NPM](https://nodei.co/npm/@fhir-uck/fhir-client.png?downloads=true&stars=true&compact=true)](https://nodei.co/npm/@fhir-uck/fhir-client/)


這是一個用於與 FHIR 伺服器進行互動的 TypeScript 客戶端函式庫，提供簡單且類型安全的 API 來處理 FHIR 呼叫，並同時支援 TypeScript 與 JavaScript。

## 功能

- 支援多個 FHIR 版本 (R2, R3, R4, R4B, R5)
- 完整的 TypeScript 與 JavaScript 支援
- 基於 Axios 的 HTTP 客戶端
- 支援存取權杖 (Token) 機制
- 提供基本的 CRUD 操作

## 安裝

```bash
npm install @fhir-uck/fhir-client
# 或
yarn add @fhir-uck/fhir-client
```

## 使用方法

### 初始化 FHIR Client

```typescript
import { FHIRClient } from '@fhir-uck/fhir-client';

const client = new FHIRClient({
  baseUrl: 'https://hapi.fhir.tw/fhir', // FHIR 伺服器的 Base URL
  token: 'your-access-token',           // 選擇性，Bearer Token
  version: 'R4'                         // 選擇性，預設為 'R4'
});
```

### 基本操作

#### 取得 Resource

```typescript
// 使用 ID 取得資料
const patient = await client.get('Patient', 'patient-id');

// 使用參數取得資料
const patients = await client.get('Patient', {
  name: 'John',
  birthdate: '1970-01-01',
  gender: 'male'
});

// 使用 ID 和參數組合取得資料
const patientWithParams = await client.get('Patient', 'patient-id', {
  _include: 'Patient:organization',
  _elements: ['name', 'birthDate', 'gender']
});
```

#### 建立 Resource

```typescript
const newPatient = await client.post({
  resourceType: 'Patient',
  name: [{ given: ['John'], family: 'Doe' }]
});
```

#### 更新 Resource

```typescript
const updatedPatient = await client.put({
  resourceType: 'Patient',
  id: 'patient-id',
  name: [{ given: ['John'], family: 'Smith' }]
});
```

#### 刪除 Resource

```typescript
await client.delete('Patient', 'patient-id');
```

## 貢獻

歡迎提交 Pull Request 和 Issue！ 

## 授權條款
對於臺灣地區（中華民國境內）使用者： 本著作係採用創用 CC 姓名標示-非商業性-相同方式分享 3.0 臺灣 授權條款授權。

您可自由：

    分享 — 以任何媒介或格式重製及散布本素材
    改編 — 重混、轉換本素材、及依本素材建立新素材

惟需遵照下列條件：

    姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結，以及指出（本作品的原始版本）是否已被變更。您可以任何合理方式為前述表彰，但不得以任何方式暗示授權人為您或您的使用方式背書。
    非商業性 — 您不得將本素材進行商業目的之使用。
    相同方式分享 — 若您重混、轉換本素材或依本素材建立新素材，您必須依本素材的授權條款來散布您的貢獻物。

例外情況:

    本專案「絕對禁止」財團法人工業技術研究院 (ITRI) 為任意形式之利用，包含但不限於：散佈、改作、引用等。 

詳細資訊請參考 [LICENSE](LICENSE) 文件。

© 2023 Lorex and Sitatech Information Services Co., Ltd. 版權所有。
