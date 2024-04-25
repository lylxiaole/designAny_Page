<template>
  <el-row style="height:100%;width:100%">
    <el-row style="height:60px;width:100%">
      <div ref="toobar"></div>
      <toolBar :currentPage="currentShowEngine" :needSave="needSave(currentShowEngine?currentShowEngine.Id:'')" :height="60"
        @onSave="onSaveCurrentPage" @onPreView="onPreView"></toolBar>
    </el-row>
    <el-row style="height:calc(100% - 60px);width:100%;display:block;position:relative;display:block">
      <el-col style="width:250px;height:100%;float:left">
        <pagelist :currentApplication="application" :pageGroups="pageDataList" @onEditPage="onEditPage" @onDeletePage="onDeletePage"></pagelist>
      </el-col>
      <el-col class="pageList" style="width:calc(100% - 500px);height:100%;float:left">
        <el-tabs v-model="currentOpenPageId" @tab-remove="closePage" closable type="border-card" style="width:100%;height:100%">
          <el-tab-pane v-for="page in openPageEngines" :key="page.Id" :label="page.name+(needSave(page.Id)?'*':'')" :name="page.Id">
            <div style="width:100%;height:100%;overflow:auto" :ref="page.Id"></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="width:250px;height:100%;float:left">
        <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="属性" name="first">
            <propertyGrid ref="propertyGrid" :currentPage="currentShowEngine" :currentLayouts="selectedComps" />
          </el-tab-pane>
          <el-tab-pane label="行为" name="second">
            <behaviorList :currentPage="currentShowEngine" />
          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>

    <previewPage ref="previewPage" />
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { pageType, DesignPageDC, GetPageDetail } from '@common/apis/designPage'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import pagelist from './pagelist.vue'
import PropertyGrid from './PropertyGrid.vue'
import toolBar from './toolBar/index.vue'
import { drawVueOnVirtualDom } from '@common/utils'
import { EnginePage, MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview, EngineLayout } from '@designEngine/index'
import { behaviorList } from '@behaviorEngine/index'
import previewPage from '@/views/previewPages/index.vue'

@Options({
  components: {
    pagelist: pagelist,
    toolBar: toolBar,
    propertyGrid: PropertyGrid,
    mobilePageDesign: MobilePageDesign,
    mobilePagePreview: MobilePagePreview,
    pCPageDesign: PCPageDesign,
    pCPagePreview: PCPagePreview,
    behaviorList: behaviorList,
    previewPage: previewPage
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
  //所有打开的页面的引擎
  private openPageEngines: EnginePage[] = []
  //当前设计的页面引擎
  private get currentShowEngine(): EnginePage {
    let findengine = this.openPageEngines.find((o) => o.Id === this.currentOpenPageId)
    return findengine
  }
  // **********是否需要保存*******************************
  private needSave(pageId: string): boolean {
    let page = this.openPageEngines.find((o) => o.Id === pageId)
    if (!page) {
      return false
    }
    let res = this.recursiveNeedSave(page)

    return res
  }
  private recursiveNeedSave(layout: EngineLayout): boolean {
    if (layout.isNeedSave) {
      return true
    }

    for (let index = 0; index < layout.children.length; index++) {
      const element = layout.children[index]
      if (element.isNeedSave) {
        return true
      }
      let res = this.recursiveNeedSave(element)
      if (res) {
        return res
      }
    }
    return false
  }
  // *****************************************
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
    window.console.log('openPage:', pageengine)
    this.currentOpenPageId = page.id
    // **********************
  }
  //关闭页面
  private closePage(pageId: string) {
    window.console.log('closePage:', pageId)
    let engineIndex = this.openPageEngines.findIndex((o) => o.Id === pageId)
    if (engineIndex > -1) {
      ;(this.openPageEngines[engineIndex] as PCPageDesign).closeDesign()
      this.openPageEngines.splice(engineIndex, 1)
    }
  }
  private isHaveOpened(pageId: string) {
    let find = this.openPageEngines.find((o) => o.Id === pageId)
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
    this.openPage(res, vueComp as any)
    await this.$nextTick()
    $(this.$refs[pageId][0]).append(virtualDom)
  }
  private async onDeletePage(pageId: string) {
    this.closePage(pageId)
  }
  // **********顶部操作栏**********************************************************
  private async onSaveCurrentPage(pageId: string) {
    window.console.log('onSaveCurrentPage:', pageId)
    await this.currentShowEngine.save(this.applicationId)
  }

  private async onPreView() {
    ;(this.$refs.previewPage as any).show(this.applicationId)
  }
  // *************右侧属性窗*******************************************************
  private activeName: string = 'second'
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