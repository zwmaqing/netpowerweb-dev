<template>
  <div class="Grid">
    <div id="left" v-bind:class="{'u-1of40':isPcDev,'u-1of1':isMobileDev}" v-show="!isShowTaskEdit">
      <el-table :data="tasks" :row-class-name="taskStatueClass" :height="taskListHeighX" @row-click="rowClick" v-loading="isTaskLoading"
        v-vscrollbar="taskLoadMore">
        <el-table-column label="定时播放任务">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.TaskName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="176">
          <template slot-scope="scope">
            <el-button size="small" :type="starButtType(scope.row)" :icon="starButtIcon(scope.row)" @click="startOrStopTask(scope.row)">{{scope.row.Status=='Stop'?'启动':'停止'}}</el-button>
            <el-button size="small" icon="el-icon-edit" @click="editTask(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="delTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <slot name="append"></slot>
      </el-table>
      <div class="suspension-bar">
        <button class="button button-royal button-circle" @click="addNewTask">
          <el-tooltip class="item" effect="dark" content="点击添加任务" placement="top">
            <i class="icon24 icon-plus"></i>
          </el-tooltip>
        </button>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="280px">
        <span>此任务配置为今天不执行，你确认需要现在手动启动吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmClose('startOrStopTask')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="right" v-bind:class="{'u-1of60':isPcDev,'u-1of1':isMobileDev}" v-show="isPcDev||isShowTaskEdit" v-swiperight="swipRight">
      <div class="taskInfoInput">
        <div class="row">
          <div class="column p20">
            任务名称:
          </div>
          <div class="column p40">
            <el-input type="TaskName" size="small" v-model="theTaskData.TaskName" placeholder="任务名称" :disabled="isEditDisabled"></el-input>
          </div>
          <div class="column p40 center">
            <el-switch v-model="theTaskData.TaskType" active-value="Music" inactive-value="Spaek" active-text="音乐" inactive-text="播报"
              :disabled="isEditDisabled">
            </el-switch>
          </div>
        </div>
        <div class="row">
          <div class="column p20">
            起止时间:
          </div>
          <div class="column p40">
            <el-time-picker size="small" v-model="theTaskData.TimeValue[0]" placeholder="开始时间点" :disabled="isEditDisabled">
            </el-time-picker>
          </div>
          <div class="column p40">
            <el-time-picker arrow-control size="small" v-model="theTaskData.TimeValue[1]" :picker-options="{ selectableRange: taskTimeRangeStr}"
              placeholder="结束时间点" :disabled="isEditDisabled">
            </el-time-picker>
          </div>
        </div>
        <div class="row">
          <div class="column p20">
            起止音量:
          </div>
          <div class="p38">
            <el-slider size="small" v-model="theTaskData.StartVolume" :disabled="isEditDisabled"></el-slider>
          </div>
          <div class="p4">
          </div>
          <div class="p38">
            <el-slider size="small" v-model="theTaskData.EndVolume" :disabled="isEditDisabled"></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="column p20">
            有效周日:
          </div>
          <div class="p80" v-bind:class="{ 'miPadding': isMobileDev }">
            <el-checkbox-group v-model="theTaskData.Week" size="small" :disabled="isEditDisabled">
              <el-checkbox-button v-for="week in weekOptions" :label="week.key" :key="week.key">{{week.label}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div class="column p20">
            收听区域:
          </div>
          <div class="column p35">
            <el-badge :value="taskGroupCount" class="item">
              <el-button type="success" size="small" class="icon16 icon-bullhorn" @click="isShowSelectGroup=true" :disabled="isEditDisabled">
                选择区域</el-button>
            </el-badge>
          </div>
          <div class="column p45 center" style="font-size: 14px;">
            模式:
            <el-radio-group v-model="theTaskData.PlayModel" size="mini" :disabled="isEditDisabled">
              <el-radio-button label="Order">顺序</el-radio-button>
              <el-radio-button label="Random">随机</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="row">
          <div class="column p50">
            <button class="button button-primary button-circle button-small juzhongz" v-show="isMobileDev" @click="returnTask">
              <i class="icon16 icon-arrow-left"></i>
            </button>
          </div>
          <div class="column p30 f-end">
            <el-button type="info" size="small" @click="taskInfoSave(false)" :disabled="isEditDisabled">取消</el-button>
          </div>
          <div class="column p20 center">
            <el-button type="primary" size="small" @click="taskInfoSave(true)" :disabled="isEditDisabled">保存</el-button>
          </div>
        </div>
      </div>
      <div class="taskFiles">
        <el-table :data="theTaskProjects" :height="projectListHeight" v-loading="isProjectLoading" v-vscrollbar="projectLoadMore">
          <el-table-column label="项目音乐文件名">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.Name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-caret-right" @click="playTheProject(scope.row)" :disabled="isPlayProjectDisabled">播放</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="delTheProject(scope.row)" :disabled="isEditDisabled">删除</el-button>
            </template>
          </el-table-column>
          <slot name="append"></slot>
        </el-table>
        <div class="suspension-bar">
          <button class="button button-royal button-circle" @click="addProjectToTask">
            <el-tooltip class="item" effect="dark" content="点击添加项目" placement="top">
              <i class="icon24 icon-plus"></i>
            </el-tooltip>
          </button>
        </div>
      </div>
      <el-dialog title="选择收听区域" :visible.sync="isShowSelectGroup" width="80%">
        <el-checkbox-group v-model="theTaskData.GroupList">
          <el-checkbox v-for="item in allChannalsGroups" :key="item.GroupID" :label="item.GroupID">{{item.GroupName}}</el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import api from "../../api";
import * as _ from "../../util/tools"; //
import Vue from "vue";

export default {
  components: {},
  data() {
    return {
      isTaskRuning: true,
      playing: false,
      playStatus: "playing",
      isTaskLoading: false,
      dialogVisible: false,
      isEditDisabled: true,
      isAddNewTask: false, //可以考虑取消，通过theTask 的TaskID为0判断
      isProjectLoading: false,
      isShowTaskEdit: false,
      isShowSelectGroup: false,
      checkList: [],
      theTaskData: {
        TaskID: 0,
        TaskName: "",
        TaskType: "Music",
        StartTime: "",
        TimeSpan: "",
        TimeValue: [],
        Week: [],
        StartVolume: 60,
        EndVolume: 60,
        Projects: 0,
        PlayModel: "Order",
        GroupList: [],
        Status: "Stop",
        IsSystem: false
      },
      theTaskProjects: [],
      taskProPageIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      isPcDev: "isPcDev",
      isLogin: "isLogin",
      tokenStr: "tokenStr",
      weekOptions: "weekOptions",
      tasks: "tasks",
      taskTotal: "taskTotal",
      taskPageIndex: "taskPageIndex",
      isTaskRefresh: "isTaskRefresh",
      groups: "groups",
      channals: "channals"
    }),
    taskListHeighX() {
      let height = this.screenHeight - 117;
      if (this.isMobileDev) {
        height += 20;
      }
      return height;
    },
    projectListHeight() {
      let height = this.screenHeight - 338;
      if (this.isMobileDev) {
        height += 20;
      }
      return height;
    },
    taskTimeRangeStr() {
      let timeStr = this.theTaskData.TimeValue[0];
      // console.log(timeStr);
      if (timeStr != undefined && timeStr != null) {
        let sr = new Date(this.theTaskData.TimeValue[0]);
        return sr.format("hh:mm:ss") + " - 23:59:59";
      } else {
        return "";
      }
    },
    isPlayProjectDisabled() {
      return !(this.theTaskData.Status === "Running");
    },
    taskGroupCount() {
      return this.theTaskData.GroupList.length;
    },
    allChannalsGroups() {
      let allChannalsGroups = [];
      this.channals.forEach(function(value, index, array) {
        let one = {};
        one.GroupID = value.ChannelID;
        one.GroupName = value.ChannelName;
        allChannalsGroups.push(one);
      });
      this.groups.forEach(function(value, index, array) {
        let one = {};
        one.GroupID = value.GroupID;
        one.GroupName = value.GroupName;
        allChannalsGroups.push(one);
      });
      return allChannalsGroups;
    }
  },
  mounted() {
    this.SET_DEVCOMMBUSY(false);
  },
  methods: {
    ...mapActions([
      "setTaskList",
      "getTasks",
      "getTasksTotal",
      "getGroups",
      "getChannals",
      "strtTask",
      "endRuningTask",
      "delOneTaskForBuff",
      "isReloginToDev",
      "taskStateRefresh"
    ]),
    ...mapMutations([
      "SET_ISTASKREFRESH",
      "SET_TASKSPAGEINDEX",
      "SET_DEVCOMMBUSY"
    ]),
    taskStatueClass(ro, index) {
      let row = ro.row;
      var d = new Date();
      d.getDay();
      if (!row.Week.contains(d.getDay())) {
        return "task-invalid";
      }
      if (row.Status == "Running" || row.Status == "Pause") {
        return "task-runing";
      }
    },
    starButtIcon(row) {
      if (row.Status == "Running" || row.Status == "Pause") {
        return "el-icon-loading";
      } else {
        return "el-icon-caret-right";
      }
    },
    starButtType(row) {
      if (row.Status == "Running" || row.Status == "Pause") {
        return "primary";
      }
      var d = new Date();
      d.getDay();
      if (!row.Week.contains(d.getDay())) {
        return "info";
      }
    },
    rowClick(row, event, column) {
      if (column.label == "定时播放任务") {
        this.getSelectTaskData(row);
        this.isEditDisabled = true;
        if (this.isMobileDev) {
          this.$message({
            showClose: true,
            message: "开始时间:" + row.StartTime + "  时长:" + row.TimeSpan,
            type: "success"
          });
        }
        //PC load pro
        if (this.isPcDev) {
          this.loardTaskProject("1-16");
          if (
            this.getProListCapacity() > 16 &&
            this.theTaskData.Projects > 16
          ) {
            setTimeout(() => {
              this.loardTaskProject("17-32");
              //this.projectLoadMore("Bottom");
            }, 2500);
          }
        }
      }
    },
    getSelectTaskData(row) {
      this.theTaskData.TaskID = row.TaskID;
      this.theTaskData.TaskName = row.TaskName;
      this.theTaskData.TaskType = row.TaskType;
      this.theTaskData.StartTime = row.StartTime;
      this.theTaskData.TimeSpan = row.TimeSpan;
      this.theTaskData.Week = row.Week;
      this.theTaskData.StartVolume = row.StartVolume;
      this.theTaskData.EndVolume = row.EndVolume;
      this.theTaskData.Projects = row.Projects;
      this.theTaskData.PlayModel = row.PlayModel;
      this.theTaskData.GroupList = row.GroupList;
      this.theTaskData.Status = row.Status;
      this.theTaskData.IsSystem = row.IsSystem;

      if (row.StartTime != "") {
        let st = row.StartTime.split(":");
        let edr = row.TimeSpan.split(":");

        let startT = new Date(
          2000,
          0,
          1,
          Number(st[0]),
          Number(st[1]),
          Number(st[2])
        );
        let endT = new Date(
          2000,
          0,
          1,
          Number(st[0]),
          Number(st[1]),
          Number(st[2])
        );

        endT.setHours(endT.getHours() + Number(edr[0]));
        endT.setMinutes(endT.getMinutes() + Number(edr[1]));
        endT.setSeconds(endT.getSeconds() + Number(edr[2]));
        // console.log('st:' + startT.format('hh:mm:ss'));
        this.theTaskData.TimeValue = [startT, endT];
      } else {
        this.theTaskData.TimeValue = [undefined, undefined];
      }
    },
    getNewTask() {
      return {
        TaskID: 0,
        TaskName: "",
        TaskType: "Music",
        StartTime: "",
        TimeSpan: "00:10:00",
        TimeValue: [new Date(2000, 0, 1, 8, 30), new Date(2000, 0, 1, 8, 40)],
        Week: [1, 2, 3, 4, 5],
        StartVolume: 80,
        EndVolume: 80,
        Projects: 0,
        PlayModel: "Order",
        GroupList: [],
        Status: "Stop",
        IsSystem: false
      };
    },
    addNewTask() {
      this.isAddNewTask = true;
      this.theTaskData = this.getNewTask();
      this.isEditDisabled = false;
      this.theTaskProjects = [];
      if (this.isMobileDev) {
        this.isShowTaskEdit = true;
      }
    },
    startOrStopTask(row) {
      this.getSelectTaskData(row);
      if (this.isPcDev) {
        this.loardTaskProject("1-16");
        if (this.getProListCapacity() > 16 && this.theTaskData.Projects > 16) {
          setTimeout(() => {
            this.loardTaskProject("17-32");
          }, 2500);
        }
      }
      switch (row.Status) {
        case "Running": {
          //实际停止操作
          this.endRuningTask();
          this.theTaskData.Status = "Stop";
          this.SET_ISTASKREFRESH(true);
          break;
        }
        case "Stop": {
          var d = new Date();
          d.getDay();
          if (row.Week.indexOf(d.getDay()) == -1) {
            this.dialogVisible = true;
          } else {
            //实际启动操作
            this.strtTask(this.theTaskData.TaskID);
            this.theTaskData.Status = "Running";
            this.SET_ISTASKREFRESH(true);
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    editTask(row) {
      this.getSelectTaskData(row);
      let message = this.theTaskData.IsSystem
        ? "系统默认任务不能编辑修改."
        : "";
      message =
        this.theTaskData.Status == "Running"
          ? "任务正在执行,不能编辑修改,请停止后更改."
          : message;
      if (this.theTaskData.IsSystem || this.theTaskData.Status == "Running") {
        this.$message({
          message: message,
          type: "warning"
        });
        return;
      }
      //小屏浏览，进入编辑页面时，获取任务项目列表
      if (this.isMobileDev) {
        this.loardTaskProject("1-16");
        if (this.getProListCapacity() > 16 && this.theTaskData.Projects > 16) {
          setTimeout(() => {
            this.loardTaskProject("17-32");
          }, 2500);
        }
      }
      this.isEditDisabled = false;
      if (this.isMobileDev) {
        this.isShowTaskEdit = true;
      }
    },
    swipRight: function(s) {
      this.returnTask();
    },
    delTask(row) {
      this.getSelectTaskData(row);
      let message = this.theTaskData.IsSystem ? "系统默认任务不能删除." : "";
      message =
        this.theTaskData.Status == "Running"
          ? "任务正在执行,不能删除,请停止后删除."
          : message;

      if (this.theTaskData.IsSystem || this.theTaskData.Status == "Running") {
        this.$message({
          message: message,
          type: "warning"
        });
        return;
      }

      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            CMD: "DelTask",
            TaskID: row.TaskID,
            Token: this.tokenStr
          };
          api.Task(params).then(res => {
            res.$router = this.$router; //是否需要重新登录检查
            this.isReloginToDev(res);
            if (res.Status) {
              //移除此任务
              this.delOneTaskForBuff(row.TaskID);
              this.theTaskData = this.getNewTask();
              this.theTaskProjects = [];
            } else {
              this.$message({
                message: "删除该任务失败！请检查后重试。",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    returnTask() {
      if (this.isMobileDev) {
        this.isShowTaskEdit = false;
      }
    },
    getTaskListCapacity() {
      return parseInt((this.taskListHeighX - 28) / 39);
    },
    taskLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.SET_TASKSPAGEINDEX(this.taskPageIndex + 1);
        //this.isTaskLoading = true; //显示加载loading
        if (this.taskTotal < this.taskPageIndex * 16 + 1) {
          return;
        }
        let range =
          (this.taskPageIndex * 16).toString() +
          "-" +
          ((this.taskPageIndex + 1) * 16 - 1).toString();
        let self = this;
        if (self && !self._isDestroyed) {
          this.getTasks({ range: range, isAdd: true });
        }
      }
    },
    confirmClose(operatType) {
      if (operatType == "startOrStopTask") {
        switch (this.theTaskData.Status) {
          case "Running": {
            //实际停止操作
            this.theTaskData.Status = "Stop";
            this.$message({
              showClose: true,
              message: "任务：" + this.theTaskData.TaskName + "停止.",
              type: "success"
            });
            break;
          }
          case "Stop": {
            //实际启动操作
            this.strtTask(this.theTaskData.TaskID);
            this.theTaskData.Status = "Running";
            break;
          }
          default: {
            break;
          }
        }
        this.SET_ISTASKREFRESH(true);
      }
      this.dialogVisible = false;
    },
    setTaskState(state) {},
    taskInfoSave(state) {
      if (state) {
        if (this.theTaskData.TaskName == "") {
          this.$message({
            message: "警告哦，必须输入任务名称!",
            type: "warning"
          });
          return;
        }
        if (this.theTaskData.Week.length < 1) {
          this.$message({
            message: "警告哦，至少需要现在一个有效的周日!",
            type: "warning"
          });
          return;
        }
        if (this.theTaskData.GroupList.length < 1) {
          this.$message({
            message: "警告哦，至少需要现在一个输出分区或分组!",
            type: "warning"
          });
          return;
        }

        let timeSpanMS =
          this.theTaskData.TimeValue[1].getTime() -
          this.theTaskData.TimeValue[0].getTime();
        //计算出相差天数
        let days = Math.floor(timeSpanMS / (24 * 3600 * 1000));

        //计算出小时数
        let leave1 = timeSpanMS % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);

        let params = {
          CMD: this.isAddNewTask ? "AddTask" : "EditTask",
          TaskID: this.isAddNewTask ? 0 : this.theTaskData.TaskID,
          TaskName: this.theTaskData.TaskName,
          TaskType: this.theTaskData.TaskType,
          IsSystem: false,
          PlayModel: this.theTaskData.PlayModel,
          StartTime: this.theTaskData.TimeValue[0].format("hh:mm:ss"),
          TimeSpan: hours + ":" + minutes + ":" + seconds,
          Week: _.arrayToStrUnderInterval(this.theTaskData.Week),
          Volume:
            this.theTaskData.StartVolume + "-" + this.theTaskData.EndVolume,
          Groups: _.arrayToStrUnderInterval(this.theTaskData.GroupList),
          Token: this.tokenStr
        };

        api.Task(params).then(res => {
          res.$router = this.$router;
          this.isReloginToDev(res);
          let message = "保存定时任务" + (res.Status ? "成功." : "失败!");

          if (!res.Status) {
            if (res.StatusMessage.indexOf("TaskNameOver") > 0) {
              message += "任务名称与既有任务名重叠!";
            }

            if (res.StatusMessage.indexOf("TaskTimeOver") > 0) {
              message += "任务时间范围与既有任务时段重叠!";
            }
          }
          this.$message({
            showClose: true,

            message: message,

            type: res.Status ? "success" : "warning"
          });

          //成功状态
          if (res.Status) {
            this.isEditDisabled = true;
            this.isAddNewTask = false;
            this.returnTask(); //如果小屏，返回任务列表界面再刷新
            this.getTasksTotal();
            this.getTasks({ range: "1-12" });
            if (this.getTaskListCapacity() > 12 && this.taskTotal > 12) {
              setTimeout(() => {
                this.getTasks({ range: "13-24", isAdd: true });
              }, 2500);
            }

            // this.theTaskData = this.getNewTask();
          }
        });
      } else {
        this.isEditDisabled = true;
        this.isAddNewTask = false;
      }
    },
    getProListCapacity() {
      return parseInt((this.projectListHeight - 28) / 39);
    },
    playTheProject(row) {
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
    delTheProject(row) {
      let params = {
        CMD: "DelTaskProject",
        TaskID: this.theTaskData.TaskID,
        ProIndex: row.Index,
        Token: this.tokenStr
      };
      this.isProjectLoading = true; //显示loading

      setTimeout(() => {
        this.isProjectLoading = false;
      }, 800);

      api.Task(params).then(res => {
        res.$router = this.$router;
        this.isReloginToDev(res);

        if (res.Status) {
          this.theTaskProjects.splice(row.Index - 1, 1);
          console.log(row.Index);
        }
        this.$message({
          showClose: true,
          message:
            "删除任务项目" +
            (res.Status ? "成功." : "失败!请检查后重试." + row.Index),
          type: res.Status ? "success" : "warning"
        });
      });
    },
    addProjectToTask() {
      if (this.theTaskData.TaskID < 1) {
        this.$message({
          message: "警告哦，添加项目前需要保存新建任务配置",
          type: "warning"
        });
        return;
      }
      //配置参数
      this.$router.push({
        path: "/files",
        query: {
          taskID: this.theTaskData.TaskID,
          taskName: this.theTaskData.TaskName
        }
      });
    },
    loardTaskProject(range, isAdd) {
      let params = {
        CMD: "GetTaskProjects",
        TaskID: this.theTaskData.TaskID,
        Range: range,
        Token: this.tokenStr
      };
      api.Task(params).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          for (let index = 0; index < res.Data.length; index++) {
            if (isAdd) {
              this.theTaskProjects.push(res.Data[index]);
            }
          }
          if (!isAdd) {
            this.theTaskProjects = res.Data;
          }
        } else {
          if (!isAdd) {
            this.theTaskProjects = [];
          }
          this.$message({
            message: "获取任务项目文件列表失败,请检查后重试.",
            type: "warning"
          });
        }
      });
    },
    projectLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.taskProPageIndex++;
        if (this.theTaskData.Projects < this.taskProPageIndex * 16 + 1) {
          return;
        }
        let range =
          (this.taskProPageIndex * 16 + 1).toString() +
          "-" +
          ((this.taskProPageIndex + 1) * 16).toString();

        //this.isProjectLoading = true; //显示加载loading
        let self = this;
        if (self && !self._isDestroyed) {
          this.loardTaskProject(range, true);
          // setTimeout(() => {
          //   if (self && !self._isDestroyed) self.isProjectLoading = false; //关闭加载loading
          // }, 1500);
        }
      }
    }
  },
  watch: {},
  created() {
    this.SET_DEVCOMMBUSY(true);
    //this.getGroupsTotal();
    this.getTasksTotal();
    this.getTasks({ range: "1-12" });
    if (this.getTaskListCapacity() > 12 && this.taskTotal > 12) {
      setTimeout(() => {
        this.getTasks({ range: "13-24", isAdd: true });
      }, 2500);
    }
    this.getGroups("1-16"); //需要完善分页请求
    this.getChannals();
  }
}; 
</script>

<style lang="scss" scoped>
.Grid {
  display: -webkit-flex;
  display: flex;
  width: 100%;
  height: 100%;
  .u-1of40 {
    flex: 4 4 40%;
    border: 1px solid;
    border-color: gainsboro;
    position: relative;
  }
  .u-1of60 {
    display: flex;
    flex: 6 6 60%;
    flex-direction: column;
    border: 1px solid;
    border-color: gainsboro;
  }
  .u-1of1 {
    flex: 1 1 100%;
    border: 1px solid;
    border-color: gainsboro;
  }
}

.cell {
  .el-button + .el-button {
    margin-left: 0px;
  }
  .el-button--small {
    padding: 10px 4px;
    font-size: 12px;
    border-radius: 3px;
  }
}

#right {
  flex-flow: column;
  //flex-direction: row-reverse;
  display: flex;

  .taskInfoInput {
    display: flex;
    width: 100%;
    height: 220px;
    flex-flow: column;
    border: 1px solid gainsboro;
    .row {
      display: flex;
      width: 100%;
      height: 32px;
      margin: 2px 0;
      flex-wrap: wrap;
      align-self: flex-start;
      .column {
        display: flex;
        align-items: center;
      }
      .center {
        justify-content: center;
      }
      .f-end {
        justify-content: flex-end;
      }
      .p4 {
        width: 4%;
      }
      .p15 {
        width: 15%;
      }
      .p20 {
        width: 20%;
      }
      .p30 {
        width: 30%;
      }
      .p35 {
        width: 35%;
      }
      .p38 {
        width: 38%;
      }
      .p40 {
        width: 40%;
      }
      .p45 {
        width: 45%;
      }
      .p50 {
        width: 50%;
      }
      .p70 {
        width: 70%;
      }
      .p80 {
        width: 80%;
      }
      .p85 {
        width: 85%;
      }
    }
  }
  .taskFiles {
    flex: 1;
    overflow: auto; // overflow-y: scroll;
    border: 1px solid gainsboro;
  }
}

.suspension-bar {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 100;
  font-size: 0;
}
</style>

