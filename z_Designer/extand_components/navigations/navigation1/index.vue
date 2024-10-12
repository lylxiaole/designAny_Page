<template>
  <div style="overflow: hidden">
    <div class="main-container" style="height: 100%; overflow: hidden; margin-left: 0px">
      <el-row class="toprow">
        <!-- 放logo和文字的 -->
        <el-col :span="4" style="height: 60px; line-height: 60px; padding-left: 32px"></el-col>
        <!-- 小标签 -->
        <el-col :span="13" style="height: 60px">
          <Navbar style="width: 100%; height: 60px" />
        </el-col>

        <el-col :span="7" style="height: 60px">
          <TopBar style="width: 100%; height: 100%; padding-top: 10px; box-sizing: border-box"></TopBar>
        </el-col>
      </el-row>

      <el-row style="height: calc(100% - 60px); width: 100%; overflow: hidden; padding: 10px; box-sizing: border-box">
        <div style="height: 100%; width: 240px; overflow: hidden; padding: 10px; box-sizing: border-box; overflow-y: auto">
          <!-- 左边菜单栏 :style="{ width: isCollapse ? '64px' : '240px' }"-->
          <Sidebar
            :allPages="selectedPages"
            @linkClick="linkClick"
            :style="{ '--el-menu-bg-color': sidebarBg, '--el-menu-text-color': menuColor, '--el-menu-hover-bg-color': menuHoverBg, '--el-menu-active-color': menuActiveColor, '--el-menu-sub-item-height': menuItemHeight + 'px', '--el-menu-item-height': menuItemHeight + 'px' }"
          />
        </div>
        <!-- **********页面显示区域****************** -->
        <div style="height: 100%; width: calc(100% - 240px); overflow: hidden" ref="renderArea"></div>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
// *******************************
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import paltform from '@design-any/interface/dist/enums/paltform'
import { DPropAttr, PropertyGroupName, AppPagesChoose_Setting, Color_Setting, Number_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { getUuid, deepClone } from '@design-any/interface/dist/utils'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'

import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'

// *******************************
import Sidebar from './sideBar/Sidebar.vue'
import Navbar from './Navbar.vue'
import TopBar from './TopBar/index.vue'
// ****************************************
@DCompnentAttr(paltform.webpc, 'Basic', 'Classic navigation bar', 'navigation001', require('../../compIcons/navigationbar.png'))
@Options({ components: { Sidebar, Navbar, TopBar } })
export default class index extends EngineComponent {
  @DPropAttr(new Color_Setting('SidebarBg', PropertyGroupName.style, true))
  private sidebarBg: string = '#000000'

  @DPropAttr(new Color_Setting('MenuColor', PropertyGroupName.style, true))
  private menuColor: string = 'white'

  @DPropAttr(new Color_Setting('MenuHoverBg', PropertyGroupName.style, true))
  private menuHoverBg: string = 'gray'

  @DPropAttr(new Color_Setting('MenuActiveColor', PropertyGroupName.style, true))
  private menuActiveColor: string = 'gray'

  @DPropAttr(new Number_Setting('MenuItemHeight', PropertyGroupName.style, true, 'px'))
  private menuItemHeight: number = 44

  @DPropAttr(new AppPagesChoose_Setting('PageList', PropertyGroupName.data, true))
  private selectedPages: any[] = []
  mounted() {
    this.width = '50%'
    this.height = '50%'
    this.background = 'white'
  }

  private async linkClick(pageId) {
    let detail = await this.applicationContext.getPageDetailById(pageId)
    let findpageengine = findPageByPaltform(paltform.webpc, 'preview')

    let { virtualDom, vueComp } = designDrawDomVirtual(findpageengine, false, { applicationContext: this.applicationContext })
    await (vueComp as any).loadPageByData(pageId, detail)
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    await this.$nextTick()
    $(this.$refs.renderArea).html('')
    $(this.$refs.renderArea).append(virtualDom)
    ;(vueComp as any).$once('onLYLLeadToOtherPage', (pageId) => {
      // this.currentOpenEngin.destorymethod()
      // this.openPage(pageId)
    })
  }
  // **************************************************
}
</script>

<style lang="less" scoped></style>
