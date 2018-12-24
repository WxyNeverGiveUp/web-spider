import * as request from 'request'
// const request = require('superagent');

class RequestClass {
    constructor() {
        this.get()
    }

    get() {
        request.get('http://127.0.0.1:3000/index/test', (err, res) => {
            console.log(err)
            console.log(res)
        })
    }

}

export const commonRequest = new RequestClass()