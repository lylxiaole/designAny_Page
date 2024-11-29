<template>
  <div style="width: 100%; height: 100%" class="flexHorilanLayout verticalAlignCenter"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, EngineLayout, EngineComponent, SaveInfo } from '@design-any/interface/dist/LayoutInterface'
import platform from '@design-any/interface/dist/enums/platform'
import { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview } from '@designEngine/index'

import ViewShell from '../../../designEngine/06viewLayouts/ViewShell.vue'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../../../designEngine/01designerContext/context'
import PageBase from '@common/views/PageBase'
import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'

@Options({})
export default class TableCellView extends PageBase {
  @Prop({ default: () => null })
  public bingdingData: SaveInfo

  @Prop({ default: () => null })
  public rowData: any

  @Prop({ default: () => null })
  public parentLayout: EngineLayout
  // *******************************************
  private currentPageEngine: PCPageDesign
  created() {}
  mounted() {}

  unmounted() {
    if (this.currentPageEngine) {
      this.currentPageEngine.destorymethod()
    }
  }
  // *******************************************
  @Watch('bingdingData', { immediate: true })
  private async onBingdingDataChanged(val: SaveInfo) {
    if (!val) {
      return
    }
    // *****************************
    let designLayout: PCPageDesign = findPageByPaltform(platform.webpc, 'preview')
    let { virtualDom, vueComp } = designDrawDomVirtual(designLayout, true, { applicationContext: applicationContext })
    await (vueComp as PCPageDesign).loadPageByData(val.id, val)
    ;(vueComp as any).name = ''
    ;(vueComp as any).left = 0
    ;(vueComp as any).top = 0
    $(this.$el).append(virtualDom)
    ;(vueComp as PCPageDesign).parentLayout = this.parentLayout
    // *****************************
    this.currentPageEngine = vueComp as PCPageDesign
  }
}
</script>

<style lang="less" scoped>
/deep/ .container {
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0px;
}
</style>
