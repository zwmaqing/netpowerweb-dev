// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';

// import Mint from 'mint-ui';
// Vue.use(Mint);

import 'element-ui/lib/theme-chalk/index.css';

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

// v-loadmore: 用于在element-ui的select下拉框加上滚动到底事件监听vscrollbar
Vue.directive('vscrollbar', {
    bind(el, binding, vnode) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
        console.log(SELECTWRAP_DOM);
        SELECTWRAP_DOM.addEventListener('scroll', function() {

            /*
             * scrollHeight 获取元素内容高度(只读)
             * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
             * clientHeight 读取元素的可见高度(只读)
             * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
             * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
             */

            // const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) &&
            //this.scrollTop > sign) 
            // 注意: && this.scrollTop
            //console.log("scrollHeight:" + this.scrollHeight + " clientHeight：" + this.clientHeight + " scrollTop:" + this.scrollTop);
            if (this.scrollTop == 0) {
                // console.log('到顶了')
                binding.value('Top');
            }
            if (this.scrollTop == (this.scrollHeight - this.clientHeight)) {
                // console.log('到底了')
                binding.value('Bottom');
            }
            // if (this.scrollTop > sign) {
            //     sign = this.scrollTop;
            //     console.log('向下')
            // }
            // if (this.scrollTop < sign) {
            //     sign = this.scrollTop;
            //     console.log('向上')
            // }
            // console.log(CONDITION)
            // if (CONDITION) {
            //     binding.value();
            // }
        });
    }
})

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
    render: h => h(App)
        // template: '<App/>',
        // components: { App }
}).$mount('#app');