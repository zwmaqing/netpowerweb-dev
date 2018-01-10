<template>
  <div style="padding:0px 4px; overflow-y:auto;" class="full">
    <div class="set-item">
      <p class="titel">
        <i class="icon16 icon-floppy-o"></i> 内部存储器</p>
      <p class="txt-info">总共：{{sdSize}}，剩余：{{sdFreeSize}}</p>
      <!-- 映射存储器数据 -->
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="sdUsedAbsolutely"></el-progress>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="set-item">
      <p class="titel">
        <i class="icon16 icon-usb"></i> 外部存储器</p>
      <p class="txt-info">总共：{{usbSize}}，剩余：{{usbFreeSize}}</p>
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="usbUsedAbsolutely"></el-progress>
          </div>
        </el-col>
      </el-row>
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
      sdSize: "0 MB",
      sdFreeSize: "0 MB",
      sdUsedAbsolutely: 0,
      usbSize: "0 MB",
      usbFreeSize: "0 MB",
      usbUsedAbsolutely: 0
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr"
    })
  },
  methods: {
    getUsedPercent(total, free) {
      let totalSize = parseInt(total);
      let freeSize = parseInt(free);
      let usedPercent;
      if (totalSize == 0) {
        usedPercent = 0;
      } else {
        usedPercent = parseInt((1 - freeSize / totalSize) * 100);
      }
      return usedPercent;
    }
  },
  watch: {},
  mounted: function() {
    let data = {
      CMD: "GetDevMem",
      Token: this.tokenStr
    };
    api.System(data).then(res => {
      this.sdSize = res.Data[0].StorageSize;
      this.sdFreeSize = res.Data[0].StorageFreeSize;
      this.usbSize = res.Data[1].StorageSize;
      this.usbFreeSize = res.Data[1].StorageFreeSize;

      //计算百分百
      this.sdUsedAbsolutely = this.getUsedPercent(this.sdSize, this.sdFreeSize);
      this.usbUsedAbsolutely = this.getUsedPercent(
        this.usbSize,
        this.usbFreeSize
      );
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function.scss";

.set-item {
  margin-bottom: 8px;
  .titel {
    background-color: gainsboro;
    height: 36px;
    padding-top: 10px;
    margin-bottom: 8px;
  }
  .txt-info {
    height: 24px;
    padding-top: 6px;
    margin-bottom: 6px;
  }
}
.grid-content {
  border-radius: 1px;
  min-height: 20px;
}
</style>


