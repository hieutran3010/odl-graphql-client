"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase_1 = __importDefault(require("lodash/fp/camelCase"));
class GraphQLEntityFetcher {
    constructor(entityName, onGetSelectFields, graphqlClient) {
        this.queryManyAsync = (queryParams, selectFields) => {
            const defaultSelectFields = this.onGetSelectFields();
            return this.graphqlClient.queryManyAsync(this.entityName, queryParams, selectFields || defaultSelectFields);
        };
        this.queryOneAsync = (queryParams, selectFields) => {
            const defaultSelectFields = this.onGetSelectFields();
            return this.graphqlClient.queryOneAsync(this.entityName, queryParams, selectFields || defaultSelectFields);
        };
        this.getByIdAsync = (id, queryParams, selectFields) => {
            const defaultSelectFields = this.onGetSelectFields();
            return this.graphqlClient.getByIdAsync(this.entityName, id, queryParams, selectFields || defaultSelectFields);
        };
        this.countAsync = (query) => this.graphqlClient.countAsync(this.entityName, query);
        this.addAsync = (model, selectFields) => {
            const defaultSelectFields = this.onGetSelectFields();
            return this.graphqlClient.addAsync(this.entityName, model, selectFields || defaultSelectFields);
        };
        this.updateAsync = (id, model, selectFields) => {
            const defaultSelectFields = this.onGetSelectFields();
            return this.graphqlClient.updateAsync(this.entityName, id, model, selectFields || defaultSelectFields);
        };
        this.deleteAsync = (id) => this.graphqlClient.deleteAsync(this.entityName, id);
        this.executeCustomMutationAsync = (mutationName, payload, variable, selectFields) => this.graphqlClient.executeCustomMutationAsync(this.entityName, mutationName, payload, variable, selectFields);
        this.executeCustomQueryAsync = (operationName, queryParams, variable, selectFields) => this.graphqlClient.executeCustomQueryAsync(this.entityName, operationName, queryParams, variable, selectFields);
        this.entityName = camelCase_1.default(entityName);
        this.graphqlClient = graphqlClient;
        this.onGetSelectFields = onGetSelectFields;
    }
    addBatchAsync(models) {
        return this.graphqlClient.addBatchAsync(this.entityName, models);
    }
}
exports.default = GraphQLEntityFetcher;
