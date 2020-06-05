"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationRequestBuilder = exports.QueryRequestBuilder = void 0;
const queryBuilder_1 = __importDefault(require("./queryBuilder"));
exports.QueryRequestBuilder = queryBuilder_1.default;
const mutationBuilder_1 = __importDefault(require("./mutationBuilder"));
exports.MutationRequestBuilder = mutationBuilder_1.default;
