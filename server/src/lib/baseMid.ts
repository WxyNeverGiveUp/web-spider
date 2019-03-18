import * as Koa from 'koa'

export async function baseMid(ctx: Koa.BaseContext, next: any) {
    return next().then(() => {
        console.log('每次请求都走中间件', ctx)
    })
}