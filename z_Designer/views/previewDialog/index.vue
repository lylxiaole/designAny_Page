<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" style="height: 100%;padding:0px" width="100%" top="0px" v-model="windowVisible"
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block">
      <!-- ********************************************************************* -->
      <div style="height:50px;z-index:999999;position:relative;background:#cdcdcd" class="verticalAlignCenter flexHorilanLayout">
        <el-button style="width: 80px; background: green;color: white" @click.prevent="onOpenDrawer">{{$t('opts.behaviors')}}</el-button>
        <el-button @click.prevent="onClose" style="background: red;color: white">{{$t('opts.exit')}}</el-button>
      </div>
      <!-- ********************************************************************* -->
      <div ref="renderArea" style="width: 100%; height: calc(100% - 50px); overflow: hidden;position:absolute;top:50px"></div>
      <!-- ********************************************************************* -->
      <el-drawer v-model="drawerShow" :title="$t('tip.BehaviorDebugger')" custom-class="lyldrawer" size="90%"
        style="height: calc(100% - 50px);top:50px" :with-header="true">
        <behaviorDebugger ref="behaviorDebugger" :currentPage="currentOpenEngine" @onEditBehavior="onEditBehavior" />
      </el-drawer>
      <!-- ********************************************************************* -->
      <behaviorDesigner ref="behaviorDesigner" @onSureBehavior="onSureBehavior" />
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication, applicationType } from '@common/apis/designApplication'

import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'

import { EngineContainer, EnginePage, SaveInfo } from '@design-any/interface/dist/LayoutInterface'
import * as utils from '@design-any/interface/dist/utils'

import { PCPagePreview, DialogPageDesign, DialogPageView } from '@designEngine/index'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import platform from '@design-any/interface/dist/enums/platform'
import applicationContext from '@designEngine/01designerContext/context'

import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType, SavePageDetail } from '@common/apis/designPage'

import behaviorDesigner from '@behaviorEngine/behaviorDesigner/behaviorDesigner.vue'
import behaviorDebugger from '@behaviorEngine/behaviorDebugger/behaviorDebugger.vue'

import { action, actionDetail, behavior, paramType, param } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { deepClone } from '@common/utils'
import { pageEmitter } from '@common/utils/eventBus'

@Options({
  components: {
    pCPagePreview: PCPagePreview,
    behaviorDebugger: behaviorDebugger,
    behaviorDesigner: behaviorDesigner
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

    pageEmitter.on('onLYLLeadToOtherPage', this.onLYLLeadToOtherPage)
    pageEmitter.on('onPopupPage', this.onPopupPage)
  }
  // ***********初始化应用数据******************************
  private async initApplication() {
    this.allPageSimples = []
    this.application = await GetApplication(this.applicationId)
    let pageTree = await GetApplicationPages(this.application.id)
    this.organizePages(pageTree)
    let defaultPage = this.allPageSimples.find((o) => o.isDefault === true)
    if (!defaultPage) {
      alert('找不到默认页，需要先设定一个默认页面。')
    }
    this.openPage(defaultPage.id, null)
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
  // ***********打开页面的方法**************************
  private async openPage(pageId: string, inparamVal: any) {
    let { virtualDom, vueComp } = await this.openPage_getVueComp(pageId)
    ;(vueComp as PCPagePreview).setPageInParam(inparamVal)

    await this.openPage_drawVueCom(virtualDom, vueComp)
    ;(vueComp as PCPagePreview).completedPageLoad()
    this.currentOpenEngine = vueComp as any
  }
  /************************渲染页面*******************/
  private async openPage_getVueComp(pageId: string) {
    let cachePageData = await GetPageDetail(pageId)

    if (cachePageData.designDetail) {
      let pageDataJson = utils.strUnZip(cachePageData.designDetail)
      cachePageData.designDetail = utils.deserialize(pageDataJson)
    }
    let designLayout: EnginePage = null
    await this.$nextTick()
    let currentPaltform: platform = platform.page
    switch (cachePageData.type) {
      case pageType.page:
        designLayout = findPageByPaltform('pageView')
        break
      case pageType.dialogPage:
        designLayout = findPageByPaltform('dialogPageView')
        break
      default:
        break
    }
    /************************渲染页面************************ */
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, false, { applicationContext: applicationContext })
    await (vueComp as any).loadPageByData(pageId, cachePageData.designDetail, currentPaltform)
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
    pageEmitter.off('onLYLLeadToOtherPage', this.onLYLLeadToOtherPage)
    pageEmitter.off('onPopupPage', this.onPopupPage)
    this.windowVisible = false
  }
  // ************行为调试窗***************************
  private drawerShow: boolean = false
  private onOpenDrawer() {
    this.drawerShow = true
  }
  // *************重新编辑行为***********************
  private async onEditBehavior(behav: behavior, container: EnginePage) {
    try {
      let { virtualDom, vueComp } = await this.openPage_getVueComp(this.currentOpenEngine.Id)
      let pageengin = vueComp as EnginePage
      // **************************
      let findOrgain = pageengin.behaviors.find((o) => o.id === behav.id)
      ;(this.$refs.behaviorDesigner as behaviorDesigner).show(deepClone(findOrgain), container, behav.platform)
      // **************************
      pageengin.destorymethod()
    } catch (error) {}
  }
  // *************行为编辑功能************************
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

    if (this.$refs.behaviorDebugger) {
      ;(this.$refs.behaviorDebugger as behaviorDebugger).setFlowData(deepClone(behav), this.currentOpenEngine)
    }
  }
  // ************页面事件处理---来自行为****************
  private onLYLLeadToOtherPage(pageId: string, inparamVal: any) {
    if (this.currentOpenEngine) {
      this.currentOpenEngine.destorymethod()
      this.currentOpenEngine = null
      this.openPage(pageId, inparamVal)
    }
  }
  private async onPopupPage(pageId: string, inparamVal: any) {
    let { virtualDom, vueComp } = await this.openPage_getVueComp(pageId)
    ;(vueComp as PCPagePreview).setPageInParam(inparamVal)
    //
    let page = vueComp as DialogPageView
    page.parentEngine = this.currentOpenEngine
    //
    $(this.$refs.renderArea).append(virtualDom)
    ;(vueComp as PCPagePreview).completedPageLoad()
    //
    this.currentOpenEngine = vueComp as any
    //
    page.$on('onLYLDestroyed', () => {
      this.currentOpenEngine = page.parentEngine
    })
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
