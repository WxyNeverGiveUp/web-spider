import * as Koa from 'koa'
import * as http from 'http'
import { getConfig } from "./config/config"
import { makeRouter } from './lib/route'

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
 * use baseMid 处理同中间件 专门用来处理某些信息
 */
app.use(async (ctx: Koa.Context, next) => {
    ctx.set('Access-Control-Allow-Origin', '*') // 允许跨域
    const start = new Date().getTime()
    if (!ctx.query.data) {
        ctx.query.data = {}
    } else {
        try {
            console.log(ctx.query.data)
            ctx.query.data = JSON.parse(ctx.query.data)
        } catch(e) {
            console.error('数据格式错误！')
            ctx.body = {
                code: AppCode.done
            }
        }
    }
    await next()
    const ms = new Date().getTime() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

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