<template>
  <div class="login-container">
    <!-- *********************************************************************************** -->
    <el-form v-show="isRegister" :rules="requestEmailRoules" ref="requestEmailForm" class="login-form" :model="requestEmailFormData">
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
        <el-input ref="username" v-model="requestEmailFormData.username" placeholder="用户名" name="username" type="text" tabindex="1"
          autocomplete="on" />
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input ref="email" v-model="requestEmailFormData.email" placeholder="邮箱" name="email" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="pwd">
        <span class="svg-container">
          <i class="el-icon-lock" />
        </span>
        <el-input ref="pwd" v-model="requestEmailFormData.pwd" placeholder="密码" name="pwd" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRequestEmail">验证邮箱</el-button>
    </el-form>
    <!-- *********************************************************************************** -->
    <el-form v-show="!isRegister" :rules="checkEmailRoules" ref="checkEmailForm" class="login-form" :model="checkEmailFormData">
      <div class="title-container">
        <h3 class="title">验证码</h3>
      </div>
      <el-form-item prop="checkingCode">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
        <el-input ref="checkingCode" v-model="checkEmailFormData.checkingCode" placeholder="验证码" name="checkingCode" type="text" tabindex="1"
          autocomplete="on" />
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleCheckEmail"> 验证 </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import { requestRegisterUser, CheckRegisterInfo } from '@src/apis/user'
import { ElForm } from 'element-ui/types/form'
import { validUsername } from '@src/utils/validate'
import PageBase from '@src/views/PageBase'

@Component
export default class register extends PageBase {
  private isRegister: boolean = true
  private get requestEmailForm(): ElForm {
    return this.$refs.requestEmailForm as ElForm
  }
  private get checkEmailForm(): ElForm {
    return this.$refs.checkEmailForm as ElForm
  }

  mounted() {}

  private validateUsername(rule, value, callback) {
    if (!validUsername(value)) {
      callback(new Error('请输入合法的用户名'))
    } else {
      callback()
    }
  }
  private validatePassword(rule, value, callback) {
    if (value.length < 3) {
      callback(new Error('密码最少3位'))
    } else {
      callback()
    }
  }

  // ***********************************************************************************
  private requestEmailFormData: any = {
    username: '',
    email: '',
    pwd: ''
  }
  private requestEmailRoules: any = {
    username: [{ required: true, trigger: 'blur', validator: this.validateUsername }],
    email: [{ required: true, trigger: 'blur', validator: this.validatePassword }]
  }

  public async handleRequestEmail(e: Event) {
    try {
      var isvalid = await this.requestEmailForm.validate()
      if (isvalid == false) {
        return
      }
      let checkId = await requestRegisterUser(this.requestEmailFormData)
      this.checkEmailFormData.checkId = checkId
      this.isRegister = false
    } catch (error) {}
  }
  // ***********************************************************************************
  private checkEmailFormData: any = {
    checkId: '',
    checkingCode: ''
  }
  private checkEmailRoules: any = {
    checkingCode: [{ required: true, trigger: 'blur' }]
  }
  public async handleCheckEmail(e: Event) {
    try {
      var isvalid = await this.checkEmailForm.validate()
      if (isvalid == false) {
        return
      }
      let success = await CheckRegisterInfo(this.checkEmailFormData)
      this.$router.push({ path: '/login' })
    } catch (error) {}
  }
}
</script>
 
<style lang="scss">
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
