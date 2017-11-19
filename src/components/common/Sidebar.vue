<template>
  <div class="sidebar" v-show="isPcDev">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
      unique-opened router>
      <el-menu-item index="tasks">
        <i class="icon16 icon-music"></i> 播放任务
      </el-menu-item>
      <el-menu-item index="speak">
        <i class="icon16 icon-bullhorn"></i> 语音播报
      </el-menu-item>
      <el-submenu index="groups">
        <template slot="title">
          <i class="icon16 icon-tasks"></i> 播放管理</template>
        <el-menu-item index="groups">分区分组管理</el-menu-item>
        <el-menu-item index="files">资源管理</el-menu-item>
        <el-menu-item index="speak-class">分班播报</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>设备管理</template>
        <el-menu-item index="settings">基础配置</el-menu-item>
        <el-menu-item index="eqadjust">音频EQ平衡</el-menu-item>
        <el-menu-item index="microphone">话筒管理</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>

import { mapGetters} from "vuex";

export default {
  computed: {
      ...mapGetters({
      isMobileDev: "isMobileDev",
      isPcDev: "isPcDev",
      isLogin: "isLogin",
    }),
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 11.25em;
  left: 0em;
  top: 3.125em;
  bottom: 3.75em;
  background: #2e363f;
}

.sidebar > ul {
  height: 100%;
}

</style>
