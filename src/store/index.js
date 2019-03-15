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
  isMobileDev: false,
  userName: cookieUserName,
  isLogin: cookieUserToken != null && cookieUserToken.length > 6,
  tokenStr: cookieUserToken,
  weekOptions: [{
      label: "星期一",
      key: 1
    },
    {
      label: "星期二",
      key: 2
    },
    {
      label: "星期三",
      key: 3
    },
    {
      label: "星期四",
      key: 4
    },
    {
      label: "星期五",
      key: 5
    },
    {
      label: "星期六",
      key: 6
    },
    {
      label: "星期日",
      key: 7
    }
  ],
  phth: '', //curent router path
  groupsTotal: 0, //分组总数
  groups: [], //分区分组列表数据
  channals: [], //设备分区列表数据
  tasks: [], //定时任务列表数据.
  taskTotal: 0,//任务总数
  taskPageIndex: 0,//任务数据获取分页序号
  isTaskRefresh: false, //是否刷新任务状态信息
  isDevCommBusy: false, //到设备是否通信忙，用于请求频繁控制
  IsTaskRunning: false,
  TaskRefreshTimer:0,
  DelFileInfo:{}//
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
