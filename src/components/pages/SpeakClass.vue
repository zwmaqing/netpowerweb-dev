<template>
  <div id="classSpaek" style="overflow-y:auto;height:100%;">
    <p class="el-icon-warning" v-show="classSpeaks.length<1">{{nullmsg}}</p>
    <el-collapse accordion>
      <el-collapse-item v-for="item in classSpeaks" :key="item.ClassID" :title="item.ClassName">
        <!-- <el-switch v-model="item.isDisable" active-text="启用播报" inactive-text="禁用播报">
        </el-switch>
        <span>. </span>-->
        <el-row class="row">
          <el-switch v-model="item.IsSpeakClass" active-text="播报班名" inactive-text="不报班名"></el-switch>
        </el-row>
        <div class="row">
          <span class="lab">语调:</span>
          <el-select v-model="item.Role" placeholder="请选择" size="small">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div class="row">
          <span class="lab">语速:</span>
          <el-slider v-model="item.Speed" :max="10"></el-slider>
        </div>
        <div class="row">
          <span class="lab">语调:</span>
          <el-slider v-model="item.Pitch" :max="10"></el-slider>
        </div>
        <div class="row">
          <span class="lab">音量:</span>
          <el-slider v-model="item.Volume" :max="10"></el-slider>
        </div>
        <div class="row" style="border-bottom:solid #969696; padding-bottom:5px;">
          <span class="lab" style="margin-right:46px;">喇叭/分组:</span>
          <el-select v-model="item.Channels" multiple placeholder="请选择" size="small">
            <el-option
              v-for="itemi in channals"
              :key="itemi.ChannelID"
              :label="itemi.ChannelName"
              :value="itemi.ChannelID"
            ></el-option>
          </el-select>
        </div>

        <el-row class="row">
          <span class="lab" style="margin-right:50px;">时段1: 是否播报</span>
          <el-switch v-model="item.Time1Switch" active-text="播报" inactive-text="不报"></el-switch>
        </el-row>
        <el-row class="row">
          <el-time-picker
            is-range
            arrow-control
            size="small"
            v-model="item.timePeriod1"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :disabled="!item.Time1Switch"
          ></el-time-picker>
        </el-row>
        <el-row class="row" style="border-bottom:solid #969696; padding-bottom:5px;">
          <el-col :span="12">
            <el-switch v-model="item.Time1StringSwitch" active-text="加问候" inactive-text="无问候"></el-switch>
          </el-col>
          <el-col :span="12">
            <el-input
              size="small"
              placeholder="输入问候语"
              v-model="item.Time1String"
              :disabled="!item.Time1StringSwitch"
            ></el-input>
          </el-col>
        </el-row>

        <el-row class="row">
          <span class="lab" style="margin-right:50px;">时段2: 是否播报</span>
          <el-switch v-model="item.Time2Switch" active-text="播报" inactive-text="不报"></el-switch>
        </el-row>
        <div class="row">
          <el-time-picker
            is-range
            arrow-control
            size="small"
            v-model="item.timePeriod2"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :disabled="!item.Time2Switch"
          ></el-time-picker>
        </div>
        <el-row class="row" style="border-bottom:solid #969696; padding-bottom:5px;">
          <el-col :span="12">
            <el-switch v-model="item.Time2StringSwitch" active-text="加问候" inactive-text="无问候"></el-switch>
          </el-col>
          <el-col :span="12">
            <el-input
              size="small"
              placeholder="输入问候语"
              v-model="item.Time2String"
              :disabled="!item.Time2StringSwitch"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <div class="flexRow">
            <el-button type="warning" size="small" icon="el-icon-delete" @click="delClass(item)">删除</el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-success"
              @click="saveClass(item)"
            >保存</el-button>
          </div>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import * as _ from "../../util/tools";
import api from "../../api/index";

export default {
  data() {
    return {
      classSpeaks: [],
      nullmsg: "",
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
      ]
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr",
      channals: "channals"
    })
  },
  methods: {
    ...mapActions(["getChannals"]),
    getSpeakClass(range) {
      let params = {
        CMD: "GetClassSpeak",
        IndexRange: range,
        Token: this.tokenStr
      };
      api.Class(params).then(res => {
        if (res.Status) {
          if (res.Data != null) {
            if (res.Data.length < 1) {
              this.nullmsg =
                " 该设备未配置有分班播报信息，请在相应的考勤/管理系统后台配置添加.";
            }
            for (var i = 0; i < res.Data.length; i++) {
              res.Data[i].timePeriod1 = [];
              res.Data[i].timePeriod2 = [];
              res.Data[i].timePeriod1[0] = new Date(
                "2017-01-01 " + res.Data[i].Time1Start
              );
              res.Data[i].timePeriod1[1] = new Date(
                "2017-01-01 " + res.Data[i].Time1End
              );

              res.Data[i].timePeriod2[0] = new Date(
                "2017-01-01 " + res.Data[i].Time2Start
              );
              res.Data[i].timePeriod2[1] = new Date(
                "2017-01-01 " + res.Data[i].Time2End
              );
              this.classSpeaks.push(res.Data[i]);
            }
            // this.classSpeaks = res.Data;
          }
        } else {
          this.$message({
            message: "获取分班播报配置失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    getAllClass() {
      this.classSpeaks = [];
      this.getSpeakClass("0-8");
      setTimeout(() => {
        this.getSpeakClass("9-16");
      }, 800);
    },
    delClass(classItem) {
      let params = {
        CMD: "DelClass",
        ClassID: classItem.ClassID,
        Token: this.tokenStr
      };
      api.Class(params).then(res => {
        this.$message({
          showClose: true,
          message:
            "该班级刷卡播报设置删除" +
            (res.Status ? "成功！" : "失败！检查后重试。"),
          type: res.Status ? "success" : "warning"
        });
        this.getAllClass();
      });
    },
    saveClass(classItem) {
      let params = {
        CMD: "SetClass",
        ClassID: classItem.ClassID,
        ClassName: classItem.ClassName,
        IsSpeakClass: classItem.IsSpeakClass,
        Role: classItem.Role,
        Speed: classItem.Speed,
        Pitch: classItem.Pitch,
        Volume: classItem.Volume,
        Time1Switch: classItem.Time1Switch,
        Time1Start: classItem.timePeriod1[0].format("hh:mm:ss"),
        Time1End: classItem.timePeriod1[1].format("hh:mm:ss"),
        Time1StringSwitch: classItem.Time1StringSwitch,
        Time1String: classItem.Time1String,
        Time2Switch: classItem.Time2Switch,
        Time2Start: classItem.timePeriod2[0].format("hh:mm:ss"),
        Time2End: classItem.timePeriod2[1].format("hh:mm:ss"),
        Time2StringSwitch: classItem.Time2StringSwitch,
        Time2String: classItem.Time2String,
        Channels: _.arrayToStrUnderInterval(classItem.Channels),
        Token: this.tokenStr
      };
      api.Class(params).then(res => {
        this.$message({
          showClose: true,
          message:
            "班级刷卡播报设置修改" +
            (res.Status ? "成功！" : "失败！检查后重试。"),
          type: res.Status ? "success" : "warning"
        });
      });
    }
  },
  watch: {},
  created() {
    //组件创建完后
    this.getChannals();
    this.getAllClass();
  }
};
</script>

<style lang="scss" scoped>
.row {
  max-width: 340px;
  margin-bottom: 6px;

  .lab {
    font-size: 14px;
    line-height: 36px;
  }
}

.lab + .el-slider {
  float: right;
  width: 70%;
  margin-right: 20px;
}

.flexRow {
  display: flex;
  max-width: 340px; //margin-bottom: 6px;
  justify-content: flex-end;
}
</style>
