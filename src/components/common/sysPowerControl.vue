<template>
  <div class="grig">
    <p class="titel">设备手动开关机</p>
    <div class="row">
      <div class="column p30">操控设备开关</div>
      <div class="column p40 center">
        <el-tooltip class="item" effect="dark" content="开关设备" placement="top">
          <el-button type="danger" size="mini" icon="icon24 icon-power2"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="重启设备" placement="top">
          <el-button type="warning" size="mini" icon="icon24 icon-refresh"></el-button>
        </el-tooltip>
      </div>
      <div class="column p30 center">
        <el-tooltip class="item" effect="dark" content="开关播放器" placement="top">
          <el-switch style="display: block" v-model="isAudioPower" active-color="#13ce66" inactive-color="#ff4949" active-text="开"
            inactive-text="关">
          </el-switch>
        </el-tooltip>
      </div>
    </div>
    <p class="titel">设备自动开关机设置</p>
    <div class="row">
      <div class="column p30">开机时间</div>
      <div class="column p70">
        <el-time-picker v-model="onPowerTime" placeholder="选择时间" value-format='HH:mm:ss'>
        </el-time-picker>
      </div>
    </div>
    <div class="row">
      <div class="column p30">关机时间</div>
      <div class="column p70">
        <el-time-picker v-model="offPowerTime" placeholder="选择时间" value-format='HH:mm:ss'>
        </el-time-picker>
      </div>
    </div>
    <div class="row week-group" style="height:80px;">
      <div class="column p15"> 有效周日</div>
      <div class="column p85">
        <el-checkbox-group v-model="autoPowerWeek" size="medium">
          <el-checkbox-button v-for="week in weeks" :label="week.key" :key="week.key">{{week.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="row" style="justify-content:flex-end;">
      <div class="column p30 center">
        <el-tooltip class="item" effect="dark" content="保存自动开关机配置到设备" placement="left">
          <el-button type="primary" icon="el-icon-success" >保存</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import api from "../../api/index";

//移到到VUEX 公共常亮
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
  data() {
    return {
      isAudioPower: true,
      weeks: weekOptions,
      autoPowerWeek: [],
      onPowerTime: "07:00:00",
      offPowerTime: "19:00:00"
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin"
    })
  },
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function.scss";

.grig {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .row {
    height: 46px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid gainsboro;
    .column {
      display: flex;
      align-items: center;
      margin-left: 6px;
    }
    .center {
      justify-content: center;
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
    .p40 {
      width: 40%;
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
.titel {
  background-color: gainsboro;
  height: 36px;
  padding-top: 10px;
  margin-bottom: 8px;
}
</style>
