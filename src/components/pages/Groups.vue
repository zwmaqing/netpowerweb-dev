<template>
    <div class="full">
        <div id="left" v-bind:class="{ 'split-horizon': isPcDev, 'full': isMobileDev }" v-show="!isMobileGroupInfo">
            <el-table :data="groupData" style="width: 100%" :height="groupListHeighX" v-loading="isGroupLoading" @row-click="rowClick" v-vscrollbar="groupLoadMore">
                <el-table-column label="分组名">
                    <template slot-scope="scope">
                        <span style="margin-left: 0px">{{ scope.row.GroupName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="176">
                    <template slot-scope="scope">
                        <el-button size="small" type="info" icon="el-icon-success" @click="openOrCloseGroup(scope.row)">打开</el-button>
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
                            <el-option v-for="item in sysChannls" :key="item.ChannelID" :label="item.ChannelID" :value="item.ChannelID">
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
import { mapGetters } from 'vuex'
import api from '../../api'
import * as _ from '../../util/tools'//
import Vue from 'vue'


export default {
    components: {

    },
    data() {
        return {
            isTaskRuning: true,
            playing: false,
            playStatus: 'playing',
            isGroupLoading: false,
            groupCount: 2,
            groupData:
            [
                {
                    GroupID: 100,
                    GroupName: "全部喇叭",
                    ChannelList: ["CH01", "CH02", "CH03", "CH04", "CH05", "CH06", "CH07", "CH08", "CH09", "CH10", "CH11", "CH12", "CH13", "CH14", "CH15", "CH16"],
                    Status: false
                },
                {
                    GroupID: 101,
                    GroupName: "操场喇叭",
                    ChannelList: ["CH01", "CH02"],
                    Status: false
                }
            ],
            theGroup: {
                GroupID: 0,
                GroupName: "",
                ChannelList: [],
                Status: false
            },
            isAddGroup: false,
            isEditDisabled: true,
            dialogVisible: false,
            isMobileGroupInfo: false,
            sysChannls: [
                {
                    ChannelID: "CH01",
                    Status: false
                },
                {
                    ChannelID: "CH02",
                    Status: false
                },
                {
                    ChannelID: "CH03",
                    Status: false
                },
                {
                    ChannelID: "CH04",
                    Status: false
                },
                {
                    ChannelID: "CH05",
                    Status: false
                },
                {
                    ChannelID: "CH06",
                    Status: false
                },
                {
                    ChannelID: "CH07",
                    Status: false
                },
                {
                    ChannelID: "CH08",
                    Status: false
                },
                {
                    ChannelID: "CH09",
                    Status: false
                },
                {
                    ChannelID: "CH10",
                    Status: false
                },
                {
                    ChannelID: "CH11",
                    Status: false
                },
                {
                    ChannelID: "CH12",
                    Status: false
                },
                {
                    ChannelID: "CH13",
                    Status: false
                },
                {
                    ChannelID: "CH14",
                    Status: false
                },
                {
                    ChannelID: "CH15",
                    Status: false
                },
                {
                    ChannelID: "CH16",
                    Status: false
                }
            ]

        }
    },
    computed: {
        ...mapGetters({
            screenWidth: 'screenWidth',
            screenHeight: 'screenHeight',
            isMobileDev: 'isMobileDev',
            isPcDev: 'isPcDev',
            isLogin: 'isLogin'
        }),
        groupListHeighX() {
            let height = this.screenHeight - 120;
            if (this.isMobileDev) {
                height += 20;
            }
            return height;
        }
    },
    mounted() {

    },
    methods: {
        addGroup() {
            this.isAddGroup = true;
            this.theGroup = this.getNewGroup();
            this.isEditDisabled = false;
            if (this.isMobileDev) {
                this.isMobileGroupInfo = true
            }
        },
        rowClick(row, event, column) {
            if (column.label == '分组名') {
                this.getSelectRowData(row);
                this.isEditDisabled = true;
            }
            // console.log(event);
        },
        openOrCloseGroup(row) {
            this.getSelectRowData(row);
            this.isEditDisabled = true;
            console.log("openOrCloseGroup:" + row.GroupID);
        },
        editGroup(row) {
            //console.log("editGroup:" + row.GroupID);
            //PC set group info ui enlb
            //moble to group info page
            this.getSelectRowData(row);
            this.isEditDisabled = false;
            if (this.isMobileDev) {
                this.isMobileGroupInfo = true
            }
        },
        deleteGroup(row) {
            this.getSelectRowData(row);
            this.dialogVisible = true;
            //console.log("GroupID:" + row.GroupID);
        },
        confirmDelete() {
            this.dialogVisible = false;
            console.log("Del GroupID:" + this.theGroup.GroupID);
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
            }
        },
        groupLoadMore(loction) {
            // 表格到底后执行  这里写你要做的事
            if (loction == 'Bottom') {
                this.isGroupLoading = true;//显示加载loading
                let self = this;
                if (self && !self._isDestroyed) {
                    setTimeout(() => {
                        if (self && !self._isDestroyed)
                            self.isGroupLoading = false;//关闭加载loading
                    }, 2000);
                }
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.$message({
                    //     message: '恭喜你，这是一条成功消息',
                    //     type: 'success'
                    // });
                    if (this.isAddGroup) {
                        this.groupData.push({
                            GroupID: 0,
                            GroupName: this.theGroup.GroupName,
                            ChannelList: this.theGroup.ChannelList,
                            Status: false
                        });
                    } else {
                        //Edit
                    }

                    if (this.isMobileDev) {
                        this.isMobileGroupInfo = false;
                    }
                } else {
                    this.$message.error('错了哦，这是一条错误消息');
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
        }
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
.split-horizon {
    position: relative;
    float: left;
    width: 50%;
    height: 100%;
}

.full {
    width: 100%;
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
    .el-button+.el-button {
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