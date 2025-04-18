<template>
  <el-dialog style="padding:0px !important;" v-model="windowVisible" :style="{width:width}" @close="onClose" :close-on-click-modal="false"
    :close-on-press-escape="false" destroy-on-close>
    <div ref="renderContent"
      :style="{ position: 'relative', width: width, height: height, left: left, top: top, background: backgroundCute, padding: '0px' }"
      oncontextmenu="self.event.returnValue=false" class="container" style="border-radius: 0px; box-sizing: border-box"></div>
  </el-dialog>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { deepClone, getUuid } from '@common/utils'

import { EnginePage, EngineLayout, EngineComponent, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import { findSystemCompByCode } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import platform from '@design-any/interface/dist/enums/platform'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../01designerContext/context'
import ViewPageBase from './ViewPageBase'
import { DMethodAttr } from '@design-any/interface/dist/LayoutAttr'
import { param, paramType } from '@design-any/interface/dist/bahaviorEngine/behavior'

@DPageAttr('dialogPageView')
@Options({})
export default class DialogPageView extends ViewPageBase {
  public parentEngine: EnginePage = null
  public pageContext: param[] = [{ key: 'pageInParam', name: 'pageInParam' }]
  public setPageInParam(val) {
    this.pageContext.find((o) => o.key === 'pageInParam').val = val
  }
  private windowVisible: boolean = true

  protected get renderCompArea(): any {
    return this.$refs.renderContent
  }

  public async close() {
    this.windowVisible = false
  }
  private onClose() {
    this.destorymethod()
  }

  @DMethodAttr({ methodName: 'Close', hasOutParam: false, inParams: [] })
  private async closeCurrentPage(data: any[]) {
    this.close()
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
