<template>
  <el-dialog ref="previewPopup" class="columnTemplateSettingDialog" style="height: 80%" width="90%" top="0px" v-model="windowVisible"
    :before-close="onDialogBeforeClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block"
      oncontextmenu="self.event.returnValue=false;self.event.preventDefault()">
      <el-row style="height: 60px; width: 100%">
        <toolBar :currentPage="currentShowEngine" :needSave="needSave(currentShowEngine ? currentShowEngine.Id : '')" :height="60"
          @onSave="onSaveCurrentPage" @onCancel="onClose"></toolBar>
      </el-row>
      <el-row style="height: calc(100% - 60px); width: 100%; display: block; position: relative; display: block">
        <el-col style="width: calc(100% - 250px); height: 100%; float: left">
          <div ref="designArea"
            style="width: 100%; height: 100%; overflow: scroll; border: 1px solid var(--el-border-color-light); box-sizing: border-box; background-color: #cdcdcd">
          </div>
        </el-col>
        <el-col style="width: 250px; height: 100%; float: left">
          <PropertyGrid ref="propertyGrid" :application="application" :currentPage="currentShowEngine" :currentLayouts="selectedComps" />
        </el-col>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, SaveInfo, EngineLayout } from '@design-any/interface/dist/LayoutInterface'

import { TableCellDesign } from '@designEngine/index'
import { designDrawDomVirtual, designDrawDomReal } from '@design-any/interface/dist/utils/drawVueDom'
import platform from '@design-any/interface/dist/enums/platform'
import applicationContext from '@designEngine/01designerContext/context'

import { deepClone, getUuid } from '@common/utils'

import toolBar from './toolBar.vue'
import PropertyGrid from '@/commonTool/propertyGrid.vue'

@Options({
  components: { toolBar, PropertyGrid }
})
export default class index extends PageBase {
  private windowVisible: boolean = false
  private currentShowEngine: TableCellDesign = null

  private get parentPage(): EnginePage {
    if (!this.currentShowEngine) {
      return null
    }
    return this.currentShowEngine.parentLayout as EnginePage
  }

  private columnKey: string = null
  protected get selectedComps(): EngineLayout[] {
    if (this.currentShowEngine) {
      var findchilds = this.currentShowEngine.findSelectedLayoutsRecursion(this.currentShowEngine.children)
      // window.console.log('pppppppppppppppp', findchilds)
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

    if (this.currentShowEngine) {
      this.currentShowEngine.destorymethod()
      this.currentShowEngine = null
    }
  }

  private onDialogBeforeClose() {}

  public async show(columnKey: string, data: SaveInfo, parentLayout: EngineLayout) {
    data = deepClone(data)
    this.windowVisible = true
    this.columnKey = columnKey
    await this.$nextTick()

    if (!data) {
      data = {
        id: getUuid()
      } as any
    }

    let designLayout: TableCellDesign = findPageByPaltform('tableCellDesign')
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, true, { applicationContext: applicationContext })

    await (vueComp as TableCellDesign).loadPageByData(data.id, data, platform.tableCell)
    ;(vueComp as TableCellDesign).name = ''
    ;(vueComp as TableCellDesign).left = 0
    ;(vueComp as TableCellDesign).top = 0
    if (!data.properties) {
      ;(vueComp as TableCellDesign).width = '200px'
      ;(vueComp as TableCellDesign).height = '80px'
    }
    ;(vueComp as TableCellDesign).parentLayout = parentLayout
    this.currentShowEngine = vueComp as TableCellDesign

    $(this.$refs.designArea).append(virtualDom)
    await this.$nextTick()
    //Scale
    let scale = $(this.$refs.designArea).width() / $(this.currentShowEngine.$el).width()
    this.currentShowEngine.scaleSize(scale)
  }

  private needSave(pageId: string): boolean {
    return false
  }
  // ***********************************************
  private async onSaveCurrentPage() {
    let data = await this.currentShowEngine.getSaveData()
    this.onSure(this.columnKey, data)
    this.currentShowEngine.destorymethod()
    this.windowVisible = false
  }

  @Emit('onSure')
  private async onSure(columnKey: string, data: SaveInfo) {}
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
