import { Route } from "../lib/route"
import { test } from "../controller/test"

export = [new Route({
    cmd:'test',
    handler: [test],
    method: "get"
})]
