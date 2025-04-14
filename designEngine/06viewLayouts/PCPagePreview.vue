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

@DPageAttr('pageView')
@Options({})
export default class PCPagePreview extends ViewPageBase {}
</script>

<style lang="less" scoped>
/deep/ .container {
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0px;
}
</style>
