<template>
  <div class="Grid">
    <div id="left" class="u-1of40" v-show="isPcDev||isShowFilesPathDiv" v-swipeleft="swipLift">
      <el-tree :props="props1" :load="loadNodeLocal" highlight-current lazy accordion @node-click="resourcesNodeClick" :render-content="renderContent">
      </el-tree>
      <el-tree :props="props1" :load="loadNodeFromNet" lazy accordion highlight-current @node-click="resourcesNodeClick">
      </el-tree>
      <div class="suspension-bar" v-show="isMobileDev">
        <button class="button button-royal button-circle" @click="showFilesPathDiv(false)">
          <el-tooltip class="item" effect="dark" content="点击返回文件列表" placement="top">
            <i class="icon24 icon-arrow-circle-left"></i>
          </el-tooltip>
        </button>
      </div>
    </div>
    <div id="right" v-bind:class="{'u-1of60':isPcDev,'u-1of1':isMobileDev}" v-show="isPcDev||!isShowFilesPathDiv" v-vscrollbar="filesLoadMore">
      <div class="music-list" id="files-list" v-swipeup="{fn:vuetap,name:'上滑'}" v-swiperight="swipRight">
        <div class="list-item" v-for="(item, index) in musicLists">
          <div class="avatar icon16 icon-music" @click="_selectFile(item,index)"></div>
          <div class="info" @click="_selectFile(item,index)">
            <div class="music-name">{{item.Name}}</div>
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
          <animation-menu :item="item" :index="index" :task="editTask" :path="currentPath"></animation-menu>
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import api from "../../api/index";

export default {
  components: {
    animationMenu
  },
  data() {
    return {
      currentPath: "",
      currentFilesTotal: 0,
      pageIndex: 0,
      musicLists: [],
      props1: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      isShowFilesPathDiv: false,
      editTask: {}
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      tokenStr: "tokenStr",
      isPcDev: "isPcDev",
      isLogin: "isLogin"
    })
    // ...mapGetters(["listenLists", "showLoading"])
  },
  methods: {
    ...mapActions(["setTaskList", "getTasks", "isReloginToDev"]),
    ...mapMutations(["SET_DEVCOMMBUSY"]),
    _selectFile(music, index) {
      this._showOperation(index);
    },
    _showOperation(index) {
      for (let i = 0; i < this.musicLists.length; i++) {
        if (i !== index) {
          this.musicLists[i].menuShow = false;
        }
      }
      this.musicLists[index].menuShow = !this.musicLists[index].menuShow;
    },
    loadNodeLocal(node, resolve) {
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
              zones: "1:",
              filesCount: 0,
              label: "1:"
            },
            {
              name: "USB可移动存储器",
              zones: "2:",
              filesCount: 0,
              label: "2:"
            }
          ];
          resolve(data);
        }, 500);
      }

      if (node.level > 1) {
        let data = {
          CMD: "GetDirs",
          Path: node.data.zones,
          Token: this.tokenStr
        };
        api.File(data).then(res => {
          res.$router = this.$router; //是否需要重新登录检查
          this.isReloginToDev(res);
          if (res.Status && res.Data.length > 1) {
            node.data.filesCount = res.Data[0].FileNum;
            res.Data.splice(0, 1);
            for (let index = 0; index < res.Data.length; index++) {
              let i = res.Data[index].DirName.lastIndexOf("/");
              res.Data[index].name = res.Data[index].DirName.substr(i + 1);
              res.Data[index].zones = res.Data[index].DirName;
              res.Data[index].leaf = false;
              res.Data[index].filesCount = res.Data[index].FileNum;
              res.Data[index].label = res.Data[index].DirName;
            }
          } else {
            node.data.leaf = true;
            node.data.filesCount =
              res.Data.length > 0 ? res.Data[0].FileNum : 0;
            res.Data = [];
          }
          resolve(res.Data);
        });
        //
      }
    },
    loadNodeFromNet(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "网络播放资源", zones: "resources", filesCount: 0 }]);
      }
      if (node.level === 1) {
        setTimeout(() => {
          const data = [
            {
              name: "云存储空间",
              zones: "1:",
              filesCount: 0,
              label: "1:"
            },
            {
              name: "酷狗音乐空间",
              zones: "2:",
              filesCount: 0,
              label: "2:"
            },
            {
              name: "故事订阅频道",
              zones: "3:",
              filesCount: 0,
              label: "3:"
            }
          ];
          resolve(data);
        }, 500);
      }
      if (node.level > 1) {
        node.data.leaf = true;
        resolve([]);
        this.$message({
          message: "尚未配置资源地址，需要先配置网络资源空间服务器地址!",
          type: "warning"
        });
      }
    },
    resourcesNodeNetClick(data, node) {
      this.$message({
        message: "尚未配置资源地址，需要先配置网络资源空间服务器地址!",
        type: "warning"
      });
    },
    resourcesNodeClick(data, node) {
      // console.log("path to : " + data.zones + " filesCount:" + data.filesCount);
      this.currentFilesTotal = data.filesCount;
      this.currentPath = data.zones;
      if (data.filesCount < 1) {
        this.musicLists = [];
        return;
      }
      this.loadFilesFromDev("0-15");
      //容器大于1第一分页的项目，再加一页以充满容器
      if (this.getMusicListCapacity() > 16) {
        setTimeout(() => {
          this.filesLoadMore("Bottom");
        }, 2500);
      }
      this.isShowFilesPathDiv = false;
    },
    filesLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.pageIndex++;
        if (this.currentFilesTotal < this.pageIndex * 16 + 1) {
          return;
        }
        let range =
          (this.pageIndex * 16).toString() +
          "-" +
          ((this.pageIndex + 1) * 16 - 1).toString();
        //console.log("load more files range:" + range);
        this.loadFilesFromDev(range, true); //Add
      }
    },
    getMusicListCapacity() {
      let listHeight = this.screenHeight - (this.isPcDev ? 117 : 101);
      return parseInt(listHeight / 43);
    },
    vuetap: function(s) {
      this.filesLoadMore("Bottom");
    },
    swipRight: function(s) {
      this.isShowFilesPathDiv = true;
    },
    swipLift: function(s) {
      this.isShowFilesPathDiv = false;
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
    },
    loadFilesFromDev(range, isAdd) {
      this.SET_DEVCOMMBUSY(true);
      let params = {
        CMD: "GetFiles",
        Path: this.currentPath,
        IndexRange: range,
        Token: this.tokenStr
      };
      api.File(params).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status && res.Data.length > 0) {
          for (let index = 0; index < res.Data.length; index++) {
            res.Data[index].menuShow = false;
            if (isAdd) {
              this.musicLists.push(res.Data[index]);
            }
          }
          if (!isAdd) {
            this.musicLists = res.Data;
          }
        } else {
          if (!isAdd) {
            this.musicLists = [];
          }
        }
        this.SET_DEVCOMMBUSY(false);
      });
    }
  },
  watch: {
    musicLists() {
      for (let item of this.musicLists) {
        Vue.set(item, "menuShow", false);
      }
    }
  },
  created() {
    this.editTask = this.$route.query;

   // this.getTasks({ range: "0-15" });

    this.isShowFilesPathDiv = true;
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
    overflow: auto;
  }
  .u-1of60 {
    display: flex;
    flex: 6 6 60%;
    flex-direction: column;
    border: 1px solid;
    border-color: gainsboro;
    overflow: auto;
  }
  .u-1of1 {
    flex: 1 1 100%;
    border: 1px solid;
    border-color: gainsboro;
    display: flex;
    overflow: auto;
  }
}

.music-list {
  position: relative;
  flex-basis: 100%;
  .list-item {
    position: relative;
    height: 2.6em;
    border-bottom: 1px solid #3c3662;
    //background: #28224e;
    display: flex;
    align-items: center;
    cursor: pointer;
    //color: #fff;
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
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 9999;
  font-size: 0;
}
</style>