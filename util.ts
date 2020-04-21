import keys from "lodash/fp/keys";
import isEmpty from "lodash/fp/isEmpty";
import isNil from "lodash/fp/isNil";
import isUndefined from "lodash/fp/isUndefined";
import get from "lodash/fp/get";
import { SUPPORTED_VARIABLES_TYPE } from "./constants";
import {
  GraphQLVariable,
  QueryVariables,
  MutationVariables,
  CountQueryVariables,
} from "./types";

export const parseBodyQueryVariable = (
  variables: QueryVariables | MutationVariables | CountQueryVariables,
  variable?: any
): GraphQLVariable => {
  const variableKeys = keys(variables);
  if (!isEmpty(variableKeys)) {
    const declareVariables = variableKeys.map((paramKey) => {
      const paramType = get(paramKey)(variable || SUPPORTED_VARIABLES_TYPE);
      return `$${paramKey}: ${paramType}`;
    });

    const inputVariables = variableKeys.map(
      (paramKey) => `${paramKey}: $${paramKey}`
    );

    return {
      declareVariables: `(${declareVariables.join(",")})`,
      inputVariables: `(${inputVariables.join(",")})`,
    };
  }
  return {
    declareVariables: "",
    inputVariables: "",
  };
};

export const convertSelectFieldsArrayToString = (selectFields?: string[]) => {
  if (
    isEmpty(selectFields) ||
    isNil(selectFields) ||
    isUndefined(selectFields)
  ) {
    return "";
  }
  return selectFields.join(",");
};
