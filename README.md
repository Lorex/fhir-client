# FHIR Client

A TypeScript client library for interacting with FHIR (Fast Healthcare Interoperability Resources) servers. This library provides a simple and type-safe API for handling FHIR resources.

[繁體中文說明](README_zh-TW.md)

## Features

- Support for multiple FHIR versions (R2, R3, R4, R4B, R5)
- Full TypeScript type support
- Axios-based HTTP client
- Authentication token support
- Basic CRUD operations

## Installation

```bash
npm install @fhir-uck/fhir-client
# or
yarn add @fhir-uck/fhir-client
```

## Usage

### Initialize Client

```typescript
import { FHIRClient } from '@fhir-uck/fhir-client';

const client = new FHIRClient({
  baseUrl: 'https://your-fhir-server.com/fhir',
  token: 'your-access-token', // optional
  version: 'R4' // optional, defaults to 'R4'
});
```

### Basic Operations

#### Get Resource

```typescript
const patient = await client.getResource('Patient', 'patient-id');
```

#### Search Resources

```typescript
const patients = await client.searchResources('Patient', {
  'name': 'John',
  '_count': '10'
});
```

#### Create Resource

```typescript
const newPatient = await client.createResource({
  resourceType: 'Patient',
  name: [{ given: ['John'], family: 'Doe' }]
});
```

#### Update Resource

```typescript
const updatedPatient = await client.updateResource({
  resourceType: 'Patient',
  id: 'patient-id',
  name: [{ given: ['John'], family: 'Smith' }]
});
```

#### Delete Resource

```typescript
await client.deleteResource('Patient', 'patient-id');
```

## Contributing

Pull requests and issues are welcome!

## License

For users outside Taiwan: This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

You are free to:

    Share — copy and redistribute the material in any medium or format
    Adapt — remix, transform, and build upon the material

Under the following terms:

    Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
    NonCommercial — You may not use the material for commercial purposes.
    ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

For more details, please refer to the [LICENSE](LICENSE) file.

© 2023 Lorex and Sitatech Information Services Co., Ltd. All Rights Reserved.
