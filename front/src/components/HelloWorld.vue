<template>  
    <div>
        <div id="wrapper">
            <h1>Wuxy 720</h1>
            <h2>Welcome to web-spider</h2>
            <el-button type="primary" @click="toNews">前往查看新闻</el-button>
			<el-button type="success" @click="toJobs">前往查看工作岗位</el-button>
        </div>
        <canvas width="1920" height="920"></canvas>
    </div>
</template>

<script type="text/javascript">
import '../assets/js/index.js'
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome to web-spider'
		}
	},
  	created() {
	},
	methods: {
		toNews() {
		    this.$router.push('/news')
		},
		toJobs() {
		    this.$router.push('/jobs')
		}
	}
}
</script>

<style scoped>
    html, body {
        overflow: hidden;
        margin: 0;
    }
    body {
        font-family: 'Open Sans', 'Helvetica Neue', 'Hiragino Sans GB', 'LiHei Pro', Arial, sans-serif;
        color: #333;
    }
    #wrapper {
        position: absolute;
        left: 0;
        width: 320px;
        text-align: center;
        top: 50%;
        left: 50%;
        margin-left: -160px;
        margin-top: -160px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    h1 {
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-weight: 700;
        font-size: 30px;
        letter-spacing: 9px;
        text-transform: uppercase;
        margin: 12px 0;
        left: 4px;
    }
    h2 {
        color: #999;
        font-weight: normal;
        font-size: 15px;
        letter-spacing: .12em;
        margin-bottom: 30px;
        left: 3px;
    }
    h1, h2 {
        position: relative;
    }
    p {
        font-size: 14px;
        line-height: 2em;
        margin: 0;
        letter-spacing: 2px;
    }
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    a {
        color: #999;
        text-decoration: none;
        transition: color .2s ease;
    }
    a:hover {
        color: #f33;
    }
</style>
