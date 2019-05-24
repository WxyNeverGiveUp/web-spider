<template>
    <div>
        <div class='button-box'>
            <el-button type="primary" @click='back'>返回首页</el-button>
            <el-button type="primary" @click='getAllJobs'>定时爬取1000条数据</el-button>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column
            prop="date"
            label="日期"
            sortable
            width="180">
            </el-table-column>
            <el-table-column
            prop="company"
            label="公司"
            sortable>
            </el-table-column>
            <el-table-column
            prop="name"
            label="职位"
            :formatter="formatter">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="薪资">
            </el-table-column>
            <el-table-column
                prop="city"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="scale"
                label="规模">
            </el-table-column>
            <el-table-column
                prop="eduLevel"
                label="教育要求">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="openUrl(scope.row.url)">查看公司详情</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="openUrl(scope.row.positionUrl)">查看岗位详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click='prePage()'>上一页</el-button>
            <el-button @click='nextPage()'>下一页</el-button>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui'
    export default {
        name: 'jobs',
        data() {
            return {
                currentPage: 1,
                tableData: [],
                currentAllPage: 1,
            }
        },
        methods: {
            formatter(row, column) {
                return row.name
            },
            openUrl(url) {
                window.open(url)
            },
            nextPage() {
                this.currentPage += 1
                this.getJobs(this.currentPage)
                console.log('当前页面数', this.currentPage)
            },
            prePage() {
                if (this.currentPage === 1) {
                    alert('当前已经是第一页')
                } else {
                    this.currentPage -= 1
                    this.getJobs(this.currentPage)
                }
            },
            getJobs(page, size = 10) {
                this.$axios.get(`http://localhost:3000/index/commonGetJobs?pageNum=${page}&pageSize=${size}`).then((response) =>{          //这里使用了ES6的语法
                    console.log(response)       //请求成功返回的数据
                    this.tableData = []
                    for (const job of response.data.data) {
                        this.tableData.push({
                            date: job.time,
                            company: job.company,
                            name: job.name,
                            salary: job.salary,
                            eduLevel: job.eduLevel,
                            city: job.city,
                            scale: job.scale,
                            url: job.url,
                            positionUrl: job.positionURL
                        })
                    }
                }).catch((error) =>{
                    console.log(error.response)
                    console.log(error)       //请求失败返回的数据
                })
            },
            back () {
                this.$router.push('/')
            },
            getAllJobs(isLoading = true) {
                const loadingOptions = {
                    lock: true,
                    text: "拼命加载中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                }
                let loading
                if (isLoading) {
                    loading = Loading.service(loadingOptions)
                }
                this.$axios.get(`http://localhost:3000/index/lagou/jobs?pageNum=${this.currentAllPage}`).then((response) =>{
                    console.log(response)       //请求成功返回的数据
                    this.tableData = []
                    for (const job of response.data.data.jobs) {
                        this.tableData.push({
                            date: job.time,
                            company: job.company,
                            name: job.name,
                            salary: job.salary,
                            eduLevel: job.eduLevel,
                            city: job.city,
                            scale: job.scale,
                            url: job.url,
                            positionUrl: job.positionURL
                        })
                    }
                    if (isLoading) {
                        loading.close()
                    }
                    this.$message({
                        message: `爬取完成, 结果如下：【${response.data.data.msg}】`,
                        type: 'success',
                        duration: 0,
                        showClose: true,
                    })
                    currentAllPage += 100
                }).catch((error) =>{
                    console.log(error.response)
                    console.log(error)       //请求失败返回的数据
                })
            }
        },
        created() {
            this.getJobs(this.currentPage)
        },
    }
</script>

<style scoped>
    .button-box {
        float: left;
    }
</style>

