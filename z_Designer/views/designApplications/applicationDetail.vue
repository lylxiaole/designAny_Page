<template>
  <div v-if="currentApplication">
    <div style="box-sizing: border-box; width: 500px; margin: 0px auto">
      <el-row class="detailrow">
        <el-col :span="12" class="flexHorilanLayout" style="text-align: right">应用名称:</el-col>
        <el-col :span="12" class="flexHorilanLayout" style="text-align: left; padding-left: 20px">{{ appName }}</el-col>
      </el-row>
      <el-row class="detailrow">
        <el-col :span="12" class="flexHorilanLayout" style="text-align: right">应用类型:</el-col>
        <el-col :span="12" class="flexHorilanLayout" style="text-align: left; padding-left: 20px">{{ appType }}</el-col>
      </el-row>

      <el-row class="detailrow flexHorilanLayout">
        <el-button type="primary" @click="deleteAppInfo">删除</el-button>
      </el-row>
      <el-row class="detailrow flexHorilanLayout">
        <el-button type="primary" @click="editAppInfo">编辑</el-button>
      </el-row>

      <el-row class="detailrow flexHorilanLayout">
        <el-button type="primary" @click="startDesignApp">设计应用</el-button>
      </el-row>
      <el-row class="detailrow flexHorilanLayout">
        <el-button type="primary" @click="startDesignApp">进入应用</el-button>
      </el-row>
    </div>
    <appEditDialog ref="appEditDialog" @onSure="onAppChanged" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { applicationType } from '@common/apis/designApplication'
import appEditDialog from './appEditDialog.vue'
import { DeleteApplication } from '@common/apis/designApplication'

@Options({ components: { appEditDialog } })
export default class index extends ComponentBase {
  @Prop({ default: null })
  private currentApplication: any

  private get appName() {
    if (!this.currentApplication) {
      return ''
    }
    return this.currentApplication.name
  }
  private get appType() {
    if (!this.currentApplication) {
      return ''
    }
    switch (this.currentApplication.type) {
      case applicationType.dashBoard:
        return '看板'
        break
      case applicationType.report:
        return '报表'
        break
      case applicationType.webSystem:
        return '网页程序'
        break
      case applicationType.H5App:
        return 'H5 App'
        break
      default:
        return ''
        break
    }
  }

  mounted() {}

  private async startDesignApp() {
    this.$router.push({ path: '/designPages', query: { appId: this.currentApplication.id } })
  }
  // ****************************************
  private editAppInfo() {
    ;(this.$refs.appEditDialog as appEditDialog).editAppHandle(this.currentApplication)
  }
  private async deleteAppInfo() {
    await DeleteApplication(this.currentApplication)
    this.onAppChanged()
  }

  @Emit('onAppChanged')
  private onAppChanged() {}
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>
