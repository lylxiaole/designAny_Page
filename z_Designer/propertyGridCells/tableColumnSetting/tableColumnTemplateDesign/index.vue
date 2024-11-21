<template>
  <el-dialog ref="previewPopup" class="columnTemplateSettingDialog" style="height: 100%" width="100%" top="0px" v-model="windowVisible" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block" oncontextmenu="self.event.returnValue=false;self.event.preventDefault()">
      <el-row style="height: 60px; width: 100%">
        <toolBar :currentPage="currentShowEngine" :needSave="needSave(currentShowEngine ? currentShowEngine.Id : '')" :height="60" @onSave="onSaveCurrentPage" @onPreView="onPreView" @onSettingBehavior="onSettingBehavior"></toolBar>
      </el-row>
      <el-row style="height: calc(100% - 60px); width: 100%; display: block; position: relative; display: block">
        <el-col style="width: calc(100% - 250px); height: 100%; float: left">
          <div ref="designArea" style="width: 100%; height: 100%; overflow: scroll; border: 1px solid var(--el-border-color-light); box-sizing: border-box; background-color: #cdcdcd"></div>
        </el-col>
        <el-col style="width: 250px; height: 100%; float: left">
          <PropertyGrid ref="propertyGrid" :application="application" :currentPage="currentShowEngine" :currentLayouts="selectedComps" />
        </el-col>
      </el-row>

      <behaviorSettingDialog ref="behaviorSettingDialog" />
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, SaveInfo, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import * as utils from '@design-any/interface/dist/utils'

import { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview } from '@designEngine/index'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import platform from '@design-any/interface/dist/enums/platform'
import applicationContext from '@designEngine/01designerContext/context'
import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType, SavePageDetail } from '@common/apis/designPage'
import behaviorList from '@behaviorEngine/behaviorDebugger/behaviorList.vue'
import flowDebugger from '@behaviorEngine/behaviorDebugger/flowDebugger.vue'
import behaviorSetting from '@behaviorEngine/behaviorList/behaviorSetting.vue'
import { action, actionDetail, behavior, paramType, param } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { deepClone, getUuid } from '@common/utils'

import behaviorSettingDialog from '@/commonTool/behaviorSettingDialog.vue'
import toolBar from './toolBar.vue'
import PropertyGrid from '@/commonTool/propertyGrid.vue'

@Options({
  components: { toolBar, behaviorSettingDialog, PropertyGrid }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  private currentShowEngine: PCPageDesign = null
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

  private onClose() {
    this.windowVisible = false
  }

  public async show(data: SaveInfo) {
    this.windowVisible = true
    await this.$nextTick()

    if (!data) {
      data = {
        id: getUuid()
      } as any
    }

    let designLayout: PCPageDesign = findPageByPaltform(platform.webpc, 'design')
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, true, { applicationContext: applicationContext })
    await (vueComp as PCPageDesign).loadPageByData(data.id, data)
    ;(vueComp as PCPageDesign).name = ''
    ;(vueComp as PCPageDesign).left = 0
    ;(vueComp as PCPageDesign).top = 0
    if (!data.properties) {
      ;(vueComp as PCPageDesign).width = '100px'
      ;(vueComp as PCPageDesign).height = '60px'
    }

    this.currentShowEngine = vueComp as PCPageDesign
    $(this.$refs.designArea).append(virtualDom)
  }

  private needSave(pageId: string): boolean {
    return false
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
