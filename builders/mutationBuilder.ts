import upperFirst from 'lodash/fp/upperFirst';
import {
  parseBodyQueryVariable,
  convertSelectFieldsArrayToString,
} from '../util';
import {MutationOperation, MutationVariables} from '../types';

export default class MutationBuilder {
  getOperationName = (operation: MutationOperation): string => {
    switch (operation) {
      case MutationOperation.Add:
        return 'add';
      case MutationOperation.Update:
        return 'update';
      case MutationOperation.Delete:
        return 'delete';
    }
  };

  build = (
    entityName: string,
    operation: MutationOperation,
    payloadModel: any,
    selectedFields?: string[],
    id?: string,
  ) => {
    const mutationVariables = this.getMutationVariables(payloadModel, id);
    let {inputVariables, declareVariables} = parseBodyQueryVariable(
      mutationVariables,
    );

    // reformat declare param to adapt dynamic entity type
    declareVariables = declareVariables.replace(
      'Input!',
      `${upperFirst(entityName)}Input!`,
    );
    const operationName = this.getOperationName(operation);
    const fields = convertSelectFieldsArrayToString(selectedFields);

    return `mutation${declareVariables} {
      ${entityName} {
        ${operationName}${inputVariables} {
          ${fields}
        }
      }
    }`;
  };

  getMutationVariables = (
    payloadModel?: any,
    id?: string,
  ): MutationVariables => {
    let mutationVariables: MutationVariables = {};
    if (id) {
      mutationVariables.id = id;
    }

    if (payloadModel) {
      mutationVariables.input = payloadModel;
    }

    return mutationVariables;
  };
}
