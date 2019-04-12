import { redisClient } from '../lib/redis';

export class cacheBase {
    public pre: string
    constructor(pre: string) {
        this.pre = pre
    }
    async delKey(key: string) {
        const result = redisClient.del(this.pre + '_' + key)
        console.log(result)
    }
    
    
}

export class cacheKeyVal extends cacheBase {
    public pre: string
    constructor(pre: string) {
        super(pre)
        this.pre = pre
    }

    /**
     * 设置一个keyVal类型的键
     * @param key 键名
     * @param value 键值
     * @param expire [可选] 存在秒数s
     * @returns boolean 表示是否设置成功 
     */
    async set(key: string, value: string, expire?: number): Promise<boolean> {
        let result = true
        if (expire) {
            await new Promise((resolve, reject) => {
                redisClient.setex(this.pre + '_' + key, expire, value, (e) => {
                    if (e) {
                        result = false
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        } else {
            await new Promise((resolve, reject) => {
                redisClient.set(this.pre + '_' + key, value, (e) => {
                    if (e) {
                        result = false
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        }
        return result
    }

    /**
     * 获取一个keyVal类型键值
     * @param key 键名
     * @return string | null 该键存在则返回string否则返回null
     */
    async get(key: string): Promise<null | string> {
        let result: string | null = null
        await new Promise((resolve, reject) => {
            redisClient.get(this.pre + '_' + key, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else { 
                    result = v
                    resolve()
                }
            })
        })
        return result
    }
}

export class cacheHash extends cacheBase {
    public pre: string
    constructor(pre: string) {
        super(pre)
        this.pre = pre
    }

    /**
     * 获取一个hash类型的属性
     * @param key 键名
     * @param field 属性名
     */
    async getField(key: string, field: string): Promise<null | string> {
        let result: string | null = null
        await new Promise((resolve, reject) => {
            redisClient.hget(this.pre + '_' + key, field, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else { 
                    result = v
                    resolve()
                }
            })
        })
        return result
    }

    /**
     * 设置一个hash类型的属性
     * @param key 键名
     * @param field 属性名
     * @param value 属性值
     */
    async set(key: string, field: string, value: string): Promise<boolean> {
        let result: boolean = true
        await new Promise((resolve, reject) => {
            redisClient.hset(this.pre + '_' + key, field, value, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }
}

