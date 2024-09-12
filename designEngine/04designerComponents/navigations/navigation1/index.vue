 
<template>
  <div :class="classObj" class="app-wrapper" style="overflow:hidden">
    <div class="main-container" style="height:100%;overflow:hidden;margin-left:0px">
      <el-row class="toprow">
        <!-- 放logo和文字的 -->
        <el-col :span="4" style="height:60px;line-height: 60px;padding-left: 32px; ">
          <span key="expand" class="sidebar-logo-link" to="/">
            <img :src="currentAppInfo ? currentAppInfo.icon : ''" class="sidebar-logo" />
            <span class="sidebar-title">{{ this.currentAppInfo ? this.currentAppInfo.name : '' }}</span>
          </span>
        </el-col>
        <!-- 小标签 -->
        <el-col :span="13" style="height:60px; ">
          <!-- <el-row style="height:35px"> -->
          <!-- <Breadcrumb style="width:100%;height:35px;overflow-y:hidden" /> -->
          <Navbar style="width:100%;height:60px;" />
          <!-- </el-row> -->
        </el-col>

        <el-col :span="7" style="height:60px; ">
          <TopBar style="width:100%;height:100%;padding-top: 10px;box-sizing: border-box;"></TopBar>
        </el-col>
      </el-row>

      <el-row style="height:calc(100% - 60px);;width:100%;overflow:hidden;padding:10px;box-sizing: border-box;">
        <el-col style="height:100%;width: 240px;overflow:hidden;padding:10px;box-sizing: border-box;">
          <!-- 左边菜单栏 :style="{ width: isCollapse ? '64px' : '240px' }"-->
          <Sidebar />
        </el-col>
        <el-col style="height:100%; width: calc(100% - 240px);overflow:hidden">
          <!-- 中间展示区域 :style="{ width: isCollapse ? 'calc(100% - 64px)' : 'calc(100% - 240px)'-->
          <el-row style="height:100%;padding:10px;box-sizing: border-box;width:100%;">
            <app-main style="width:100%;height:100%;overflow:hidden;display:inherit" />
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompType, DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { getUuid, deepClone } from '@common/utils'
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.webpc, DCompType.system_component, '系统组件', '导航栏1', 'navigation1', null)
@Options({})
export default class index extends EngineComponent {
  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }
}
</script>



<style scoped>
</style>