import * as request from 'request'
import * as ajaxRequest from 'superagent'
import { HashMap } from '../models/mysqlModel';

class RequestClass {
    constructor() {
    }

    get(url: string, params?: HashMap) {
        let path = url + `?data=${JSON.stringify(params)}`
        request.get(path, (err, res) => {
            console.log(`请求的路径为：${path}`)
            if (err) {
                console.log('this request error==> ', err)
                console.log('this request res==>', res)
            }
        })
    }

    post() {

    }

    ajaxGet(url: string, params?: HashMap, cb?: () => any) {
        ajaxRequest.get(url).query(params).end((err, res) => {
            cb && cb()
            if (err) {
                console.log(`this ajax 【${url}】 request(get) error==>`, err)
                console.log(`this ajax 【${url}】 request res==>`, res)
            }
        })
    }

    ajaxPost(url: string, params?: HashMap, cb?: () => any) {
        ajaxRequest.post(url).send(params).end((err, res) => {
            cb && cb()
            if (err) {
                console.log(`this ajax 【${url}】 request(post) error==>`, err)
                console.log(`this ajax 【${url}】 request(post) res==>`, res)
            }
        })
    }
}

export const commonRequest = new RequestClass()