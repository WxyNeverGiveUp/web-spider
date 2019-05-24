import * as Koa from 'koa'
import * as cheerio from 'cheerio'
import * as https from 'https'
import { cacheKeyVal } from '../models/redisModel';
import { getConfig } from '../config/config';
import { mysqlFactory } from '../models/mysqlModel';


const jobTable = mysqlFactory<mysqlTable.job>({
    table: "job"
})
/**
 * 获取静态网页数据
 * @param ctx 
 */
export async function getNews(ctx: Koa.Context) {
    const url = 'https://voice.hupu.com/nba'
    const { pageNum = 1 }: routeParams.getNews.request = ctx.query
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
                let $ = cheerio.load(html, {decodeEntities: false}) //cheerio模块开始处理 DOM处理
                
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
                        console.log(oneNews.title)  //控制台输出新闻信息
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



/** 
 * 获取动态网页数据
 * @param ctx 
 */
export async function getJobs(ctx: Koa.Context) {
    const { pageNum = 1, pageSize = 10}: routeParams.getJobs.request = ctx.query
    
    type job = {
        extractSkillTag: string[],
        welfare: string[],
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
    let successCounter = 0,
        existCounter = 0,
        errorCounter = 0

    let msg

    for (let i = pageNum; i < pageNum + 100; i++) {
        const dataUrl = `https://fe-api.zhaopin.com/c/i/sou?start=${(i - 1) * pageSize}&pageSize=${pageSize}`
        await new Promise((resolve, reject) => {
            https.get(dataUrl, (res) => { //通过get方法获取对应地址中的页面信息
                let chunks: any[] = []
                let size = 0
                res.on('data', (chunk) => {   //监听事件 传输
                    chunks.push(chunk)
                    size += chunk.length
                })
                res.on('end', async () => { //数据传输完
                    let bufferData = Buffer.concat(chunks, size) 
                    console.log(bufferData.toString())
                    let data 
                    try {
                        data = JSON.parse(bufferData.toString())
                    } catch (error) {
                    }
                    for (const item of data.data.results) {
                        let job: job = {
                            extractSkillTag: item.extractSkillTag, // 需要技巧
                            welfare: item.welfare,
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
                        console.log(job.name)  //控制台输出岗位名
                        if (job.company) {
                            jobs.push(job) 
                            try {
                                let isExist = await jobTable.get({company: job.company, name: job.name}, ['name'])
                                if (isExist.length === 0) {
                                    await jobTable.insert({
                                        company: job.company, // 公司名
                                        name: job.name, // 岗位
                                        city: job.city, // 地区
                                        salary: job.salary, // 薪资
                                        scale:  job.scale, // 规模
                                        edu_level: job.eduLevel, // 教育要求
                                        exp: job.exp, // 工作年限
                                        time: job.time, // 发布时间
                                        url: job.url, // 网址
                                        welfare: job.welfare.join(','),
                                        skilltag: job.extractSkillTag.join(','),
                                        empl_type: job.emplType, // 招聘类型
                                        position_url: job.positionURL // 岗位详情
                                    })
                                    successCounter++
                                } else {
                                    existCounter++
                                }
                            } catch (error) {
                                console.log(error)
                                errorCounter++
                            }
                        } 
                    }
                    msg = `总共抓取${data.data.results.length}条数据，成功插入${successCounter}条数据，重复信息${existCounter}条数据，不完整性数据${errorCounter}条`
                    resolve(jobs)
                })
                res.on('error', (e) => {
                    console.log(e)
                    reject()
                })
            })
        })
    }
    console.log(msg)

    ctx.body = {
        data: {
            jobs,
            msg
        }
    }
}



export async function testRedis(ctx: Koa.Context) {
    const pre = getConfig().server.mount
    let keyValueModel = new cacheKeyVal(pre)
    await keyValueModel.set('test', '1')
    console.log(await keyValueModel.get('test'))
    ctx.body = {
        data: '???'
    }
}


/** 
 * 获取动态网页数据
 * @param ctx 
 */
export async function commonGetJobs(ctx: Koa.Context) {
    const { pageNum = 1, pageSize = 10}: routeParams.getJobs.request = ctx.query
    
    type job = {
        extractSkillTag: string[],
        welfare: string[],
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
        const dataUrl = `https://fe-api.zhaopin.com/c/i/sou?start=${(pageNum - 1) * pageSize}&pageSize=${pageSize}`
        await new Promise((resolve, reject) => {
            https.get(dataUrl, (res) => { //通过get方法获取对应地址中的页面信息
                let chunks: any[] = []
                let size = 0
                res.on('data', (chunk) => {   //监听事件 传输
                    chunks.push(chunk)
                    size += chunk.length
                })
                res.on('end', async () => { //数据传输完
                    let bufferData = Buffer.concat(chunks, size) 
                    console.log(bufferData.toString())
                    let data
                    try {
                        data = JSON.parse(bufferData.toString())
                    } catch (error) {
                        
                    }
                    for (const item of data.data.results) {
                        let job: job = {
                            extractSkillTag: item.extractSkillTag, // 需要技巧
                            welfare: item.welfare,
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
                        console.log(job.name)  //控制台输出岗位名
                        if (job.company) {
                            jobs.push(job) 
                            try {
                                let isExist = await jobTable.get({company: job.company, name: job.name}, ['name'])
                                if (isExist.length === 0) {
                                    await jobTable.insert({
                                        company: job.company, // 公司名
                                        name: job.name, // 岗位
                                        city: job.city, // 地区
                                        salary: job.salary, // 薪资
                                        scale:  job.scale, // 规模
                                        edu_level: job.eduLevel, // 教育要求
                                        exp: job.exp, // 工作年限
                                        time: job.time, // 发布时间
                                        url: job.url, // 网址
                                        welfare: job.welfare.join(','),
                                        skilltag: job.extractSkillTag.join(','),
                                        empl_type: job.emplType, // 招聘类型
                                        position_url: job.positionURL // 岗位详情
                                    })
                                }
                            } catch (error) {
                                console.log(error)
                            }
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



