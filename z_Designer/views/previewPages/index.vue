<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" style="height: 100%" width="100%" top="0px" v-model="windowVisible" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block">
      <!-- ********************************************************************* -->
      <el-button @click="onClose" style="background: red; position: absolute; right: 0px; top: 0px; z-index: 99; color: white">Exit</el-button>
      <div ref="renderArea" style="width: 100%; height: 100%; overflow: hidden"></div>
      <!-- ********************************************************************* -->
      <el-button style="width: 80px; background: green; position: absolute; right: 0px; top: 48%; z-index: 99; color: white" @click="onOpenDrawer">Behaviors</el-button>
      <el-drawer v-model="drawerShow" title="Behavior Debugger" custom-class="lyldrawer" size="90%" :with-header="true">
        <el-row style="width: 100%; height: 100%">
          <div style="width: 220px; height: 100%; float: left">
            <behaviorList :currentPage="currentOpenEngin" @onBehaviorChanged="onBehaviorChanged" />
          </div>
          <div style="width: calc(100% - 220px); height: 100%; float: left">
            <flowDebugger ref="flowDebugger" />
          </div>
        </el-row>
      </el-drawer>
      <!-- ********************************************************************* -->
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'

import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'

import { EnginePage, SaveInfo } from '@design-any/interface/dist/LayoutInterface'
import * as utils from '@design-any/interface/dist/utils'

import { MobilePagePreview, PCPagePreview } from '@designEngine/index'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import paltform from '@design-any/interface/dist/enums/paltform'
import applicationContext from '@designEngine/01designerContext/context'

import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType } from '@common/apis/designPage'

import behaviorList from '@behaviorEngine/behaviorDebugger/behaviorList.vue'
import flowDebugger from '@behaviorEngine/behaviorDebugger/flowDebugger.vue'
import { action, actionDetail, behavior, paramType, param } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: {
    mobilePagePreview: MobilePagePreview,
    pCPagePreview: PCPagePreview,
    behaviorList: behaviorList,
    flowDebugger: flowDebugger
  }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  private allPageSimples: any[] = []
  private currentOpenEngin: EnginePage = null

  mounted() {}
  public async show(appId: string) {
    this.windowVisible = true
    await this.$nextTick()
    this.applicationId = appId
    await this.initApplication()
  }
  // ***********加载数据**********************************************************
  private async initApplication() {
    this.allPageSimples = []
    this.application = await GetApplication(this.applicationId)
    let pageTree = await GetApplicationPages(this.application.id)
    this.organizePages(pageTree)
    let defaultPage = this.allPageSimples.find((o) => o.isDefault === true)
    if (!defaultPage) {
      alert('找不到默认页，需要先设定一个默认页面。')
    }
    this.openPage(defaultPage.id)
  }
  private organizePages(pageTree: any[]) {
    for (let index = 0; index < pageTree.length; index++) {
      const treenode = pageTree[index]
      if (treenode.type === 'page') {
        this.allPageSimples.push(treenode)
      }
      if (treenode.children) {
        this.organizePages(treenode.children)
      }
    }
  }
  // *****************************************************************************
  private async openPage(pageId: string) {
    let cachePageData = await GetPageDetail(pageId)
    if (cachePageData.designDetail) {
      let pageDataJson = utils.strUnZip(cachePageData.designDetail)
      cachePageData.designDetail = utils.deserialize(pageDataJson)
    }

    await this.$nextTick()
    let designLayout: EnginePage = null
    switch (cachePageData.type) {
      case pageType.pcPage:
        designLayout = findPageByPaltform(paltform.webpc, 'preview')
        break
      case pageType.mobilePage:
        designLayout = findPageByPaltform(paltform.webapp, 'preview')
        break
      default:
        break
    }
    /************************渲染页面************************ */
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, false, { applicationContext: applicationContext })
    await (vueComp as any).loadPageByData(pageId, cachePageData.designDetail)
    ;(vueComp as any).name = cachePageData.name
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0

    this.currentOpenEngin = vueComp as any
    await this.$nextTick()
    $(this.$refs.renderArea).html('')
    $(this.$refs.renderArea).append(virtualDom)

    this.currentOpenEngin.$once('onLYLLeadToOtherPage', (pageId) => {
      this.currentOpenEngin.destorymethod()
      this.openPage(pageId)
    })
  }
  // *****************************************************************************
  private onClose() {
    try {
      this.openedPageData = []
      if (this.currentOpenEngin) {
        this.currentOpenEngin.destorymethod()
      }
    } catch (error) {}
    this.windowVisible = false
  }
  // *****************************************************************************
  private drawerShow: boolean = true
  private onOpenDrawer() {
    this.drawerShow = true
  }

  private onBehaviorChanged(behav: behavior) {
    ;(this.$refs.flowDebugger as flowDebugger).setFlowData(behav, this.currentOpenEngin)
  }
}
</script>

<style lang="less">
.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}

.el-drawer {
  .el-drawer__header {
    background-color: green;
    margin-bottom: 0px;
    height: 50px;
    .el-drawer__title {
      color: white;
    }
  }
}
</style>
