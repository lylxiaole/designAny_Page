<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-countdown :value="deadline" :format="format" @finish="onFinish" style="margin-right: 50px" />
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import { Property, PropertyGroupName, Number_Property, Enum_Property } from '../../03designerLayoutBase'

@Component({})
export default class CountDownComponent extends ComponentBase {
  mounted() {
    this.width = 200
    this.height = 200
    this.registerProperty('时间', PropertyGroupName.special, new Number_Property(), 1587112242)
    this.registerProperty('展示', PropertyGroupName.special, new Enum_Property(true, ['时分秒', '毫秒', '天数']), '时分秒')
  }
  get format(): string {
    if (this.findProperties(PropertyGroupName.special, '展示')[0]) {
      let newval2 = this.findProperties(PropertyGroupName.special, '展示')[0].value
      return newval2 === '时分秒' ? 'HH:mm:ss' : newval2 === '毫秒' ? 'HH:mm:ss:SSS' : 'D 天 H 时 m 分 s 秒'
    } else {
      return 'normal'
    }
  }
  get deadline(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '时间')) {
      let property = (Date.now() + this.findPropertyByName(PropertyGroupName.special, '时间').value) as number
      return property
    } else {
      return Date.now() + 300000
    }
  }
  onFinish() {
    //console.info('over')
  }
}
</script>