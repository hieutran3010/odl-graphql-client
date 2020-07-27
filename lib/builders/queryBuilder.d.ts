import { QueryOperation, QueryParams, QueryVariables, CountQueryVariables } from '../types';
export default class QueryBuilder {
    private _internalBuildQuery;
    getOperationName: (operation: QueryOperation) => string;
    buildQuery: (entityName: string, operation: QueryOperation, params: QueryParams | CountQueryVariables, selectFields?: string[] | undefined, id?: string | undefined, isCountQuery?: boolean) => string;
    buildCustomQuery: (entityName: string, operationName: string, variables: any, selectFields: string[]) => string;
    buildCountQuery: (entityName: string, query: string) => string;
    compactResponse: (entityName: string, response: any, operationName: string, defaultValue: any) => any;
    compactCountResponse: (entityName: string, response: any) => number;
    getQueryVariables: (queryParams: QueryParams | CountQueryVariables, id?: string | undefined, isCountQuery?: boolean) => QueryVariables | CountQueryVariables;
}
