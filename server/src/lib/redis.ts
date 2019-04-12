import * as redis from 'redis'
import { getConfig } from '../config/config'

export const redisClient = redis.createClient({
    host: getConfig().redis.host,
    port: getConfig().redis.port
})
