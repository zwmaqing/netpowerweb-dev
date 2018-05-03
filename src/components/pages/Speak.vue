<template>
  <div class="Grid">
    <div id="left" class="Grid-cell" v-bind:class="{'u-1of2':isPcDev,'u-1of1':isMobileDev}">
      <div id="spaekIn">
        <el-form :model="speakData">
          <el-form-item label="播报内容:" label-width="75px">
            <el-input type="textarea" :rows="2" placeholder="在此输入播报内容" :maxlength="40" v-model="speakData.speakContent">
            </el-input>
          </el-form-item>
          <el-form-item label="播报设置:" label-width="75px">
            <div id="styleDefW1">
              <el-select v-model="speakData.role" placeholder="请选择">
                <el-option v-for="item in ttsSetting.roles" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
              <el-tooltip content="更多设置" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-setting" @click="ttsSetFormVisible=true"></el-button>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="收听分组:" label-width="75px">
            <div id="styleDefW">
              <el-select v-model="speakData.groupList" multiple placeholder="请选择分组">
                <el-option v-for="item in allChannalsGroups" :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="播报名称:" label-width="75px" v-show="fastButtonSet.IsEdit">
            <div id="styleDefW">
              <el-input v-model="fastButtonSet.AnotherName" :minlength=2 :maxlength=10  placeholder="快捷播报名称"></el-input>
            </div>
          </el-form-item>
          <div class="el-row--flex is-justify-end">
            <el-form-item>
              <el-button type="success" icon="el-icon-circle-check" size="medium" v-show="fastButtonSet.IsEdit" @click="saveFastSpaek">存储快捷播报</el-button>
              <el-button type="primary" class="icon16 icon-bullhorn" size="small" @click="speakInputTxt">. 播报</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-dialog title="播报参数设置" :visible.sync="ttsSetFormVisible">
          <el-form :model="ttsSetting">
            <el-form-item label="播报音量" :label-width="ttsSetLabelWidth">
              <el-slider v-model="ttsSetting.Volume" :max="10"></el-slider>
            </el-form-item>
            <el-form-item label="播报语速" :label-width="ttsSetLabelWidth">
              <el-slider v-model="ttsSetting.Speed" :max="10"></el-slider>
            </el-form-item>
            <el-form-item label="播报语调" :label-width="ttsSetLabelWidth">
              <el-slider v-model="ttsSetting.Pitch" :max="10"></el-slider>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ttsSetFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="fastSpaek">
        <el-button type="danger" icon="el-icon-info" @click="userFireAlarm">消防/应急报警(打开/关闭)</el-button>
        <el-button type="warning" icon="el-icon-time" @click="speakTime">全区域播报当前时间</el-button>
        <el-button-group v-for="item in fastbuttons" :key="item.Index">
          <el-button-group>
            <el-button type="primary" @click="fastSpaekButton(item)">{{item.AnotherName}}</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="editFastSpaekButton(item)"></el-button>
          </el-button-group>
        </el-button-group>
      </div>
    </div>
    <div id="right" class="Grid-cell u-1of2" v-show="isPcDev">
      <el-table :data="spaekHistory" style="width: 100%" border @row-click="rowClick">
        <el-table-column label="播报历史记录">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.Content}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="176">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-success" @click="speakHistoricalRecord(scope.row)">重播</el-button>
            <el-button size="small" icon="el-icon-edit" @click="speakHistoricalEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="speakHistoricalDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <slot name="append"></slot>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      ttsSetting: {
        roles: [
          {
            value: "women",
            label: "成年女声"
          },
          {
            value: "man",
            label: "成年男士"
          },
          {
            value: "girl",
            label: "童声女孩"
          }
        ],
        Volume: 8,
        Speed: 4,
        Pitch: 5
      },
      ttsSetFormVisible: false,
      ttsSetLabelWidth: "80px",
      speakData: {
        speakContent: "",
        role: "women",
        groupList: []
      },
      fastButtonSet: {
        IsEdit: false,
        FastButtonID: 0,
        AnotherName: ""
      },
      fastbuttons: [],
      spaekHistory: [],
      isUserFireAlarm: false
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
      groupsTotal: "groupsTotal",
      groups: "groups",
      channals: "channals"
    }),
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
  mounted() {},
  methods: {
    ...mapActions(["setPath", "getGroupsTotal", "getGroups", "getChannals"]),
    speakInputTxt() {
      if (this.speakData.speakContent.length < 1) {
        this.$message({
          message: "请输入播报的文字内容",
          type: "warning"
        });
        return;
      }
      if (this.speakData.groupList.length < 1) {
        this.$message({
          message: "请选择收听播报的喇叭或分区。",
          type: "warning"
        });
        return;
      }
      this.speakTxtTTS(this.speakData.speakContent);
      //检查缓存有没有，没有则添加到浏览器缓存，以用于历史记录
      this.saveSpeakToLocalStorage();
    },
    speakTxtTTS(content, groups) {
      let params = {
        CMD: "SpeakTTS",
        Content: content, //this.speakData.speakContent,
        Groups:
          groups == undefined
            ? _.arrayToStrUnderInterval(this.speakData.groupList)
            : groups,
        Volume: this.ttsSetting.Volume,
        Speed: this.ttsSetting.Speed,
        Role: this.speakData.role,
        Pitch: this.ttsSetting.Pitch,
        Token: this.tokenStr
      };
      api.Speak(params).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "播报请求已成功提交",
            type: "success"
          });
        } else {
          this.$message({
            message: "播报请求提交失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    userFireAlarm() {
      let params = {
        CMD: this.isUserFireAlarm ? "StopFireAlarm" : "FireAlarm",
        Groups: "100",
        Token: this.tokenStr
      };
      api.Speak(params).then(res => {
        if (res.Status) {
          if (params.CMD === "FireAlarm") {
            this.isUserFireAlarm = true;
          } else {
            this.isUserFireAlarm = false;
          }
          this.$message({
            showClose: true,
            message: "播报请求已成功提交",
            type: "success"
          });
        } else {
          this.$message({
            message: "播报请求提交失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    speakTime() {
      let time = new Date();
      let timeStr =
        "现在时间 " + time.getHours() + "点 " + time.getMinutes() + "分";
      this.speakTxtTTS(timeStr, "100");
    },
    fastSpaekButton(but) {
      let params = {
        CMD: "SpeakTTS",
        Content: but.Content,
        Groups: but.Groups.join("_"),
        Volume: but.Volume,
        Speed: but.Speed,
        Role: but.Role,
        Pitch: but.Pitch,
        Token: this.tokenStr
      };
      api.Speak(params).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "播报请求已成功提交",
            type: "success"
          });
        } else {
          this.$message({
            message: "播报请求提交失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    editFastSpaekButton(but) {
      this.$notify.info({
        title: "消息",
        message: "修改快捷播报配置后,请保存快捷播报."
      });
      this.fastButtonSet.IsEdit = true;
      this.fastButtonSet.FastButtonID = but.Index;
      this.fastButtonSet.AnotherName = but.AnotherName;
      this.speakData.speakContent = but.Content;
      this.speakData.role = but.Role;
      this.speakData.groupList = but.Groups;
      this.ttsSetting.Volume = but.Volume;
      this.ttsSetting.Speed = but.Speed;
      this.ttsSetting.Pitch = but.Pitch;
    },
    saveFastSpaek() {
      if (this.fastButtonSet.AnotherName == "") {
        this.$message({
          message: "请输入快捷播报名称!",
          type: "warning"
        });
        return;
      }
      if (this.speakData.groupList.length == 0) {
        this.$message({
          message: "请选择快捷播报 的收听分区分组!",
          type: "warning"
        });
        return;
      }
      //存储快捷播报
      this.fastButtonSet.IsEdit = false;
      //发出修改命令
      let params = {
        CMD: "SetShortCutKey",
        Index: this.fastButtonSet.FastButtonID,
        AnotherName: this.fastButtonSet.AnotherName,
        Content: this.speakData.speakContent,
        Groups: this.speakData.groupList.join("_"),
        Volume: this.ttsSetting.Volume,
        Speed: this.ttsSetting.Speed,
        Role: this.speakData.role,
        Pitch: this.ttsSetting.Pitch,
        Token: this.tokenStr
      };
      api.Speak(params).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "快捷播报修改请求，成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "快捷播报修改请求失败！请检查后重试。",
            type: "warning"
          });
        }
      });
      //恢复
      this.speakData.speakContent = "";
      this.speakData.groupList = [];
      //重载快捷播报数据
      this.getAllFastSpeak();
    },
    getAllFastSpeak() {
      let params = {
        CMD: "GetShortCutKey",
        Range: "1-10",
        Token: this.tokenStr
      };
      api.Speak(params).then(res => {
        if (res.Status) {
          this.fastbuttons = res.Data;
        } else {
          console.log("GetShortCutKey Ero");
        }
      });
    },
    rowClick(row, event, column) {},
    speakHistoricalRecord(row) {
      let groups = row.Groups.join("_");
      this.speakTxtTTS(row.Content, groups);
    },
    speakHistoricalEdit(row) {
      //载入到Input
      this.speakData.speakContent = row.Content;
      this.speakData.role = row.Role;
      this.speakData.groupList = row.Groups;
      this.ttsSetting.Volume = row.Volume;
      this.ttsSetting.Speed = row.Speed;
      this.ttsSetting.Pitch = row.Pitch;
    },
    speakHistoricalDel(row) {
      //删除
      var index = this.spaekHistory.indexOf(row);
      //console.log("Index:" + index);
      if (index > -1) {
        this.spaekHistory.splice(index, 1);
         var storage = window.localStorage;
        storage.setItem("spaekHistory", JSON.stringify(this.spaekHistory));
      }
    },
    saveSpeakToLocalStorage() {
      var storage = window.localStorage;
      var speakRecord = {
        Content: this.speakData.speakContent,
        Groups: this.speakData.groupList,
        Volume: this.ttsSetting.Volume,
        Speed: this.ttsSetting.Speed,
        Role: this.speakData.role,
        Pitch: this.ttsSetting.Pitch,
        Token: this.tokenStr
      };
      this.spaekHistory.push(speakRecord);
      storage.setItem("spaekHistory", JSON.stringify(this.spaekHistory));
      //
    },
    loadSpeakRecordLocalStorage() {
      var storage = window.localStorage;
      this.spaekHistory = JSON.parse(storage.getItem("spaekHistory"));
    },
    longTimeTest() {}
  },
  watch: {},
  created() {
    //组件创建完后
    //在此触发隐藏Playbar  显示Speak按钮
    this.setPath("speak");
    if (this.groupsTotal == 0) {
      this.getGroupsTotal();
      this.getGroups("0-15"); //需要完善分页请求
      this.getChannals();
    }
    this.getAllFastSpeak();
    this.loadSpeakRecordLocalStorage();
    //console.log("in to speak");
  }
};
</script>

<style lang="scss" scoped>
.Grid {
  display: -webkit-flex;
  display: flex;
  width: 100%;
  height: 100%;
  .Grid-cell.u-1of2 {
    display: flex;
    flex: 0 0 50%;
    flex-direction: column;
  }
  .Grid-cell.u-1of1 {
    display: flex;
    flex: 0 0 100%;
    flex-direction: column;
  }
}

#spaekIn {
  .el-form-item {
    margin-bottom: 12px;
  }
}

#fastSpaek {
  background-color: #f8f8ff;
  position: relative;
  flex: 1;
  overflow: auto;
}

#styleDefW .el-select {
  width: 100%;
}

#styleDefW1 .el-select {
  width: 70%;
}

#fastSpaek .el-button {
  margin: 4px 0px;
  padding: 10px 10px;
}

#fastSpaek .el-button-group {
  margin: 1px 2px;
  padding: 1px 2px;
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
</style>

