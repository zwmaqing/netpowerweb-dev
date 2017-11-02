<template>
    <div class="Grid">
        <div id="left" class="Grid-cell" v-bind:class="{'u-1of2':isPcDev,'u-1of1':isMobileDev}">
            <div id="spaekIn">
                <el-form :model="speakData">
                    <el-form-item label="播报内容:" label-width="75px">
                        <el-input type="textarea" :rows="2" placeholder="在此输入播报内容" :maxlength="40" v-model="speakData.speakContent">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="播报设置:" label-width="75px">
                        <div id="styleDefW1">
                            <el-select v-model="speakData.role" placeholder="请选择">
                                <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                                </el-option>
                            </el-select>

                            <el-tooltip content="更多设置" placement="top" effect="light">
                                <el-button type="primary" icon="el-icon-setting"></el-button>
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <el-form-item label="收听分组:" label-width="75px">
                        <div id="styleDefW">
                            <el-select v-model="speakData.groupList" multiple placeholder="请选择分组">
                                <el-option v-for="item in groupData" :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <div class="el-row--flex is-justify-end">
                        <el-form-item>
                            <el-tooltip content="收藏为快捷播报" placement="left" effect="light">
                                <el-button type="success" icon="el-icon-star-on" size="medium" @click="collectQuickSpeak">收藏</el-button>
                            </el-tooltip>
                            <el-button type="primary" class="icon16 icon-bullhorn" size="small" @click="speakInputTxt">. 播报</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div id="fastSpaek" >
                <el-button type="danger">消防报警</el-button>
                <el-button type="warning">即将关门</el-button>
                <el-button type="primary">播报时间</el-button>
                <el-button type="success">操场集合</el-button>
                <el-button type="info">用餐准备</el-button>
                <el-button type="info">放学准备</el-button>
                <el-button>家长请排队</el-button>
                <el-button>危险按钮</el-button>
                <el-button type="primary" v-for="item in fastbuttons" :key="item.butID" @click="fastSpaekButton(item)">{{item.label}}</el-button>
            </div>
        </div>
        <div id="right" class="Grid-cell u-1of2" v-show="isPcDev">
            <el-table :data="spaekHistory" style="width: 100%" border  @row-click="rowClick" >
                <el-table-column label="播报历史记录">
                    <template slot-scope="scope">
                        <span style="margin-left: 0px">{{ scope.row.txt}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="176">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-success" >重播</el-button>
                        <el-button size="small" icon="el-icon-edit" >编辑</el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
                <slot name="append"></slot>
            </el-table>
        </div>
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
                },
                {
                    GroupID: 102,
                    GroupName: "操场喇叭",
                    ChannelList: ["CH01", "CH02"],
                    Status: false
                },
                {
                    GroupID: 103,
                    GroupName: "操场喇叭",
                    ChannelList: ["CH01", "CH02"],
                    Status: false
                },
                {
                    GroupID: 104,
                    GroupName: "操场喇叭",
                    ChannelList: ["CH01", "CH02"],
                    Status: false
                }
            ],
            roles: [{
                value: 'women',
                label: '成年女声'
            }, {
                value: 'man',
                label: '成年男士',
                disabled: true
            },
            {
                value: 'girl',
                label: '童声女孩',
                disabled: true
            }
            ],
            speakData: {
                speakContent: '',
                role: 'women',
                speech: 12,
                volume: 12,
                groupList: []
            },
            fastbuttons: [
                {
                    label: '快捷按键1',
                    butID: '102',
                    groupList: [102, 103],
                    txt: '放学准备1'
                },
                {
                    label: '快捷按键2',
                    butID: '103',
                    groupList: [102, 103],
                    txt: '放学准备2'
                },
                {
                    label: '快捷按键3',
                    butID: '104',
                    groupList: [102, 103],
                    txt: '放学准备3'
                },
                {
                    label: '快捷按键4',
                    butID: '105',
                    groupList: [102, 103],
                    txt: '放学准备4'
                },
                {
                    label: '快捷按键1',
                    butID: '102',
                    groupList: [102, 103],
                    txt: '放学准备1'
                }
            ],
            spaekHistory:[
                {
                    logID:1,
                    groupList: [102, 103],
                    txt: '各班老师，请于下午2点到会议室开会'
                },
                {
                    logID: 2,
                    groupList: [102, 103],
                    txt: '各班老师，请于下午2点到会议室开会'
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
        })
    },
    mounted() {
        
    },
    methods: {
        collectQuickSpeak() {
            this.$message({
                showClose: true,
                message: '收藏到快捷播报成功.',
                type: 'success'
            });
        },
        speakInputTxt() {
            this.$message({
                showClose: true,
                message: '播报请求已成功提交.',
                type: 'success'
            });
        },
        fastSpaekButton(but) {
            this.$message({
                showClose: true,
                message: '播报请求: ' + but.txt,
                type: 'success'
            });
        },
        rowClick(row, event, column) {
            // if (column.label == '分组名') {
            //     this.getSelectRowData(row);
            //     this.isEditDisabled = true;
             }
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>

.Grid {
    display: -webkit-flex;
    display: flex;
    width: 100%;
    height: 100%;
    .Grid-cell.u-1of2 {
        display: flex;
        flex: 0 0 50%;
        flex-direction: column;
    }
    .Grid-cell.u-1of1 {
        display: flex;
        flex: 0 0 100%;
        flex-direction: column;
    }
}

#spaekIn {
    .el-form-item {
        margin-bottom: 12px;
    }
}

#fastSpaek {
    background-color: #f8f8ff;
    position: relative;
    flex: 1;
    overflow: auto;
}

#styleDefW .el-select {
    width: 100%;
}


#styleDefW1 .el-select {
    width: 70%;
}

#fastSpaek .el-button {
    margin: 4px 1px;
    padding: 8px 10px;
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

</style>