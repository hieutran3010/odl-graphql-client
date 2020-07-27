"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationBatchOperation = exports.MutationOperation = exports.QueryOperation = void 0;
var QueryOperation;
(function (QueryOperation) {
    QueryOperation["QueryMany"] = "queryMany";
    QueryOperation["QueryOne"] = "queryOne";
    QueryOperation["Count"] = "count";
    QueryOperation["GetById"] = "getById";
})(QueryOperation = exports.QueryOperation || (exports.QueryOperation = {}));
var MutationOperation;
(function (MutationOperation) {
    MutationOperation["Add"] = "add";
    MutationOperation["Update"] = "update";
    MutationOperation["Delete"] = "delete";
})(MutationOperation = exports.MutationOperation || (exports.MutationOperation = {}));
var MutationBatchOperation;
(function (MutationBatchOperation) {
    MutationBatchOperation["AddBatch"] = "addBatch";
    MutationBatchOperation["UpdateBatch"] = "updateBatch";
    MutationBatchOperation["DeleteBatch"] = "deleteBatch";
})(MutationBatchOperation = exports.MutationBatchOperation || (exports.MutationBatchOperation = {}));
