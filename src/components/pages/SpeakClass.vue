<template>
  <div id="classSpaek" style="overflow-y:auto;height:100%;">
    <el-collapse accordion>
      <el-collapse-item v-for="item in classSpeaks" :key="item.classID" :title="item.className">
        <el-switch v-model="item.isDisable" active-text="启用播报" inactive-text="禁用播报">
        </el-switch>
        <span>. </span>
        <el-switch v-model="item.isName" active-text="播报班名" inactive-text="不报班名">
        </el-switch>
        <div class="row">
          <span class="lab">语速:</span>
          <el-slider v-model="item.speed" :max="16"></el-slider>
        </div>
        <div class="row">
          <span class="lab">音量:</span>
          <el-slider v-model="item.volume" :max="16"></el-slider>
        </div>
        <div class="row">
          <span class="lab" style="margin-right:46px;">喇叭:</span>
          <el-select v-model="item.groupID" placeholder="请选择" size="small">
            <el-option v-for="itemi in groupData" :key="itemi.GroupID" :label="itemi.GroupName" :value="itemi.GroupID">
            </el-option>
          </el-select>
        </div>
        <div class="flexRow">
          <el-button type="primary" size="small" icon="el-icon-success" @click="saveClass(item)">保存</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import api from "../../api/index";

export default {
  data() {
    return {
      classSpeaks: [
        {
          classID: 101,
          className: "大一班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 102,
          className: "大二班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 103,
          className: "中一班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 104,
          className: "中二班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 105,
          className: "小一班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 106,
          className: "小二班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        },
        {
          classID: 107,
          className: "中一班",
          groupID: 101,
          speed: 10,
          volume: 8,
          isName: false,
          isDisable: false
        }
      ],
      groupData: [
        {
          GroupID: 100,
          GroupName: "全部喇叭",
          ChannelList: [
            "CH01",
            "CH02",
            "CH03",
            "CH04",
            "CH05",
            "CH06",
            "CH07",
            "CH08",
            "CH09",
            "CH10",
            "CH11",
            "CH12",
            "CH13",
            "CH14",
            "CH15",
            "CH16"
          ],
          Status: false
        },
        {
          GroupID: 101,
          GroupName: "操场喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 102,
          GroupName: "大班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 103,
          GroupName: "中班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        },
        {
          GroupID: 104,
          GroupName: "小班喇叭",
          ChannelList: ["CH01", "CH02"],
          Status: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin"
    })
  },
  methods: {
      saveClass(classItem){
console.log(classItem.className+' spaek is saved.')
      }
  },
  watch: {},
  created() {
    //组件创建完后
  }
};
</script>

<style lang="scss" scoped>
.row {
  max-width: 340px;
  margin-bottom: 6px;
  .lab {
    font-size: 14px;
    line-height: 36px;
  }
}

.lab + .el-slider {
  float: right;
  width: 70%;
  margin-right: 20px;
}

.flexRow {
  display: flex;
  max-width: 340px;
  //margin-bottom: 6px;
  justify-content: flex-end;
}
</style>