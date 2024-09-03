<template>
  <div class="login-container">
    <el-form ref="loginFormControl" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" tabindex="2"
            autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:65%;margin-bottom:30px;" @click.native.prevent="handleLogin">账号密码登录</el-button>
      <el-button type="text" style="width:30%;margin-bottom:30px;" @click.native.prevent="handleLoginRegister">注册</el-button>

    </el-form>

  </div>
</template>


<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Watch } from 'vue-property-decorator'
import { validUsername } from '@common/utils/validate'
import PageBase from '@common/views/PageBase'
import { login } from '@common/apis/user'

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error('请输入合法的用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value.length < 3) {
    callback(new Error('密码最少3位'))
  } else {
    callback()
  }
}

@Options({})
export default class loginPage extends PageBase {
  loginForm: any = {
    username: '',
    password: ''
  }
  loginRules: any = {
    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
  }
  passwordType: string = 'password'
  capsTooltip: boolean = false
  loading: boolean = false
  showDialog: boolean = false
  redirect: string = undefined
  otherQuery: any = {}
  // ******************************************************************
  @Watch('$route', { immediate: true })
  onRouteChanged(route) {
    const query = route.query
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  created() {
    // window.addEventListener('storage', this.afterQRScan)
  }
  mounted() {
    if (this.loginForm.username === '') {
      ;(this.$refs.username as any).focus()
    } else if (this.loginForm.password === '') {
      ;(this.$refs.passwordas as any).focus()
    }
  }
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  }
  // ********************************************************
  checkCapslock(e) {
    const { key } = e
    this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
  }
  async handleLogin() {
    try {
      let valid = await (this.$refs.loginFormControl as any).validate()
      if (!valid) {
        console.log('error submit!!')
        return false
      }
      this.loading = true
      let requdata = { username: this.loginForm.username.trim(), pwd: this.loginForm.password, machineType: 1 }
      let token = await login(requdata)
      this.$store.commit('system/SET_TOKEN', token)

      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }
  handleLoginRegister() {
    this.$router.push({ path: '/register' })
  }
  getOtherQuery(query) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {})
  }
}
</script>
 

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input__wrapper {
    box-shadow: none;
    background-color: transparent;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
