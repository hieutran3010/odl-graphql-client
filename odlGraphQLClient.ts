import { GraphQLClient } from "graphql-request";
import omit from "lodash/fp/omit";
import set from "lodash/fp/set";
import { QueryRequestBuilder, MutationRequestBuilder } from "./builders";
import {
  QueryParams,
  QueryOperation,
  MutationOperation,
  ODLGraphQLClientOptions,
} from "./types";

export default class ODLGraphqlClient {
  private graphQLClient!: GraphQLClient;
  private queryBuilder: QueryRequestBuilder;
  private mutationBuilder: MutationRequestBuilder;

  constructor(endpoint: string, options?: ODLGraphQLClientOptions) {
    this._configGraphQLClient(endpoint, options);
    this.queryBuilder = new QueryRequestBuilder();
    this.mutationBuilder = new MutationRequestBuilder();
  }

  private _configGraphQLClient = (
    endpoint: string,
    options?: ODLGraphQLClientOptions
  ) => {
    const { authenticationToken } = options || {};

    let clientOption = {};
    if (authenticationToken) {
      clientOption = set(
        "headers.authorization",
        `Bearer ${authenticationToken}`
      )(clientOption);
    }

    this.graphQLClient = new GraphQLClient(endpoint, clientOption);
  };

  private _executeQueryAsync = (
    entityName: string,
    query: string,
    operation: QueryOperation,
    queryParams: QueryParams,
    defaultvalue: any,
    id?: string
  ) => {
    const queryVariables = this.queryBuilder.getQueryVariables(queryParams, id);
    const operationName = this.queryBuilder.getOperationName(operation);

    return this.graphQLClient
      .request(query, queryVariables)
      .then((response) => {
        return this.queryBuilder.compactResponse(
          entityName,
          response,
          operationName,
          defaultvalue
        );
      });
  };

  private _executeMutationAsync = (
    entityName: string,
    query: string,
    operation: MutationOperation | string,
    payloadModel: any,
    defaultvalue: any,
    id?: string
  ) => {
    const mutationVariables = this.mutationBuilder.getMutationVariables(
      payloadModel,
      id
    );
    const operationName =
      this.mutationBuilder.getOperationName(operation as MutationOperation) ||
      (operation as string);

    return this.graphQLClient
      .request(query, mutationVariables)
      .then((response) => {
        return this.queryBuilder.compactResponse(
          entityName,
          response,
          operationName,
          defaultvalue
        );
      });
  };

  queryManyAsync = (
    entityName: string,
    queryParams: QueryParams,
    selectFields?: string[]
  ) => {
    const query = this.queryBuilder.buildQuery(
      entityName,
      QueryOperation.QueryMany,
      queryParams,
      selectFields
    );

    return this._executeQueryAsync(
      entityName,
      query,
      QueryOperation.QueryMany,
      queryParams,
      []
    );
  };

  queryOneAsync = (
    entityName: string,
    queryParams: QueryParams,
    selectFields?: string[]
  ) => {
    const query = this.queryBuilder.buildQuery(
      entityName,
      QueryOperation.QueryOne,
      queryParams,
      selectFields
    );

    return this._executeQueryAsync(
      entityName,
      query,
      QueryOperation.QueryOne,
      queryParams,
      {}
    );
  };

  getByIdAsync = (
    entityName: string,
    id: string,
    queryParams: QueryParams,
    selectFields?: string[]
  ) => {
    const query = this.queryBuilder.buildQuery(
      entityName,
      QueryOperation.GetById,
      queryParams,
      selectFields,
      id
    );

    return this._executeQueryAsync(
      entityName,
      query,
      QueryOperation.GetById,
      queryParams,
      {},
      id
    );
  };

  countAsync = (entityName: string, query: string): Promise<number> => {
    const queryBody = this.queryBuilder.buildCountQuery(entityName, query);
    return this.graphQLClient
      .request(queryBody, { query })
      .then((response: any) => {
        return this.queryBuilder.compactCountResponse(entityName, response);
      });
  };

  addAsync = (entityName: string, model: any, selectFields?: string[]) => {
    const formattedModel = omit(["id"])(model);
    const mutation = this.mutationBuilder.build(
      entityName,
      MutationOperation.Add,
      formattedModel,
      selectFields
    );

    return this._executeMutationAsync(
      entityName,
      mutation,
      MutationOperation.Add,
      formattedModel,
      {}
    );
  };

  updateAsync = (
    entityName: string,
    id: string,
    model: any,
    selectFields?: string[]
  ) => {
    const mutation = this.mutationBuilder.build(
      entityName,
      MutationOperation.Update,
      model,
      selectFields,
      id
    );
    return this._executeMutationAsync(
      entityName,
      mutation,
      MutationOperation.Update,
      model,
      {},
      id
    );
  };

  deleteAsync = (entityName: string, id: string) => {
    const mutation = this.mutationBuilder.build(
      entityName,
      MutationOperation.Delete,
      undefined,
      ["id", "code"],
      id
    );
    return this.graphQLClient.request(mutation, { id });
  };

  executeCustomMutationAsync = (
    entityName: string,
    mutationName: string,
    payload: any,
    variable: any,
    selectFields?: string[]
  ) => {
    const mutation = this.mutationBuilder.buildCustomMutationOperation(
      entityName,
      mutationName,
      payload,
      variable,
      selectFields
    );

    return this._executeMutationAsync(
      entityName,
      mutation,
      mutationName,
      payload,
      {}
    );
  };
}
