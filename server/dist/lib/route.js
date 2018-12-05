"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Router = require("koa-router");
const router = new Router();
const ROUTER_PATH = path.resolve(__dirname, '..', 'route');
const compose = require('koa-compose');
class Route {
    constructor(opts) {
        this.cmd = opts.cmd;
        this.handlers = opts.handler;
    }
}
exports.Route = Route;
function makeRouter(app) {
    let files = readdirSync(ROUTER_PATH);
    for (let i = 0; i < files.length; ++i) {
        let routes = require(path.resolve(ROUTER_PATH, files[i]));
        let tmppath = files[i].replace(/.js/, '');
        for (let j = 0; j < routes.length; ++j) {
            let cmd_path = tmppath;
            if (routes[j].cmd) {
                cmd_path = tmppath + '_' + routes[j].cmd;
            }
            if (routes[j].handlers.length < 2) {
                app.use(cmd_path, routes[j].handlers[0]);
            }
            else {
                app.use(cmd_path, compose(routes[j].handlers));
            }
            if (!cmd_path) {
                console.log(`[baseMid:] ready`);
            }
            else {
                console.log(`[cmd:][${cmd_path}] ready`);
            }
        }
    }
    return app;
}
exports.makeRouter = makeRouter;
