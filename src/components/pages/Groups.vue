<template>
    <div class="full">
        <div id="left" v-bind:class="{ 'split-horizon': isPcDev, 'full': isMobileDev }" v-show="!isMobileGroupInfo">
            <el-table :data="groups" style="width: 100%" :height="groupListHeighX" v-loading="isGroupLoading" @row-click="rowClick" v-vscrollbar="groupLoadMore">
                <el-table-column label="分组名">
                    <template slot-scope="scope">
                        <span style="margin-left: 0px">{{ scope.row.GroupName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="176">
                    <template slot-scope="scope">
                        <el-button size="small" :type="openButtType(scope.row)" icon="el-icon-success" @click="openOrCloseGroup(scope.row)">{{scope.row.Status?'关闭':'打开'}}</el-button>
                        <el-button size="small" icon="el-icon-edit" @click="editGroup(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteGroup(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <slot name="append"></slot>
            </el-table>
            <div class="suspension-bar">
                <button class="button button-royal button-circle" @click="addGroup">
                    <el-tooltip class="item" effect="dark" content="点击添加分组" placement="top">
                        <i class="icon24 icon-plus"></i>
                    </el-tooltip>
                </button>
            </div>
        </div>
        <div id="right" class="split-horizon backg" v-bind:class="{'full': isMobileGroupInfo }" v-show="isPcDev||isMobileGroupInfo">
            <div class="groupNameIn">
                <el-form :inline="true" :model="theGroup" ref="theGroup" label-width="100px">
                    <el-form-item label="输出分组名:" prop="GroupName" :rules="[
                                  { required: true, message: '名称不能为空'}]">
                        <el-input type="GroupName" v-model="theGroup.GroupName" placeholder="分组名称" :disabled="isEditDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="包含的分区:" prop="ChannelList" :rules="[
                                  { required: true, message: '不能不配置分区'}]">
                        <el-select v-model="theGroup.ChannelList" multiple placeholder="请选择输出分区" :disabled="isEditDisabled">
                            <el-option v-for="item in channals" :key="item.ChannelID" :label="item.ChannelName" :value="item.ChannelID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="el-row--flex is-justify-end">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-success" @click="submitForm('theGroup')" :disabled="isEditDisabled">保存</el-button>
                            <el-button type="info" icon="el-icon-error" @click="resetForm('theGroup')" :disabled="isEditDisabled">放弃</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <el-dialog title="删除前确认" :visible.sync="dialogVisible" width="260px">
            <span>你确实要删除选定的输出分组吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../../api";
import * as _ from "../../util/tools"; //
import Vue from "vue";

export default {
  components: {},
  data() {
    return {
      isTaskRuning: true,
      playing: false,
      playStatus: "playing",
      isGroupLoading: false,
      theGroup: {
        GroupID: 0,
        GroupName: "",
        ChannelList: [],
        Status: false
      },
      isAddGroup: false,
      isEditDisabled: true,
      dialogVisible: false,
      isMobileGroupInfo: false
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "screenWidth",
      screenHeight: "screenHeight",
      isMobileDev: "isMobileDev",
      tokenStr: "tokenStr",
      isPcDev: "isPcDev",
      isLogin: "isLogin",
      groupsTotal: "groupsTotal",
      groups: "groups",
      channals: "channals"
    }),
    groupListHeighX() {
      let height = this.screenHeight - 120;
      if (this.isMobileDev) {
        height += 20;
      }
      return height;
    }
  },
  mounted() {},
  methods: {
    ...mapActions([
      "getGroupsTotal",
      "getGroups",
      "getChannals",
      "isReloginToDev"
    ]),
    addGroup() {
      this.isAddGroup = true;
      this.theGroup = this.getNewGroup();
      this.isEditDisabled = false;
      if (this.isMobileDev) {
        this.isMobileGroupInfo = true;
      }
    },
    rowClick(row, event, column) {
      if (column.label == "分组名") {
        this.getSelectRowData(row);
        this.isEditDisabled = true;
      }
      // console.log(event);
    },
    openOrCloseGroup(row) {
      this.getSelectRowData(row);
      this.isEditDisabled = true;
      let data = {
        CMD: this.theGroup.Status ? "Close" : "Open",
        Groups: this.theGroup.GroupID,
        Token: this.tokenStr
      };
      api.Group(data).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "操作分区输出分组成功。",
            type: "success"
          });
          setTimeout(() => {
            this.getGroups("0-11");
          }, 1000);
        } else {
          this.$message({
            message: "操作分区输出分组失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    openButtType(row) {
      if (row.Status) {
        return "primary";
      } else {
        return "info";
      }
    },
    editGroup(row) {
      this.getSelectRowData(row);
      if (this.theGroup.GroupID < 101) {
        this.$message({
          message: "系统保留分区分组，不能修改!",
          type: "warning"
        });
        return;
      }
      if (this.theGroup.Status) {
        this.$message({
          message: "分组已打开，不能修改!",
          type: "warning"
        });
        return;
      }
      this.isEditDisabled = false;
      if (this.isMobileDev) {
        this.isMobileGroupInfo = true;
      }
    },
    deleteGroup(row) {
      this.getSelectRowData(row);
      if (this.theGroup.GroupID < 101) {
        this.$message({
          message: "系统保留分区分组，不能删除!",
          type: "warning"
        });
        return;
      }
      if (this.theGroup.Status) {
        this.$message({
          message: "分组已打开，不能删除!",
          type: "warning"
        });
        return;
      }
      this.dialogVisible = true;
    },
    confirmDelete() {
      this.dialogVisible = false;
      //
      let data = {
        CMD: "DelChannelGroup",
        GroupID: this.theGroup.GroupID,
        Token: this.tokenStr
      };
      api.Group(data).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "删除分区输出分组成功。",
            type: "success"
          });
          setTimeout(() => {
            this.getGroups("0-11");
          }, 1000);
          //console.log(this.$refs)
          this.theGroup = this.getNewGroup();
          this.$refs.theGroup.resetFields();
        } else {
          this.$message({
            message: "删除分区输出分组失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    },
    getSelectRowData(row) {
      this.theGroup.GroupID = row.GroupID;
      this.theGroup.GroupName = row.GroupName;
      this.theGroup.Status = row.Status;
      this.theGroup.ChannelList = row.ChannelList;
    },
    getNewGroup() {
      return {
        GroupID: 0,
        GroupName: "",
        ChannelList: [],
        Status: false
      };
    },
    groupLoadMore(loction) {
      // 表格到底后执行  这里写你要做的事
      if (loction == "Bottom") {
        this.isGroupLoading = true; //显示加载loading
        let self = this;
        if (self && !self._isDestroyed) {
          setTimeout(() => {
            if (self && !self._isDestroyed) self.isGroupLoading = false; //关闭加载loading
          }, 2000);
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveTheGroupChange(this.isAddGroup);

          if (this.isMobileDev) {
            this.isMobileGroupInfo = false;
          }
        } else {
          this.$message.error("错了哦，这是一条错误消息");
          return false;
        }
        this.isAddGroup = false;
        this.theGroup = this.getNewGroup();
        this.$refs[formName].resetFields();
        this.isEditDisabled = true;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isAddGroup = false;
      this.theGroup = this.getNewGroup();
      this.isEditDisabled = true;
      if (this.isMobileDev) {
        this.isMobileGroupInfo = false;
      }
    },
    saveTheGroupChange(isNew) {
      let data = {
        CMD: isNew ? "AddChannelGroup" : "EditChannelGroup",
        GroupName: this.theGroup.GroupName,
        Channels: _.arrayToStrUnderInterval(this.theGroup.ChannelList),
        Token: this.tokenStr
      };
      if (!isNew) {
        data.GroupID = this.theGroup.GroupID;
      }

      api.Group(data).then(res => {
        res.$router = this.$router; //是否需要重新登录检查
        this.isReloginToDev(res);
        if (res.Status) {
          this.$message({
            showClose: true,
            message: "保存分区输出分组成功。",
            type: "success"
          });
          this.getGroups("0-11");
        } else {
          this.$message({
            message: "保存分区输出分组失败！请检查后重试。",
            type: "warning"
          });
        }
      });
    }
  },
  watch: {},
  mounted: function() {
    this.getGroupsTotal();
    this.getGroups("0-15"); //需要完善分页请求
    this.getChannals();
  }
};
</script>

<style lang="scss" scoped>
.split-horizon {
  position: relative;
  float: left;
  width: 50%;
  height: 100%;
}

.backg {
  background-color: #f8f8ff;
}

.groupNameIn {
  padding: 10px 5px;
  .el-form--inline {
    width: 347px;
  }
}

.cell {
  .el-button + .el-button {
    margin-left: 0px;
  }
  .el-button--small {
    padding: 10px 4px;
    font-size: 12px;
    border-radius: 3px;
  }
}

.suspension-bar {
  /* background-color: black; */
  width: 40px;
  height: 40px;
  position: absolute;
  /* position: fixed; */
  bottom: 2px;
  right: 5px;
  font-size: 0;
  line-height: 0;
  z-index: 100;
}
</style>