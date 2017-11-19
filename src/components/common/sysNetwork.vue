<template>
  <div class="grig">
    <div class="row">
      <div class="column p60">自动获取IP地址</div>
      <div class="column p40 center">
        <el-switch style="display: block" v-model="isGetIPFromDHCP" active-color="#13ce66" inactive-color="#ff4949" active-text="ON"
          inactive-text="OFF">
        </el-switch>
      </div>
    </div>
    <div class="row">
      <div class="column p30">IP地址</div>
      <div class="column p70">
        <vue-ip-input :ip="devIP" :on-change="onIpChange" :on-blur="onIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">子网掩码</div>
      <div class="column p70">
        <vue-ip-input :ip="devSubnetMask" :on-change="onIpChange" :on-blur="onIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">网关地址</div>
      <div class="column p70">
        <vue-ip-input :ip="devGatewayIP" :on-change="onIpChange" :on-blur="onIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">DNS服务地址</div>
      <div class="column p50">
        <vue-ip-input :ip="dnsServerIP" :on-change="onIpChange" :on-blur="onIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
      <div class="column p20">
        <el-tooltip class="item" effect="dark" content="保存更改到设备" placement="left">
          <el-button size="small" type="primary" icon="el-icon-success" :disabled="isGetIPFromDHCP">保存</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueIpInput from "vue-ip-input";
import { mapGetters } from "vuex";
import api from "../../api/index";

export default {
  components: {
    "vue-ip-input": VueIpInput
  },
  data() {
    return {
      isGetIPFromDHCP: true,
      devIP: "127.0.0.1",
      devSubnetMask: "255.255.255.0",
      devGatewayIP: "127.0.0.1",
      dnsServerIP: "61.139.2.69"
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin"
    })
  },
  methods: {
    onIpChange(ip) {
      //console.log('ip input change:', ip);
    },
    onIpBlur(ip) {
      // console.log('ip input blur:', ip);
    }
  },
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
    .p60 {
      width: 60%;
    }
    .p70 {
      width: 70%;
    }
  }
}

.ip-disabled {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #b4bccc;
  cursor: not-allowed;
}
</style>



