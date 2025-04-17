<template>
  <div style="overflow: hidden" :style="{
      '--el-menu-bg-color': sidebarBg,
      '--el-menu-text-color': menuColor,
      '--el-menu-hover-bg-color': menuHoverBg,
      '--el-menu-active-color': menuActiveColor,
      '--el-menu-sub-item-height': menuItemHeight + 'px',
      '--el-menu-item-height': menuItemHeight + 'px'
    }">
    <div class="main-container" :style="{ 'background-color': background }" style="height: 100%; overflow: hidden; margin-left: 0px">
      <el-row class="toprow">
        <!-- 放logo和文字的 -->
        <el-col :span="4" :style="{ height: containerHeaderHeight }"></el-col>
        <!-- 小标签 -->
        <el-col :span="13" :style="{ height: containerHeaderHeight }">
          <Navbar :allPages="allOpenedPageTags" :currentPageId="currentPageId" @closeSelectedTag="closeSelectedTag" @selectedTag="selectedTag"
            style="width: 100%; height: 100%" />
        </el-col>

        <el-col :span="7" :style="{ height: containerHeaderHeight }">
          <TopBar style="width: 100%; height: 100%; padding-top: 10px; box-sizing: border-box"></TopBar>
        </el-col>
      </el-row>

      <el-row style="height: calc(100% - 45px); width: 100%; overflow: hidden; box-sizing: border-box">
        <div style="height: 100%; width: 240px; overflow: hidden; box-sizing: border-box; overflow-y: auto">
          <!-- 左边菜单栏 :style="{ width: isCollapse ? '64px' : '240px' }"-->
          <Sidebar :allPages="selectedPages" v-model:activeMenu="currentPageId" @linkClick="linkClick" />
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
import { EngineLayout, EngineComponent, SaveInfo, EnginePage } from '@design-any/interface/dist/LayoutInterface'

import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import platform from '@design-any/interface/dist/enums/platform'
import {
  DPropAttr,
  PropertyGroupName,
  AppPagesChoose_Setting,
  Color_Setting,
  Number_Setting,
  Boolean_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { getUuid, deepClone } from '@design-any/interface/dist/utils'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { pageEmitter } from '@common/utils/eventBus'

// *******************************
import Sidebar from './sideBar/Sidebar.vue'
import Navbar from './Navbar.vue'
import TopBar from './TopBar/index.vue'
// ****************************************
@DCompnentAttr(platform.page, 'Basic', 'Classic navigation bar', 'navigation001', require('../../compIcons/navigationbar.png'))
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

  @DPropAttr(new Number_Setting('ContainerHeaderHeight', PropertyGroupName.style, true, 'px'))
  private containerHeaderHeight: number = 45
  // ******************************************************
  @DPropAttr(new AppPagesChoose_Setting('PageList', PropertyGroupName.data, true))
  private selectedPages: any[] = []
  // ******************************************************
  mounted() {
    this.width = '50%'
    this.height = '50%'
    this.background = 'white'
    pageEmitter.on('onLYLLeadToOtherPage', this.onLYLLeadToOtherPage)
    pageEmitter.on('onPopupPage', this.onPopupPage)
  }

  unmounted() {
    pageEmitter.off('onLYLLeadToOtherPage', this.onLYLLeadToOtherPage)
    pageEmitter.off('onPopupPage', this.onPopupPage)
  }

  private get allOpenedPageTags() {
    return this.roopGetAllPageTags(this.selectedPages)
  }
  private roopGetAllPageTags(pages: any[]) {
    let res = []
    for (let index = 0; index < pages.length; index++) {
      const element = pages[index]
      if (element.type === 'group') {
        let finds = this.roopGetAllPageTags(element.children)
        res = res.concat(finds)
      } else if (this.allPageViews.find((o) => o.Id === element.id)) {
        res.push(element)
      }
    }
    return res
  }

  private allPageViews: EnginePage[] = []
  private currentPageId: string = ''

  private async linkClick(pageId) {
    let cacheView: EnginePage = this.allPageViews.find((o) => o.Id === pageId)

    if (!cacheView) {
      let findpageengine = findPageByPaltform('pageView')
      let { virtualDom, vueComp } = designDrawDomVirtual(findpageengine, false, { applicationContext: this.applicationContext })
      var detail = await this.applicationContext.getPageDetailById(pageId)
      this.allPageViews.push(vueComp as EnginePage)
      await (vueComp as EnginePage).loadPageByData(pageId, detail, platform.page)
      ;(vueComp as any).left = 0
      ;(vueComp as any).top = 0
      await this.$nextTick()
      $(this.$refs.renderArea).html('')
      $(this.$refs.renderArea).append(virtualDom)
      ;(vueComp as EnginePage).completedPageLoad()
    } else {
      let pageView = this.allPageViews.find((o) => o.Id === pageId)
      $(this.$refs.renderArea).html('')
      $(this.$refs.renderArea).append(pageView.$el)
      ;(pageView as EnginePage).completedPageLoad()
    }
    this.currentPageId = pageId
  }

  private closeSelectedTag(page) {
    let findIndex = this.allPageViews.findIndex((o) => o.Id === page.id)
    if (this.currentPageId === page.id) {
      let nextOpenPageIndex = 0

      nextOpenPageIndex = findIndex - 1
      let nextOpenpage = this.allPageViews[nextOpenPageIndex]
      if (nextOpenpage) {
        this.linkClick(nextOpenpage.Id)
      } else {
        $(this.$refs.renderArea).html('')
      }
    }
    this.allPageViews.splice(findIndex, 1)
  }

  private selectedTag(page) {
    this.linkClick(page.id)
  }
  // **************************************************
  private onLYLLeadToOtherPage(pageId: string) {
    this.linkClick(pageId)
  }
  private onPopupPage(pageId: string) {}
}
</script>

<style lang="less" scoped></style>
