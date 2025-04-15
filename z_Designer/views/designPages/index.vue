<template>
  <el-row style="height: 100%; width: 100%">
    <el-row style="height: 60px; width: 100%">
      <toolBar :application="application" :currentPage="currentShowEngine" :needSave="needSave(currentShowEngine ? currentShowEngine.Id : '')"
        :height="60" @onSave="onSaveCurrentPage" @onPreView="onPreView" @onSettingBehavior="onSettingBehavior"></toolBar>
    </el-row>
    <el-row style="height: calc(100% - 60px); width: 100%; display: block; position: relative; display: block">
      <el-col style="width: 250px; height: 100%; float: left">
        <pagelist :currentApplication="application" @onEditPage="onEditPage" @onDeletePage="onDeletePage"></pagelist>
      </el-col>
      <el-col class="designArea" style="width: calc(100% - 500px); height: 100%; float: left">
        <el-tabs v-model="currentOpenPageId" @tab-remove="closePage" closable type="card" style="width: 100%; height: 100%">
          <el-tab-pane v-for="page in openPageEngines" :key="page.Id" :label="page.name + (needSave(page.Id) ? '*' : '')" :name="page.Id">
            <div
              style="width: 100%; height: 100%; overflow: scroll; border: 1px solid var(--el-border-color-light); box-sizing: border-box; background-color: #cdcdcd"
              :ref="page.Id"></div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="width: 250px; height: 100%; float: left">
        <propertyGrid ref="propertyGrid" :application="application" :currentPage="currentShowEngine" :currentLayouts="selectedComps" />
      </el-col>
    </el-row>

    <previewPage ref="previewPage" />
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'

import { pageType, DesignPageDC, GetPageDetail, SavePageDetail } from '@common/apis/designPage'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'

import { EnginePage, EngineLayout, SaveInfo } from '@design-any/interface/dist/LayoutInterface'

import { PCPageDesign, PCPagePreview } from '@designEngine/index'
import applicationContext from '@designEngine/01designerContext/context'

import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import * as utils from '@design-any/interface/dist/utils'
import platform from '@design-any/interface/dist/enums/platform'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'

import previewPage from '@/views/previewDialog/index.vue'
import propertyGrid from '@/commonTool/propertyGrid.vue'
import pagelist from '@/commonTool/pagelist.vue'
import toolBar from './tooBar.vue'
@Options({
  components: {
    pagelist: pagelist,
    toolBar: toolBar,
    propertyGrid: propertyGrid,
    pCPageDesign: PCPageDesign,
    pCPagePreview: PCPagePreview,
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
    $(window).on('keydown', this._onKeyDown)
  }
  unmounted() {
    $(window).off('keydown', this._onKeyDown)
  }
  // **********当前应用的页面**********************************************************
  //当前打开进行设计的页面
  private currentOpenPageId: string = null
  //所有打开的页面的引擎
  private openPageEngines: PCPageDesign[] = []
  //当前设计的页面引擎
  private get currentShowEngine(): PCPageDesign {
    let findengine = this.openPageEngines.find((o) => o.Id === this.currentOpenPageId)
    return findengine
  }
  // **********是否需要保存*******************************
  private needSave(pageId: string): boolean {
    let page = this.openPageEngines.find((o) => o.Id === pageId)
    if (!page) {
      return false
    }
    return page.isNeedSave
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
  private openPage(page: DesignPageDC, pageengine: PCPageDesign) {
    let engine = this.openPageEngines.find((o) => o.Id === page.id)
    if (!engine) {
      this.openPageEngines.push(pageengine)
    }
    this.currentOpenPageId = page.id
    // **********************
  }
  //关闭页面
  private async closePage(pageId: string) {
    let engineIndex = this.openPageEngines.findIndex((o) => o.Id === pageId)
    if (engineIndex > -1) {
      ;(this.openPageEngines[engineIndex] as PCPageDesign).closeDesign()
      this.openPageEngines.splice(engineIndex, 1)
    }

    if (this.currentOpenPageId === pageId && this.openPageEngines.length > 0) {
      this.currentOpenPageId = this.openPageEngines[0].Id
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

    let pageData: SaveInfo = null
    if (res.designDetail) {
      let pageDataJson = utils.strUnZip(res.designDetail)
      pageData = utils.deserialize(pageDataJson)
    }

    let designLayout: any = typeof PCPageDesign
    switch (res.type) {
      case pageType.page:
        designLayout = findPageByPaltform('pageDesign')
        break
      case pageType.dialogPage:
        designLayout = findPageByPaltform('dialogPageDesign')
        break
      default:
        break
    }
    /************************渲染页面 */
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, true, { applicationContext: applicationContext })
    await (vueComp as PCPageDesign).loadPageByData(pageId, pageData, platform.page)
    ;(vueComp as any).name = res.name
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    this.openPage(res, vueComp as PCPageDesign)
    this.$forceUpdate()
    await this.$nextTick()
    $(this.$refs[pageId][0]).append(virtualDom)
  }
  private async onDeletePage(pageId: string) {
    this.closePage(pageId)
  }
  // **********顶部操作栏************************************************
  private async onSaveCurrentPage() {
    if (!this.currentShowEngine) {
      return
    }

    let data = await this.currentShowEngine.getSaveData()

    var saveinfoStr = utils.serialize(data)
    saveinfoStr = utils.strZip(saveinfoStr)
    await SavePageDetail({ appId: this.applicationId, id: this.currentShowEngine.Id, designDetail: saveinfoStr } as any)
    this.currentShowEngine.isNeedSave = false
  }
  private onPreView() {
    ;(this.$refs.previewPage as any).show(this.applicationId)
  }
  // *************右侧属性窗**********************************************
  private activeName: string = 'first'
  // ********************************************************************
  private _onKeyDown = (e: any) => {
    var keyCode = e.keyCode || e.which || e.charCode
    var ctrlKey = e.ctrlKey || e.metaKey
    if (keyCode == 83 && ctrlKey == true) {
      e.preventDefault()
      this.onSaveCurrentPage()
    }
  }
}
</script>

<style lang="less" scoped>
.toolbarheader {
  height: 42px;
  padding: 0px;
}

.designcontainer {
  height: calc(100% - 42px);
}

/deep/.designArea > .el-tabs {
  --el-tabs-header-height: 35px;
}
/deep/.designArea .el-tabs__content {
  padding: 0px;
  height: calc(100% - 39px) !important;
  box-sizing: border-box;
}

/deep/.designArea .el-tabs__header {
  margin: 0px !important;
  box-sizing: border-box;
}
</style>
