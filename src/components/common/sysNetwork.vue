<template>
  <div class="grig">
    <div class="row">
      <div class="column p60">自动获取IP地址</div>
      <div class="column p40 center">
        <el-switch style="display: block" v-model="isGetIPFromDHCP" active-color="#13ce66" inactive-color="#ff4949" active-text="是"
          inactive-text="否">
        </el-switch>
      </div>
    </div>
    <div class="row">
      <div class="column p30">IP地址</div>
      <div class="column p70">
        <vue-ip-input :ip="devIP" :on-change="onIpChange" :on-blur="onDevIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">子网掩码</div>
      <div class="column p70">
        <vue-ip-input :ip="devSubnetMask" :on-change="onIpChange" :on-blur="onMaskIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">网关地址</div>
      <div class="column p70">
        <vue-ip-input :ip="devGatewayIP" :on-change="onIpChange" :on-blur="onGatewayIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
    </div>
    <div class="row">
      <div class="column p30">DNS服务地址</div>
      <div class="column p50">
        <vue-ip-input :ip="dnsServerIP" :on-change="onIpChange" :on-blur="onDNSIpBlur" :disabled="isGetIPFromDHCP"></vue-ip-input>
      </div>
      <div class="column p20">
        <el-tooltip class="item" effect="dark" content="保存更改到设备" placement="left">
          <el-button size="small" type="primary" icon="el-icon-success" :disabled="isGetIPFromDHCP" @click="setDevIP">保存</el-button>
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
      isLogin: "isLogin",
      tokenStr: "tokenStr"
    })
  },
  methods: {
    onIpChange(ip) {
      //console.log('ip input change:', ip);
    },
    onDNSIpBlur(ip) {
      //console.log('ip input blur:', ip);
      this.dnsServerIP = ip;
    },
    onGatewayIpBlur(ip) {
      this.devGatewayIP = ip;
    },
    onMaskIpBlur(ip) {
      this.devSubnetMask = ip;
    },
    onDevIpBlur(ip) {
      this.devIP = ip;
    },
    getDevIP() {
      let data = {
        CMD: "GetIP",
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        this.isGetIPFromDHCP = res.Data.DHCPStatus;
        this.devIP = res.Data.DevIPV4;
        this.devSubnetMask = res.Data.DevMask;
        this.devGatewayIP = res.Data.DevGateway;
        this.dnsServerIP = res.Data.DevDNS;
      });
    },
    setDevIP() {
      let data = {
        CMD: "ChangeIP",
        Switch: this.isGetIPFromDHCP,
        newIP: this.devIP,
        newmask: this.devSubnetMask,
        newgateway: this.devGatewayIP,
        newdnsweb: this.dnsServerIP,
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "设备IP地址配置更改成功！请记住新的IP配置。",
            type: "success"
          });
        } else {
          this.$message({
            message: "更改设备IP地址配置失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    }
  },
  watch: {},
  mounted: function() {
    this.getDevIP();
    
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



