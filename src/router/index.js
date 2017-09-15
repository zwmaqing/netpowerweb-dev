import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/pages/login'
import Home from '@/pages/Home'
import * as _ from '@/util/tools'
Vue.use(Router)

const router = new Router({

    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            meta: {
                requiresAuth: true
            },
            component: Home
        }
    ]
})

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) { // 判断是否需要登录权限
        var cookie = _.getCookie("User_Login_Token");
        //console.log(cookie);
        if (cookie != null && cookie.length > 6) { // 判断是否登录
            next()
        } else { // 没登录则跳转到登录界面
            next({
                path: '/login'
            })
        }
    } else {
        next()
    }
})

export default router