"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../lib/mysql");
class BaseModel {
    constructor(opts) {
        this.table = '';
        this.table = opts.table;
    }
    async insert(data) {
        return mysql_1.mysql_op.insert(this.table, data);
    }
    async get(wheres = {}, fields) {
        return mysql_1.mysql_op.get(this.table, wheres, fields);
    }
    async query(qstr, params) {
        return mysql_1.mysql_op.exec_sql(qstr, params);
    }
    async del(wheres) {
        return mysql_1.mysql_op.del(this.table, wheres);
    }
    async update(sets, wheres) {
        return mysql_1.mysql_op.update(this.table, sets, wheres);
    }
}
exports.BaseModel = BaseModel;
function modelFactroy(param) {
    return new BaseModel(param);
}
exports.modelFactroy = modelFactroy;
function handlerData(datas, pk) {
    let result = {};
    let property_names = [];
    for (let i = 0; i < datas.length; ++i) {
        let tmp = {};
        if (datas[i] instanceof Array) {
            if (i === 0) {
                property_names = datas[i];
                continue;
            }
            for (let k = 0; k < property_names.length; ++k) {
                if (pk === property_names[k]) {
                    result[datas[i][k]] = tmp;
                }
                tmp[property_names[k]] = datas[i][k];
            }
        }
        else {
            for (let p in datas[i]) {
                if (pk === p) {
                    result[datas[i][p]] = datas[i];
                }
            }
        }
    }
    return result;
}
exports.handlerData = handlerData;
