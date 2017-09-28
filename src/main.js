// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';

// import Mint from 'mint-ui';
// Vue.use(Mint);

import 'element-ui/lib/theme-default/index.css';

Vue.config.productionTip = false

import { mapGetters, mapActions, mapMutations } from 'vuex'

Vue.use(ElementUI);

/* eslint-disable no-new */
var winSize = function() {
    var e = window,
        a = 'inner';

    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return { width: e[a + 'Width'], height: e[a + 'Height'] };
};

new Vue({
    el: '#app',
    router,
    store,
    methods: {
        ...mapActions([
            'setWidth', 'setHeight', 'setSys_Width', 'setSys_Height'
        ]),
        ...mapMutations(['SET_WIDTH', 'SET_HEIGHT', 'SET_SYS_WIDTH', 'SET_SYS_HEIGHT'])
    },
    mounted() {
        //转存 this，以便于在事件方法调用
        const that = this
            // console.log("system.systemWidth:" + store.state.system.system_Width);
            //启动时设置初始值
            //Global Actions
            // window.resizeTo(winSize().height, (winSize().width + 10));
            // console.log("change:" + winSize().width);
        that.setWidth(winSize().width);
        that.setHeight(winSize().height);
        //modules system Actions
        that.setSys_Width(winSize().width);
        that.setSys_Height(winSize().height);

        //绑定事件方法
        window.onresize = function() {
            return function() {
                console.log('window.onresized');
                //Global Mutations
                that.SET_WIDTH(winSize().width);
                //Global Actions
                that.setHeight(winSize().height);
                //modules system Mutations
                that.SET_SYS_WIDTH(winSize().width);
                that.SET_SYS_HEIGHT(winSize().height);
            }()
        }
    },
    template: '<App/>',
    components: { App }
})