import { QueryParams, GraphQLDoorClientOptions } from './types';
export default class GraphQLDoorClient {
    private graphQLClient;
    private queryBuilder;
    private mutationBuilder;
    constructor(endpoint: string, options?: GraphQLDoorClientOptions);
    private _configGraphQLClient;
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
}
