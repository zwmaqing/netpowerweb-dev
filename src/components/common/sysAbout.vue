<template>
  <div class="grig">
    <div class="row">
      <div class="column p15 center">
        <img class="user-logo" src="../../../static/img/zwSound-d.png">
      </div>
      <div class="column p70">
        网络智能播放服务器
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        设备型号
      </div>
      <div class="column p80">
        {{DevModel}}
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        序列号SN
      </div>
      <div class="column p80">
        {{DevSN}}
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        硬件版本
      </div>
      <div class="column p80">
        {{HardwareVersion}}
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        软件版本
      </div>
      <div class="column p80">
        {{SoftwareVersion}}
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        软件更新
      </div>
      <div class="column p50">
        {{NewSoftwareVersion}}
      </div>
      <div class="column p30">
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="update">{{updatedButton}}</el-button>
      </div>
    </div>
    <div class="blankLine"></div>
    <div style=" display: flex;justify-content: center;">
      <img class="Qr-code" src="../../../static/img/zwQr.jpg">
    </div>
    <div class="row-t">
      请关注公众号以获取使用协助和最新信息。
    </div>
    <div class="row-t">
      版权所有 2017 Zhiwei Tech Inc. 保留所有权利。
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import api from "../../api/index";

export default {
  data() {
    return {
      isAllowUpdate: false,
      DevModel: "",
      DevSN: "",
      HardwareVersion: "",
      SoftwareVersion: "",
      NewSoftwareVersion: ""
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr",
      TaskRefreshTimer: "TaskRefreshTimer"
    }),
    updatedButton() {
      return this.isAllowUpdate ? "更新软件" : "检查更新";
    }
  },
  methods: {
    ...mapActions(["isReloginToDev"]),
    getDevBasicInfo() {
      let data = {
        CMD: "GetDevInfo",
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        this.DevModel = res.Data.DevModel;
        this.DevSN = res.Data.DevSN;
        this.HardwareVersion = res.Data.HardwareVersion;
        this.SoftwareVersion = res.Data.SoftwareVersion;
      });
    },

    getNetFirmwareVersion() {
      //模拟数据
      api.GetUpgradeData({}).then(res => {
        // let data=JSON.parse(res);
        //let version = res.SoftwareVersion.split(".");
        this.NewSoftwareVersion = res.SoftwareVersion;
        if (this.SoftwareVersion !== res.SoftwareVersion) {
          //console.log(res.SoftwareVersion);
          this.isAllowUpdate = true;
        }
      });
    },
    update() {
      if (!this.isAllowUpdate) {
        this.getNetFirmwareVersion();
      } else {
        this.$confirm("此操作将更新设备软件并重启设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let data = {
            CMD: "SystemUp",
            Token: this.tokenStr
          };
          api.System(data).then(res => {
            if (res.Status) {
              this.$message({
                showClose: true,
                message: "启动系统更新成功！请记请等待系统更新并重启完成(大约1分钟)。",
                type: "success"
              });
              clearInterval(this.TaskRefreshTimer);
              let data = {
                CMD: "SignOut",
                Token: this.tokenStr
              };
              api.System(data).then(res => {
                this.$router.push("/login"); //进入登录页面
              });
            }
          });
        });
      }
    }
  },
  watch: {},
  mounted: function() {
    this.getDevBasicInfo();
  }
};
</script>

<style lang="scss" scoped>
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
  .row-t {
    height: 32px;
    display: flex;
    flex-direction: row;
  }
}

.blankLine {
  height: 6px;
}
.Qr-code {
  width: 120px;
  height: 120px;
}
.user-logo {
  width: 40px;
  height: 40px;
  // border-radius: 50%;
}
</style>

