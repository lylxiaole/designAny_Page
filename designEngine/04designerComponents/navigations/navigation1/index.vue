 
<template>
  <div :class="classObj" class="app-wrapper" style="overflow:hidden">
    <div class="main-container" style="height:100%;overflow:hidden;margin-left:0px">
      <el-row class="toprow">
        <!-- 放logo和文字的 -->
        <el-col :span="4" style="height:60px;line-height: 60px;padding-left: 32px;">

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
// ****************************************
import Sidebar from './sideBar/Sidebar.vue'
import Navbar from './Navbar.vue'
import { PropertyTypeEnum, AppPagesChoose_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

@DCompnentAttr(paltform.webpc, DCompType.system_component, '系统组件', '导航栏模板', 'navigation1', null)
@Options({ components: { Sidebar, Navbar } })
export default class index extends EngineComponent {
  @DPropAttr(new AppPagesChoose_Setting('页面清单', PropertyGroupName.data, true))
  private allPages: any[] = []

  mounted() {
    this.width = '50%'
    this.height = '50%'
    this.background = 'white'
  }
}
</script>



<style scoped>
</style>