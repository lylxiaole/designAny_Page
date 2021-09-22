<template>
  <h1 :style="{color:fontColor,fontSize:fontSize+'px'}" :v-model="status">
    {{countTime}}
  </h1>
</template>
<script lang="ts">
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Watch } from 'vue-property-decorator'
import { Property, PropertyGroupName, Number_Property, Button_Property, Enum_Property, Text_Property } from '../../03designerLayoutBase'
import common from '../../02common/commonMethod'
import { property } from 'xe-utils/methods'

@Component
export default class CountTimerComponent extends ComponentBase {
  private y: number = 1999
  private m: number = 1
  private d: number = 1
  private h: number = 0 //定义时，分，秒，毫秒并初始化为0；
  private mm: number = 0
  private s: number = 0
  private time: number = 0
  private status: string = '停止'

  mounted() {
    this.width = 200
    this.height = 200
    //this.status = '停止'
    //this.registerProperty('状态', PropertyGroupName.special, new Enum_Property(true, ['开始', '停止', '重置']), '停止')
    this.registerProperty('计时器', PropertyGroupName.special, new Text_Property(), 915120000000)

    this.registerMethods('开始', '', this.countStart, null, null)
    this.registerMethods('停止', '', this.countSuspend, null, null)
    this.registerMethods('重置', '', this.countReset, null, null)
  }

  Destory() {
    if (this.time) {
      clearInterval(this.time)
    }
    // super.Destory()
  }

  beforeDestroy() {}
  private countStart() {
    //window.console.info('执行了开始*------------------------')
    //this.status = '开始'
    this.time = setInterval(() => {
      this.timer()
    }, 1000)
  }
  private countSuspend() {
    //window.console.info('执行了停止*------------------------')
    //this.status = '停止'
    clearInterval(this.time)
  }
  private countReset() {
    //window.console.info('执行了重置*------------------------')
    //this.status = '重置'
    clearInterval(this.time)
    this.y = 1999
    this.m = 1
    this.d = 1
    this.h = 0
    this.mm = 0
    this.s = 0
    let template =
      this.y + '-' + this.add(this.m) + '-' + this.add(this.d) + ' ' + this.add(this.h) + ':' + this.add(this.mm) + ':' + this.add(this.s)
    //window.console.info('template-------------', template)
    let property = this.findPropertyByName(PropertyGroupName.special, '计时器')
    property.value = Date.parse(template)
  }
  get countTime(): string {
    var hh = 0
    if (this.findPropertyByName(PropertyGroupName.special, '计时器')) {
      let property = parseInt(this.findPropertyByName(PropertyGroupName.special, '计时器').value)
      //window.console.info('property-----------------', property)
      var time = new Date(property)
      //window.console.info('time-----------------', time)
      this.y = time.getFullYear()
      this.m = time.getMonth() + 1
      this.d = time.getDate()
      this.h = time.getHours()
      this.mm = time.getMinutes()
      this.s = time.getSeconds()
      if (this.d !== 1) {
        hh = this.d * 24 + this.h - 24
      } else {
        hh = this.h
      }
      let propertyTime = this.add(hh) + ':' + this.add(this.mm) + ':' + this.add(this.s)
      //window.console.info('propertyTime------------', propertyTime)
      return propertyTime

      //return property
    } else {
      return ''
    }
  }
  set countTime(val: string) {
    var property = this.findPropertyByName(PropertyGroupName.special, '计时器')
    this.setPropertyVal(property.id, val)
  }
  get fontColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
    return ''
  }
  get fontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
    return ''
  }
  private add(m) {
    return m < 10 ? '0' + m : m
  }
  private timer() {
    this.s = this.s + 1
    if (this.s >= 60) {
      this.s = 0
      this.mm = this.mm + 1 //分钟
    }
    if (this.mm >= 60) {
      this.mm = 0
      this.h = this.h + 1 //小时
    }
    if (this.h >= 24) {
      this.h = 0
      this.d = this.d + 1
    }
    let template =
      this.y + '-' + this.add(this.m) + '-' + this.add(this.d) + ' ' + this.add(this.h) + ':' + this.add(this.mm) + ':' + this.add(this.s)
    //window.console.info('template-------------', template)
    let property = this.findPropertyByName(PropertyGroupName.special, '计时器')
    property.value = Date.parse(template)
  }

  private toDub(n) {
    //补0操作
    if (n < 10) {
      return '0' + n
    } else {
      return '' + n
    }
  }

  private toDubms(n) {
    //给毫秒补0操作
    if (n < 10) {
      return '00' + n
    } else {
      return '0' + n
    }
  }
}
</script>