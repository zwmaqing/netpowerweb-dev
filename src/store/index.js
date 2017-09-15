import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import system from './modules/system'
import mutations from './mutations'
import * as _ from '@/util/tools'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


var cookieUserName = _.getCookie("User_Login_Name");
var cookieUserToken = _.getCookie("User_Login_Token");

const state = {
    screenWidth: 0,
    screenHeight: 0,
    userName: cookieUserName,
    isLogin: cookieUserToken != null && cookieUserToken.length > 6,
    tokenStr: cookieUserToken
}
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        system
    },
    strict: debug
})