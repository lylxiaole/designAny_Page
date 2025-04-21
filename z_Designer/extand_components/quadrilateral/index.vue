<template>
  <div style="width: 100%; height: 100%"
    :style="{ background: backgroundCute, 'border-radius': borderRadius + 'px', 'box-shadow': showBoxShadow ? boxShadow : 'none' }"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { PropertyGroupName, Number_Setting, Boolean_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DPropAttr } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import platform from '@design-any/interface/dist/enums/platform'

@DCompnentAttr(platform.universal, getLocale().t('tip.basic'), 'Quadrilateral', 'QuadrilateralComponent_001', require('../compIcons/矩形.png'))
@Options({
  components: {}
})
export default class QuadrilateralComponent extends EngineComponent {
  private get backgroundCute(): string {
    // window.console.log('backgroundCute:', this.background_img)
    if (!this.background_img || this.background_img.length < 1) {
      return this.background
    }
    return 'url("' + this.applicationContext.getFileApiAddr(this.background_img[0].uid) + '")'
  }

  @DPropAttr(new Number_Setting('BorderRadius', PropertyGroupName.style, true, 'px'))
  private borderRadius: number = 0
  @DPropAttr(new Boolean_Setting('ShowBoxShadow', PropertyGroupName.style, true))
  private showBoxShadow: boolean = false

  private get boxShadow(): string {
    return '0px 4px 12px 0px rgba(138, 149, 163, 0.35)'
  }

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }
}
</script>

<style lang="less" scoped></style>
