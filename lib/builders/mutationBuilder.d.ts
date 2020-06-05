import { MutationOperation, MutationVariables, MutationBatchOperation } from '../types';
export default class MutationBuilder {
    getOperationName: (operation: MutationOperation | MutationBatchOperation) => string;
    build: (entityName: string, operation: MutationOperation, payloadModel: any, selectedFields?: string[] | undefined, id?: string | undefined) => string;
    buildBatch: (entityName: string, operation: MutationBatchOperation) => string;
    buildCustomMutationOperation: (entityName: string, operationName: string, payloadModel: any, variable: any, selectedFields?: string[] | undefined) => string;
    getMutationVariables: (payloadModel?: any, id?: string | undefined) => MutationVariables;
}
