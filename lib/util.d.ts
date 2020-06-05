import { GraphQLVariable, QueryVariables, MutationVariables, CountQueryVariables } from './types';
export declare const parseBodyQueryVariable: (variables: QueryVariables | MutationVariables | CountQueryVariables, variable?: any) => GraphQLVariable;
export declare const convertSelectFieldsArrayToString: (selectFields?: string[] | undefined) => string;
