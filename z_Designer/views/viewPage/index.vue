<template>
  <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block">
    <div ref="renderArea" style="width: 100%; height: 100%; overflow: hidden"></div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, SaveInfo } from '@design-any/interface/dist/LayoutInterface'
import * as utils from '@design-any/interface/dist/utils'

import { PCPagePreview, DialogPageDesign, DialogPageView } from '@designEngine/index'

import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import platform from '@design-any/interface/dist/enums/platform'
import applicationContext from '@designEngine/01designerContext/context'

import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType } from '@common/apis/designPage'
import { pageEmitter } from '@common/utils/eventBus'
import { valHooks } from 'jquery'

@Options({
  components: {
    pCPagePreview: PCPagePreview
  }
})
export default class index extends PageBase {
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  private allPageSimples: any[] = []
  private openedPageData: any[] = []
  private currentOpenEngin: EnginePage = null

  mounted() {
    this.applicationId = this.$route.query.appId as string
    this.initApplication().then(() => {
      pageEmitter.on('onLYLLeadToOtherPage', this.onLYLLeadToOtherPage)
      pageEmitter.on('onPopupPage', this.onPopupPage)
    })
  }
  // ***********加载数据*************************
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
  // ***********打开页面的方法**************************
  private async openPage(pageId: string, inparamVal: any) {
    /************************渲染页面*******************/
    let { virtualDom, vueComp } = await this.openPage_getVueComp(pageId)
    ;(vueComp as PCPagePreview).setPageInParam(inparamVal)
    this.currentOpenEngin = vueComp as any
    await this.openPage_drawVueCom(virtualDom, vueComp)
  }
  private async openPage_getVueComp(pageId: string) {
    let cachePageData = this.openedPageData.find((o) => o.id === pageId)
    if (!cachePageData) {
      cachePageData = await GetPageDetail(pageId)

      if (cachePageData.designDetail) {
        let pageDataJson = utils.strUnZip(cachePageData.designDetail)
        cachePageData.designDetail = utils.deserialize(pageDataJson)
      }
      this.openedPageData.push(cachePageData)
    }

    await this.$nextTick()
    let designLayout: EnginePage = null
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
  // ************页面事件处理---来自行为*********************************
  private onLYLLeadToOtherPage(pageId: string, inparamVal: any) {
    if (this.currentOpenEngin) {
      this.currentOpenEngin.destorymethod()
      this.currentOpenEngin = null
      this.openPage(pageId, inparamVal)
    }
  }
  private async onPopupPage(pageId: string, inparamVal: any) {
    let { virtualDom, vueComp } = await this.openPage_getVueComp(pageId)
    ;(vueComp as PCPagePreview).setPageInParam(inparamVal)
    //
    let page = vueComp as DialogPageView
    page.parentEngine = this.currentOpenEngin
    this.currentOpenEngin = vueComp as any

    //
    $(this.$refs.renderArea).append(virtualDom)
    //
    page.$on('onLYLDestroyed', () => {
      this.currentOpenEngin = page.parentEngine
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
</style>
