<template>
  <div :style="{background:backgroundColor}">
    <a-month-picker class="gad-calendar-month-picker" :locale="locale" format="YYYY-MM" v-model="dateValue" :size="size" :disabledDate="disabledDate"
      :disabled="disabled" @change="basechange" :style="{width: '100%'}">
      <div slot="suffixIcon"></div>
    </a-month-picker>
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
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

@Component
export default class DatePickerCom extends ComponentBase {
  /**选择器类型 0-DatePicker,1-MonthPicker,2-WeekPicker,3-RangePicker */

  @Prop()
  value: string

  public locale = locale

  @Watch('value')
  valueChange() {
    this.dateValue = moment(this.value)
  }

  public created() {}

  protected items = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH', 'YYYY-MM-DD', 'YYYY-MM', 'HH:mm:ss', 'HH:mm']
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
      this.registerProperty('值', PropertyGroupName.special, new TimePickerFile_Property('month'), null)
      this.registerProperty('最小值', PropertyGroupName.special, new TimePickerFile_Property('month'))
      this.registerProperty('最大值', PropertyGroupName.special, new TimePickerFile_Property('month'))
      this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])
    }
    //属性改变触发
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)
    //添加最大值、最小值之间的检验规则
    this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最小值')[0].id, (newval: any) => {
      return this.maxdatevalue === undefined || newval === null ? true : newval <= this.maxdatevalue
    })
    this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最大值')[0].id, (newval: any) => {
      return this.mindatevalue === undefined || newval === null ? true : newval >= this.mindatevalue
    })
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
    //moment(new Date())
    return nowvalue
  }

  set dateValue(val: moment.Moment) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    //this.setPropertyVal(property.id, this.$moment(val))
    if (val == null) {
      this.setPropertyVal(property.id, null)
    } else {
      var newv = moment(val).valueOf()
      // this.setPropertyVal(property.id, this.$moment(val))
      this.setPropertyVal(property.id, newv)
    }
  }

  /*
  最小值
  */
  get mindatevalue(): String {
    // let fmt = this.findProperties(PropertyGroupName.special, '最小值')
    // if (moment.isMoment(fmt[0].value)) {
    //   return fmt[0].value.format("YYYY-MM")
    // }
    // return fmt[0].value as String
    let fmt = this.findProperties(PropertyGroupName.special, '最小值')
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format('YYYY-MM')
    } else if (typeof fmt[0].value == 'number') {
      var newvalue = moment(fmt[0].value).format('YYYY-MM')
      return newvalue
    }
    return fmt[0].value as string
  }
  /*
  最大值
  */
  get maxdatevalue(): String {
    // let fmt = this.findProperties(PropertyGroupName.special, '最大值')
    // if (moment.isMoment(fmt[0].value)) {
    //   return fmt[0].value.format("YYYY-MM")
    // }
    // return fmt[0].value as String
    let fmt = this.findProperties(PropertyGroupName.special, '最大值')
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format('YYYY-MM')
    } else if (typeof fmt[0].value == 'number') {
      //var maxvalue= timeStamp2time(fmt[0].value, this.formatter)
      var maxvalue = moment(fmt[0].value).format('YYYY-MM')
      return maxvalue
    }
    return fmt[0].value as string
  }
  /*
  不可点击的日期
  */
  disabledDate(current: any) {
    let newformat, newmin, newmax
    newmin = this.mindatevalue != null ? this.mindatevalue : '1900-01-01'
    newmax = this.maxdatevalue != null ? this.maxdatevalue : '2999-01-01'
    return current.format('YYYY-MM') < this.$moment(newmin).format('YYYY-MM') || current.format('YYYY-MM') > this.$moment(newmax).format('YYYY-MM')
  }
  /*
  属性变化事件
  */
  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    if (property.propertyName === '前景色') {
      //改变颜色
      $(this.$el)
        .find('.ant-calendar-picker-input')
        .css('color', property.value)
    } else if (property.propertyName === '字体') {
      //改变字体大小
      $(this.$el)
        .find('.ant-calendar-picker-input')
        .css('fontSize', property.value + 'px')
    }
    // else if (property.propertyName === '宽度') {
    //   //改变字体大小
    //   $(this.$el)
    //     .find('.ant-calendar-picker-input')
    //     .css('width', property.value + 'px')
    // } else if (property.propertyName === '高度') {
    //   //改变字体大小
    //   $(this.$el)
    //     .find('.ant-calendar-picker-input')
    //     .css('height', property.value + 'px')
    // }
  }

  get backgroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
    }
    return '#FFF'
  }
  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      let mv = this.findProperties(PropertyGroupName.special, '尺寸')[0].value
      return mv === '大' ? 'large' : mv === '中' ? 'default' : 'small'
    }
    return 'default'
  }
  private basechange(date: any, dateString: string) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    var newdate
    if (date != null) {
      newdate = moment(date).valueOf()
    } else {
      newdate = null
    }
    this.setPropertyVal(property.id, newdate)
    this.$emit('change', newdate)
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>