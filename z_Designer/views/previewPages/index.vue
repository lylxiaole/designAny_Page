<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" style="height:100%" width="100%" top="0px" v-model="windowVisible" :before-close="onClose"
    :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height:100%;width:100%;display:block;position:relative;display:block">
      <div ref="renderArea" style="width:100%;height:100%;overflow:hidden"></div>
      <el-button @click="onClose" style="background:red;position:absolute;left:0px;top:0px">退出预览</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { drawVueOnVirtualDom } from '@common/utils'
import { EnginePage, MobilePagePreview, PCPagePreview } from '@designEngine/index'
import { behaviorList } from '@behaviorEngine/index'
import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType } from '@common/apis/designPage'
@Options({
  components: {
    mobilePagePreview: MobilePagePreview,
    pCPagePreview: PCPagePreview,
    behaviorList: behaviorList
  }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  private allPageSimples: any[] = []
  private openedPageData: any = []
  private currentOpenEngin: EnginePage = null

  mounted() {}
  public async show(appId: string) {
    this.windowVisible = true
    await this.$nextTick()
    this.applicationId = appId
    await this.initApplication()
  }

  // ***********加载数据*************************
  private async initApplication() {
    this.allPageSimples = []
    this.application = await GetApplication(this.applicationId)
    let pageTree = await GetApplicationPages(this.application.id)
    this.organizePages(pageTree)
    let defaultPage = this.allPageSimples.find((o) => o.isDefault === true)
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
  // ************************************
  private async openPage(pageId: string) {
    let cachePageData = this.openedPageData.find((o) => o.id === pageId)
    if (!cachePageData) {
      cachePageData = await GetPageDetail(pageId)
      this.openedPageData.push(cachePageData)
    }
    await this.$nextTick()
    let designLayout: any = typeof EnginePage
    switch (cachePageData.type) {
      case pageType.pcPage:
        designLayout = PCPagePreview
        break
      case pageType.mobilePage:
        designLayout = MobilePagePreview
        break
      default:
        break
    }
    /************************渲染页面 */
    let { virtualDom, vueComp } = drawVueOnVirtualDom(designLayout)
    await (vueComp as any).loadPageByData(pageId, cachePageData.designDetail)
    ;(vueComp as any).name = cachePageData.name
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    this.currentOpenEngin = vueComp as any
    await this.$nextTick()
    $(this.$refs.renderArea).append(virtualDom)
  }

  // ************************************
  private onClose() {
    this.openedPageData = []
    this.currentOpenEngin.destorymethod()
    this.windowVisible = false
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