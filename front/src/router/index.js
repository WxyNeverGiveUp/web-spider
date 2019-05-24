import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import jobs from '@/components/LGjobs'
import news from '@/components/news'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    }, {
        path: '/jobs',
        name: 'jobs',
        component: jobs
    }, {
        path: '/news',
        name: 'news',
        component: news
    }]
})