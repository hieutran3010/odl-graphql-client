export declare type QueryParams = {
    query?: string;
    include?: string;
    orderBy?: string;
    page?: number;
    pageSize?: number;
};
export declare type QueryVariables = {
    queryParams: QueryParams;
    id?: string;
};
export declare type CountQueryVariables = {
    query?: string;
};
export declare type MutationVariables = {
    input?: any;
    id?: string;
};
export declare enum QueryOperation {
    QueryMany = "queryMany",
    QueryOne = "queryOne",
    Count = "count",
    GetById = "getById"
}
export declare enum MutationOperation {
    Add = "add",
    Update = "update",
    Delete = "delete"
}
export declare enum MutationBatchOperation {
    AddBatch = "addBatch",
    UpdateBatch = "updateBatch",
    DeleteBatch = "deleteBatch"
}
export declare type GraphQLVariable = {
    declareVariables: string;
    inputVariables: string;
};
export declare type GraphQLDoorClientOptions = {
    headers?: any;
    authenticationToken?: string;
    getToken?: () => Promise<string>;
};
