export type QueryParams = {
  query?: string;
  include?: string;
  orderBy?: string;
  page?: number;
  pageSize?: number;
};

export type QueryVariables = {
  queryParams: QueryParams;
  id?: string;
};

export type CountQueryVariables = {
  query?: string;
};

export type MutationVariables = {
  input?: any;
  id?: string;
};

export enum QueryOperation {
  QueryMany = 0,
  QueryOne,
  Count,
  GetById,
}

export enum MutationOperation {
  Add = 0,
  Update,
  Delete,
}

export type GraphQLVariable = {
  declareVariables: string;
  inputVariables: string;
};

export type ODLGraphQLClientOptions = {
  headers?: any;
  authenticationToken?: string;
};
