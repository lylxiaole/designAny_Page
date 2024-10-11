<template>
  <div v-if="currentApplication">
    <div style="box-sizing: border-box; width: 500px; margin: 0px auto">
      <el-row class="detailrow">
        <el-col :span="12" class="flexHorilanLayout" style="text-align: right">{{ $t('menu.appName') }}:</el-col>
        <el-col :span="12" class="flexHorilanLayout" style="text-align: left; padding-left: 20px">{{ appName }}</el-col>
      </el-row>
      <el-row class="detailrow">
        <el-col :span="12" class="flexHorilanLayout" style="text-align: right">{{ $t('menu.appType') }}:</el-col>
        <el-col :span="12" class="flexHorilanLayout" style="text-align: left; padding-left: 20px">{{ appType }}</el-col>
      </el-row>

      <el-row class="detailrow flexHorilanLayout">
        <el-button style="width: 140px" type="primary" @click="startDesignApp">{{ $t('opts.designApp') }}</el-button>
      </el-row>
      <el-row class="detailrow flexHorilanLayout">
        <el-button style="width: 140px" type="primary" @click="startViewApp">{{ $t('opts.viewApp') }}</el-button>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { applicationType } from '@common/apis/designApplication'
import appEditDialog from './appEditDialog.vue'
import { DeleteApplication } from '@common/apis/designApplication'
import { ElMessage, ElMessageBox } from 'element-plus'

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
        return 'PC App'
        break
      case applicationType.H5App:
        return 'Mobile App'
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
  private startViewApp() {
    this.$router.push({ path: '/viewPages', query: { appId: this.currentApplication.id } })
  }
  // ****************************************
  private editAppInfo() {
    ;(this.$refs.appEditDialog as appEditDialog).editAppHandle(this.currentApplication)
  }
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>
