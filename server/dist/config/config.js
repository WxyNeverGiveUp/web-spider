"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConfig() {
    return {
        server: {
            "secret": '6a03578a1ad3984e918df7c920b6be5d',
            "ip": '127.0.0.1',
            "port": 58000,
            "machine_id": 1,
            "env": "test",
            "log_path": 'D:/workspace/restaurant/server/dist/log',
            "clear_index_file": 'D:/workspace/restaurant/server/src/index.d.ts',
            "mount": '',
            "debug": 0
        },
        redis: {
            "host": "localhost",
            "port": 6379,
            "max": 10,
            "min": 1,
            "timeout": 30000,
            "log": 0,
            "expire": 86400,
            "turnOn": 1,
            "password": ""
        },
        mysql: {
            "host": "localhost",
            "port": 3306,
            "db": "restaurant_game",
            "user": "root",
            "password": "root",
            "max": 10,
            "min": 1,
            "timeout": 30000,
            "log": 1
        }
    };
}
exports.getConfig = getConfig;
