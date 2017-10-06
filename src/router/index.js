import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/login.vue'
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
            // meta: {
            //     requiresAuth: true
            // },
            component: resolve => require(['@/components/common/Home.vue'], resolve),
            //component: Home,
            children: [{
                    path: '/tasks',
                    component: resolve => require(['../components/pages/Tasks.vue'], resolve)
                },
                {
                    path: '/files',
                    component: resolve => require(['../components/pages/Files.vue'], resolve)
                },
                {
                    path: '/groups',
                    component: resolve => require(['../components/pages/Groups.vue'], resolve)
                },
                {
                    path: '/speak',
                    component: resolve => require(['../components/pages/Speak.vue'], resolve)
                },
                {
                    path: '/speak-class',
                    component: resolve => require(['../components/pages/SpeakClass.vue'], resolve)
                },
                {
                    path: '/settings',
                    component: resolve => require(['../components/pages/Settings.vue'], resolve)
                },
                {
                    path: '/eqadjust',
                    component: resolve => require(['../components/pages/EQAdjust.vue'], resolve)
                },
                {
                    path: '/microphone',
                    component: resolve => require(['../components/pages/Microphone.vue'], resolve)
                }
            ]
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