import GraphQLDoorClient from './GraphQLDoorClient';
import { QueryParams } from './types';
export default class GraphQLEntityFetcher<T> {
    graphqlClient: GraphQLDoorClient;
    entityName: string;
    onGetSelectFields: () => string[];
    constructor(entityName: string, onGetSelectFields: () => string[], graphqlClient: GraphQLDoorClient);
    queryManyAsync: (queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<T[]>;
    queryOneAsync: (queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<T>;
    getByIdAsync: (id: string, queryParams: QueryParams, selectFields?: string[] | undefined) => Promise<T>;
    countAsync: (query: string) => Promise<number>;
    addAsync: (model: any, selectFields?: string[] | undefined) => Promise<T>;
    updateAsync: (id: string, model: any, selectFields?: string[] | undefined) => Promise<T>;
    deleteAsync: (id: string) => Promise<unknown>;
    executeCustomMutationAsync: (mutationName: string, payload: any, variable: any, selectFields?: string[] | undefined) => Promise<any>;
    addBatchAsync(models: T[]): Promise<any>;
}
