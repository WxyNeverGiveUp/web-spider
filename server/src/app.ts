import * as Koa from 'koa'
import * as http from 'http'
import { getConfig } from "./config/config";
import { makeRouter } from './lib/route';

export const app = new Koa()
const serverConfig = getConfig().server


/**
 * Create HTTP server.
 */

let server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(serverConfig.port)
server.on('listening', onListening)

/**
 * use router
 */
makeRouter(app)

  
/**
 * Event listener for HTTP server "listening" event.
 */
  
function onListening() {
    console.log('web-spider server running:', serverConfig.ip + ':' + serverConfig.port)
}