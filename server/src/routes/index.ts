import { Route } from "../lib/route"
import { test } from "../controller/test"
import { getJobs, getNews, testRedis } from "../controller/index";


export = [new Route({
    cmd:'test',
    handler: [test],
    method: "get"
}), new Route({
    cmd:'hupu/news',
    handler: [getNews],
    method: "get"
}), new Route({
    cmd:'lagou/jobs',
    handler: [getJobs],
    method: "get"
}), new Route({
    cmd: 'testRedis',
    handler:[testRedis],
    method: 'get'
})]
