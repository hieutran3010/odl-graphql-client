"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase_1 = __importDefault(require("lodash/fp/camelCase"));
class GraphQLEntityFetcher {
    constructor(entityName, defaultSelectFields, graphqlClient) {
        this.queryManyAsync = (queryParams, selectFields) => this.graphqlClient.queryManyAsync(this.entityName, queryParams, selectFields || this.defaultSelectFields);
        this.queryOneAsync = (queryParams, selectFields) => this.graphqlClient.queryOneAsync(this.entityName, queryParams, selectFields || this.defaultSelectFields);
        this.getByIdAsync = (id, queryParams, selectFields) => this.graphqlClient.getByIdAsync(this.entityName, id, queryParams, selectFields || this.defaultSelectFields);
        this.countAsync = (query) => this.graphqlClient.countAsync(this.entityName, query);
        this.addAsync = (model, selectFields) => this.graphqlClient.addAsync(this.entityName, model, selectFields || this.defaultSelectFields);
        this.updateAsync = (id, model, selectFields) => this.graphqlClient.updateAsync(this.entityName, id, model, selectFields || this.defaultSelectFields);
        this.deleteAsync = (id) => this.graphqlClient.deleteAsync(this.entityName, id);
        this.executeCustomMutationAsync = (mutationName, payload, variable, selectFields) => this.graphqlClient.executeCustomMutationAsync(this.entityName, mutationName, payload, variable, selectFields);
        this.entityName = camelCase_1.default(entityName);
        this.defaultSelectFields = defaultSelectFields;
        this.graphqlClient = graphqlClient;
    }
    addBatchAsync(models) {
        return this.graphqlClient.addBatchAsync(this.entityName, models);
    }
}
exports.default = GraphQLEntityFetcher;
