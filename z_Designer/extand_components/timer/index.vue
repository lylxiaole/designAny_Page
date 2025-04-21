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

@DCompnentAttr(platform.universal, getLocale().t('tip.basic'), 'Timer', 'Timer001', require('../compIcons/定时器.png'))
@Options({
  components: {}
})
export default class Index extends EngineComponent {
  @DPropAttr(new Number_Setting('Tick', PropertyGroupName.data, true, 'second'))
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

  @DEventAttr({ eventName: 'onTickTock', description: '', inParams: [], hasOutParam: false })
  private onTickTock() {}
}
</script>

<style lang="less" scoped></style>
