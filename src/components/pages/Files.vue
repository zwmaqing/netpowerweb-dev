<template>
  <div class="Grid">
    <div id="left" class="u-1of40" v-show="isPcDev||isShowFilesPathDiv">
      <el-tree :props="props1" :load="loadNode1" highlight-current lazy accordion @node-click="resourcesNodeClick">
      </el-tree>
      <el-tree :props="props1" :load="loadNode1" lazy accordion highlight-current @node-click="resourcesNodeClick" :render-content="renderContent">
      </el-tree>
        <div class="suspension-bar" v-show="isMobileDev">
        <button class="button button-royal button-circle"  @click="showFilesPathDiv(false)">
          <el-tooltip class="item" effect="dark" content="点击返回文件列表" placement="top">
            <i class="icon24 icon-arrow-circle-left"></i>
          </el-tooltip>
        </button>
      </div>
    </div>
    <div id="right" v-bind:class="{'u-1of60':isPcDev,'u-1of1':isMobileDev}" v-show="!isShowFilesPathDiv">
      <div class="music-list">
        <div class="list-item" v-for="(item, index) in musicLists">
          <div class="avatar icon16 icon-music" @click="_selectFile(item,index)"></div>
          <div class="info" @click="_selectFile(item,index)">
            <div class="music-name">{{item.name}}</div>
            <!-- <div class="music-s"
                     v-if="item.ar">{{item.ar[0].name}}</div>
                <div class="music-s"
                     v-else>{{item.artists[0].name}}</div>
                <div class="music-hot"
                     v-show="item.hot"><i class="icon">&#xe650;</i>{{item.hot}}</div> -->

          </div>
          <div class="operation" @click="_showOperation(index)">
            <i class="el-icon-more"></i>
          </div>
          <animation-menu :item="item" :index="index"></animation-menu>
        </div>
      </div>
      <div class="suspension-bar" v-show="isMobileDev">
        <button class="button button-royal button-circle" @click="showFilesPathDiv(true)">
          <el-tooltip class="item" effect="dark" content="点击选择资源位置" placement="top">
            <i class="icon24 icon-folder-open"></i>
          </el-tooltip>
        </button>
      </div>
    </div>
  </div>
</template>



<script>
import animationMenu from "../common/animationMenu";

import Vue from "vue";
import { mapGetters } from "vuex";

import api from "../../api/index";

export default {
  components: {
    animationMenu
  },
  data() {
    return {
      musicLists: [
        {
          name: "刚好遇见你-中反复大概的.mp3",
          menuShow: false
        },
        {
          name: "暧昧",
          menuShow: false
        },
        {
          name: "刚好遇见你-中反复大概的.mp3",
          menuShow: false
        },
        {
          name: "刚好遇见你-中反复大概的.mp3",
          menuShow: false
        },
        {
          name: "暧昧",
          menuShow: false
        },
        {
          name: "刚好遇见你-中反复大概的.mp3",
          menuShow: false
        }
      ],
      props1: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      isShowFilesPathDiv: false
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
    // ...mapGetters(["listenLists", "showLoading"])
  },
  methods: {
    _selectFile(music, index) {
      this._showOperation(index);

      //   this.$store.dispatch("setPlaying", false);
      //   this.$store.dispatch("setAudio", music);
      //   this.$store.dispatch("setShowPlayLoading", true);
      //   //查找试听列表中有没有点击中的歌
      //   let x = this.listenLists.findIndex(item => {
      //     //判断是否是搜索列表里的(搜索结果字段不一样)
      //     if (item.ar && music.ar) {
      //       return item.name == music.name && item.ar[0].name == music.ar[0].name;
      //     } else if (item.artists && music.artists) {
      //       return (
      //         item.name == music.name &&
      //         item.artists[0].name == music.artists[0].name
      //       );
      //     }
      //   });
      //   if (x === -1) {
      //     this.$store.dispatch("addListenLists", music);
      //   }
      //   if (music.mp3Url) {
      //     this.$store.dispatch("setAudioUrl", music.mp3Url);
      //   } else {
      //     api.MusicUrl(music.id).then(res => {
      //       this.$store.dispatch("setAudioUrl", res.data[0].url);
      //     });
      //   }
    },
    _showOperation(index) {
      for (let i = 0; i < this.musicLists.length; i++) {
        if (i !== index) {
          this.musicLists[i].menuShow = false;
        }
      }
      this.musicLists[index].menuShow = !this.musicLists[index].menuShow;
    },
    loadNode1(node, resolve) {
      if (node.level === 0) {
        return resolve([
          { name: "设备本地播放资源", zones: "resources", filesCount: 0 }
        ]);
      }
      if (node.level === 1) {
        setTimeout(() => {
          const data = [
            {
              name: "内部存储器",
              zones: "0\\resources",
              filesCount: 0,
              label: "0\\resources"
            },
            {
              name: "USB可移动存储器",
              zones: "1\\music",
              filesCount: 16,
              label: "1\\music"
            }
          ];

          resolve(data);
        }, 500);
      }

      if (node.level > 1) {
        // getChildNodesData(node.data.zones);//获取子目录节点数据
        // if (node.data.zones === "0\\resources")
        {
          const data = [
            {
              name: "儿童音乐资源",
              zones: "0\\resources\\music",
              leaf: true,
              filesCount: 22,
              label: "0\\resources\\music"
            },
            {
              name: "性格与习惯养成故事",
              zones: "0\\resources\\story",
              leaf: true,
              filesCount: 25,
              label: "0\\resources\\story"
            }
          ];
          resolve(data);
        }
      }
    },
    resourcesNodeClick(data, node) {
      console.log("path to : " + data.zones);
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="icon14 icon-folder-o">
          {" "}
          {data.name + " " + data.filesCount}
        </span>
      );
    },
    showFilesPathDiv(p) {
      if (p) {
        this.isShowFilesPathDiv = true;
      } else {
        this.isShowFilesPathDiv = false;
      }
    }
  },
  watch: {
    musicLists() {
      for (let item of this.musicLists) {
        Vue.set(item, "menuShow", false);
      }
    }
  }
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
}

.music-list {
  position: relative;
  flex-basis: 100%;
  .list-item {
    position: relative;
    height: 2.6em;
    border-bottom: 1px solid #3c3662;
    background: #28224e;
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
      border-radius: 50%;
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

@media screen and(min-width: 769px) {
  .list-item {
    .info {
      .music-hot {
        .icon {
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>