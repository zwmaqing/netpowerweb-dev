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
          <div class="el-row--flex is-justify-end">
            <el-form-item>
              <el-tooltip content="收藏为快捷播报" placement="left" effect="light">
                <el-button type="success" icon="el-icon-star-on" size="medium" @click="collectQuickSpeak">收藏</el-button>
              </el-tooltip>
              <el-button type="primary" class="icon16 icon-bullhorn" size="small" @click="speakInputTxt">. 播报</el-button>
              <!-- <el-button type="primary" size="small" @click="longTimeTest">长链请求</el-button> -->
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
        <el-button type="danger" @click="userFireAlarm">消防报警</el-button>
        <el-button type="warning" @click="closeDoor">即将关门</el-button>
        <el-button type="primary" @click="speakTime">播报时间</el-button>
        <el-button type="success" @click="playground">操场集合</el-button>
        <el-button type="info" @click="repareMeal">用餐准备</el-button>
        <el-button type="info" @click="readyLeave">放学准备</el-button>
        <el-button  @click="lineUpToRemind">家长请排队</el-button>
        <el-button @click="classSpeakDemo">刷卡播报Demo</el-button>
        <el-button type="primary" v-for="item in fastbuttons" :key="item.butID" @click="fastSpaekButton(item)">{{item.label}}</el-button>
      </div>
    </div>
    <div id="right" class="Grid-cell u-1of2" v-show="isPcDev">
      <el-table :data="spaekHistory" style="width: 100%" border @row-click="rowClick">
        <el-table-column label="播报历史记录">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.txt}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="176">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-success" @click="speakHistoricalRecord(scope.row)">重播</el-button>
            <el-button size="small" icon="el-icon-edit" @click="speakHistoricalEdit">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="speakHistoricalDel">删除</el-button>
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
      fastbuttons: [
        {
          label: "快捷按键1",
          butID: "102",
          groupList: [102, 103],
          txt: "播报内容尚未配置"
        },
        {
          label: "快捷按键2",
          butID: "103",
          groupList: [102, 103],
          txt: "播报内容尚未配置"
        },
        {
          label: "快捷按键3",
          butID: "104",
          groupList: [102, 103],
          txt: "播报内容尚未配置"
        },
        {
          label: "快捷按键4",
          butID: "105",
          groupList: [102, 103],
          txt: "播报内容尚未配置"
        },
        {
          label: "快捷按键1",
          butID: "102",
          groupList: [102, 103],
          txt: "播报内容尚未配置"
        }
      ],
      spaekHistory: [
        {
          logID: 1,
          groupList: [1, 2],
          txt: "各班老师，请于下午2点到会议室开会"
        },
        {
          logID: 2,
          groupList: [1, 2],
          txt: "大一班老师，请现在到操场准备布置活动现场"
        }
      ],
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
    collectQuickSpeak() {
      this.$message({
        showClose: true,
        message: "收藏到快捷播报成功.",
        type: "success"
      });
    },
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
    closeDoor() {
      this.speakTxtTTS("即将关闭大门,听到广播后请尽快离开", "100");
    },
    speakTime() {
      let time = new Date();
      let timeStr = "现在时间 " + time.getHours() + "点 " + time.getMinutes() + "分";
      this.speakTxtTTS(timeStr, "100");
    },
    playground() {
      this.speakTxtTTS("请注意 听到广播后立即到操场集合", "100");
    },
    repareMeal() {
      this.speakTxtTTS("即将到用餐时间,请尽快做好用餐准备", "100");
    },
    readyLeave() {
      this.speakTxtTTS("即将放学,听到广播后请尽快做好放学准备", "100");
    },
    lineUpToRemind() {
      if (this.speakData.groupList.length < 1) {
        this.$message({
          message: "请选择收听播报的喇叭或分区。",
          type: "warning"
        });
        return;
      }
      let group = _.arrayToStrUnderInterval(this.speakData.groupList);

      this.speakTxtTTS("欢迎各位家长，请自觉排队不要拥挤,谢谢大家", group);
    },
    classSpeakDemo() {
      let params = {
        CMD: "SpeakStudent",
        ClassID: 11449,
        Content: "王丽丽再见",
        Token: this.tokenStr
      };
      api.Class(params).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "播报请求已成功提交",
            type: "success"
          });
        }
      });
    },
    fastSpaekButton(but) {
      this.$message({
        showClose: true,
        message: "播报请求: " + but.txt,
        type: "success"
      });
    },
    rowClick(row, event, column) {},
    speakHistoricalRecord(row) {
      let groups = _.arrayToStrUnderInterval(row.groupList);
      this.speakTxtTTS(row.txt, groups);
    },
    speakHistoricalEdit() {
      this.$message({
        showClose: true,
        message: "此播报的功能数据接口已禁用.",
        type: "warning"
      });
    },
    speakHistoricalDel() {
      this.$message({
        showClose: true,
        message: "此播报的功能数据接口已禁用.",
        type: "warning"
      });
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
  margin: 4px 1px;
  padding: 8px 10px;
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