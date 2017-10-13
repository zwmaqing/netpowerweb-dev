<template>
    <div class="header">
        <div class="logo" v-show="isPcDev">播放服务器-管理系统</div>
            <div class="user-info"  v-show="isPcDev">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img class="user-logo" src="../../../static/img/zwSound-d.png">.{{userName}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">
                            <i class="el-icon-delete"></i> 退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

    <el-menu  class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router v-show="isMobileDev">
        <el-submenu index="1">
            <template slot="title">播放管理</template>
            <el-menu-item index="tasks">定时播放</el-menu-item>
            <el-menu-item index="files">播放资源</el-menu-item>
        </el-submenu>
        <el-menu-item index="groups">分区分组</el-menu-item>
        <el-menu-item index="speak">广播播报</el-menu-item>
        <el-submenu index="4">
            <template slot="title">设备管理</template>
            <el-menu-item index="eqadjust">音频EQ均衡</el-menu-item>
            <el-menu-item index="microphone">话筒管理</el-menu-item>
            <el-menu-item index="settings">基础配置</el-menu-item>
            <el-menu-item index="loginout" @click="_SignOut">退出登录</el-menu-item>
        </el-submenu>
    </el-menu>

    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '../../api/index'
import * as _ from '../../util/tools'

export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            userName: 'userName',
            isLogin: 'isLogin',
            tokenStr: 'tokenStr',
            isMobileDev: 'isMobileDev',
            isPcDev: 'isPcDev'
        })
    },
    methods: {
        ...mapMutations([
            'SET_ISLOGIN', 'SET_TOKENSTR', 'SET_USERNAME'
        ]),
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('ms_username')
                this._SignOut();
            }
        },
        _SignOut() {
            let data = {
                CMD: 'SignOut',
                Token: this.tokenStr
            }
            // this.$store.dispatch('setLoadingState', true)
            //console.log('name:'+data.userName+'pass'+data.password);
            api.System(data)
                .then(res => {
                    if (res.StatusCode === 200) {
                        console.log('成功退出设备系统。');
                    }
                    else {
                        console.log('发生错误！错误信息：' + res.StatusMessage);
                        //_.toast('发生错误！错误信息：' + res.StatusMessage);
                        this.notice = '发生错误！' + res.DetailedInfo;
                    }
                    this.SET_USERNAME('');
                    this.SET_ISLOGIN(false);
                    this.SET_TOKENSTR('');
                    _.clearCookie('User_Login_Token');
                    _.clearCookie('User_Login_Name');
                    this.$router.push('/login');//进入登录页面
                })
                .catch(res => {
                    //_.toast('发生错误！错误信息：' + res);
                    this.notice = '发生错误！错误信息：网络故障或设备关闭。';
                })
        }
    }
}


</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    font-size: 22px;
    line-height: 50px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}

@media(max-width:768px) {

    .user-info {
        padding-right: 0em;
    }
}
</style>
