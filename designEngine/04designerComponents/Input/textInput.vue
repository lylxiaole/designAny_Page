 
<template>
  <div style="height:100%;width:100%">
    <el-input v-model="currentText" :type="type" :show-password="type==='password'" :placeholder="placeholder" :readonly="readonly" :style="{
          'height':'100%','width':'100%'}" />
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

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '文本输入框', 'textInput_001', null)
@Options({})
export default class textInput extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @DPropAttr(new Text_Setting('值', PropertyGroupName.special, true))
  private currentText: string = ''

  @DPropAttr(new Text_Setting('提示语', PropertyGroupName.special, true))
  private placeholder: string = '请输入一个值'

  @DPropAttr(new Boolean_Setting('只读', PropertyGroupName.special, true))
  private readonly: boolean = false

  @DPropAttr(new Enum_Setting('文本类型', PropertyGroupName.special, true, null, true, ['text', 'password']))
  private type: string = 'text'
}
</script>



<style scoped>
</style>