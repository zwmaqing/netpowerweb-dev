<template>
  <div style="padding:0px 4px; overflow-y:auto;" class="full">
    <div class="set-item">
      <p class="titel"><i class="icon16 icon-floppy-o"></i> 内部存储器</p>
      <p class="txt-info">总共：8.00 GB，剩余：3.46 GB</p>
      <!-- 映射存储器数据 -->
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="set-item">
      <p class="titel"><i class="icon16 icon-usb"></i> 外部存储器</p>
      <p class="txt-info">总共：8.00 GB，剩余：3.46 GB</p>
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
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
    return {};
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


