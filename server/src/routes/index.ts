import { Route } from "../lib/route"
import * as Koa from 'koa'

async function test(ctx: Koa.Context, next: () => Promise<any>) {
    console.log('走到该方法中')
    console.log(ctx.query)
    // await ctx.render('index', {
    //     title: 'Hello Koa 2!'
    // })
    ctx.body = {
        data: 123312
    }
}
export = [new Route({
    cmd:'test',
    handler: [test],
    method: "get"
})]
