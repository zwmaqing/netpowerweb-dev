<template>
    <div>
        <p>基于Vue + Element UI EQ平衡调节模块 EQAdjust</p>
        <mt-range v-model="rangeValue" :bar-height="10"></mt-range>
        <div class="block">
    <el-slider
      v-model="value10"
      vertical
      height="200px">
    </el-slider>
  </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../../api";
import * as _ from "../../util/tools"; //
import Vue from "vue";
import 'mint-ui/lib/style.css';

export default {
  components: {},
  data() {
    return {
        rangeValue:0,
        value10:0

    };
  }
};
</script>