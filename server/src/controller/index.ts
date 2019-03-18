import * as Koa from 'koa'
import * as cheerio from 'cheerio'
// import * as http from 'http'
import * as https from 'https'
// import { mysqlFactory } from '../models/mysqlModel'

// const messageTable = mysqlFactory<mysqlTable.message>({
//     table: 'message'
// })

export async function getJobs(ctx: Koa.Context) {
    const url = 'https://fe-api.zhaopin.com/c/i/sou?pageSize=90&cityId=%E4%B8%8A%E6%B5%B7&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kw=Web%E5%89%8D%E7%AB%AF&kt=3&at=e92686b03c72451482b9d097eb8ac142&rt=ce6f0aaa24a2431c900d497fb6b03d37&_v=0.68040916&userCode=710265625&x-zp-page-request-id=2b18580055a74d119ceeba380e5d9adc-1552901204648-206112'
    let jobs: {
        company: string,
        period: string,
        scale: string,
        name: string,
        src: string,
        city: string,
        salary: string,
        exp: string,
        time: string
    }[] = []
    await new Promise((resolve) => {
        https.get(url, (res) => { //通过get方法获取对应地址中的页面信息
            let chunks: any[] = []
            let size = 0
            res.on('data', (chunk) => {   //监听事件 传输
                chunks.push(chunk)
                size += chunk.length
            })
            res.on('end', () => { //数据传输完
                let data = Buffer.concat(chunks, size) 
                console.log(JSON.parse(data.toString()))
                let html = data.toString()
                let $ = cheerio.load(html, {decodeEntities: false}); //cheerio模块开始处理 DOM处理
                $(".contentpile__content__wrapper__item__info").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
                    let job: {
                        company: string,
                        period: string,
                        scale: string,
                        name: string,
                        src: string,
                        city: string,
                        salary: string,
                        exp: string,
                        time: string
                    } = {}
                    // job.company = $(this).find('h4 a').html() //公司名
                    // job.period = $(this).find(".hot_pos_r span").eq(1).html() //阶段
                    // job.scale = $(this).find(".hot_pos_r span").eq(2).html() //规模
        
                    // job.name = $(this).data('positionname') //岗位名
                    // job.src = $(this).find(".hot_pos_l a").attr("href") //岗位链接
                    // job.city = $(this).find(".hot_pos_l .c9").html() //岗位所在城市
                    // job.salary = $(this).data('salary') //薪资
                    // job.exp = $(this).find(".hot_pos_l span").eq(2).html() //岗位所需经验
                    // job.time = $(this).find(".hot_pos_l span").eq(5).html() //发布时间
        
                    console.log(job.company)  //控制台输出岗位名
                    if (job.company) {
                        jobs.push(job) 
                    } 
                })
                resolve(jobs)
            })
        })
    })
    
    ctx.body = {
        data: jobs
    }
}

export async function getNews(ctx: Koa.Context) {
    const url = 'https://voice.hupu.com/nba'
    const { page = 1 } = ctx.query.data
    console.log('data=>', ctx.query.data, typeof ctx.query.data)
    let news: {
        title: string,
        time: string,
        comeFrom: string
    }[] = []
    await new Promise((resolve) => {
        https.get(url + '/' + page, (res) => { //通过get方法获取对应地址中的页面信息
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