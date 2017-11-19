<template>
  <div class="Grid">
    <div id="left" v-bind:class="{'u-1of40':isPcDev,'u-1of1':isMobileDev}" v-show="!isShowTaskEdit">
      <el-table :data="taskList" :row-class-name="taskStatueClass" :height="taskListHeighX" @row-click="rowClick" v-loading="isTaskLoading"
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
    <div id="right" v-bind:class="{'u-1of60':isPcDev,'u-1of1':isMobileDev}" v-show="isPcDev||isShowTaskEdit">
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
              <el-checkbox-button v-for="week in weeks" :label="week.key" :key="week.key">{{week.label}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div class="column p20">
            收听区域:
          </div>
          <div class="column p35">
            <el-badge :value="taskGroupCount" class="item">
            <el-button type="success" size="small" class="icon16 icon-bullhorn" :disabled="isEditDisabled"> 选择区域</el-button>
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
              <span style="margin-left: 0px">{{ scope.row.FileName}}</span>
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
    </div>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
import api from "../../api";
import * as _ from "../../util/tools"; //
import Vue from "vue";

const weekOptions = [
  {
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
    key: 0
  }
];

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
      weeks: weekOptions,
      isProjectLoading: false,
      isShowTaskEdit: false,
      taskList: [
        {
          TaskID: 100,
          TaskName: "全部音乐",
          TaskType: "Music",
          StartTime: "",
          TimeSpan: "",
          Week: [],
          StartVolume: 60,
          EndVolume: 60,
          Projects: -1,
          PlayModel: "Order",
          GroupList: [100],
          Status: "Stop",
          IsSystem: true
        },
        {
          TaskID: 101,
          TaskName: "早操音乐",
          TaskType: "Music",
          StartTime: "09:10:00",
          TimeSpan: "00:10:00",
          Week: [1, 2, 3, 4, 5],
          StartVolume: 75,
          EndVolume: 75,
          Projects: 3,
          PlayModel: "Order",
          GroupList: [101],
          Status: "Stop",
          IsSystem: false
        },
        {
          TaskID: 102,
          TaskName: "午餐音乐",
          TaskType: "Music",
          StartTime: "11:10:00",
          TimeSpan: "00:10:00",
          Week: [1, 2, 3, 4, 5],
          StartVolume: 60,
          EndVolume: 70,
          Projects: 3,
          PlayModel: "Order",
          GroupList: [102, 103, 104],
          Status: "Stop",
          IsSystem: false
        },
        {
          TaskID: 103,
          TaskName: "午睡音乐",
          TaskType: "Music",
          StartTime: "12:10:00",
          TimeSpan: "00:10:00",
          Week: [1, 2, 3, 4, 5],
          StartVolume: 70,
          EndVolume: 40,
          Projects: 3,
          PlayModel: "Order",
          GroupList: [102, 103, 104],
          Status: "Runing",
          IsSystem: false
        },
        {
          TaskID: 104,
          TaskName: "起床音乐",
          TaskType: "Music",
          StartTime: "14:10:00",
          TimeSpan: "00:10:00",
          Week: [1, 2, 3, 4, 5],
          StartVolume: 40,
          EndVolume: 70,
          Projects: 3,
          PlayModel: "Random",
          GroupList: [102, 103, 104],
          Status: "Stop",
          IsSystem: false
        }
      ],
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
      theTaskProjects: [
        {
          FileIndex: 1,
          FileName: "爸爸妈妈我爱你们1.mp3",
          TimeSpan: "00:03:12"
        },
        {
          FileIndex: 2,
          FileName: "爸爸妈妈我爱你们2.mp3",
          TimeSpan: "00:03:12"
        },
        {
          FileIndex: 3,
          FileName: "爸爸妈妈我爱你们3.mp3",
          TimeSpan: "00:03:12"
        }
      ],
      groupData: [
        {
          GroupID: 100,
          GroupName: "全部喇叭",
          ChannelList: [
            "CH01",
            "CH02",
            "CH03",
            "CH04",
            "CH05",
            "CH06",
            "CH07",
            "CH08",
            "CH09",
            "CH10",
            "CH11",
            "CH12",
            "CH13",
            "CH14",
            "CH15",
            "CH16"
          ],
          Status: false
        },
        {
          GroupID: 101,
          GroupName: "操场喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 102,
          GroupName: "大班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 103,
          GroupName: "中班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 104,
          GroupName: "小班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      isPcDev: "isPcDev",
      isLogin: "isLogin"
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
      return !(this.theTaskData.Status === "Runing");
    },
    taskGroupCount(){
      return this.theTaskData.GroupList.length
    }
  },
  mounted() {},
  methods: {
    taskStatueClass(ro, index) {
      let row = ro.row;
      var d = new Date();
      d.getDay();
      //console.log(row.row);
      // if (row == undefined||row.Week==undefined) {
      //   return
      // }
      if (!row.Week.contains(d.getDay())) {
        return "task-invalid";
      }
      if (row.Status == "Runing") {
        return "task-runing";
      }
    },
    starButtIcon(row) {
      if (row.Status == "Runing") {
        return "el-icon-loading";
      } else {
        return "el-icon-caret-right";
      }
    },
    starButtType(row) {
      // if (row == undefined || row.Week == undefined) {
      //   return
      // }
      if (row.Status == "Runing") {
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
        StartVolume: 60,
        EndVolume: 60,
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
      if (this.isMobileDev) {
        this.isShowTaskEdit = true;
      }
    },
    startOrStopTask(row) {
      this.getSelectTaskData(row);
      switch (row.Status) {
        case "Runing": {
          //实际停止操作
          row.Status = "Stop";
          this.theTaskData.Status = "Stop";
          break;
        }
        case "Stop": {
          var d = new Date();
          d.getDay();
          if (row.Week.indexOf(d.getDay()) == -1) {
            this.dialogVisible = true;
          } else {
            //实际启动操作
            row.Status = "Runing";
            this.theTaskData.Status = "Runing";
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
      if (this.theTaskData.IsSystem) {
        this.$message({
          message: "系统默认任务不能编辑修改",
          type: "warning"
        });
        return;
      } else {
        this.isEditDisabled = false;
        if (this.isMobileDev) {
          this.isShowTaskEdit = true;
        }
      }
    },
    delTask(row) {
      if (row.IsSystem) {
        this.$message({
          message: "系统默认任务不能编辑删除",
          type: "warning"
        });
        return;
      } else {
        this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            console.log("Del task:" + row.TaskName);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    returnTask() {
      if (this.isMobileDev) {
        this.isShowTaskEdit = false;
      }
    },
    taskLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.isTaskLoading = true; //显示加载loading
        let self = this;
        if (self && !self._isDestroyed) {
          setTimeout(() => {
            if (self && !self._isDestroyed) self.isTaskLoading = false; //关闭加载loading
          }, 2000);
        }
      }
    },
    confirmClose(operatType) {
      if (operatType == "startOrStopTask") {
        switch (this.theTaskData.Status) {
          case "Runing": {
            //实际停止操作
            this.theTaskData.Status = "Stop";
            this.$message({
              showClose: true,
              message: "任务：" + this.theTaskData.TaskName + "启动停止.",
              type: "success"
            });
            break;
          }
          case "Stop": {
            //实际启动操作
            this.theTaskData.Status = "Runing";
            this.$message({
              showClose: true,
              message: "任务：" + this.theTaskData.TaskName + "启动成功.",
              type: "success"
            });
            break;
          }
          default: {
            break;
          }
        }
      }
      this.dialogVisible = false;
    },
    taskInfoSave(state) {
      if (state) {
      } else {
      }
      this.isEditDisabled = true;
    },
    playTheProject(row) {
      this.$message({
        showClose: true,
        message: "播放 " + this.theTaskData.TaskName + " 的 " + row.FileName,
        type: "success"
      });
    },
    delTheProject(row) {
      this.$message({
        showClose: true,
        message: "删除 " + this.theTaskData.TaskName + " 的 " + row.FileName,
        type: "success"
      });
    },
    addProjectToTask() {
      if (this.theTaskData.TaskID < 1) {
        console.log(
          "The basic information of the new task must be stored first"
        );
        return;
      }
      this.$message({
        showClose: true,
        message: "添加项目到 " + this.theTaskData.TaskName,
        type: "success"
      });
    },
    projectLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.isProjectLoading = true; //显示加载loading
        let self = this;
        if (self && !self._isDestroyed) {
          setTimeout(() => {
            if (self && !self._isDestroyed) self.isProjectLoading = false; //关闭加载loading
          }, 2000);
        }
      }
    }
  },
  watch: {}
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

