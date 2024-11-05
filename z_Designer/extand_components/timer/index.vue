<template>
  <div>I am Timer</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { PropertyGroupName, UploadFile_Setting, Text_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DPropAttr } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.universal, 'Basic', 'Timer', 'Timer001', require('../compIcons/anniu2.png'))
@Options({
  components: {}
})
export default class Index extends EngineComponent {
  mounted() {
    this.width = '60px'
    this.height = '60px'
  }
  unmounted() {}
}
</script>

<style lang="less" scoped></style>
