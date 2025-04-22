<template>
  <div>
    <img style="height: 100%" :src="require('./clock.png')" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { PropertyGroupName, Number_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DPropAttr } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'

@DCompnentAttr(platform.universal, getLocale().t('tip.basic'), getLocale().t('tip.timer'), 'Timer001', require('../compIcons/定时器.png'))
@Options({
  components: {}
})
export default class Index extends EngineComponent {
  @DPropAttr(new Number_Setting(getLocale().t('tip.tick'), PropertyGroupName.data, true, 'second'))
  private tiimeout: number = 1
  private interval: number = -1

  mounted() {
    this.width = '60px'
    this.height = '60px'
    this.findPropertyInfo((o) => o.background).canSetting = false
    this.findPropertyInfo((o) => o.background_img).canSetting = false
    this.findPropertyInfo((o) => o.foreground).canSetting = false
    this.findPropertyInfo((o) => o.fontSize).canSetting = false

    if (this.tiimeout > 0 && this.isDesigning === false) {
      this.interval = window.setInterval(() => {
        this.onTickTock()
      }, this.tiimeout * 1000)
    }
  }

  unmounted() {
    if (this.interval > -1) {
      window.clearInterval(this.interval)
    }
  }

  @DEventAttr({ eventName: getLocale().t('tip.onTickTock'), description: '', inParams: [], hasOutParam: false })
  private onTickTock() {}
}
</script>

<style lang="less" scoped></style>
