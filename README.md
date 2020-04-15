# odl-graphql-client

This helps to create a client point to fetch data from backend is built with [odl-graphql](https://github.com/hieutran3010/odl-graphql)

## Installation

Use npm to install

```bash
npm install --save odl-graphql-client
```

Use yarn to install

```bash
yarn add odl-graphql-client
```

## Usage

```js
import ODLGraphqlClient from 'odl-graphql-client';
import {ODLGraphQLClientOptions} from 'odl-graphql-client/types'

constructor() {
    const endpoint = '<your-graphql-server>';
    const options : ODLGraphQLClientOptions = {authenticationToken: '<your-authentication-token>', headers: "<your-custom-header-key-value>"};
    this.graphqlFetcher = new ODLGraphqlClient(endpoint, options); // options is optional
}
```

## Methods

All methods are served with asynchronous.

| Method Name    | Description                                                           | Params                                                                           |
| -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| queryManyAsync | Support to query many record on an entity                             | entityName: string, queryParams: QueryParams, selectFields?: string[] - optional |
| queryOneAsync  | Support to query one record on an entity                              | entityName: string, queryParams: QueryParams, selectFields?: string[] - optional |
| getByIdAsync   | Support to get a record by id on an entity                            | entityName: string, id: string, selectFields?: string[] - optional               |
| countAsync     | Support to count based on a query on an entity                        | entityName: string, query: string                                                |
| addAsync       | Support to add a new record into an entity and return the new record  | entityName: string, model: any, selectFields?: string[] - optional               |
| updateAsync    | Support to update a record in an entity and return the updated record | entityName: string, id: string, model: any, selectFields?: string[] - optional   |
| deleteAsync    | Support to delete a record in an entity                               | entityName: string, id: string                                                   |

## Types

### QueryParams

| Property  | Type   | Description                                                                                                                                 |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| query?    | string | the linq query. Please get the further information at https://github.com/StefH/System.Linq.Dynamic.Core                                     |
| include?  | string | The nested entity which you want to include. You can include many entities with ','                                                         |
| orderBy?  | string | The property which you want to order by, default is ASC, for contrary, just add "desc" after the prop name. Example: {orderBy: 'name desc'} |
| page?     | number |                                                                                                                                             |
| pageSize? | number |                                                                                                                                             |
