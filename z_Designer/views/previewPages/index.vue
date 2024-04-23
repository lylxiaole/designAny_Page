<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:100%" width="100%" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false"> <el-row
      style="height:100%;width:100%;display:block;position:relative;display:block">
      <div ref="renderArea" style="width:100%;height:100%;overflow:auto"></div>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import pagelist from './pagelist.vue'
import PropertyGrid from './PropertyGrid.vue'
import toolBar from './toolBar/index.vue'
import { drawVueOnVirtualDom } from '@common/utils'
import { EnginePage, MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview, EngineLayout } from '@designEngine/index'
import { behaviorList } from '@behaviorEngine/index'
import {
  DesignPageGroupDC,
  DesignPageDC,
  TreeNodeDC,
  GetApplicationPages,
  ChangeGroupGroup,
  ChangePageGroup,
  AddPage,
  AddGroup,
  GetPageDetail,
  UpdatePageName,
  UpdateGroupName,
  UpdateNodesSort,
  DeletePage,
  DeleteGroup,
  pageType
} from '@common/apis/designPage'
@Options({
  components: {
    mobilePageDesign: MobilePageDesign,
    mobilePagePreview: MobilePagePreview,
    pCPageDesign: PCPageDesign,
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
    debugger
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
    let res = await GetPageDetail(pageId)

    await this.$nextTick()
    let designLayout: any = typeof EnginePage
    switch (res.type) {
      case pageType.pcPage:
        designLayout = PCPageDesign
        break
      case pageType.mobilePage:
        designLayout = MobilePageDesign
        break
      default:
        break
    }
    /************************渲染页面 */
    let { virtualDom, vueComp } = drawVueOnVirtualDom(designLayout)
    await (vueComp as any).loadPageByData(pageId, res.designDetail)
    ;(vueComp as any).name = res.name
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    this.openPage2(res, vueComp as any)
    await this.$nextTick()
    $(this.$refs.renderArea).append(virtualDom)
    this.openedPageData.push(res)
  }

  private openPage2(page: DesignPageDC, pageengine: EnginePage) {
    // let engine = this.openPageEngines.find((o) => o.Id === page.id)
    // if (!engine) {
    //   this.openPageEngines.push(pageengine)
    // }
    // window.console.log('openPage:', pageengine)
    // this.currentOpenPageId = page.id
    // **********************
  }
}
</script>

<style lang="less">
.toolbarheader {
  height: 42px;
  padding: 0px;
}
.designcontainer {
  height: calc(100% - 42px);
}

.pageList > .el-tabs--border-card {
  box-sizing: border-box;
}
.pageList > .el-tabs--border-card > .el-tabs__header {
  height: 39px;
  box-sizing: border-box;
}
.pageList > .el-tabs--border-card > .el-tabs__content {
  padding: 0px;
  height: calc(100% - 39px);
  box-sizing: border-box;
}
</style>