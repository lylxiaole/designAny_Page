<template>
  <div>
    <a-week-picker class="gad-calendar-picker" :disabledDate="disabledStartDate" :size="size" v-model="startValue" placeholder="开始"
      style='margin: 0 8px 12px 0;' />
    <a-week-picker class="gad-calendar-picker" :disabledDate="disabledEndDate" :size="size" placeholder="结束" v-model="endValue"
      @panelChange='changeend' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  TimePickerFile_Property,
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'

@Component
export default class DateRangePickerCom extends ComponentBase {
  /** 是否展示时分秒选择器  */
  @Prop({ required: false })
  public showTime: boolean | any = false
  @Prop({ required: false })
  public disabledStartTime: any
  @Prop({ required: false })
  public disabledEndTime: any

  @Prop({ required: false })
  public startValue: any
  @Prop({ required: false })
  public endValue: any

  public created() { }

  protected items = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH', 'YYYY-MM-DD']
  protected timeitems = ['HH:mm:ss', 'HH:mm']
  protected sizeitems = ['大', '中', '小']
  protected hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  protected minsec = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59
  ]
  mounted() {
    if (this.IsDesigning) {
      this.width = 195 * 2 + 8
      this.height = 32
      //注册特有属性
      this.RegisterProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])
    }
  }

  disabledStartDate(startValue: Date) {
    const endValue = this.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate(endValue: Date) {
    const startValue = this.startValue
    if (!endValue || !startValue) {
      return false
    }
    return startValue.valueOf() >= endValue.valueOf()
  }

  get size(): string {
    if (this.FindProperties(PropertyGroupName.special, '尺寸')[0]) {
      let mv = this.FindProperties(PropertyGroupName.special, '尺寸')[0].value
      return mv === '大' ? 'large' : mv === '中' ? 'default' : 'small'
    }
    return 'default'
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>