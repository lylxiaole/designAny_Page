<template>
  <div :style="{background:backgroundColor}">
    <a-time-picker :size="size" v-bind:disabled="disabled" v-model="dateValue" :format="formatter" :disabledHours='disabledHours'
      :disabledMinutes='disabledMinutes' :disabledSeconds='disabledSeconds' @change="basechange" :style="{width: '100%'}" :allowClear="!disabled">
      <div slot="suffixIcon" v-if="!disabled"></div>
    </a-time-picker>
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
import moment from 'moment'
import { timeStamp2time } from '../../02common/utils/util'
import { param, paramType } from '../../03designerLayoutBase'

@Component
export default class DatePickerCom extends ComponentBase {
  inparam: param[]
  outparam: param
  /**选择器类型 0-DatePicker,1-MonthPicker,2-WeekPicker,3-RangePicker */

  /** 是否展示时分秒选择器  */
  @Prop({ required: false })
  public showtime: boolean | any

  @Prop()
  value: string

  @Watch('value')
  valueChange() {
    //this.dateValue = moment(this.value)
  }

  public created() {}

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
      this.width = 195
      this.height = 32
      //注册特有属性
      this.registerProperty('值', PropertyGroupName.special, new TimePickerFile_Property('time'), null)
      this.registerProperty('格式化', PropertyGroupName.special, new Enum_Property(true, this.timeitems), this.timeitems[0])
      this.registerProperty('最小值', PropertyGroupName.special, new TimePickerFile_Property('time'))
      this.registerProperty('最大值', PropertyGroupName.special, new TimePickerFile_Property('time'))
      this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])
    }
    //添加最大值、最小值之间的检验规则
    this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最小值')[0].id, (newval: any) => {
      return this.maxdatevalue === undefined || newval === null ? true : newval <= this.maxdatevalue
    })
    this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最大值')[0].id, (newval: any) => {
      return this.mindatevalue === undefined || newval === null ? true : newval >= this.mindatevalue
    })

    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
  }

  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    return property
  }
  get dateValue(): moment.Moment {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    if (property == undefined) {
      return null
    }
    let nowvalue =
      property != undefined && property.value != undefined && property.value != '' ? moment(property.value) : property.value == '' ? null : null
    return nowvalue
  }

  set dateValue(val: moment.Moment) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    if (val == null) {
      this.setPropertyVal(property.id, null)
    } else {
      var newv = '1971-01-01 ' + val.format(this.formatter)
      newv = moment(newv).valueOf()
      this.setPropertyVal(property.id, newv)
    }
  }
  /*
  时间格式化展示
  */
  get formatter(): string {
    let fmt = this.findProperties(PropertyGroupName.special, '格式化')
    if (fmt.length === 0) {
      return this.timeitems[0]
    }
    let fmvalue = fmt[0].value as string
    if (fmvalue.indexOf('HH') >= 0 || fmvalue.indexOf(':') >= 0) {
      if (fmvalue.indexOf(' ') >= 0) {
        this.showtime = { format: fmvalue.split(' ')[1] }
      } else {
        this.showtime = { format: fmvalue }
      }
    } else {
      this.showtime = false
    }
    var propertyType_max = this.findProperties(PropertyGroupName.special, '最大值')[0].propertyType as TimePickerFile_Property
    propertyType_max.showTime = this.showtime

    var propertyType_min = this.findProperties(PropertyGroupName.special, '最小值')[0].propertyType as TimePickerFile_Property
    propertyType_min.showTime = this.showtime

    return fmvalue
  }
  /*
  最小值
  */
  get mindatevalue(): string {
    let fmt = this.findProperties(PropertyGroupName.special, '最小值')
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format(this.formatter)
    } else if (typeof fmt[0].value == 'number') {
      var newvalue = moment(fmt[0].value).format(this.formatter)
      return newvalue
    }
    return fmt[0].value as string
  }
  /*
  最大值
  */
  get maxdatevalue(): string {
    let fmt = this.findProperties(PropertyGroupName.special, '最大值')
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format(this.formatter)
    } else if (typeof fmt[0].value == 'number') {
      var maxvalue = moment(fmt[0].value).format(this.formatter)
      return maxvalue
    }
    return fmt[0].value as string
  }

  get backgroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
    }
    return ''
  }
  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      let mv = this.findProperties(PropertyGroupName.special, '尺寸')[0].value
      return mv === '大' ? 'large' : mv === '中' ? 'default' : 'small'
    }
    return 'default'
  }
  //禁止小时
  private disabledHours() {
    //console.info('ininin')
    let mhour = []

    if (this.mindatevalue != null && this.mindatevalue != undefined) {
      mhour = mhour.concat(this.hours.filter((c) => c < parseInt(this.mindatevalue.split(':')[0])))
    }
    if (this.maxdatevalue != null && this.maxdatevalue != undefined) {
      mhour = mhour.concat(this.hours.filter((c) => c > parseInt(this.maxdatevalue.split(':')[0])))
    }
    return mhour
  }
  //禁止分钟
  private disabledMinutes(selectedHour: any) {
    let mmin = []
    if (this.mindatevalue != null && this.mindatevalue != undefined && selectedHour === parseInt(this.mindatevalue.split(':')[0])) {
      mmin = mmin.concat(this.minsec.filter((c) => c < parseInt(this.mindatevalue.split(':')[1])))
    }
    if (this.maxdatevalue != null && this.maxdatevalue != undefined && selectedHour === parseInt(this.maxdatevalue.split(':')[0])) {
      mmin = mmin.concat(this.minsec.filter((c) => c > parseInt(this.maxdatevalue.split(':')[1])))
    }
    return mmin
  }
  //禁止秒
  private disabledSeconds(selectedHour: any, selectedMinute: any) {
    let msec = []
    if (this.formatter.indexOf('ss') < 0) {
      return msec
    }
    if (
      this.mindatevalue != null &&
      this.mindatevalue != undefined &&
      selectedHour === parseInt(this.mindatevalue.split(':')[0]) &&
      selectedMinute === parseInt(this.mindatevalue.split(':')[1])
    ) {
      msec = msec.concat(this.minsec.filter((c) => c < parseInt(this.mindatevalue.split(':')[2])))
    }
    if (
      this.maxdatevalue != null &&
      this.maxdatevalue != undefined &&
      selectedHour === parseInt(this.maxdatevalue.split(':')[0]) &&
      selectedMinute === parseInt(this.maxdatevalue.split(':')[1])
    ) {
      msec = msec.concat(this.minsec.filter((c) => c > parseInt(this.maxdatevalue.split(':')[2])))
    }
    return msec
  }

  private basechange(date: any, dateString: string) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    var newdate
    if (date != null) {
      var now = new Date(date)
      var hms = '1971-01-01 ' + this.getHours(now) + ':' + this.getMinutes(now) + ':' + this.getSeconds(now)
      newdate = moment(hms).valueOf()
    } else {
      newdate = null
    }
    this.setPropertyVal(property.id, newdate)
    this.$emit('change', newdate)
    this.triggeEvent('值改变事件', newdate)
  }

  //返回小时
  private getHours(date) {
    var hours = 0
    var result = ''
    hours = date.getHours()
    if (hours < 10) {
      result = '0' + hours
    } else {
      result = hours + ''
    }
    return result
  }
  //返回分
  private getMinutes(date) {
    var minute = 0
    var result = ''
    minute = date.getMinutes()
    if (minute < 10) {
      result = '0' + minute
    } else {
      result = minute + ''
    }
    return result
  }
  //返回秒
  private getSeconds(date) {
    var second = 0
    var result = ''
    second = date.getSeconds()
    if (second < 10) {
      result = '0' + second
    } else {
      result = second + ''
    }
    return result
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>
