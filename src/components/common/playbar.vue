<template>
  <div class="playbar" v-bind:class="{ mobile: isMobileDev }">
    <div class="payset-bar">
      <el-popover ref="popmusiclist" placement="top" width="336" trigger="click">
        <el-table :data="runningTask.ProjectsList" v-on:row-click="selectProjectPlay">
          <el-table-column width="50" property="Index" label="序号"></el-table-column>
          <el-table-column width="200" property="Name" label="曲目名"></el-table-column>
          <el-table-column width="80" property="TimeSpan" label="时长"></el-table-column>
        </el-table>
      </el-popover>
      <el-popover ref="popvolumeadj" placement="top" width="260" trigger="click">
        <div style="">
          <el-slider v-model="runningTask.Volume" @change="valumchange"></el-slider>
        </div>
      </el-popover>
      <button class="button button-primary button-circle button-small juzhongd" :disabled="!runningTask.IsTaskRunning" v-popover:popvolumeadj>
        <i class="icon16 icon-volume-up"></i>
      </button>
      <el-tooltip class="item" effect="dark" content="均衡调节" placement="top" v-show="isPcDev">
        <button class="button button-primary button-circle button-small juzhongz" v-on:click="equalizingControl" :disabled="!runningTask.IsTaskRunning">
          <i class="icon16 icon-sliders"></i>
        </button>
      </el-tooltip>
      <button class="button button-primary button-circle button-small juzhongz" :disabled="!runningTask.IsTaskRunning" v-popover:popmusiclist>
        <i class="icon16 icon-list-ul"></i>
      </button>
      <el-tooltip class="item" effect="dark" content="播放模式" placement="top" v-show="isPcDev">
        <button class="button button-primary button-circle button-small juzhongz" :disabled="!runningTask.IsTaskRunning" @click="playmodelswich">
          <i class="icon16 icon-retweet"></i>
        </button>
      </el-tooltip>
    </div>
    <div class="play-box">
      <div class="pay-front">
        <button class="button button-royal button-circle" v-bind:class="{ 'button-small': isMobileDev }" v-on:click="_previous">
          <i class="icon16 icon-step-backward"></i>
        </button>
      </div>
      <div class="pay-play">
        <button class="button button-royal button-circle" v-bind:class="{ 'button-large': isPcDev }" v-on:click="_playPause">
          <i class="icon24" v-bind:class="playPauseIcon"></i>
        </button>
      </div>
      <div class="pay-next">
        <button class="button button-royal button-circle" v-bind:class="{ 'button-small': isMobileDev }" v-on:click="_next">
          <i class="icon16 icon-step-forward"></i>
        </button>
      </div>
    </div>
    <div class="progress-bar" style="padding-top: 3px;">
      <div class="remainingTimeFlag">
        <span v-show="isPcDev">-{{runningTask.TrackRemainingTime}}</span>
      </div>
      <div class="finishTimeFlag">
        <span v-show="isPcDev">{{runningTask.TrackPastTime}}</span>
      </div>
      <div class="musicnameFlag">
        <span style="" v-show="isPcDev">{{runningTask.TrackName}}</span>
      </div>
      <el-slider v-model="runningTask.PlayPercent" :disabled="!runningTask.IsTaskRunning" @input="percentinput" @change="playPercentchange"></el-slider>
    </div>
  </div>
</template>

<script>
import listenList from "./listenList";
import { mapGetters, mapActions, mapMutations } from "vuex";
import api from "../../api";
import * as _ from "../../util/tools";

export default {
  components: {
    "v-listen-list": listenList
  },
  data() {
    return {
      showListenList: false,
      runningTask: {
        IsTaskRunning: false,
        TaskID: 0, //任务ID
        TaskName: "", //任务名称
        TaskType: "", //任务类型
        Week: [], //任务周
        Volume: 60, //实际音量
        Projects: 0, //项目数量
        GroupList: [], //喇叭组ID
        StartTime: "00:00:00", //任务开始实际时间
        TimeSpan: "00:00:00", //任务时长
        TaskRemainingTime: "00:00:00", //任务剩余时长
        Status: "Stop", //播放文件状态
        TrackName: "", //音乐名称
        TrackTime: "00:00:00", //歌曲时长
        TrackPastTime: "00:00:00", //过去了的时间
        TrackRemainingTime: "00:00:00", //剩余时长
        PlayPercent: 0, //已完成百分百
        ProjectsList: []
      },
      timeOutCount: 0,
      isWaitingConfirm: false,
      notifyIns: undefined
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      tokenStr: "tokenStr",
      isPcDev: "isPcDev",
      isLogin: "isLogin",
      path: "path",
      isTaskRefresh: "isTaskRefresh",
      TaskRefreshTimer: "TaskRefreshTimer",
      isDevCommBusy: "isDevCommBusy"
    }),
    playPauseIcon: function() {
      return this.runningTask.Status === "Running" ? "icon-pause" : "icon-play";
    }
  },
  mounted() {
    //立即刷新一次
    this.getRunningTask();
  },
  methods: {
    ...mapMutations([
      "SET_TASKSTATUS",
      "SET_ISTASKREFRESH",
      "SET_TASKREFTIMEER"
    ]),
    ...mapActions(["isReloginToDev"]),
    _playPause() {
      if (this.runningTask.IsTaskRunning) {
        let params = {
          CMD: "PlayPause",
          Token: this.tokenStr
        };
        switch (this.runningTask.Status) {
          case "Running": {
            break;
          }
          case "Pause": {
            params.CMD = "PlayRestart";
            break;
          }
          default: {
            return;
          }
        }
        api.Task(params).then(res => {
          res.$router = this.$router; //是否需要重新登录检查
          this.isReloginToDev(res);
          if (res.Status) {
            this.SET_ISTASKREFRESH(true);
          }
        });
      }
    },
    _previous() {
      if (this.runningTask.IsTaskRunning) {
        let params = {
          CMD: "PlayBefore",
          Token: this.tokenStr
        };
        api.Task(params).then(res => {
          res.$router = this.$router; //是否需要重新登录检查
          this.isReloginToDev(res);
          if (res.Status) {
            this.SET_ISTASKREFRESH(true);
          }
        });
      }
    },
    _next() {
      if (this.runningTask.IsTaskRunning) {
        let params = {
          CMD: "PlayNext",
          Token: this.tokenStr
        };
        api.Task(params).then(res => {
          res.$router = this.$router; //是否需要重新登录检查
          this.isReloginToDev(res);
          if (res.Status) {
            this.SET_ISTASKREFRESH(true);
          }
        });
      }
    },
    showList() {
      //this.$store.dispatch('setShowListenList', true)
    },
    showPlay() {
      //this.$store.dispatch('setShowPlay', true)
    },
    selectProjectPlay(row) {
      let params = {
        CMD: "PlaySpecify",
        ProIndex: row.Index,
        Token: this.tokenStr
      };
      api.Task(params).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          this.SET_ISTASKREFRESH(true);
        }
      });
    },
    percentinput(newvalum) {
      //手动调整拖放曲目的播放进度
      // console.log('percentChanged to ' + newvalum);
    },
    playPercentchange(newvalum) {
      let params = {
        CMD: "PlayPosition",
        Progress: newvalum,
        Token: this.tokenStr
      };
      api.Task(params).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
        }
      });
    },
    playmodelswich() {
      // console.log('playmodelswich');
    },
    equalizingControl() {
      this.$message({
        showClose: true,
        message: "对不起，当前机型好像不支持远程EQ调节.",
        type: "warning"
      });
    },
    valumchange(newvalum) {
      console.log("valumchange to " + newvalum);
    },
    getRunningTask() {
      if (this.isWaitingConfirm || this.isDevCommBusy) {
        return;
      }
      if (this.timeOutCount > 2) {
        this.isWaitingConfirm = true;
        this.$confirm("获取数据超时, 是否退出系统?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            clearInterval(this.TaskRefreshTimer);
            this.$router.push("/login"); //进入登录页面
          })
          .catch(() => {
            this.timeOutCount = 0;
            this.isWaitingConfirm = false;
          });
      }
      let params = {
        CMD: "GetRunningTask",
        Token: this.tokenStr
      };
      api
        .SyncGetData(params)
        .then(res => {
          res.$router = this.$router; //是否需要重新登录检查
          this.isReloginToDev(res);
          this.timeOutCount = 0;
          if (res.Status) {
            if (res.Data.IsTaskRunning) {
              this.runningTaskDataRef(res.Data);
              if (
                !this.runningTask.IsTaskRunning &&
                this.runningTask.ProjectsList.length == 0
              ) {
                setTimeout(() => {
                  this.loadRunningTaskProject("0-15"); //实现列表其他项目
                }, 1000);
              }
              this.runningTask.IsTaskRunning = res.Data.IsTaskRunning;
            } else {
              if (this.runningTask.IsTaskRunning) {
                this.SET_TASKSTATUS({ TaskID: 0, Status: "Running" });
              }
              this.iniRunningTaskData();
            }
            //this.SET_ISTASKREFRESH(false);
          }
        })
        .catch(error => {
          //console.log(Error)
          this.timeOutCount++;
        });
    },
    loadRunningTaskProject(range) {
      let params = {
        CMD: "GetTaskProjects",
        TaskID: this.runningTask.TaskID,
        Range: range,
        Token: this.tokenStr
      };
      api.Task(params).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          this.runningTask.ProjectsList = res.Data;
        } else {
          this.$message({
            message: "获取任务项目文件列表失败,请检查后重试.",
            type: "warning"
          });
        }
      });
    },
    iniRunningTaskData() {
      this.runningTask.IsTaskRunning = false;
      this.runningTask.TaskID = 0;
      this.runningTask.TaskName = "";
      this.runningTask.TaskType = "";
      this.runningTask.Week = [];
      this.runningTask.Volume = 60;
      this.runningTask.Projects = 0;
      this.runningTask.GroupList = [];
      this.runningTask.StartTime = "00:00:00";
      this.runningTask.TimeSpan = "00:00:00";
      this.runningTask.TaskRemainingTime = "00:00:00";
      this.runningTask.Status = "Stop";
      this.runningTask.TrackName = "";

      this.runningTask.TrackTime = "00:00:00";
      this.runningTask.TrackPastTime = "00:00:00";
      this.runningTask.TrackRemainingTime = "00:00:00";
      this.runningTask.PlayPercent = 0;
      this.runningTask.ProjectsList = [];
    },
    runningTaskDataRef(data) {
      this.runningTask.TaskID = data.TaskID;
      this.runningTask.TaskName = data.TaskName;
      this.runningTask.TaskType = data.TaskType;
      this.runningTask.Week = data.Week;
      this.runningTask.Volume = data.Volume;
      this.runningTask.Projects = data.Projects;
      this.runningTask.GroupList = data.GroupList;
      this.runningTask.StartTime = data.StartTime;
      this.runningTask.TimeSpan = data.TimeSpan;
      this.runningTask.TaskRemainingTime = data.TaskRemainingTime;
      this.runningTask.Status = data.Status;

      if (this.runningTask.TrackName != data.TrackName) {
        
        if (this.isMobileDev) {
          this.notifyIns = undefined;
          this.notifyIns = this.$notify({
            title: "当前曲目",
            message: data.TrackName,
            offset: 100,
            duration: 3000
          });
        }
        this.runningTask.TrackName = data.TrackName;
        //console.log(this.notifyIns);
      }
      this.runningTask.TrackTime = data.TrackTime;
      this.runningTask.TrackPastTime = data.TrackPastTime;
      this.runningTask.TrackRemainingTime = data.TrackRemainingTime;
      this.runningTask.PlayPercent = this.getPlayPercent(
        data.TrackTime,
        data.TrackPastTime
      );
    },
    getPlayPercent(total, past) {
      var perc;
      let st = total.split(":");
      let pas = past.split(":");

      let totalS =
        parseInt(st[0]) * 3600 + parseInt(st[1]) * 60 + parseInt(st[2]);
      let pastS =
        parseInt(pas[0]) * 3600 + parseInt(pas[1]) * 60 + parseInt(pas[2]);

      perc = parseInt(pastS / totalS * 100);

      if (past === total) {
        perc = 100;
      }
      return perc;
    }
  },
  watch: {
    //立即刷新请求
    isTaskRefresh: function(val) {
      if (!val) {
        return;
      }
      //console.log("isTaskRefresh:" + val);
      setTimeout(() => {
        this.getRunningTask();
        this.SET_ISTASKREFRESH(!val);
      }, 400);
    }
  },
  created() {
    //设置定时刷新
    this.SET_TASKREFTIMEER(
      setInterval(() => {
        if (this.tokenStr != "") {
          this.getRunningTask();
        }
      }, 4000)
    );
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function";

.playbar {
  transition: all 0.7s ease-in; // display: flex;
  background: #353c46;
  position: absolute;
  width: 100%;
  height: 3.75em;
  bottom: 0em; // border-width: 1px;
  // border-style: solid;
  // border-color: #d3d3d3;
  .play-box {
    width: 11.25em;
    float: left;
    height: 100%;
    .pay-front {
      position: absolute;
      top: 18%;
      left: 0.7em;
    }
    .pay-play {
      position: absolute;
      top: 10%;
      left: 4em;
    }
    .pay-next {
      position: absolute;
      top: 18%;
      left: 8em;
    }
  }
  .progress-bar {
    margin-left: 11.25em;
    margin-right: 12em;
    height: 100%;
    span {
      color: #fff;
    }
    div {
      height: 1em;
    }
    .remainingTimeFlag {
      width: 4.375em;
      float: right;
    }
    .finishTimeFlag {
      width: 4.375em;
      float: left;
    }
    .musicnameFlag {
      margin-left: 4.375em;
      margin-right: 4.375em;
      text-align: center;
      margin-top: -0.2em;
    }
  }
  .payset-bar {
    float: right;
    width: 12em;
    height: 100%;
    .juzhongd {
      margin: 1.25em 0.5em 1.25em 1.5em;
    }
    .juzhongz {
      margin: 1.25em 0.5em 1.25em 0em;
    }
  }
}

.mobile {
  height: 2.75em;
  .play-box {
    width: 6.85em;
    height: 100%;
    .pay-front {
      position: absolute;
      top: 18%;
      left: 0.2em;
    }
    .pay-play {
      position: absolute;
      top: 5%;
      left: 2.2em;
    }
    .pay-next {
      position: absolute;
      top: 18%;
      left: 4.8em;
    }
  }
  .progress-bar {
    margin-left: 6.85em;
    margin-right: 5em;
    margin-top: -0.8em;
    .el-slider {
      margin: 2px 4px 5px 6px;
    }
  }
  .payset-bar {
    width: 5em;
    .juzhongd {
      margin: 0.65em 0.3em 0.65em 0.3em;
    }
    .juzhongz {
      margin: 0.65em 0.3em 0.65em 0em;
    }
  }
}
</style>