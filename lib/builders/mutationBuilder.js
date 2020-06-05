"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upperFirst_1 = __importDefault(require("lodash/fp/upperFirst"));
const toString_1 = __importDefault(require("lodash/fp/toString"));
const camelCase_1 = __importDefault(require("lodash/fp/camelCase"));
const util_1 = require("../util");
class MutationBuilder {
    constructor() {
        this.getOperationName = (operation) => camelCase_1.default(toString_1.default(operation));
        this.build = (entityName, operation, payloadModel, selectedFields, id) => {
            const mutationVariables = this.getMutationVariables(payloadModel, id);
            const { inputVariables, declareVariables } = util_1.parseBodyQueryVariable(mutationVariables);
            let declare = declareVariables;
            // reformat declare param to adapt dynamic entity type
            declare = declareVariables.replace('Input!', `${upperFirst_1.default(entityName)}Input!`);
            const operationName = this.getOperationName(operation);
            const fields = util_1.convertSelectFieldsArrayToString(selectedFields);
            return `mutation${declare} {
      ${entityName} {
        ${operationName}${inputVariables} {
          ${fields}
        }
      }
    }`;
        };
        this.buildBatch = (entityName, operation) => {
            const formattedEntityName = upperFirst_1.default(entityName);
            const operationName = this.getOperationName(operation);
            const fields = util_1.convertSelectFieldsArrayToString(['id', 'code']);
            return `mutation($inputs: [${formattedEntityName}Input!]) {
      ${entityName} {
        ${operationName}(inputs: $inputs) {
          ${fields}
        }
      }
    }`;
        };
        this.buildCustomMutationOperation = (entityName, operationName, payloadModel, variable, selectedFields) => {
            const mutationVariables = this.getMutationVariables(payloadModel);
            const { inputVariables, declareVariables } = util_1.parseBodyQueryVariable(mutationVariables, variable);
            const fields = util_1.convertSelectFieldsArrayToString(selectedFields || ['didSuccess', 'errorCode']);
            return `mutation${declareVariables} {
      ${entityName} {
        ${operationName}${inputVariables} {
          ${fields}
        }
      }
    }`;
        };
        this.getMutationVariables = (payloadModel, id) => {
            const mutationVariables = {};
            if (id) {
                mutationVariables.id = id;
            }
            if (payloadModel) {
                mutationVariables.input = payloadModel;
            }
            return mutationVariables;
        };
    }
}
exports.default = MutationBuilder;
