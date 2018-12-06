import { Route } from "../lib/route"
import * as Koa from 'koa'

async function test(ctx: Koa.Context) {
    console.log(ctx.query)
    
    ctx.body = {
        data: 123312
    }
}
export = [new Route({
    cmd:'test',
    handler: [test],
    method: "get"
})]
