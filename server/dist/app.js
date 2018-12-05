"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const http = require("http");
const config_1 = require("./config/config");
const app = new Koa();
const serverConfig = config_1.getConfig().server;
async function test(ctx, next) {
}
let server = http.createServer(app.callback());
server.listen(serverConfig.port);
server.on('listening', onListening);
function onListening() {
    console.log('now listening on port:', serverConfig.port);
}
