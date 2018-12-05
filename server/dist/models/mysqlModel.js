"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../lib/mysql");
class MysqlModel {
    constructor(opts) {
        this.table = '';
        this.table = opts.table;
    }
    async insert(data) {
        return mysql_1.mysqlOp.insert(this.table, data);
    }
    async get(wheres = {}, fields) {
        return mysql_1.mysqlOp.get(this.table, wheres, fields);
    }
    async query(queryStr, params) {
        return mysql_1.mysqlOp.exec_sql(queryStr, params);
    }
    async del(wheres) {
        return mysql_1.mysqlOp.del(this.table, wheres);
    }
    async update(sets, wheres) {
        return mysql_1.mysqlOp.update(this.table, sets, wheres);
    }
}
exports.MysqlModel = MysqlModel;
function mysqlFactory(param) {
    return new MysqlModel(param);
}
exports.mysqlFactory = mysqlFactory;
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
