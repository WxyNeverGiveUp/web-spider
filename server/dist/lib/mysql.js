"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const config_1 = require("../config/config");
let mysql_config = config_1.getConfig().mysql;
let pool = mysql_1.createPool({
    host: mysql_config.host,
    port: mysql_config.port,
    user: mysql_config.user,
    password: mysql_config.password,
    database: mysql_config.db,
    queryFormat: function (query, values) {
        if (!values)
            return query;
        return query.replace(/:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    },
    charset: 'utf8mb4_unicode_ci',
    supportBigNumbers: true
});
let pool_wrap = function (fn) {
    return function (...args) {
        return new Promise((resovle, reject) => {
            pool.getConnection(function (err, client) {
                if (err) {
                    reject(err);
                }
                else {
                    let start_time = new Date().getTime();
                    let [sql, params] = fn(...args);
                    if (params) {
                        sql = client.format(sql, params);
                    }
                    client.query(sql, null, function (err, data) {
                        let end_time = new Date().getTime();
                        console.info(`[COST]${end_time - start_time}ms  exec sql: ${sql}`);
                        client.release();
                        if (err) {
                            reject(err);
                        }
                        resovle(data);
                    });
                }
            });
        });
    };
};
function gen(wheres, split = ' , ', nowhere = false) {
    let wheres_key = Object.keys(wheres);
    let tails = '', tail_key = 'tail', where_txt;
    if (wheres_key.length) {
        where_txt = wheres_key.map(k => {
            if (k === tail_key) {
                tails = ' ' + wheres[k];
                return '1=1';
            }
            else {
                if (typeof wheres[k] === 'string') {
                    if (/\s+/g.test(wheres[k])) {
                        return `${k} ${wheres[k]}`;
                    }
                    else {
                        return `${k} = :${k}`;
                    }
                }
                else {
                    return `${k} = :${k}`;
                }
            }
        }).join(split);
        where_txt += tails;
        if (!nowhere) {
            where_txt = ' where ' + where_txt;
        }
    }
    else {
        where_txt = '';
    }
    return where_txt;
}
exports.mysqlOp = {
    insert: pool_wrap((table, obj) => {
        let keys = Object.keys(obj);
        let columns = keys.join(',');
        let val_name = keys.map(k => ':' + k).join(',');
        let sql = `insert into ${table} (${columns}) values(${val_name})`;
        return [sql, obj];
    }),
    get: pool_wrap((table, wheres, fields) => {
        for (let i = 0; i < fields.length; ++i) {
            fields[i] = `${fields[i]}`;
        }
        let where_txt = gen(wheres, ' AND ');
        let sql = `select ${fields.join(',')} from ${table}  ${where_txt}`;
        return [sql, wheres];
    }),
    update: pool_wrap((table, set_value, wheres) => {
        let where_txt = gen(wheres, ' AND ');
        let set_txt = gen(set_value, ' , ', true);
        let sql = `update ${table} set ${set_txt} ${where_txt}`;
        let params = Object.assign(set_value, wheres);
        return [sql, params];
    }),
    exec_sql: pool_wrap((sql, params) => { return [sql, params]; }),
    del: pool_wrap((table, wheres) => {
        let where_txt = gen(wheres);
        let sql = `DELETE FROM ${table} ${where_txt}`;
        return [sql, wheres];
    })
};
