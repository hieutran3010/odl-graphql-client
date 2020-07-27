import { GraphQLClient } from 'graphql-request';
import omit from 'lodash/fp/omit';
import set from 'lodash/fp/set';
import map from 'lodash/fp/map';
import { QueryRequestBuilder, MutationRequestBuilder } from './builders';
import {
  QueryParams,
  QueryOperation,
  MutationOperation,
  MutationBatchOperation,
  GraphQLDoorClientOptions,
} from './types';
import { isEmpty } from 'lodash';

export default class GraphQLDoorClient {
  private graphQLClient!: GraphQLClient;
  private queryBuilder: QueryRequestBuilder;
  private mutationBuilder: MutationRequestBuilder;
  private options: GraphQLDoorClientOptions | undefined;

  constructor(endpoint: string, options?: GraphQLDoorClientOptions) {
    this._configGraphQLClient(endpoint, options);
    this.queryBuilder = new QueryRequestBuilder();
    this.mutationBuilder = new MutationRequestBuilder();
    this.options = options;
  }

  private _configGraphQLClient = (endpoint: string, options?: GraphQLDoorClientOptions) => {
    const { headers } = options || {};

    this.graphQLClient = new GraphQLClient(endpoint, { headers });
  };

  private getToken = async () => {
    const { authenticationToken, getToken } = this.options || {};
    let token;
    if (authenticationToken) {
      token = authenticationToken;
    } else if (getToken) {
      token = await getToken();
    }

    if (!isEmpty(token)) {
      this.graphQLClient.setHeader('authorization', `Bearer ${token}`);
    }
  };

  private _executeQueryAsync = async (
    entityName: string,
    query: string,
    operation: QueryOperation | string,
    queryParams: QueryParams,
    defaultValue: any,
    id?: string,
  ) => {
    const queryVariables = this.queryBuilder.getQueryVariables(queryParams, id);
    const operationName = this.queryBuilder.getOperationName(operation as QueryOperation) || (operation as string);

    await this.getToken();

    return this.graphQLClient.request(query, queryVariables).then((response) => {
      return this.queryBuilder.compactResponse(entityName, response, operationName, defaultValue);
    });
  };

  private _executeMutationAsync = async (
    entityName: string,
    query: string,
    operation: MutationOperation | string,
    payloadModel: any,
    defaultValue: any,
    id?: string,
  ) => {
    const mutationVariables = this.mutationBuilder.getMutationVariables(payloadModel, id);
    const operationName =
      this.mutationBuilder.getOperationName(operation as MutationOperation) || (operation as string);

    await this.getToken();

    return this.graphQLClient.request(query, mutationVariables).then((response) => {
      return this.queryBuilder.compactResponse(entityName, response, operationName, defaultValue);
    });
  };

  private _executeMutationBatchAsync = async (
    entityName: string,
    query: string,
    operation: MutationBatchOperation | string,
    payloadModels: any[],
  ) => {
    const operationName =
      this.mutationBuilder.getOperationName(operation as MutationBatchOperation) || (operation as string);

    await this.getToken();

    return this.graphQLClient.request(query, { inputs: payloadModels }).then((response) => {
      return this.queryBuilder.compactResponse(entityName, response, operationName, {});
    });
  };

  queryManyAsync = (entityName: string, queryParams: QueryParams, selectFields?: string[]) => {
    const query = this.queryBuilder.buildQuery(entityName, QueryOperation.QueryMany, queryParams, selectFields);

    return this._executeQueryAsync(entityName, query, QueryOperation.QueryMany, queryParams, []);
  };

  queryOneAsync = (entityName: string, queryParams: QueryParams, selectFields?: string[]) => {
    const query = this.queryBuilder.buildQuery(entityName, QueryOperation.QueryOne, queryParams, selectFields);

    return this._executeQueryAsync(entityName, query, QueryOperation.QueryOne, queryParams, {});
  };

  getByIdAsync = (entityName: string, id: string, queryParams: QueryParams, selectFields?: string[]) => {
    const query = this.queryBuilder.buildQuery(entityName, QueryOperation.GetById, {}, selectFields, id);

    return this._executeQueryAsync(entityName, query, QueryOperation.GetById, queryParams, {}, id);
  };

  countAsync = async (entityName: string, query: string): Promise<number> => {
    const queryBody = this.queryBuilder.buildCountQuery(entityName, query);

    await this.getToken();

    return this.graphQLClient.request(queryBody, { query }).then((response: any) => {
      return this.queryBuilder.compactCountResponse(entityName, response);
    });
  };

  addAsync<T>(entityName: string, model: T, selectFields?: string[]) {
    const formattedModel = omit(['id'])(model as any);
    const mutation = this.mutationBuilder.build(entityName, MutationOperation.Add, formattedModel, selectFields);

    return this._executeMutationAsync(entityName, mutation, MutationOperation.Add, formattedModel, {});
  }

  updateAsync = (entityName: string, id: string, model: any, selectFields?: string[]) => {
    const formattedModel = omit(['id'])(model as any);
    const mutation = this.mutationBuilder.build(entityName, MutationOperation.Update, formattedModel, selectFields, id);
    return this._executeMutationAsync(entityName, mutation, MutationOperation.Update, formattedModel, {}, id);
  };

  deleteAsync = (entityName: string, id: string) => {
    const mutation = this.mutationBuilder.build(entityName, MutationOperation.Delete, undefined, ['id', 'code'], id);
    return this.graphQLClient.request(mutation, { id });
  };

  addBatchAsync<T>(entityName: string, models: T[]) {
    const formattedBatch = map((model: any) => omit('id')(model))(models);

    const mutation = this.mutationBuilder.buildBatch(entityName, MutationBatchOperation.AddBatch);

    return this._executeMutationBatchAsync(entityName, mutation, MutationBatchOperation.AddBatch, formattedBatch);
  }

  executeCustomMutationAsync = (
    entityName: string,
    mutationName: string,
    payload: any,
    variable: any,
    selectFields?: string[],
  ) => {
    const mutation = this.mutationBuilder.buildCustomMutationOperation(
      entityName,
      mutationName,
      payload,
      variable,
      selectFields,
    );

    return this._executeMutationAsync(entityName, mutation, mutationName, payload, {});
  };

  executeCustomQueryAsync = (
    entityName: string,
    operationName: string,
    queryParams: any,
    variable: any,
    selectFields: string[],
  ) => {
    const query = this.queryBuilder.buildCustomQuery(entityName, operationName, variable, selectFields);

    return this._executeQueryAsync(entityName, query, operationName, queryParams, {});
  };
}
