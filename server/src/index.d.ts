/**
 * 全局声明文件
 */
declare const enum SwitchValue {
    OFF,
    ON
}

declare const enum Env {
    TEST = 'test',
    ONLINE = 'online',
    LOCAL = 'local'
}

declare namespace Config {
    /**
     * mysql配置项
     */
    type Mysql = {
        host: string,
        port: number,
        db: string,
        user: string,
        password: string,
        max: number,
        min: number,
        timeout: number,
        log: SwitchValue
    }
    
    /**
      * Redis配置项
      */
     type Redis = {
        host: string,
        port: number,
        max: number,
        min: number,
        timeout: number,
        log: SwitchValue,
        expire: number,
        turnOn: SwitchValue,
        password: string
    }

    /***
     * 服务配置项，包含主要环境变量
     */
    type Server = {
        ip: string,
        port: number,
        machine_id: number,
        debug: SwitchValue,
        log_path: string,
        env: string,
        secret: string,
        mount: string,
        clear_index_file: string,
        data_file_path?: string,
        certification_path?: string
    }

    /**
     * 配置项
     */
    type Options = {
        server: Server,
        redis: Redis,
        mysql: Mysql
    }
}

declare namespace mysqlTable {
    type job = {
        id?: number, // 唯一ID
        company: string, // 公司名
        name: string, // 岗位
        city: string, // 地区
        salary: string, // 薪资
        scale:  string, // 规模
        edu_level: string, // 教育要求
        exp: string, // 工作年限
        time: string, // 发布时间
        url: string, // 网址
        empl_type: string, // 招聘类型
        welfare: string, // 福利待遇
        skilltag: string, // 技能
        position_url: string // 岗位详情
    }
}

declare const enum AppCode {
    done = 0
}

declare namespace routeParams {
    /**
     * 获取工作信息
     */
    namespace getJobs {
        interface request {
            pageSize: number,
            pageNum: number
        }
        interface response {

        }
    }
    /**
     * 获取新闻信息
     */
    namespace getNews {
        interface request {
            pageSize: number,
            pageNum: number
        }
        interface response {

        }
    }
}