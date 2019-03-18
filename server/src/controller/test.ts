import * as Koa from 'koa'
import * as cheerio from 'cheerio'
import { commonRequest } from '../util/requestClass';

export async function test(ctx: Koa.Context) {
    const $ = cheerio.load('<h2>你们好</h2>')
    console.log(ctx.query)
    commonRequest.ajaxGet('http://127.0.0.1:3000/index/hupu', {jdaddddd: 12123})
    ctx.body = {
        data: $('h2').text()
    }
}