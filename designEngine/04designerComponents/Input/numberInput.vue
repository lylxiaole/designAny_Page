 
<template>
  <div style="height:100%;width:100%">
    <el-input-number v-model="currentVal" size="small" :style="{'height':'100%','width':'100%'}" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr } from '@designEngine/03designerLayoutBase'
import {
  DPropAttr,
  Property,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting
} from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '数字输入框', 'numberInput_001', null)
@Options({})
export default class numberInput extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @DPropAttr(new Number_Setting('值', PropertyGroupName.special, true))
  private currentVal: number = 0
}
</script>



<style scoped>
</style>