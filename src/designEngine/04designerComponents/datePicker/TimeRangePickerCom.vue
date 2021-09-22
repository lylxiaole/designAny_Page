<template>
  <div>
    <a-time-picker :size="size" :format="formatter" v-model="startValue" placeholder="开始" style='margin: 0 8px 12px 0;'
      :disabledHours='disabledStartHours' :disabledMinutes='disabledStartMinutes' :disabledSeconds='disabledStartSeconds' />
    <a-time-picker :size="size" :format="formatter" placeholder="结束" v-model="endValue" :disabledHours='disabledEndHours'
      :disabledMinutes='disabledEndMinutes' :disabledSeconds='disabledEndSeconds' />
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
  TimePickerFile_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'

@Component
export default class DateRangePickerCom extends ComponentBase {
  @Prop({ required: false })
  public startValue: any
  @Prop({ required: false })
  public endValue: any

  public created() {}

  protected items = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH', 'YYYY-MM-DD']
  protected timeitems = ['HH:mm:ss', 'HH:mm']
  protected sizeitems = ['大', '中', '小']
  protected hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  protected minsec = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59
  ]
  mounted() {
    if (this.IsDesigning) {
      this.width = 195 * 2 + 8
      this.height = 32
      //注册特有属性
      this.registerProperty('格式化', PropertyGroupName.special, new Enum_Property(true, this.timeitems), this.timeitems[0])
      this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])
    }
  }
  /*
  时间格式化展示
  */
  get formatter(): string {
    let fmt = this.findProperties(PropertyGroupName.special, '格式化')
    if (fmt.length === 0) {
      return this.items[0]
    }
    let fmvalue = fmt[0].value as string
    return fmvalue
  }

  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      let mv = this.findProperties(PropertyGroupName.special, '尺寸')[0].value
      return mv === '大' ? 'large' : mv === '中' ? 'default' : 'small'
    }
    return 'default'
  }

  //禁止小时
  private disabledStartHours() {
    //console.info('disabledStartHours')
    let mhour = []
    if (this.endValue != null && this.endValue != undefined) {
      mhour = mhour.concat(this.hours.filter((c) => c > this.endValue.hours()))
    }
    return mhour
  }
  //禁止分钟
  private disabledStartMinutes(selectedHour: any) {
    let mmin = []
    if (this.endValue != null && this.endValue != undefined && selectedHour === this.endValue.hours()) {
      mmin = mmin.concat(this.minsec.filter((c) => c > this.endValue.minutes()))
    }
    return mmin
  }
  //禁止秒
  private disabledStartSeconds(selectedHour: any, selectedMinute: any) {
    let msec = []
    if (this.formatter.indexOf('ss') < 0) {
      return msec
    }
    if (
      this.endValue != null &&
      this.endValue != undefined &&
      selectedHour === parseInt(this.endValue.split(':')[0]) &&
      selectedMinute === parseInt(this.endValue.split(':')[1])
    ) {
      msec = msec.concat(this.minsec.filter((c) => c > this.endValue.seconds()))
    }
    return msec
  }

  //禁止小时
  private disabledEndHours() {
    let mhour = []
    if (this.startValue != null && this.startValue != undefined) {
      mhour = mhour.concat(this.hours.filter((c) => c < this.startValue.hours()))
    }
    return mhour
  }
  //禁止分钟
  private disabledEndMinutes(selectedHour: any) {
    let mmin = []
    if (this.startValue != null && this.startValue != undefined && selectedHour === this.startValue.hours()) {
      mmin = mmin.concat(this.minsec.filter((c) => c < this.startValue.minutes()))
    }
    return mmin
  }
  //禁止秒
  private disabledEndSeconds(selectedHour: any, selectedMinute: any) {
    let msec = []
    if (this.formatter.indexOf('ss') < 0) {
      return msec
    }
    if (
      this.startValue != null &&
      this.startValue != undefined &&
      selectedHour === this.startValue.hours() &&
      selectedMinute === this.startValue.minutes()
    ) {
      msec = msec.concat(this.minsec.filter((c) => c < this.startValue.seconds()))
    }
    return msec
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>