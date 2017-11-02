<template>
  <div class="Grid">
    <div id="left" v-bind:class="{'u-1of40':isPcDev,'u-1of1':isMobileDev}">
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
            <el-button size="small" icon="el-icon-edit" @click=" editTask(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
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
    <div id="right" class="u-1of60" v-show="isPcDev">
      <div id="taskInfo">
        <el-form :inline="true" inline :model="theTaskData" ref="theTaskData" label-width="100px" class="taskInfoInput">
          <el-row :gutter="3">
            <el-col :span="4">
              <div class="grid-content">
                <span>任务名称:</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item prop="TaskName">
                  <el-input type="TaskName" v-model="theTaskData.TaskName" placeholder="任务名称" :disabled="isEditDisabled"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item prop="TaskType">
                  <el-switch v-model="theTaskData.TaskType" active-value="Music" inactive-value="Spaek" active-text="定时音乐" inactive-text="定时播报" :disabled="isEditDisabled">
                  </el-switch>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="4">
              <div class="grid-content">
                <span>起止时间:</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item prop="TimeValue">
                  <!-- <el-time-picker is-range arrow-control v-model="theTaskData.TimeValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" >
                                                </el-time-picker> -->
                  <el-time-picker v-model="theTaskData.TimeValue[0]" placeholder="选择时间点" :disabled="isEditDisabled">
                  </el-time-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <span>结束时间:</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item prop="TimeValue">
                  <el-time-picker arrow-control v-model="theTaskData.TimeValue[1]" :picker-options="{ selectableRange: taskTimeRangeStr}" placeholder="选择时间点"
                    :disabled="isEditDisabled">
                  </el-time-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="4">
              <div class="grid-content">
                <span>起始音量:</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content form-item-full">
                <el-form-item prop="StartVolume">
                  <el-slider v-model="theTaskData.StartVolume" :disabled="isEditDisabled"></el-slider>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <span>结束音量:</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content form-item-full">
                <el-form-item prop="EndVolume">
                  <el-slider v-model="theTaskData.EndVolume" :disabled="isEditDisabled"></el-slider>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="4">
              <div class="grid-content">
                <span>收听分组:</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content form-item-full">
                <el-form-item prop="GroupList">
                  <div id="styleDefW">
                    <el-select v-model="theTaskData.GroupList" multiple placeholder="请选择分组" :disabled="isEditDisabled">
                      <el-option v-for="item in groupData" :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <span>播放模式:</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content form-item-full model-group">
                <el-form-item prop="PlayModel">
                  <el-radio-group v-model="theTaskData.PlayModel" size="small" :disabled="isEditDisabled">
                    <el-radio-button label="Order">顺序</el-radio-button>
                    <el-radio-button label="Random">随机</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="4">
              <div class="grid-content">
                <span>有效星期:</span>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content week-group">
                <el-form-item prop="Week">
                  <el-checkbox-group v-model="theTaskData.Week" size="medium" :disabled="isEditDisabled">
                    <el-checkbox-button v-for="week in weeks" :label="week.key" :key="week.key">{{week.label}}</el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="4">
              <div class="grid-content">
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content form-item-full">
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content form-item-full">
                <el-button size="medium" type="info" @click="taskInfoSave(false)" :disabled="isEditDisabled">取消</el-button>
                <el-button size="medium" type="primary" @click="taskInfoSave(true)" :disabled="isEditDisabled">保存</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div id="taskFiles">
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
  import {
    mapGetters
  } from 'vuex'
  import api from '../../api'
  import * as _ from '../../util/tools' //
  import Vue from 'vue'

  const weekOptions = [{
    label: '星期一',
    key: 1
  }, {
    label: '星期二',
    key: 2
  }, {
    label: '星期三',
    key: 3
  }, {
    label: '星期四',
    key: 4
  }, {
    label: '星期五',
    key: 5
  }, {
    label: '星期六',
    key: 6
  }, {
    label: '星期日',
    key: 0
  }];

  export default {
    components: {

    },
    data() {
      return {
        isTaskRuning: true,
        playing: false,
        playStatus: 'playing',
        isTaskLoading: false,
        dialogVisible: false,
        isEditDisabled: true,
        isAddNewTask: false, //可以考虑取消，通过theTask 的TaskID为0判断
        weeks: weekOptions,
        isProjectLoading: false,
        taskList: [{
            TaskID: 100,
            TaskName: "全部音乐",
            TaskType: "Music",
            StartTime: "",
            TimeSpan: "",
            Week: [],
            StartVolume: 60,
            EndVolume: 60,
            Projects: -1,
            PlayModel: 'Order',
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
            PlayModel: 'Order',
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
            PlayModel: 'Order',
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
            PlayModel: 'Order',
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
            PlayModel: 'Random',
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
          PlayModel: 'Order',
          GroupList: [],
          Status: "Stop",
          IsSystem: false
        },
        theTaskProjects: [{
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
          },
        ],
        groupData: [{
            GroupID: 100,
            GroupName: "全部喇叭",
            ChannelList: ["CH01", "CH02", "CH03", "CH04", "CH05", "CH06", "CH07", "CH08", "CH09", "CH10", "CH11",
              "CH12", "CH13", "CH14", "CH15", "CH16"
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
      }
    },
    computed: {
      ...mapGetters({
        screenWidth: 'screenWidth',
        screenHeight: 'screenHeight',
        isMobileDev: 'isMobileDev',
        isPcDev: 'isPcDev',
        isLogin: 'isLogin',
      }),
      taskListHeighX() {
        let height = this.screenHeight - 117;
        if (this.isMobileDev) {
          height += 20;
        }
        return height;
      },
      projectListHeight() {
        let height = this.screenHeight - 398;
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
          return sr.format('hh:mm:ss') + ' - 23:59:59';
        } else {
          return ''
        }
      },
      isPlayProjectDisabled() {
        return !(this.theTaskData.Status === 'Runing');
      }
    },
    mounted() {

    },
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
          return 'task-invalid';
        }
        if (row.Status == 'Runing') {
          return 'task-runing';
        }
      },
      starButtIcon(row) {

        if (row.Status == 'Runing') {
          return 'el-icon-loading';
        } else {
          return 'el-icon-caret-right'
        }
      },
      starButtType(row) {

        // if (row == undefined || row.Week == undefined) {
        //   return
        // }
        if (row.Status == 'Runing') {
          return 'primary';
        }
        var d = new Date();
        d.getDay();
        if (!row.Week.contains(d.getDay())) {
          return 'info';
        }
      },
      rowClick(row, event, column) {
        if (column.label == '定时播放任务') {
          this.getSelectTaskData(row);
          this.isEditDisabled = true;
          if (this.isMobileDev) {
            this.$message({
              showClose: true,
              message: '开始时间:' + row.StartTime + '  时长:' + row.TimeSpan,
              type: 'success'
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

        if (row.StartTime != '') {
          let st = row.StartTime.split(":");
          let edr = row.TimeSpan.split(":");

          let startT = new Date(2000, 0, 1, Number(st[0]), Number(st[1]), Number(st[2]));
          let endT = new Date(2000, 0, 1, Number(st[0]), Number(st[1]), Number(st[2]));

          endT.setHours(endT.getHours() + Number(edr[0]));
          endT.setMinutes(endT.getMinutes() + Number(edr[1]));
          endT.setSeconds(endT.getSeconds() + Number(edr[2]));
          // console.log('st:' + startT.format('hh:mm:ss'));
          this.theTaskData.TimeValue = [startT, endT]
        } else {
          this.theTaskData.TimeValue = [undefined, undefined]
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
          PlayModel: 'Order',
          GroupList: [],
          Status: "Stop",
          IsSystem: false
        }
      },
      addNewTask() {
        this.isAddNewTask = true;
        this.theTaskData = this.getNewTask();
        this.isEditDisabled = false;
      },
      startOrStopTask(row) {
        this.getSelectTaskData(row);
        switch (row.Status) {
          case 'Runing':
            {
              //实际停止操作
              row.Status = 'Stop';
              this.theTaskData.Status = 'Stop';
              break
            }
          case 'Stop':
            {
              var d = new Date();
              d.getDay();
              if (row.Week.indexOf(d.getDay()) == -1) {
                this.dialogVisible = true;
              } else {
                //实际启动操作
                row.Status = 'Runing';
                 this.theTaskData.Status = 'Runing';
              }
              break
            }
          default:
            {
              break
            }
        }
      },
      editTask(row) {
        this.getSelectTaskData(row);
        if (this.theTaskData.IsSystem) {
          this.$message({
            message: '系统默认任务不能编辑修改',
            type: 'warning'
          });
          return;
        } else {
          this.isEditDisabled = false;
        }
      },
      taskLoadMore(loction) {
        // 表格到底后执行  这里写你要做的事
        if (loction == 'Bottom') {
          this.isTaskLoading = true; //显示加载loading
          let self = this;
          if (self && !self._isDestroyed) {
            setTimeout(() => {
              if (self && !self._isDestroyed)
                self.isTaskLoading = false; //关闭加载loading
            }, 2000);
          }

        }
      },
      confirmClose(operatType) {
        if (operatType == 'startOrStopTask') {
          switch (this.theTaskData.Status) {
            case 'Runing':
              {
                //实际停止操作
                this.theTaskData.Status = 'Stop';
                this.$message({
                  showClose: true,
                  message: '任务：' + this.theTaskData.TaskName + '启动停止.',
                  type: 'success'
                });
                break
              }
            case 'Stop':
              {
                //实际启动操作
                this.theTaskData.Status = 'Runing';
                this.$message({
                  showClose: true,
                  message: '任务：' + this.theTaskData.TaskName + '启动成功.',
                  type: 'success'
                });
                break
              }
            default:
              {
                break
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
          message: '播放 ' + this.theTaskData.TaskName + ' 的 ' + row.FileName,
          type: 'success'
        });
      },
      delTheProject(row) {

        this.$message({
          showClose: true,
          message: '删除 ' + this.theTaskData.TaskName + ' 的 ' + row.FileName,
          type: 'success'
        });
      },
      addProjectToTask() {
        if (this.theTaskData.TaskID < 1) {
          console.log('The basic information of the new task must be stored first');
          return
        }
        this.$message({
          showClose: true,
          message: '添加项目到 ' + this.theTaskData.TaskName,
          type: 'success'
        });
      },
      projectLoadMore(loction) {
        // 表格到底后执行  这里写你要做的事
        if (loction == 'Bottom') {
          this.isProjectLoading = true; //显示加载loading
          let self = this;
          if (self && !self._isDestroyed) {
            setTimeout(() => {
              if (self && !self._isDestroyed)
                self.isProjectLoading = false; //关闭加载loading
            }, 2000);
          }
        }
      },
    },
    watch: {

    }
  }

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
    .el-button+.el-button {
      margin-left: 0px;
    }
    .el-button--small {
      padding: 10px 4px;
      font-size: 12px;
      border-radius: 3px;
    }
  }


  #taskInfo {
    height: 270px;
    border-bottom: 1px solid #999;
    padding: 5px;
    .taskInfoInput {
      // display: flex;
      // align-items:flex-start;
      width: 100%;
    }
  }


  .grid-content {
    border-radius: 4px;
    max-height: 36px;
    padding-left: 8px; //   display: flex;
    //   align-items: center;
    .el-form-item {
      width: 100%;
      .el-form-item__content {
        display: none;
      }
    }
  }

  .el-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }
  }

  #styleDefW .el-select {
    width: 100%;
  }

  #taskFiles {
    flex: 1;
    overflow: auto;
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
