<template>
  <div v-if="currentApplication">
    <div style="box-sizing:border-box;width:500px;margin:0px auto">
      <el-row class="detailrow">
        <el-col :span="12" class="middleAlign" style="text-align:right">应用名称:</el-col>
        <el-col :span="12" class="middleAlign" style="text-align:left;padding-left:20px">{{appName}}</el-col>
      </el-row>
      <el-row class="detailrow">
        <el-col :span="12" class="middleAlign" style="text-align:right">应用类型:</el-col>
        <el-col :span="12" class="middleAlign" style="text-align:left;padding-left:20px">{{appType}}</el-col>
      </el-row>
      <el-row class="detailrow middleAlign">
        <el-button type="primary">设计应用</el-button>
      </el-row>
      <el-row class="detailrow middleAlign">
        <el-button type="primary">进入应用</el-button>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { applicationType } from '@src/apis/designApplication'

@Component
export default class index extends PageBase {
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
        return '业务系统'
        break
      default:
        return ''
        break
    }
  }

  mounted() {}
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>