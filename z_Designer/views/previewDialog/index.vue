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
            <behaviorList :currentPage="currentOpenEngine" @onBehaviorChanged="onBehaviorChanged" />
          </div>
          <div style="width: calc(100% - 220px); height: 100%; float: left">
            <flowDebugger ref="flowDebugger" @onEditBehavior="onEditBehavior" />
          </div>
        </el-row>
      </el-drawer>
      <!-- ********************************************************************* -->
      <behaviorSetting ref="behaviorSetting" @onSureBehavior="onSureBehavior" />
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

import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType, SavePageDetail } from '@common/apis/designPage'

import behaviorList from '@behaviorEngine/behaviorDebugger/behaviorList.vue'
import flowDebugger from '@behaviorEngine/behaviorDebugger/flowDebugger.vue'
import behaviorSetting from '@behaviorEngine/behaviorList/behaviorSetting.vue'

import { action, actionDetail, behavior, paramType, param } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { deepClone } from '@common/utils'

@Options({
  components: {
    mobilePagePreview: MobilePagePreview,
    pCPagePreview: PCPagePreview,
    behaviorList: behaviorList,
    flowDebugger: flowDebugger,
    behaviorSetting: behaviorSetting
  }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  private allPageSimples: any[] = []
  private currentOpenEngine: EnginePage = null

  mounted() {}
  public async show(appId: string) {
    this.windowVisible = true
    await this.$nextTick()
    this.applicationId = appId
    await this.initApplication()
  }
  // ***********加载数据******************************
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
  // ***********组织全局页面树资源*********************
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
  // ***********打开页面的方法**************************
  private async openPage(pageId: string) {
    /************************渲染页面************************ */
    let { virtualDom, vueComp } = await this.openPage_getVueComp(pageId)
    this.currentOpenEngine = vueComp as any

    this.currentOpenEngine.$once('onLYLLeadToOtherPage', (pageId) => {
      this.currentOpenEngine.destorymethod()
      this.openPage(pageId)
    })

    await this.openPage_drawVueCom(virtualDom, vueComp)
  }

  private async openPage_getVueComp(pageId: string) {
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
    return { virtualDom, vueComp }
  }
  private async openPage_drawVueCom(virtualDom: Element, vueComp: Vue) {
    await this.$nextTick()
    $(this.$refs.renderArea).html('')
    $(this.$refs.renderArea).append(virtualDom)
  }
  // *************关闭预览*****************************
  private onClose() {
    try {
      if (this.currentOpenEngine) {
        this.currentOpenEngine.destorymethod()
      }
    } catch (error) {}
    this.windowVisible = false
  }
  // ************行为调试窗************************************
  private drawerShow: boolean = false
  private onOpenDrawer() {
    this.drawerShow = true
  }
  private onBehaviorChanged(behav: behavior) {
    if (this.$refs.flowDebugger) {
      ;(this.$refs.flowDebugger as flowDebugger).setFlowData(behav, this.currentOpenEngine)
    }
  }

  //重新编辑行为
  private async onEditBehavior(behav: behavior) {
    try {
      let { virtualDom, vueComp } = await this.openPage_getVueComp(this.currentOpenEngine.Id)
      let pageengin = vueComp as EnginePage
      // **************************
      let findOrgain = pageengin.behaviors.find((o) => o.id === behav.id)
      ;(this.$refs.behaviorSetting as behaviorSetting).show(deepClone(findOrgain), this.currentOpenEngine)
      // **************************
      pageengin.destorymethod()
    } catch (error) {}
  }
  // *************行为编辑功能*************************************
  private async onSureBehavior(behav: behavior) {
    let { virtualDom, vueComp } = await this.openPage_getVueComp(this.currentOpenEngine.Id)
    let pageengin = vueComp as EnginePage
    // **************************
    let findbehaviorIndex = pageengin.behaviors.findIndex((o) => o.id === behav.id)
    pageengin.behaviors.splice(findbehaviorIndex, 1, deepClone(behav))
    let data = await pageengin.getSaveData()
    var saveinfoStr = utils.serialize(data)
    saveinfoStr = utils.strZip(saveinfoStr)
    await SavePageDetail({ appId: this.applicationId, id: pageengin.Id, designDetail: saveinfoStr } as any)
    // **************************
    pageengin.destorymethod()
    // **************************
    findbehaviorIndex = this.currentOpenEngine.behaviors.findIndex((o) => o.id === behav.id)
    this.currentOpenEngine.behaviors.splice(findbehaviorIndex, 1, deepClone(behav))
    this.onBehaviorChanged(deepClone(behav))
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
