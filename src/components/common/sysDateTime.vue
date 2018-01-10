<template>
  <div class="grig">
    <div class="row">
      <div class="column p60">自动同步网络时间</div>
      <div class="column p40">
        <el-switch style="display: block" v-model="isSyncNetDatetime" active-color="#13ce66" inactive-color="#ff4949" active-text="是"
          inactive-text="否" @change="syncTimeModeChange">
        </el-switch>
      </div>
    </div>
    <div class="row">
      <div class="column p30">日期</div>
      <div class="column p40">
        <el-date-picker v-model="devDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"
          :disabled="isSyncNetDatetime">
        </el-date-picker>
      </div>
      <div class="column p30">
        <el-tooltip class="item" effect="dark" content="获取客户端时间" placement="left">
          <el-button type="primary" icon="el-icon-refresh" :disabled="isSyncNetDatetime" @click="getClientTime">获取</el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="row">
      <div class="column p30">时间</div>
      <div class="column p40">
        <el-time-picker v-model="devTime" placeholder="选择时间" value-format='HH:mm:ss' :disabled="isSyncNetDatetime">
        </el-time-picker>
      </div>
      <div class="column p30">
        <el-tooltip class="item" effect="dark" content="保存时间到设备" placement="left">
          <el-button type="primary" icon="el-icon-success" :disabled="isSyncNetDatetime" @click="setDevTime">保存</el-button>
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
      isSyncNetDatetime: true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      devDate: "2017-11-09",
      devTime: "14:39:25"
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr"
    })
  },
  methods: {
    getDevTime() {
      let data = {
        CMD: "GetDevTime",
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        this.isSyncNetDatetime = res.Data.TimeNetSYNC;
        this.devDate = res.Data.DevDate;
        this.devTime = res.Data.DevTime;
      });
    },
    syncTimeModeChange() {
      //console.log("time sync mode changed.");
      if (this.isSyncNetDatetime) {
        getClientTime();
        this.setDevTime();
      }
    },
    getClientTime() {
      let current = new Date();
      this.devDate =
        current.getFullYear() +
        "-" +
        (current.getMonth() + 1) +
        "-" +
        current.getDate();
      this.devTime =
        current.getHours() +
        ":" +
        current.getMinutes() +
        ":" +
        current.getSeconds();
    },
    setDevTime() {
      let data = {
        CMD: "SetDevTime",
        Switch: this.isSyncNetDatetime,
        NewDate: this.devDate,
        NewTime: this.devTime,
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "更改设备日期时间成功。",
            type: "success"
          });
        } else {
          this.$message({
            message: "更改设备日期时间失败！",
            type: "warning"
          });
        }
      });
    }
  },
  watch: {},
  mounted: function() {
    this.getDevTime();
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
    .p30 {
      width: 30%;
    }
    .p40 {
      width: 40%;
    }
    .p60 {
      width: 60%;
    }
  }
}
</style>

