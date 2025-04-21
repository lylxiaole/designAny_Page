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
import {
  DPropAttr,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import platform from '@design-any/interface/dist/enums/platform'

@DCompnentAttr(platform.universal, 'Basic', 'NumberInput', 'numberInput_001', require('../compIcons/数字输入框.png'))
@Options({})
export default class numberInput extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @DPropAttr(new Number_Setting('Value', PropertyGroupName.data, true))
  private currentVal: number = 0
}
</script>

<style scoped></style>
