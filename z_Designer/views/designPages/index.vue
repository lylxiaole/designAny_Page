<template>
  <el-row style="height:100%;width:100%">
    <el-row style="height:60px;width:100%">
      <div ref="toobar"></div>
      <toolBar :currentPage="currentShowEngine" :height="60" @onSave="onSaveCurrentPage"></toolBar>
    </el-row>
    <el-row style="height:calc(100% - 60px);width:100%;">
      <el-col :span="4" style="width:250px;height:100%">
        <pagelist :currentPage="currentShowEngine" :currentApplication="application" :pageGroups="pageDataList" @onEditPage="onEditPage"
          @onDeletePage="onDeletePage"></pagelist>
      </el-col>
      <el-col :span="16" class="pageList" style="width:calc(100% - 500px);height:100%">
        <el-tabs v-model="currentOpenPageId" @tab-remove="closePage" closable type="border-card" style="width:100%;height:100%">
          <el-tab-pane v-for="page in openPages" :key="page.id" :label="page.name" :name="page.id">
            <div style="width:100%;height:100%;overflow:auto" :ref="page.id"></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="4" style="width:250px;height:100%">
        <propertyGrid :currentPage="currentShowEngine" :currentLayouts="selectedComps" />
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
 
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { pageType, DesignPageDC, GetPageDetail } from '@src/apis/designPage'
import { applicationType, ApplicationDC, GetApplication } from '@src/apis/designApplication'
import pagelist from './pagelist.vue'
import PropertyGrid from './PropertyGrid.vue'
import toolBar from './toolBar/index.vue'

import { drawVueOnVirtualDom } from '@src/utils'
import { EnginePage, MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview, EngineLayout } from '@src/designEngine'
@Options({
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
  // **********当前应用**********************************************************
  private applicationId: string = null
  private application: ApplicationDC = null
  mounted() {
    this.applicationId = this.$route.query.appId as string
    GetApplication(this.applicationId).then((res) => {
      this.application = res
    })
  }
  // **********当前应用的页面**********************************************************
  //当前的页面列表
  private pageDataList: any[] = []
  //当前打开进行设计的页面
  private currentOpenPageId: string = null
  //所有打开的页面的数据
  private openPages: DesignPageDC[] = []
  //所有打开的页面的引擎
  private openPageEngines: EnginePage[] = []
  //当前设计的页面引擎
  private get currentShowEngine(): EnginePage {
    let findengine = this.openPageEngines.find((o) => o.Id === this.currentOpenPageId)
    return findengine
  }
  //当前选择的组件列表
  protected get selectedComps(): EngineLayout[] {
    if (this.currentShowEngine) {
      var findchilds = this.currentShowEngine.findSelectedLayoutsRecursion(this.currentShowEngine.children)
      // window.console.log('pppppppppppppppp',findchilds)
      if (findchilds.length > 0) {
        return findchilds
      } else {
        return [this.currentShowEngine]
      }
    } else {
      return null
    }
  }
  //打开新页面
  private openPage(page: DesignPageDC, pageengine: EnginePage) {
    let engine = this.openPageEngines.find((o) => o.Id === page.id)
    if (!engine) {
      this.openPageEngines.push(pageengine)
    }

    let findopen = this.openPages.find((o) => o.id === page.id)
    if (!findopen) {
      this.openPages.push(page)
    }
    window.console.log('openPage:', page.id)
    this.currentOpenPageId = page.id
  }
  //关闭页面
  private closePage(pageId: string) {
    window.console.log('closePage:', pageId)
    let engineIndex = this.openPageEngines.findIndex((o) => o.Id === pageId)
    if (engineIndex > -1) {
      this.openPageEngines[engineIndex].$destroy()
      this.openPageEngines.splice(engineIndex, 1)
    }
    let pagedataIndex = this.openPages.findIndex((o) => o.id === pageId)
    if (pagedataIndex > -1) {
      this.openPages.splice(pagedataIndex, 1)
    }
  }
  private isHaveOpened(pageId: string) {
    let find = this.openPages.find((o) => o.id === pageId)
    if (find) {
      return true
    } else {
      return false
    }
  }
  // **********左侧页面列表操作**************************************************
  private async onEditPage(pageId: string) {
    if (this.isHaveOpened(pageId)) {
      this.currentOpenPageId = pageId
      return
    }

    let res = await GetPageDetail(pageId)
    await this.$nextTick()
    let designLayout: EnginePage = null
    switch (res.type) {
      case pageType.pcPage:
        designLayout =  PCPageDesign
        break
      case pageType.mobilePage:
        designLayout =  MobilePageDesign
        break
      default:
        break
    }
    /************************渲染页面 */
    let drawer = drawVueOnVirtualDom(designLayout) 
    await drawer.vueComp.loadPageByData(pageId, res.designDetail)
    await this.$nextTick()
    this.openPage(res, drawer.vueComp)
    await this.$nextTick()
    $(this.$refs[pageId][0]).append(drawer.virtualDom)
  }
  private async onDeletePage(pageId: string) {
    this.closePage(pageId)
  }

  // **********顶部操作栏**********************************************************
  private async onSaveCurrentPage(pageId: string) {
    window.console.log('onSaveCurrentPage:', pageId)
    await this.currentShowEngine.save(this.applicationId)
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