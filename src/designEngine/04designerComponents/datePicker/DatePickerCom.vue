<template>
  <a-date-picker class="gad-calendar-picker" :locale="locale" :size="size" :format="formatter" v-bind:disabled='disabled' :showTime="IsShowTime"
    :disabledDate="disabledDate" @panelChange='change' :disabledTime='disabledTime' v-model='dateValue' @change="basechange" placeholder="选择时间"
    :style="{width: '100%'}" :inputReadOnly="true">
    <div slot="suffixIcon" v-if="!disabled"></div>
  </a-date-picker>
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
import { param, paramType } from '../../03designerLayoutBase'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

@Component
export default class DatePickerCom extends ComponentBase {
  inparam: param[]
  outparam: param

  @Prop()
  value: string

  @Watch('value')
  valueChange() {
    this.dateValue = moment(this.value, this.formatter)
  }

  /** 是否展示时分秒选择器  */
  @Prop({ required: false })
  public showTime: boolean | any
  /**是否禁用 */
  // @Prop({ required: false })
  // public disabled: boolean
  @Prop({ required: false })
  public disabledTime: any

  public locale = locale
  public IsShowTime: boolean | any = false

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

  @Prop() private dateType: string

  private onValChange(val: any, timestr: string) {
    //window.console.log(timestr)
  }
  mounted() {
    if (this.IsDesigning) {
      this.width = 195
      this.height = 32
      //注册特有属性
      this.registerProperty('值', PropertyGroupName.special, new TimePickerFile_Property('date'), null)
      this.registerProperty('格式化', PropertyGroupName.special, new Enum_Property(true, this.items), this.items[0])
      this.registerProperty('最小值', PropertyGroupName.special, new TimePickerFile_Property('date'))
      this.registerProperty('最大值', PropertyGroupName.special, new TimePickerFile_Property('date'))
      this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])

      //添加最大值、最小值之间的检验规则
      this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最小值')[0].id, (newval: any) => {
        return this.maxdatevalue === undefined || newval === null ? true : newval <= this.maxdatevalue
      })
      this.addPropertyValidator(this.findProperties(PropertyGroupName.special, '最大值')[0].id, (newval: any) => {
        return this.mindatevalue === undefined || newval === null ? true : newval >= this.mindatevalue
      })
    }
    //属性改变触发
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)

    this.registerEvents('值改变事件', '', this.inparam, this.outparam)

    this.IsShowTime = this.showTime

    if (this.curModelproperty && this.curModelproperty.formatter) {
      this.formatter = this.curModelproperty.formatter
    }
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.dateValue = moment(this.curModelproperty.defaultValue, this.formatter)
    }
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
      property != undefined && property.value != undefined && property.value != ''
        ? moment(parseInt(property.value))
        : property.value == ''
        ? null
        : null
    //moment(new Date())

    return nowvalue
  }

  set dateValue(val: moment.Moment) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    if (val == null) {
      this.setPropertyVal(property.id, null)
    } else {
      //var newv = moment(val).valueOf()
      var newv = val.format(this.formatter)
      //console.info('时间错是的',this.$moment(newv,this.formatter));
      newv = this.$moment(newv, this.formatter).valueOf()
      // this.setPropertyVal(property.id, this.$moment(val))
      this.setPropertyVal(property.id, newv)
    }
    //this.setPropertyVal(property.id, this.$moment(val))
  }

  set formatter(val: string) {
    let fmt = this.findPropertyByName(PropertyGroupName.special, '格式化')
    if (fmt) {
      fmt.value = val
    }
  }

  /*
  时间格式化展示
  */
  get formatter(): string {
    let fmt = this.findProperties(PropertyGroupName.special, '格式化')
    if (fmt.length === 0) {
      //window.console.log('时间格式化初值', fmt)
      // if (this.curModelproperty && this.curModelproperty.formatter) {
      //   //window.console.log('this.curModelproperty.formatter',this.curModelproperty.formatter.toUpperCase())
      //   //fmt[0].value = this.curModelproperty.formatter.toUpperCase()
      //   return this.curModelproperty.formatter.toUpperCase()
      // }
      return this.items[0]
    }
    //window.console.log('时间格式话变更',fmt)
    // if (this.curModelproperty && this.curModelproperty.formatter){
    //   window.console.log('this.curModelproperty.formatter',this.curModelproperty.formatter.toUpperCase())
    //   //fmt[0].value = this.curModelproperty.formatter.toUpperCase()
    // }
    let fmvalue = fmt[0].value as string
    if (fmvalue.indexOf('HH') >= 0 || fmvalue.indexOf(':') >= 0) {
      if (fmvalue.indexOf(' ') >= 0) {
        this.IsShowTime = { format: fmvalue.split(' ')[1] }
      } else {
        this.IsShowTime = { format: fmvalue }
      }
    } else {
      this.IsShowTime = false
    }
    var propertyType_max = this.findProperties(PropertyGroupName.special, '最大值')[0].propertyType as TimePickerFile_Property
    propertyType_max.showTime = this.IsShowTime

    // propertyType_max.format = fmvalue
    var propertyType_min = this.findProperties(PropertyGroupName.special, '最小值')[0].propertyType as TimePickerFile_Property
    propertyType_min.showTime = this.IsShowTime

    var propertyType_val = this.findProperties(PropertyGroupName.special, '值')[0].propertyType as TimePickerFile_Property
    propertyType_val.showTime = this.IsShowTime

    return fmvalue
  }

  /*
  最小值
  */
  get mindatevalue(): String {
    //console.info('最小值');
    let fmt = this.findProperties(PropertyGroupName.special, '最小值')
    // if (moment.isMoment(fmt[0].value)) {
    //   return fmt[0].value.format(this.formatter)
    // }
    // return fmt[0].value as String
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format(this.formatter)
    } else if (typeof fmt[0].value == 'number') {
      // var newvalue = timeStamp2time(fmt[0].value, this.formatter)
      if (fmt[0].value < 0) {
        fmt[0].value = 0
      }
      var newvalue = moment(fmt[0].value).format(this.formatter)
      //let timestamp1 = moment(newvalue).valueOf()
      return newvalue
    }
    return fmt[0].value as string
  }
  /*
  最大值
  */
  get maxdatevalue(): String {
    let fmt = this.findProperties(PropertyGroupName.special, '最大值')
    // if (moment.isMoment(fmt[0].value)) {
    //   return fmt[0].value.format(this.formatter)
    // }
    // return fmt[0].value as String
    if (moment.isMoment(fmt[0].value)) {
      return fmt[0].value.format(this.formatter)
    } else if (typeof fmt[0].value == 'number') {
      //var maxvalue= timeStamp2time(fmt[0].value, this.formatter)
      var maxvalue = moment(fmt[0].value).format(this.formatter)
      return maxvalue
    }
    return fmt[0].value as string
  }
  /*
  不可点击的日期
  */
  disabledDate(current: any) {
    //window.console.info('12312313131')
    let newformat, newmin, newmax
    if (this.formatter.indexOf(' ') >= 0 && this.formatter.indexOf('YY') >= 0) {
      newformat = this.formatter.split(' ')[0]
    } else newformat = this.formatter
    newmin = this.mindatevalue != null ? this.mindatevalue : '1970-01-01'
    newmax = this.maxdatevalue != null ? this.maxdatevalue : '2999-01-01'
    return (
      current.format(newformat) < this.$moment(newmin).format('YYYY-MM-DD') || current.format(newformat) > this.$moment(newmax).format('YYYY-MM-DD')
    )
  }
  /*
  属性变化事件
  */
  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    //window.console.info('onCurrentPropertyChanged', property)
    if (property.propertyName === '前景色') {
      //改变颜色
      //$('.ant-calendar-picker-input')[0].style.color = property.value
      $(this.$el)
        .find('.ant-calendar-picker-input')
        .css('color', property.value)
      //$('#' + this.Id).children('.ant-calendar-picker-input')[0].style.color = property.value
    } else if (property.propertyName === '字体') {
      //改变字体大小
      $(this.$el)
        .find('.ant-calendar-picker-input')
        .css('fontSize', property.value + 'px')
    } else if (property.propertyName == '最小值') {
      if (property.value == 0 || property.value == '') {
        this.setPropertyVal(property.id, null)
      }
    } else if (property.propertyName == '最大值') {
      if (property.value == 0 || property.value == '') {
        this.setPropertyVal(property.id, null)
      }
    }
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
    return '大'
  }
  //监听切换面板事件
  private change(value: any, mode: string) {
    //时间
    if (mode === 'time') {
      //需要根据日期值大小判定选项
      let nowdate = value.format('YYYY-MM-DD')
      let newmin = this.mindatevalue != null ? this.mindatevalue : '1970-01-01 08:00:01'
      let newmax = this.maxdatevalue != null ? this.maxdatevalue : '2999-01-01'
      let mindate = this.$moment(newmin).format('YYYY-MM-DD')
      let maxdate = this.$moment(newmax).format('YYYY-MM-DD')
      //设置禁用时分秒配置
      this.disabledTime = () => {
        return {
          disabledHours: () => {
            let mhour = []
            if (nowdate < mindate) {
              return this.hours
            }
            if (mindate === nowdate) {
              mhour = mhour.concat(this.hours.filter((c) => c < this.$moment(newmin).hours()))
            }
            if (maxdate === nowdate) {
              mhour = mhour.concat(this.hours.filter((c) => c > this.$moment(newmax).hours()))
            }
            return mhour
          },
          disabledMinutes: (selectedHour: any) => {
            let mmin = []
            if (nowdate < mindate) {
              return this.minsec
            }
            if (mindate === nowdate && selectedHour === this.$moment(newmin).hours()) {
              mmin = mmin.concat(this.minsec.filter((c) => c < this.$moment(newmin).minutes()))
            }
            if (maxdate === nowdate && selectedHour === this.$moment(newmax).hours()) {
              mmin = mmin.concat(this.minsec.filter((c) => c > this.$moment(newmax).minutes()))
            }
            return mmin
          },
          disabledSeconds: (selectedHour: any, selectedMinute: any) => {
            let msec = []
            if (nowdate < mindate) {
              return this.minsec
            }
            if (mindate === nowdate && selectedHour === this.$moment(newmin).hours() && selectedMinute === this.$moment(newmin).minutes()) {
              msec = msec.concat(this.minsec.filter((c) => c < this.$moment(newmin).seconds()))
            }
            if (maxdate === nowdate && selectedHour === this.$moment(newmax).hours() && selectedMinute === this.$moment(newmax).minutes()) {
              msec = msec.concat(this.minsec.filter((c) => c > this.$moment(newmax).seconds()))
            }
            return msec
          }
        }
      }
    }
    //console.log('value',value)
    //this.$emit('change', value)
  }

  private basechange(date: any, dateString: string) {
    //console.log('datastring',dateString)
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    // this.setPropertyVal(property.id, dateString)
    // this.$emit('change', dateString)
    var newdate
    if (date != null) {
      var min_date = (this.mindatevalue != null ? this.mindatevalue : '1970-01-01 08:00:01') as string
      var max_date = (this.maxdatevalue != null ? this.maxdatevalue : '2999-01-01') as string
      var min = new Date(min_date).getTime()
      var max = new Date(max_date).getTime()
      var now = new Date(date).getTime()
      if (now < min) {
        date = min
      } else if (now > max) {
        date = max
      }
      let new_value = moment(date).format(this.formatter) as string
      // newdate =this.$moment(date,this.formatter).valueOf()
      newdate = this.$moment(new_value).valueOf()
    } else {
      newdate = null
    }
    this.setPropertyVal(property.id, newdate)
    this.$emit('change', newdate)
    this.triggeEvent('值改变事件', newdate)
  }

  getTruthTime(time) {
    // 服务器端时区，北京东八区（-8*60）
    let timezone = -480

    // 需要修复的时间，支持字符串传参
    let nowDate = time ? new Date(time).getTime() : new Date().getTime()
    let timeStamp = new Date(nowDate + timezone * 60 * 1000)
    return timeStamp.getTime()
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>

