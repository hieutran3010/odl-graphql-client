import { Variables } from 'graphql-request/dist/src/types';
import { QueryParams, GraphQLDoorClientOptions, MathResult } from './types';
export default class GraphQLDoorClient {
    private graphQLClient;
    private queryBuilder;
    private mutationBuilder;
    private options;
    constructor(endpoint: string, options?: GraphQLDoorClientOptions);
    private _configGraphQLClient;
    private getToken;
    private _executeQueryAsync;
    private _executeMutationAsync;
    private _executeMutationBatchAsync;
    queryManyAsync: (entityName: string, queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    queryOneAsync: (entityName: string, queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    getByIdAsync: (entityName: string, id: string, queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    countAsync: (entityName: string, query: string) => Promise<number>;
    addAsync<T>(entityName: string, model: T, selectFields?: string[]): Promise<any>;
    updateAsync: (entityName: string, id: string, model: any, selectFields?: string[] | undefined) => Promise<any>;
    deleteAsync: (entityName: string, id: string) => Promise<unknown>;
    addBatchAsync<T>(entityName: string, models: T[]): Promise<any>;
    executeCustomMutationAsync: (entityName: string, mutationName: string, payload: any, variable: any, selectFields?: string[] | undefined) => Promise<any>;
    executeCustomQueryAsync: (entityName: string, operationName: string, queryParams: any, variable: any, selectFields: string[]) => Promise<any>;
    executeAsync: (entityName: string, operationName: string, query: string, variable?: Variables | undefined, defaultValue?: any) => Promise<any>;
    sumAsync: (entityName: string, fields: string, sumFormula: string, query?: string | undefined) => Promise<MathResult>;
}
