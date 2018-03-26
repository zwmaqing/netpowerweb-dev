<template>
    <div class="login-wrap">
        <!-- <img class="user-logo" src="../../static/img/zwSound-d.png"> -->
        <div class="ms-title">
            播放服务器-管理系统-Dev</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="登录用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码口令" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">123456</el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:20px;color:#999;padding-top: 5px;">{{notice}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from "../../api/index";
import * as _ from "../../util/tools";

import { mapGetters, mapActions, mapMutations } from "vuex";
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
      notice: "提示 : 用户名 admin,密码123456。",
      ruleForm: {
        userName: "admin",
        password: "123456"
      },
      rules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations(["SET_ISLOGIN", "SET_TOKENSTR", "SET_USERNAME"]),
    ...mapActions(["setLogin"]),
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          // localStorage.setItem('ms_username', self.ruleForm.username);
          this._login();
        } else {
          return false;
        }
      });
    },
    _login() {
      let data = {
        CMD: "LogOn",
        userName: this.ruleForm.userName,
        password: this.ruleForm.password
      };
      // {
      //   this.SET_USERNAME(data.userName);
      //   this.setLogin(true);
      //   this.SET_TOKENSTR("yrfghnbfghfhr55");
      //   _.setCookie("User_Login_Token", "yrfghnbfghfhr55");
      //   _.setCookie("User_Login_Name", data.userName);
      //   this.$router.push("/tasks"); //进入主页
      //   return
      // }
      // this.$store.dispatch('setLoadingState', true)
      // console.log('name:'+data.userName+'pass'+data.password);
      api
        .System(data)
        .then(res => {
          if (res.StatusCode === 200) {
            this.SET_USERNAME(data.userName);
            this.setLogin(res.Status);
            this.SET_TOKENSTR(res.Data.Token);
            this.notice = "登录成功！";
            // localStorage.setItem('Sys_Token', res.Data.Token);
            //  var nowDate = new Date();
            // localStorage.setItem('Sys_DateTime', nowDate.toLocaleString());
            _.setCookie("User_Login_Token", res.Data.Token);
            _.setCookie("User_Login_Name", data.userName);
            this.$router.push("/tasks"); //进入主页
            //console.log('push home');
          } else {
            // console.log('发生错误！错误信息：' + res.StatusMessage);
            this.SET_USERNAME("");
            this.SET_ISLOGIN(false);
            this.SET_TOKENSTR("");
            //_.toast('发生错误！错误信息：' + res.StatusMessage);
            this.notice = "登录错误！" + res.DetailedInfo;
            this.$msgbox({
              title: "错误信息",
              type: "error",
              message: "登录错误！请确认登录用户名和密码是否正确。"
            });
          }
        })
        .catch(res => {
          //_.toast('发生错误！错误信息：' + res);
          this.SET_USERNAME("");
          this.SET_ISLOGIN(false);
          this.SET_TOKENSTR("");
          this.notice = "登录错误！错误信息：网络故障或设备关闭。";
          this.$msgbox({
            type: "error",
            message: this.notice
          });
        });
    }
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      tokenStr: "tokenStr"
    })
  }
};
</script>

<style>
.login-wrap {
  /* position: relative;*/
  width: 100%;
  height: 100%;
}

.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -8em;
  text-align: center;
  font-size: 1.875em;
  color: #fff;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18em;
  height: 12em;
  margin: -9.375em 0 0 -11.875em;
  padding: 2.5em;
  border-radius: 0.3125em;
  background: #fff;
}

.el-input__inner {
  height: 46px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 3em;
}
</style>