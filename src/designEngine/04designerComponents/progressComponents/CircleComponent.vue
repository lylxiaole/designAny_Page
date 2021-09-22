<template>
  <div>
    <a-progress :percent="percent" type="circle" :showInfo="showInfo" :gapPosition="gapPosition" :status="progrestatus"
      :successPercent="successPercent" />
  </div>
</template>

<script lang="ts">
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  Boolean_Property,
  PropertyGroupName,
  Number_Property,
  BindingModels_Property
} from '../../03designerLayoutBase'

@Component
export default class LineComponent extends ComponentBase {
  mounted() {
    this.width = 300
    this.height = 300
    this.registerProperty('输入值', PropertyGroupName.special, new Number_Property(), 75)
    //this.registerProperty("已完成",PropertyGroupName.special,new Number_Property(),0)
    this.registerProperty('是否显示进度数值', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('状态', PropertyGroupName.special, new Enum_Property(true, ['正常', '成功', '异常', '活动']), '正常')
    //只限type=circle时使用
    this.registerProperty('缺口位置', PropertyGroupName.special, new Enum_Property(true, ['居左', '居右', '居上', '居下']), '居上')
  }
  get gapPosition(): string {
    if (this.findProperties(PropertyGroupName.special, '缺口位置')[0]) {
      let newval = this.findProperties(PropertyGroupName.special, '缺口位置')[0].value
      return newval === '居上' ? 'top' : newval === '居下' ? 'bottom' : newval === '居左' ? 'left' : 'right'
    } else {
      return 'right'
    }
  }
  get progrestatus(): string {
    if (this.findProperties(PropertyGroupName.special, '状态')[0]) {
      let newval2 = this.findProperties(PropertyGroupName.special, '状态')[0].value
      return newval2 === '正常' ? 'normal' : newval2 === '成功' ? 'success' : newval2 === '异常' ? 'exception' : 'active'
    } else {
      return 'normal'
    }
  }
  get showInfo(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示进度数值')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否显示进度数值')[0].value as boolean
    } else {
      return false
    }
  }
  get strokeWidth(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '进度条宽度')) {
      return this.findPropertyByName(PropertyGroupName.special, '进度条宽度').value as number
    } else {
      return 0
    }
  }
  get percent(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '输入值')) {
      return this.findPropertyByName(PropertyGroupName.special, '输入值').value as number
    } else {
      return 0
    }
  }
  get successPercent(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '已完成')) {
      return this.findPropertyByName(PropertyGroupName.special, '已完成').value as number
    } else {
      return 0
    }
  }
}
</script>
<style scoped>
div.ant-progress-circle,
div.ant-progress-line {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
