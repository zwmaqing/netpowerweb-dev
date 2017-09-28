<template>
    <div class="header">
        <div class="logo">播放服务器-管理系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../static/img/zwSound-d.png">.{{userName}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">
                        <i class="el-icon-delete"></i> 退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '../api/index'
import * as _ from '@/util/tools'

export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            userName: 'userName',
            isLogin: 'isLogin',
            tokenStr: 'tokenStr'
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

    .user-info{
        padding-right: 0em;
    }
}
</style>
