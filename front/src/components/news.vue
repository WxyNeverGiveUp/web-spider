<template>
    <div>
        <div class='button-box'>
            <el-button type="primary" @click='back'>返回首页</el-button>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column
            prop="date"
            label="发布时间"
            sortable
            width="180">
            </el-table-column>
            <el-table-column
            prop="title"
            label="标题"
            sortable>
            </el-table-column>
            <el-table-column
            prop="comeFrom"
            label="来源"
            sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="openUrl(scope.row.link)">查看新闻详情</el-button>
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
  export default {
	name: 'news',
    data() {
        return {
            currentPage: 1,
            tableData: []
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
            this.getNews(this.currentPage)
            console.log('当前页面数', this.currentPage)
        },
        prePage() {
            if (this.currentPage === 1) {
                this.$message({
                    message: `当前已经是第一页`,
                    type: 'error',
                    duration: 3000
                })
            } else {
                this.currentPage -= 1
                this.getNews(this.currentPage)
            }
        },
        getNews(page) {
            this.$axios.get(`http://localhost:3000/index/hupu/news?pageNum=${page}`).then((response) =>{          //这里使用了ES6的语法
                console.log(response)       //请求成功返回的数据
                this.tableData = []
                for (const msg of response.data.data) {
                    this.tableData.push({
                        date: msg.time,
                        title: msg.title,
                        comeFrom: msg.comeFrom,
                        link: msg.link
                    })
                }
            }).catch((error) =>{
                console.log(error.response)
                console.log(error)       //请求失败返回的数据
            })
        },
        back () {
            this.$router.push('/')
        }
    },
    created() {
		this.getNews(this.currentPage)
	}
  }
</script>

<style scoped>
    .button-box {
        float: left;
    }
</style>
