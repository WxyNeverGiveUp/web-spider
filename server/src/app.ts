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

/**
 * use router
 */
makeRouter(app)

server.listen(serverConfig.port)
server.on('listening', onListening)
 
  
/**
 * Event listener for HTTP server "listening" event.
 */
  
function onListening() {
    console.log('now listening on port:', serverConfig.port)
}