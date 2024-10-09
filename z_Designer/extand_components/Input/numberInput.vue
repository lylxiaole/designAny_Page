<template>
  <div style="height: 100%; width: 100%">
    <el-input-number v-model="currentVal" size="small" :style="{ height: '100%', width: '100%' }" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import { DPropAttr, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.universal, '基础组件', '数字输入框', 'numberInput_001', null)
@Options({})
export default class numberInput extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @DPropAttr(new Number_Setting('值', PropertyGroupName.data, true))
  private currentVal: number = 0
}
</script>

<style scoped></style>
