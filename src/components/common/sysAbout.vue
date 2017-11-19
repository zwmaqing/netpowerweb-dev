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
        ZWNB_U2A4CH16C35_350
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        序列号SN
      </div>
      <div class="column p80">
        HR935F.6FDB33.4F5RVE
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        硬件版本
      </div>
      <div class="column p80">
        A4.Vs3.DC35.Re16.PD350.Y102.B1
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        软件版本
      </div>
      <div class="column p80">
        A4.2.1.0.1B
      </div>
    </div>
    <div class="row">
      <div class="column p20">
        软件更新
      </div>
      <div class="column p50">
        {{netFirmwareVersion}}
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
import { mapGetters } from "vuex";
import api from "../../api/index";

export default {
  data() {
    return {
      isAllowUpdate: false,
      netFirmwareVersion: ""
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin"
    }),
    updatedButton() {
      return this.isAllowUpdate ? "更新软件" : "检查更新";
    }
  },
  methods: {
    getNetFirmwareVersion() {
      //模拟数据
      this.netFirmwareVersion = "A4.2.1.0.2B";
      this.isAllowUpdate = true;
    },
    update() {
      if (!this.isAllowUpdate) {
        this.getNetFirmwareVersion();
      } else {
        //update function
        this.$confirm("此操作将更新设备软件并重启设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "更新成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消更新"
            });
          });
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>

.grig {
  width: 100%;
  height: 100%;
  overflow-y:auto;
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

