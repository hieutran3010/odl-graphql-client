import ODLGraphqlClient from "./odlGraphQLClient";
import { QueryParams } from "./types";
import camelCase from "lodash/fp/camelCase";

export default class GraphQLEntityFetcher {
  graphqlClient: ODLGraphqlClient;
  entityName: string;
  defaultSelectFields: string[];

  constructor(
    entityName: string,
    defaultSelectFields: string[],
    graphqlClient: ODLGraphqlClient
  ) {
    this.entityName = camelCase(entityName);
    this.defaultSelectFields = defaultSelectFields;
    this.graphqlClient = graphqlClient;
  }

  queryManyAsync = (queryParams: QueryParams, selectFields?: string[]) =>
    this.graphqlClient.queryManyAsync(
      this.entityName,
      queryParams,
      selectFields || this.defaultSelectFields
    );

  queryOneAsync = (queryParams: QueryParams, selectFields?: string[]) =>
    this.graphqlClient.queryOneAsync(
      this.entityName,
      queryParams,
      selectFields || this.defaultSelectFields
    );

  getByIdAsync = (
    id: string,
    queryParams: QueryParams,
    selectFields?: string[]
  ) =>
    this.graphqlClient.getByIdAsync(
      this.entityName,
      id,
      queryParams,
      selectFields || this.defaultSelectFields
    );

  countAsync = (query: string): Promise<number> =>
    this.graphqlClient.countAsync(this.entityName, query);

  addAsync = (model: any, selectFields?: string[]) =>
    this.graphqlClient.addAsync(
      this.entityName,
      model,
      selectFields || this.defaultSelectFields
    );

  updateAsync = (id: string, model: any, selectFields?: string[]) =>
    this.graphqlClient.updateAsync(
      this.entityName,
      id,
      model,
      selectFields || this.defaultSelectFields
    );

  deleteAsync = (id: string) =>
    this.graphqlClient.deleteAsync(this.entityName, id);

  executeCustomMutationAsync = (
    mutationName: string,
    payload: any,
    variable: any,
    selectFields?: string[]
  ) =>
    this.graphqlClient.executeCustomMutationAsync(
      this.entityName,
      mutationName,
      payload,
      variable,
      selectFields
    );
}
