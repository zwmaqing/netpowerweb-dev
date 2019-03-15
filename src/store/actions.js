import * as types from './mutation-types'
import store from './index'
import api from "../api/index";
import {
  Loading,
  MessageBox
} from 'element-ui'

export default {
  setWidth({
    commit
  }, width) {
    //console.log("action:" + width)
    commit(types.SET_WIDTH, width)
  },
  setHeight({
    commit
  }, height) {
    commit(types.SET_HEIGHT, height)
  },
  setLogin({
    commit
  }, isLogin) {
    commit(types.SET_ISLOGIN, isLogin)
  },
  setPath({
    commit
  }, path) {
    commit(types.SET_PATH, path)
  },
  setGroups({
    commit
  }, groups) {
    commit(types.SET_GROUPS, groups)
  },
  setChannals({
    commit
  }, channals) {
    commit(types.SET_CHANNALS, channals)
  },
  setTaskList({
    commit
  }, tasks) {
    commit(types.SET_TASKSLIST, tasks)
  },
  getGroupsTotal({
    commit
  }) {
    let data = {
      CMD: "GetCHGroupsCount",
      Token: store.state.tokenStr
    };
    api.Group(data).then(res => {
      commit(types.SET_GROUPSTOTAL, res.Data.GroupCount)
    });
  },
  getGroups({
    commit
  }, range) {
    let data = {
      CMD: "GetCHGroups",
      Range: range,
      Token: store.state.tokenStr
    };
    api.Group(data).then(res => {
      if (res.Status) {
        commit(types.SET_GROUPS, res.Data);
      }
    });
  },
  getPushGroups({
    commit
  }, range) {
    let data = {
      CMD: "GetCHGroups",
      Range: range,
      Token: store.state.tokenStr
    };
    api.Group(data).then(res => {
      if (res.Status) {
        res.Data.forEach(element => {
          commit(types.PUSH_GROUPS, element);
        });
      }
    });
  },
  getAllGroups2p({
    dispatch,
    commit
  }) {
    dispatch('getGroupsTotal').then(res => {
      dispatch('getGroups', "0-15").then()
      dispatch('getPushGroups', "16-32").then()
    })
  },
  getChannals({
    commit
  }) {
    let data = {
      CMD: "GetChannels",
      Token: store.state.tokenStr
    };
    api.Group(data).then(res => {
      if (res.Status) {
        commit(types.SET_CHANNALS, res.Data);
      }
    });
  },
  getTasksTotal({
    commit
  }) {
    let data = {
      CMD: "GetTaskCount",
      Token: store.state.tokenStr
    };
    api.Task(data).then(res => {
      if (res.Status) {
        commit(types.SET_TASKSTOTAL, res.Data.TaskCount);
      } else {

      }
    });
  },
  getTasks({
    commit
  }, params) {
    let data = {
      CMD: "GetTaskList",
      Range: params.range,
      Token: store.state.tokenStr
    };
    api.Task(data).then(res => {
      if (res.Status) {
        for (let index = 0; index < res.Data.length; index++) {
          if (params.isAdd) {
            commit(types.SET_PUSHTASKSLIST, res.Data[index]);
          }
        }
        if (!params.isAdd) {
          commit(types.SET_TASKSLIST, res.Data);
        }
      } else {
        // if (!isAdd) {
        //   commit(types.SET_TASKSLIST, []);
        // }
      }
    });
  },
  getHomePageTasks({
    dispatch,
    commit
  }, vessel) {
    dispatch('getTasksTotal').then(res => {
      commit(types.SET_TASKSPAGEINDEX, 0);
      dispatch('getTasks', {
        range: "1-12",
        isAdd: false
      }).then()

      if (vessel > 12) {
        commit(types.SET_TASKSPAGEINDEX, 1);
        setTimeout(() => {
          dispatch('getTasks', {
            range: "13-24",
            isAdd: true
          }).then();
        }, 450);
      }
    })
  },
  strtTask({
    commit
  }, taskID) {
    let params = {
      CMD: "StartTask",
      TaskID: taskID,
      Token: store.state.tokenStr
    };
    api.Task(params).then(res => {
      if (res.Status) {
        commit(types.SET_TASKSTATUS, {
          TaskID: taskID,
          Status: "Running"
        });
      } else {
        var msg = "启动任务失败！";
        if (res.StatusCode == 410) {
          msg += "该任务已不存在了(其他终端删除了,请刷新页面.)";
        }
        msg += "\n(" + res.DetailedInfo + ")";
        MessageBox.alert(msg, {
          confirmButtonText: '确定'
        })
      }
    });
  },
  endRuningTask({
    commit
  }) {
    let params = {
      CMD: "EndRunningTask",
      Token: store.state.tokenStr
    };
    api.Task(params).then(res => {
      if (res.Status) {
        commit(types.SET_TASKSTATUS, {
          TaskID: 0,
          Status: "Running"
        });
      }
    });
  },
  delOneTaskForBuff({
    commit
  }, taskID) {
    commit(types.DEL_ONETASKFORBUFF, taskID)
  },
  taskStateRefresh({
    commit
  }, timeSpan) {

  },
  isReloginToDev({
    commit
  }, reData) {

    if (reData.StatusCode == 204) {
      // console.log(reData);
      // alert("to login");
      clearInterval(state.TaskRefreshTimer);
      MessageBox.confirm('登录已失效, 是否重新登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reData.$router.push("/login"); //进入登录页面
      }).catch(() => {
        return
      });
    }
  }
}
