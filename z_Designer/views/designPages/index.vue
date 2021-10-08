<template>
  <el-row style="height:100%;width:100%">
    <el-row style="height:60px;width:100%">
      <toolBar :currentPage="currentShowEngine" :height="60"></toolBar>
    </el-row>
    <el-row style="height:calc(100% - 60px);width:100%;">
      <el-col style="width:250px;height:100%">
        <pagelist :currentPage="currentShowEngine" :currentApplication="application" :pageGroups="pageDataList" @onEditPage="onEditPage"
          @onDeletePage="onDeletePage"></pagelist>
      </el-col>
      <el-col class="pageList" style="width:calc(100% - 500px);height:100%">
        <el-tabs v-model="currentOpenPageId" closable type="border-card" style="width:100%;height:100%">
          <el-tab-pane v-for="page in openPages" :key="page.id" :label="page.name" :name="page.id">
            <div style="width:100%;height:100%;overflow:auto" :ref="page.id"></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="width:250px;height:100%">
        <propertyGrid />
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { pageType, DesignPageDC, GetPageDetail } from '../../apis/designPage'
import { applicationType, ApplicationDC, GetApplication } from '../../apis/designApplication'

import pagelist from './pagelist.vue'
import PropertyGrid from './PropertyGrid.vue'
import toolBar from './toolBar/index.vue'

import { drawVueOnVirtualDom } from '@src/utils'
import { EnginePage, MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview } from '@src/designEngine'

@Component({
  components: {
    pagelist: pagelist,
    toolBar: toolBar,
    propertyGrid: PropertyGrid,
    mobilePageDesign: MobilePageDesign,
    mobilePagePreview: MobilePagePreview,
    pCPageDesign: PCPageDesign,
    pCPagePreview: PCPagePreview
  }
})
export default class index extends PageBase {
  private applicationId: string = null
  private application: ApplicationDC = null
  private pageDataList: any[] = []
  mounted() {
    this.applicationId = this.$route.query.appId as string
    GetApplication(this.applicationId).then((res) => {
      this.application = res
      // window.console.log('GetApplication:', res)
    })
  }
  // **********页面Tabs**********************************************************
  private currentOpenPageId: string = null
  private openPages: DesignPageDC[] = []
  private openPageEngines: EnginePage[] = []
  private get currentShowEngine(): EnginePage {
    let findengine = this.openPageEngines.find((o) => o.Id === this.currentOpenPageId)
    return findengine
  }
  private openPage(page: DesignPageDC) {
    let findopen = this.openPages.find((o) => o.id === page.id)
    if (!findopen) {
      this.openPages.push(page)
    }
    this.currentOpenPageId = page.id
  }
  private cachePageEngine(pageId: string, pageEngine: EnginePage) {
    let engine = this.openPageEngines.find((o) => o.Id === pageId)
    if (!engine) {
      this.openPageEngines.push(pageEngine)
    }
  }
  private closePage(pageId: string) {
    let engineIndex = this.openPageEngines.findIndex((o) => o.Id === pageId)
    if (engineIndex > -1) {
      this.openPageEngines.splice(engineIndex, 1)
    }
    let pagedataIndex = this.openPages.findIndex((o) => o.id === pageId)
    if (pagedataIndex > -1) {
      this.openPages.splice(pagedataIndex, 1)
    }
  }
  // **********页面列表**********************************************************
  private async onEditPage(pageId: string) {
    let res = await GetPageDetail(pageId)
    this.openPage(res)
    await this.$nextTick()
    let designLayout: EnginePage = null
    switch (res.type) {
      case pageType.pcPage:
        designLayout = new PCPageDesign() as any
        break
      case pageType.pcPage:
        designLayout = new MobilePageDesign() as any
        break
      default:
        break
    }
    /************************渲染页面 */
    let documentFrag = drawVueOnVirtualDom(designLayout)
    await designLayout.$nextTick()
    designLayout.loadPageById(pageId)
    $(this.$refs[pageId][0]).append(documentFrag)
    this.cachePageEngine(pageId, designLayout)
  }
  private async onDeletePage(pageId: string) {
    this.closePage(pageId)
  }
  // **********属性窗**********************************************************
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
  padding: 6px;
  height: calc(100% - 39px);
  box-sizing: border-box;
}
</style>