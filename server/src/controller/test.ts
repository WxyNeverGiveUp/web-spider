import * as Koa from 'koa'
import * as cheerio from 'cheerio'
import { commonRequest } from '../util/requestClass';

export async function test(ctx: Koa.Context) {
    const $ = cheerio.load('<h2>你们好</h2>')
    console.log(ctx.query)
    console.log(commonRequest)
    ctx.body = {
        data: $('h2').text()
    }
}