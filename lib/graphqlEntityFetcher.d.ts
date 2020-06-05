import GraphQLDoorClient from './GraphQLDoorClient';
import { QueryParams } from './types';
export default class GraphQLEntityFetcher {
    graphqlClient: GraphQLDoorClient;
    entityName: string;
    defaultSelectFields: string[];
    constructor(entityName: string, defaultSelectFields: string[], graphqlClient: GraphQLDoorClient);
    queryManyAsync: (queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    queryOneAsync: (queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    getByIdAsync: (id: string, queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<any>;
    countAsync: (query: string) => Promise<number>;
    addAsync: (model: any, selectFields?: string[] | undefined) => Promise<any>;
    updateAsync: (id: string, model: any, selectFields?: string[] | undefined) => Promise<any>;
    deleteAsync: (id: string) => Promise<unknown>;
    executeCustomMutationAsync: (mutationName: string, payload: any, variable: any, selectFields?: string[] | undefined) => Promise<any>;
    addBatchAsync<T>(models: T[]): Promise<any>;
}
