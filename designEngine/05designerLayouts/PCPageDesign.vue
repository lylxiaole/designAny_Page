<template>
  <div :style="{ position: 'relative', width: width, height: height, left: left, top: top, background: backgroundCute, padding: '0px' }"
    oncontextmenu="self.event.returnValue=false" class="container" style="border-radius: 0px; box-sizing: border-box"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { deepClone, getUuid } from '@common/utils'
import DesignShell from './DesignShell.vue'
import DesignEvents, { DragItemData, DragItemTypeEnum } from './DesignEvents'

import { EnginePage, EngineLayout, EngineComponent, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import { findSystemCompByCode } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import platform from '@design-any/interface/dist/enums/platform'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../01designerContext/context'

import DesignPageBase from './DesignPageBase'
import { param, paramType } from '@design-any/interface/dist/bahaviorEngine/behavior'

@DPageAttr('pageDesign')
@Options({})
export default class PCPageDesign extends DesignPageBase {
  public pageContext: param[] = [{ key: 'pageInParam', name: 'pageInParam' }]

  protected get renderCompArea(): any {
    return this.$el
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0px;
}
.container:focus-visible {
  outline: none;
}
</style>
