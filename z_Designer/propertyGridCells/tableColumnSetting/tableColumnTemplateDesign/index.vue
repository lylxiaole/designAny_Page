<template>
  <el-dialog ref="previewPopup" class="columnTemplateSettingDialog" style="height: 100%" width="100%" top="0px" v-model="windowVisible" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block">
      <el-row style="height: 60px; width: 100%">
        <toolBar :application="application" :currentPage="currentShowEngine" :needSave="needSave(currentShowEngine ? currentShowEngine.Id : '')" :height="60" @onSave="onSaveCurrentPage" @onPreView="onPreView" @onSettingBehavior="onSettingBehavior"></toolBar>
      </el-row>
      <el-row style="height: calc(100% - 60px); width: 100%; display: block; position: relative; display: block">
        <el-col class="designArea" style="width: calc(100% - 250px); height: 100%; float: left">
          <div style="width: 100%; height: 100%; overflow: scroll; border: 1px solid var(--el-border-color-light); box-sizing: border-box"></div>
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
import { deepClone } from '@common/utils'

import behaviorSettingDialog from '@/commonTool/behaviorSettingDialog.vue'
import toolBar from './toolBar.vue'
import PropertyGrid from '@/commonTool/PropertyGrid.vue'

@Options({
  components: { toolBar, behaviorSettingDialog, PropertyGrid }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  private onClose() {
    this.windowVisible = false
  }

  public show() {
    this.windowVisible = true
  }

  private needSave(pageId: string): boolean {
    return false
  }

  protected get selectedComps(): EngineLayout[] {
    return []
  }

  private get currentShowEngine(): PCPageDesign {
    return null
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
