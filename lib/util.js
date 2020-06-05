"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSelectFieldsArrayToString = exports.parseBodyQueryVariable = void 0;
const keys_1 = __importDefault(require("lodash/fp/keys"));
const isEmpty_1 = __importDefault(require("lodash/fp/isEmpty"));
const isNil_1 = __importDefault(require("lodash/fp/isNil"));
const isUndefined_1 = __importDefault(require("lodash/fp/isUndefined"));
const get_1 = __importDefault(require("lodash/fp/get"));
const constants_1 = require("./constants");
exports.parseBodyQueryVariable = (variables, variable) => {
    const variableKeys = keys_1.default(variables);
    if (!isEmpty_1.default(variableKeys)) {
        const declareVariables = variableKeys.map((paramKey) => {
            const paramType = get_1.default(paramKey)(variable || constants_1.SUPPORTED_VARIABLES_TYPE);
            return `$${paramKey}: ${paramType}`;
        });
        const inputVariables = variableKeys.map((paramKey) => `${paramKey}: $${paramKey}`);
        return {
            declareVariables: `(${declareVariables.join(',')})`,
            inputVariables: `(${inputVariables.join(',')})`,
        };
    }
    return {
        declareVariables: '',
        inputVariables: '',
    };
};
exports.convertSelectFieldsArrayToString = (selectFields) => {
    if (isEmpty_1.default(selectFields) || isNil_1.default(selectFields) || isUndefined_1.default(selectFields)) {
        return '';
    }
    return selectFields.join(',');
};
