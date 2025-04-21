<template>
  <div style="height: 100%; width: 100%">
    <el-input v-model="currentText" :type="type" :show-password="type === 'password'" :placeholder="placeholder" :readonly="readonly" :style="{
        height: '100%',
        width: '100%'
      }" />
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

@DCompnentAttr(platform.universal, 'Basic', 'TextInput', 'textInput_001', require('../compIcons/文本输入框.png'))
@Options({})
export default class textInput extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @Watch('currentText', { deep: true, immediate: true })
  private onchanged(val) {
    debugger
  }

  @DPropAttr(new Text_Setting('Value', PropertyGroupName.data, true))
  private currentText: string = ''

  @DPropAttr(new Text_Setting('Placeholder', PropertyGroupName.data, true))
  private placeholder: string = 'Please Input A Value'

  @DPropAttr(new Boolean_Setting('Readonly', PropertyGroupName.data, true))
  private readonly: boolean = false

  @DPropAttr(new Enum_Setting('Text Type', PropertyGroupName.data, true, null, true, ['text', 'password']))
  private type: string = 'text'
}
</script>

<style scoped></style>
