<template>
  <div :style="{ position: 'relative', width: width, height: height, left: left, top: top, background: backgroundCute, padding: '0px' }"
    oncontextmenu="self.event.returnValue=false" style="border-radius: 0px"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import platform from '@design-any/interface/dist/enums/platform'
import ViewShell from './ViewShell.vue'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../01designerContext/context'

import ViewPageBase from './ViewPageBase'
import { param } from '@design-any/interface/dist/bahaviorEngine'

@DPageAttr('tableCellView')
@Options({})
export default class TableCellView extends ViewPageBase {
  public pageContext: param[] = [{ key: 'tableCurrentRow', name: 'Current Row Data' }]

  public setCurrentRowData(val) {
    this.pageContext.find((o) => o.key === 'tableCurrentRow').val = val
  }

  protected get renderCompArea(): any {
    return this.$el
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
