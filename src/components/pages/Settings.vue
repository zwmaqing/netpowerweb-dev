<template>
  <div class="Grid">
    <div id="left" class="u-1of40" >
      <div class="setting-list">
          <!-- 还需要增加滚动条 -->
        <div class="list-item" v-for="(item, index) in settingsPro">
          <div class="avatar icon16" v-bind:class="[item.icon]"></div>
          <div class="info" @click="_selectSetting(item,index)">
            <div class="music-name">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div id="right" v-bind:class="{'u-1of60':isPcDev,'u-1of1':isMobileDev}" v-show="isPcDev||isShowFilesPathDiv">
      <div class="suspension-bar" v-show="isMobileDev">
        <button class="button button-royal button-circle">
          <el-tooltip class="item" effect="dark" content="点击返回" placement="top">
            <i class="icon24 icon-folder-open"></i>
          </el-tooltip>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import { mapGetters } from "vuex";

import api from "../../api/index";

export default {
  components: {},
  data() {
    return {
      isShowFilesPathDiv: false,
      settingsPro: [
        {
          name: "设备存储",
          path: "",
          icon: "icon-floppy-o"
        },
        {
          name: "网络设置",
          path: "",
          icon: "icon-sitemap"
        },
        {
          name: "时间与日期",
          path: "",
          icon: "icon-clock-o"
        },
        {
          name: "快捷键功能配置",
          path: "",
          icon: "icon-hand-o-up"
        },
        {
          name: "报警联动配置",
          path: "",
          icon: "icon-whatsapp"
        },
        {
          name: "音频条件配置",
          path: "",
          icon: "icon-cogs"
        },
        {
          name: "设备开关机",
          path: "",
          icon: "icon-power-off"
        },
        {
          name: "用户与权限",
          path: "",
          icon: "icon-user-circle"
        },
        {
          name: "关于设备",
          path: "",
          icon: "icon-registered"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      isPcDev: "isPcDev",
      isLogin: "isLogin"
    })
  },
  methods: {
    _selectSetting(item, index) {
      console.log("selectSetting : " + item.name+" index: "+index);
      //get select setting pro data
      
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function.scss";

.Grid {
  display: -webkit-flex;
  display: flex;
  width: 100%;
  height: 100%;
  .u-1of40 {
    flex: 4 4 40%;
    border: 1px solid;
    border-color: gainsboro;
    position: relative;
  }
  .u-1of60 {
    display: flex;
    flex: 6 6 60%;
    flex-direction: column;
    border: 1px solid;
    border-color: gainsboro;
  }
  .u-1of1 {
    flex: 1 1 100%;
    border: 1px solid;
    border-color: gainsboro;
    display: flex;
  }

  .setting-list {
    position: relative;
    flex-basis: 100%;
    .list-item {
      position: relative;
      height: 2.6em;
      border-bottom: 1px solid #3c3662;
      background: #6897b0;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #fff;
      &:last-child {
        border-bottom: none;
      }
      .avatar {
        width: px2rem(100px);
        height: px2rem(100px);
        // border-radius: 50%;
        overflow: hidden;
        margin: 0 px2rem(15px) 0 px2rem(25px);
        img {
          width: 100%;
        }
      }
      .info {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
        .music-name {
          font-size: 0.775em; //px2rem(32px);
          font-weight: bold;
          vertical-align: middle;
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
      .operation {
        width: px2rem(100px);
        height: 100%;
        line-height: px2rem(145px);
        text-align: center;
        padding-top: 24px;
      }
    }
  }

  .suspension-bar {
    width: 40px;
    height: 40px;
    //align-self: flex-start;
    // align-content:center;
    //justify-content: center;
    //order: -1;
    position: fixed;
    top: 250px;
    z-index: 9999;
    font-size: 0;
  }
}
</style>