"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = __importDefault(require("lodash/fp/isEmpty"));
const getOr_1 = __importDefault(require("lodash/fp/getOr"));
const set_1 = __importDefault(require("lodash/fp/set"));
const camelCase_1 = __importDefault(require("lodash/fp/camelCase"));
const toString_1 = __importDefault(require("lodash/fp/toString"));
const util_1 = require("../util");
const types_1 = require("../types");
class QueryBuilder {
    constructor() {
        this._internalBuildQuery = (entityName, graphQLVariables, operation, selectFields) => {
            const operationName = this.getOperationName(operation);
            const queryFields = util_1.convertSelectFieldsArrayToString(selectFields);
            const query = `
      query${graphQLVariables.declareVariables || ''} {
        ${entityName} {
          ${operationName}${graphQLVariables.inputVariables || ''} {
            ${queryFields}
          }
        }
      }
    `;
            return query;
        };
        this.getOperationName = (operation) => camelCase_1.default(toString_1.default(operation));
        this.buildQuery = (entityName, operation, params, selectFields, id, isCountQuery = false) => {
            const queryVariables = this.getQueryVariables(params, id, isCountQuery);
            const graphqlVariable = util_1.parseBodyQueryVariable(queryVariables);
            return this._internalBuildQuery(entityName, graphqlVariable, operation, selectFields);
        };
        this.buildCustomQuery = (entityName, operationName, variables, selectFields) => {
            const queryVariables = this.getQueryVariables(variables);
            const { inputVariables, declareVariables } = util_1.parseBodyQueryVariable(queryVariables, variables);
            const fields = util_1.convertSelectFieldsArrayToString(selectFields);
            return `query${declareVariables} {
      ${entityName} {
          ${operationName}${inputVariables} {
              ${fields}
            }
          }
        }`;
        };
        this.buildCountQuery = (entityName, query) => {
            const params = { query };
            const queryString = this.buildQuery(entityName, types_1.QueryOperation.Count, params || {}, ['numberOfItem'], undefined, true);
            return queryString;
        };
        this.compactResponse = (entityName, response, operationName, defaultValue) => {
            return getOr_1.default(defaultValue, `${entityName}.${operationName}`)(response);
        };
        this.compactCountResponse = (entityName, response) => {
            return getOr_1.default(0, `${entityName}.count.numberOfItem`)(response);
        };
        this.getQueryVariables = (queryParams, id, isCountQuery = false) => {
            if (!isCountQuery) {
                let queryVariables = {};
                if (id) {
                    queryVariables = set_1.default('id', id)(queryVariables);
                }
                if (!isEmpty_1.default(queryParams)) {
                    queryVariables = set_1.default('queryParams', queryParams)(queryVariables);
                }
                return queryVariables;
            }
            const countQueryVariables = {
                query: queryParams.query,
            };
            return countQueryVariables;
        };
    }
}
exports.default = QueryBuilder;
