import upperFirst from 'lodash/fp/upperFirst';
import toString from 'lodash/fp/toString';
import camelCase from 'lodash/fp/camelCase';
import { parseBodyQueryVariable, convertSelectFieldsArrayToString } from '../util';
import { MutationOperation, MutationVariables, MutationBatchOperation } from '../types';

export default class MutationBuilder {
  getOperationName = (operation: MutationOperation | MutationBatchOperation): string => camelCase(toString(operation));

  build = (
    entityName: string,
    operation: MutationOperation,
    payloadModel: any,
    selectedFields?: string[],
    id?: string,
  ) => {
    const mutationVariables = this.getMutationVariables(payloadModel, id);
    const { inputVariables, declareVariables } = parseBodyQueryVariable(mutationVariables);

    let declare = declareVariables;
    // reformat declare param to adapt dynamic entity type
    declare = declareVariables.replace('Input!', `${upperFirst(entityName)}Input!`);
    const operationName = this.getOperationName(operation);
    const fields = convertSelectFieldsArrayToString(selectedFields);

    return `mutation${declare} {
      ${entityName} {
        ${operationName}${inputVariables} {
          ${fields}
        }
      }
    }`;
  };

  buildBatch = (entityName: string, operation: MutationBatchOperation) => {
    const formattedEntityName = upperFirst(entityName);

    const operationName = this.getOperationName(operation);
    const fields = convertSelectFieldsArrayToString(['id', 'code']);

    return `mutation($inputs: [${formattedEntityName}Input!]) {
      ${entityName} {
        ${operationName}(inputs: $inputs) {
          ${fields}
        }
      }
    }`;
  };

  buildCustomMutationOperation = (
    entityName: string,
    operationName: string,
    payloadModel: any,
    variable: any,
    selectedFields?: string[],
  ) => {
    const mutationVariables = this.getMutationVariables(payloadModel);
    const { inputVariables, declareVariables } = parseBodyQueryVariable(mutationVariables, variable);

    const fields = convertSelectFieldsArrayToString(selectedFields || ['didSuccess', 'errorCode']);

    return `mutation${declareVariables} {
      ${entityName} {
        ${operationName}${inputVariables} {
          ${fields}
        }
      }
    }`;
  };

  getMutationVariables = (payloadModel?: any, id?: string): MutationVariables => {
    const mutationVariables: MutationVariables = {};
    if (id) {
      mutationVariables.id = id;
    }

    if (payloadModel) {
      mutationVariables.input = payloadModel;
    }

    return mutationVariables;
  };
}
