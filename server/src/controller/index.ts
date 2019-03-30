import * as Koa from 'koa'
import * as cheerio from 'cheerio'
import * as https from 'https'
// import { mysqlFactory } from '../models/mysqlModel'

// const messageTable = mysqlFactory<mysqlTable.message>({
//     table: 'message'
// })

/**
 * 获取动态网页数据
 * @param ctx 
 */
export async function getJobs(ctx: Koa.Context) {
    const { pageNum = 1, pageSize = 90}: routeParams.getJobs.request = ctx.query
    console.log('请求的参数为', ctx.query)
    // const baseUrl = 'https://sou.zhaopin.com/?jl=489&in=10100&p=3' // 用于获取动态数据的基础页面
    const dataUrl = `https://fe-api.zhaopin.com/c/i/sou?industry=160400&start=${(pageNum - 1) * pageSize}&pageSize=${pageSize}`
    type job = {
        company: string,
        eduLevel: string,
        scale: string,
        name: string,
        url: string,
        city: string,
        salary: string,
        exp: string,
        time: string,
        emplType: string,
        positionURL: string
    }
    let jobs: job[] = []
    await new Promise((resolve, reject) => {
        https.get(dataUrl, (res) => { //通过get方法获取对应地址中的页面信息
            let chunks: any[] = []
            let size = 0
            res.on('data', (chunk) => {   //监听事件 传输
                chunks.push(chunk)
                size += chunk.length
            })
            res.on('end', () => { //数据传输完
                let bufferData = Buffer.concat(chunks, size) 
                let data = JSON.parse(bufferData.toString())
                for (const item of data.data.results) {
                    let job: job = {
                        company: item.company.name, // 公司名
                        name: item.jobName, // 岗位
                        city: item.city.display, // 地区
                        salary: item.salary, // 薪资
                        scale:  item.company.size.name, // 规模
                        eduLevel: item.eduLevel.name, // 教育要求
                        exp: item.workingExp.name, // 工作年限
                        time: item.createDate, // 发布时间
                        url: item.company.url, // 网址
                        emplType: item.emplType, // 招聘类型
                        positionURL: item.positionURL // 岗位详情
                    }        
                    console.log(job.company)  //控制台输出岗位名
                    if (job.company) {
                        jobs.push(job) 
                    } 
                }
                resolve(jobs)
            })
            res.on('error', (e) => {
                console.log(e)
                reject()
            })
        })
    })
    
    ctx.body = {
        data: jobs
    }
}


/**
 * 获取静态网页数据
 * @param ctx 
 */
export async function getNews(ctx: Koa.Context) {
    const url = 'https://voice.hupu.com/nba'
    const { pageNum = 1 }: routeParams.getNews.request = ctx.query
    console.log('data=>', ctx.query, typeof ctx.query)
    let news: {
        title: string,
        time: string,
        comeFrom: string
    }[] = []
    await new Promise((resolve) => {
        https.get(url + '/' + pageNum, (res) => { //通过get方法获取对应地址中的页面信息
            let chunks: any[] = []
            let size = 0
            res.on('data', (chunk) => { //监听事件 传输
                chunks.push(chunk)
                size += chunk.length
            })
            res.on('end', () => { //数据传输完
                let data = Buffer.concat(chunks, size) 
                let html = data.toString()
                let $ = cheerio.load(html, {decodeEntities: false}); //cheerio模块开始处理 DOM处理
                
                $(".news-list li").each(function(){   // 新闻列表
                    let oneNews: {
                        title: string,
                        time: string,
                        comeFrom: string,
                        link: string
                    } = {
                        title: $(this).find('h4 a').text(), // 新闻名字
                        time: $(this).find('.otherInfo .time').attr('title'),
                        comeFrom: $(this).find('.otherInfo .comeFrom a').text(),
                        link: $(this).find('h4 a').attr('href')
                    }

                    if (oneNews.title) {
                        console.log(oneNews.title)  //控制台输出岗位名
                        news.push(oneNews) 
                    } 
                })
                resolve(news)
            })
        })
    })
    
    ctx.body = {
        data: news
    }
}