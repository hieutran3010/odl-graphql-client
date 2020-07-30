"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const omit_1 = __importDefault(require("lodash/fp/omit"));
const map_1 = __importDefault(require("lodash/fp/map"));
const isEmpty_1 = __importDefault(require("lodash/fp/isEmpty"));
const builders_1 = require("./builders");
const types_1 = require("./types");
class GraphQLDoorClient {
    constructor(endpoint, options) {
        this._configGraphQLClient = (endpoint, options) => {
            const { headers } = options || {};
            this.graphQLClient = new graphql_request_1.GraphQLClient(endpoint, { headers });
        };
        this.getToken = () => __awaiter(this, void 0, void 0, function* () {
            const { authenticationToken, getToken } = this.options || {};
            let token;
            if (authenticationToken) {
                token = authenticationToken;
            }
            else if (getToken) {
                token = yield getToken();
            }
            if (!isEmpty_1.default(token)) {
                this.graphQLClient.setHeader('authorization', `Bearer ${token}`);
            }
        });
        this._executeQueryAsync = (entityName, query, operation, queryParams, defaultValue, id) => __awaiter(this, void 0, void 0, function* () {
            const queryVariables = this.queryBuilder.getQueryVariables(queryParams, id);
            const operationName = this.queryBuilder.getOperationName(operation) || operation;
            yield this.getToken();
            return this.graphQLClient.request(query, queryVariables).then((response) => {
                return this.queryBuilder.compactResponse(entityName, response, operationName, defaultValue);
            });
        });
        this._executeMutationAsync = (entityName, query, operation, payloadModel, defaultValue, id) => __awaiter(this, void 0, void 0, function* () {
            const mutationVariables = this.mutationBuilder.getMutationVariables(payloadModel, id);
            const operationName = this.mutationBuilder.getOperationName(operation) || operation;
            yield this.getToken();
            return this.graphQLClient.request(query, mutationVariables).then((response) => {
                return this.queryBuilder.compactResponse(entityName, response, operationName, defaultValue);
            });
        });
        this._executeMutationBatchAsync = (entityName, query, operation, payloadModels) => __awaiter(this, void 0, void 0, function* () {
            const operationName = this.mutationBuilder.getOperationName(operation) || operation;
            yield this.getToken();
            return this.graphQLClient.request(query, { inputs: payloadModels }).then((response) => {
                return this.queryBuilder.compactResponse(entityName, response, operationName, {});
            });
        });
        this.queryManyAsync = (entityName, queryParams, selectFields) => {
            const query = this.queryBuilder.buildQuery(entityName, types_1.QueryOperation.QueryMany, queryParams, selectFields);
            return this._executeQueryAsync(entityName, query, types_1.QueryOperation.QueryMany, queryParams, []);
        };
        this.queryOneAsync = (entityName, queryParams, selectFields) => {
            const query = this.queryBuilder.buildQuery(entityName, types_1.QueryOperation.QueryOne, queryParams, selectFields);
            return this._executeQueryAsync(entityName, query, types_1.QueryOperation.QueryOne, queryParams, {});
        };
        this.getByIdAsync = (entityName, id, queryParams, selectFields) => {
            const query = this.queryBuilder.buildQuery(entityName, types_1.QueryOperation.GetById, {}, selectFields, id);
            return this._executeQueryAsync(entityName, query, types_1.QueryOperation.GetById, queryParams, {}, id);
        };
        this.countAsync = (entityName, query) => __awaiter(this, void 0, void 0, function* () {
            const queryBody = this.queryBuilder.buildCountQuery(entityName, query);
            yield this.getToken();
            return this.graphQLClient.request(queryBody, { query }).then((response) => {
                return this.queryBuilder.compactCountResponse(entityName, response);
            });
        });
        this.updateAsync = (entityName, id, model, selectFields) => {
            const formattedModel = omit_1.default(['id'])(model);
            const mutation = this.mutationBuilder.build(entityName, types_1.MutationOperation.Update, formattedModel, selectFields, id);
            return this._executeMutationAsync(entityName, mutation, types_1.MutationOperation.Update, formattedModel, {}, id);
        };
        this.deleteAsync = (entityName, id) => {
            const mutation = this.mutationBuilder.build(entityName, types_1.MutationOperation.Delete, undefined, ['id', 'code'], id);
            return this.graphQLClient.request(mutation, { id });
        };
        this.executeCustomMutationAsync = (entityName, mutationName, payload, variable, selectFields) => {
            const mutation = this.mutationBuilder.buildCustomMutationOperation(entityName, mutationName, payload, variable, selectFields);
            return this._executeMutationAsync(entityName, mutation, mutationName, payload, {});
        };
        this.executeCustomQueryAsync = (entityName, operationName, queryParams, variable, selectFields) => {
            const query = this.queryBuilder.buildCustomQuery(entityName, operationName, variable, selectFields);
            return this._executeQueryAsync(entityName, query, operationName, queryParams, {});
        };
        this.executeAsync = (entityName, operationName, query, variable, defaultValue) => __awaiter(this, void 0, void 0, function* () {
            yield this.getToken();
            return this.graphQLClient.request(query, variable).then((response) => {
                return this.queryBuilder.compactResponse(entityName, response, operationName, defaultValue);
            });
        });
        this.sumAsync = (entityName, sumField, query) => __awaiter(this, void 0, void 0, function* () {
            const graphQLQuery = `query($query: String!, $field: String!) {
      ${entityName} {
          sum(query: $query, field: $field) {
             value
          }
      }
  }`;
            yield this.getToken();
            return this.graphQLClient.request(graphQLQuery, { query, field: sumField }).then((response) => {
                return this.queryBuilder.compactResponse(entityName, response, 'sum', { value: 0 });
            });
        });
        this._configGraphQLClient(endpoint, options);
        this.queryBuilder = new builders_1.QueryRequestBuilder();
        this.mutationBuilder = new builders_1.MutationRequestBuilder();
        this.options = options;
    }
    addAsync(entityName, model, selectFields) {
        const formattedModel = omit_1.default(['id'])(model);
        const mutation = this.mutationBuilder.build(entityName, types_1.MutationOperation.Add, formattedModel, selectFields);
        return this._executeMutationAsync(entityName, mutation, types_1.MutationOperation.Add, formattedModel, {});
    }
    addBatchAsync(entityName, models) {
        const formattedBatch = map_1.default((model) => omit_1.default('id')(model))(models);
        const mutation = this.mutationBuilder.buildBatch(entityName, types_1.MutationBatchOperation.AddBatch);
        return this._executeMutationBatchAsync(entityName, mutation, types_1.MutationBatchOperation.AddBatch, formattedBatch);
    }
}
exports.default = GraphQLDoorClient;
