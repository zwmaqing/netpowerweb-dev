<template>
  <div class="grig">
    <p class="titel">默认快捷功能按键</p>
    <div class="row">
      <div class="name">应急报警按键</div>
      <div class="veluem">打开所有通道，播报报警疏散语音</div>
      <div class="opret">
        1
      </div>
    </div>
    <div class="row">
      <div class="name">全开通道按键</div>
      <div class="veluem">开关所有喇叭通道</div>
      <div class="opret">
        2
      </div>
    </div>
    <p class="titel">自定义快捷功能按键 3</p>
    <div class="row">
      <div class="name">开关分区分组</div>
      <div class="veluem">
        <el-select v-model="fastButton3.group" placeholder="请选择分组">
          <el-option v-for="item in groups" :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
          </el-option>
        </el-select>
      </div>
      <div class="opret">
        3
      </div>
    </div>
    <div class="row">
      <div class="name">播报语音内容</div>
      <div class="veluem">
        <el-input v-model="fastButton3.speakTxt" :maxlength=20 placeholder="播报内容20字以内"></el-input>
      </div>
      <div class="opret">
        <el-button type="primary" icon="el-icon-success" @click="saveFastButton(3)">保存</el-button>
      </div>
    </div>
    <p class="titel">自定义快捷功能按键 4</p>
    <div class="row">
      <div class="name">开关分区分组</div>
      <div class="veluem">
        <el-select v-model="fastButton4.group" placeholder="请选择分组">
          <el-option v-for="item in groups" :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
          </el-option>
        </el-select>
      </div>
      <div class="opret">
        4
      </div>
    </div>
    <div class="row">
      <div class="name">播报语音内容</div>
      <div class="veluem">
        <el-input v-model="fastButton4.speakTxt" :maxlength=20 placeholder="播报内容20字以内"></el-input>
      </div>
      <div class="opret">
        <el-button type="primary" icon="el-icon-success" @click="saveFastButton(4)">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions} from "vuex";
import api from "../../api/index";

export default {
  data() {
    return {
      fastButton3: {
        group: null,
        speakTxt: ""
      },
      fastButton4: {
        group: null,
        speakTxt: ""
      },
      fastButtonSet: []
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr",
      groups: "groups"
    })
  },
  methods: {
     ...mapActions(["getGroupsTotal", "getGroups", "getChannals"]),
    getfastButtonSet() {
      let data = {
        CMD: "GetButton",
        Token: this.tokenStr
      };
      api.System(data).then(res => {
        this.fastButtonSet = res.Data;
        if (res.Data[2] != undefined) {
          this.fastButton3.group = res.Data[2].buttChannel;
          this.fastButton3.speakTxt = res.Data[2].buttContent;
        }
        if (res.Data[3] != undefined) {
          this.fastButton4.group = res.Data[3].buttChannel;
          this.fastButton4.speakTxt = res.Data[3].buttContent;
        }
      });
    },
    saveFastButton(butt) {
      // ButtonFuction 3
      let data = {
        CMD: "SetButton",
        ButtonID: 3,
        Method: 3,
        Channels: this.fastButton3.group,
        Content: this.fastButton3.speakTxt,
        Token: this.tokenStr
      };
      if (butt == 4) {
        data.ButtonID = 4;
        data.Channels = this.fastButton4.group;
        data.Content = this.fastButton4.speakTxt;
      }
      api.System(data).then(res => {
        this.fastButtonSet = res.Data;
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "快捷功能键配置更改成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "快捷功能键配置更改失败！请检查后重试。",
            type: "warning"
          });
        }
      });
      //console.log("Save fastbutton " + butt + " set to device.");
    }
  },
  watch: {},
  mounted: function() {
    this.getGroups("0-15"); //需要完善分页请求
    this.getfastButtonSet();
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/function.scss";

.grig {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .row {
    height: 42px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid gainsboro;
    .name {
      width: 30%;
      display: flex;
      align-items: center;
      margin-left: 6px;
      //border: 1px solid #aaa;
    }
    .veluem {
      width: 40%;
      //height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      //border: 1px solid #aaa;
    }
    .opret {
      width: 30%;
      //height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      //border: 1px solid #aaa;
    }
  }
  .titel {
    background-color: gainsboro;
    height: 24px;
    padding-top: 10px;
    margin-bottom: 8px;
  }
}
</style>
