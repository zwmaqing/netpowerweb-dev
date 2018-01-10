<template>
  <div class="grig">
    <p class="titel">应急报警通知</p>
    <div class="row">
      <div class="column p20">基础通知</div>
      <div class="column p80">
        持续向全区域喇叭强插播 报警声和疏散语音
      </div>
    </div>
    <div class="row">
      <div class="column p30">通知接收手机</div>
      <div class="column p40">
        <el-input v-model="alarmPhone" placeholder="接收手机号码"></el-input>
      </div>
      <div class="column p30">
      </div>
    </div>
    <div class="row">
      <div class="column p20">通知内容</div>
      <div class="column p40">
        <el-input v-model="alarmText"  placeholder="自定义通知" :maxlength='50' :disabled="isDefaultAlarmText"></el-input>
      </div>
      <div class="column p40 center">
        <el-switch style="display: block" v-model="isDefaultAlarmText" active-color="#13ce66" inactive-color="#ff4949" active-text="预定"
          inactive-text="自定">
        </el-switch>
      </div>
    </div>
    <div class="row" style="justify-content:flex-end;">
      <div class="column p30 center">
        <el-tooltip class="item" effect="dark" content="保存报警通知配置到设备" placement="left">
          <el-button type="primary" icon="el-icon-success" @click="setAlarmMsmSettings">保存</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import api from "../../api/index";

export default {
  data() {
    return {
      alarmPhone: "18908235688",
      alarmText: "",
      isDefaultAlarmText: true
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr"
    })
  },
  methods: {
    getAlarmSet() {
      let data = {
        CMD: "GetDevSMSAlarm",
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        this.isDefaultAlarmText = res.Data.CustomSwitch;
        this.alarmPhone = res.Data.PhoneNum;
        this.alarmText = res.Data.PhoneContent;
      });
    },
    setAlarmMsmSettings(){
      let data = {
        CMD: "SetDevSMSAlarm",
        Switch: this.isDefaultAlarmText,
        Phone: this.alarmPhone,
        Content: this.alarmText,
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "应急报警联动发送短信通知配置更改成功。",
            type: "success"
          });
        } else {
          this.$message({
            message: "应急报警联动发送短信通知配置更改失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    }
  },
  watch: {},
  mounted: function() {
    this.getAlarmSet();
  }
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
