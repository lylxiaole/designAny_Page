<template>
  <div>
    <a-date-picker class="gad-calendar-picker" :locale="locale" :disabledDate="disabledStartDate" :size="size" :format="formatter"
      :showTime="IsShowTime" v-model="startValue" placeholder="开始" :disabledTime='disabledStartTime' @panelChange='changestart'
      style='margin: 0 8px 12px 0;' />
    <a-date-picker class="gad-calendar-picker" :locale="locale" :disabledDate="disabledEndDate" :size="size" :format="formatter"
      :showTime="IsShowTime" placeholder="结束" v-model="endValue" :disabledTime='disabledEndTime' @panelChange='changeend' />
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
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
@Component
export default class DateRangePickerCom extends ComponentBase {
  /** 是否展示时分秒选择器  */
  @Prop({ required: false })
  public showTime: boolean | any = false
  @Prop({ required: false })
  public disabledStartTime: any
  @Prop({ required: false })
  public disabledEndTime: any

  public locale = locale;

  public IsShowTime: boolean | any = false

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
      // this.IsShowTime = this.showTime
      //注册特有属性
      this.RegisterProperty('开始值', PropertyGroupName.special, new TimePickerFile_Property('date'), null)
      this.RegisterProperty('结束值', PropertyGroupName.special, new TimePickerFile_Property('date'), null)
      this.RegisterProperty('格式化', PropertyGroupName.special, new Enum_Property(true, this.items), this.items[0])
      this.RegisterProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, this.sizeitems), this.sizeitems[1])
    }
  }

  get startValue(): moment.Moment {
    var property = this.FindPropertyByName(PropertyGroupName.special, '开始值')
    if (property == undefined) {
      return null
    }
    let nowvalue =
      property != undefined && property.value != undefined && property.value != '' ? moment(property.value) : property.value == '' ? null : null
    //moment(new Date())

    return nowvalue
  }

  set startValue(val: moment.Moment) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '开始值')
    if (val == null) {
      this.SetPropertyVal(property.id, null)
    } else {
      var newv = this.$moment(val, this.formatter).valueOf() as any

      newv = Math.floor(newv/1000)*1000
      // this.SetPropertyVal(property.id, this.$moment(val))
      this.SetPropertyVal(property.id, newv)
    }
    //this.SetPropertyVal(property.id, this.$moment(val))
  }

  get endValue(): moment.Moment {
    var property = this.FindPropertyByName(PropertyGroupName.special, '结束值')
    if (property == undefined) {
      return null
    }
    let nowvalue =
      property != undefined && property.value != undefined && property.value != '' ? moment(property.value) : property.value == '' ? null : null
    //moment(new Date())

    return nowvalue
  }

  set endValue(val: moment.Moment) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '结束值')
    if (val == null) {
      this.SetPropertyVal(property.id, null)
    } else {
      //var newv = moment(val).valueOf()
      var newv = this.$moment(val, this.formatter).valueOf() as any

      newv = Math.floor(newv/1000) *1000+999
      // this.SetPropertyVal(property.id, this.$moment(val))
      this.SetPropertyVal(property.id, newv)
    }
    //this.SetPropertyVal(property.id, this.$moment(val))
  }

  /*
  时间格式化展示
  */
  get formatter(): string {
    let fmt = this.FindProperties(PropertyGroupName.special, '格式化')
    if (fmt.length === 0) {
      return this.items[0]
    }
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
    return fmvalue
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

  //监听切换面板事件
  private changestart(value: any, mode: string) {
    //时间
    if (mode === 'time') {
      //需要根据日期值大小判定选项
      let nowdate = value.format('YYYY-MM-DD')
      let newmax = this.endValue != null ? this.endValue : '2999-01-01'
      let maxdate = this.$moment(newmax).format('YYYY-MM-DD')
      //设置禁用时分秒配置
      this.disabledStartTime = () => {
        return {
          disabledHours: () => {
            let mhour = []
            if (nowdate > maxdate) {
              return this.hours
            }
            if (maxdate === nowdate) {
              mhour = mhour.concat(this.hours.filter((c) => c > this.$moment(newmax).hours()))
            }
            return mhour
          },
          disabledMinutes: (selectedHour: any) => {
            let mmin = []
            if (nowdate > maxdate) {
              return this.minsec
            }
            if (maxdate === nowdate && selectedHour === this.$moment(newmax).hours()) {
              mmin = mmin.concat(this.minsec.filter((c) => c > this.$moment(newmax).minutes()))
            }
            return mmin
          },
          disabledSeconds: (selectedHour: any, selectedMinute: any) => {
            let msec = []
            if (nowdate > maxdate) {
              return this.minsec
            }
            if (maxdate === nowdate && selectedHour === this.$moment(newmax).hours() && selectedMinute === this.$moment(newmax).minutes()) {
              msec = msec.concat(this.minsec.filter((c) => c > this.$moment(newmax).seconds()))
            }
            return msec
          }
        }
      }
    }
  }

  //监听切换面板事件
  private changeend(value: any, mode: string) {
    //时间
    if (mode === 'time') {
      //需要根据日期值大小判定选项
      let nowdate = value.format('YYYY-MM-DD')
      let newmin = this.startValue != null ? this.startValue : '1900-01-01 00:00:00'
      let mindate = this.$moment(newmin).format('YYYY-MM-DD')
      //设置禁用时分秒配置
      this.disabledEndTime = () => {
        return {
          disabledHours: () => {
            let mhour = []
            if (nowdate < mindate) {
              return this.hours
            }
            if (mindate === nowdate) {
              mhour = mhour.concat(this.hours.filter((c) => c < this.$moment(newmin).hours()))
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
            return msec
          }
        }
      }
    }
  }

  get size(): string {
    if (this.FindProperties(PropertyGroupName.special, '尺寸')[0]) {
      let mv = this.FindProperties(PropertyGroupName.special, '尺寸')[0].value
      return mv === '大' ? 'large' : mv === '中' ? 'default' : 'small'
    }
    return 'default';
  }
}
</script>
<style lang="less" scoped>
@import url('./style/DateTimePicker.less');
</style>