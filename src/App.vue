<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters({
      screenWidth: 'screenWidth',
      screenHeight: 'screenHeight',
      userName: 'userName',
      isLogin: 'isLogin',
      tokenStr: 'tokenStr'
    })
  }
}

</script>

<style>
/* @import '../static/css/element-ui/lib/theme-default/index.css'; */
@import "../static/css/main.css";
@import "../static/css/color-dark.css";
@import "../static/css/font_icon.css";
@import "../static/css/buttons.css";

/* 深色主题 */


/*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
</style>
