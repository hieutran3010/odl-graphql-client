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
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
}

export enum MutationBatchOperation {
  AddBatch = 'addBatch',
  UpdateBatch = 'updateBatch',
  DeleteBatch = 'deleteBatch',
}

export type GraphQLVariable = {
  declareVariables: string;
  inputVariables: string;
};

export type GraphQLDoorClientOptions = {
  headers?: any;
  authenticationToken?: string;
  getToken?: () => Promise<string>;
};
