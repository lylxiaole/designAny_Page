 
<template>
  <div style="height:100%;">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompType, DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { getUuid, deepClone } from '@common/utils'
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.webpc, DCompType.system_component, '系统组件', '导航栏1', 'navigation1', null)
@Options({})
export default class index extends EngineComponent {
  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }
}
</script>



<style scoped>
</style>