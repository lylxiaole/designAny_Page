/**
 * 四边形，显示图片用
 * By JBM
 * 日期
 */
<template>
  <div :style="{'border-width':borderWidth,'border-color':bordercolor,'border-style':borderStyle
            ,'background-size':backImagesize,'border-left-width':borderLeftWidth,'border-top-width':borderTopWidth
            ,'border-right-width':borderRightWidth,'border-bottom-width':borderBottomWidth
            ,'border-radius':borderRadius ,'background-color':backGroundColor}" class="quadrangle">
    <div v-if="backImage.length>0" style="width:100%;height:100%;">
      <img :src="backImage" style="width:100%;height:100%;display:block;" referrer="no-referrer|origin|unsafe-url" />
    </div>
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
  Color_Property,
  PropertyGroupName
} from '../../03designerLayoutBase'
import { getUuid, deepClone, BuildingFileUrlForShow } from '@src/utils'

import { ComponentBase } from '../../03designerLayoutBase'
import { CurrentContext } from '../../01designerContext'

@Component
export default class QuadrangleComponent extends ComponentBase {
  created() {}
  mounted() {
    this.width = 200
    this.height = 200
    //注册属性
    this.registerProperty('图片填充', PropertyGroupName.special, new Enum_Property(true, ['自适应', '填充', '无缩放']), '无缩放')
    this.registerProperty('边框宽度', PropertyGroupName.special, new Number_Property(), 5)
    this.registerProperty('边框颜色', PropertyGroupName.special, new Color_Property(), 'white')
    this.registerProperty('圆角半径', PropertyGroupName.special, new Number_Property(), 4)
    this.registerProperty('边框样式', PropertyGroupName.special, new Enum_Property(true, ['无边框', '实线', '虚线']), '实线')
    // this.registerProperty(
    //   '边框样式',
    //   PropertyGroupName.normal,
    //   new Enum_Property(true, ['无边框', '实线', '虚线', '内框', '外框', '双边框', '凹陷', '凸起', '点线 ']),
    //   '实线'
    // )
    //注册特有属性
    this.registerProperty('左边框显示', PropertyGroupName.special, new Enum_Property(true, ['显示', '隐藏']), '显示')
    this.registerProperty('右边框显示', PropertyGroupName.special, new Enum_Property(true, ['显示', '隐藏']), '显示')
    this.registerProperty('上边框显示', PropertyGroupName.special, new Enum_Property(true, ['显示', '隐藏']), '显示')
    this.registerProperty('下边框显示', PropertyGroupName.special, new Enum_Property(true, ['显示', '隐藏']), '显示')
  }

  //公有属性
  get borderStyle(): string {
    if (this.findProperties(PropertyGroupName.special, '边框样式')[0]) {
      if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '实线') return 'solid'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '无边框') return 'none'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '点线') return 'dotted'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '虚线') return 'dashed'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '内框') return 'inset'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '外框') return 'outset'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '双边框') return 'double'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '凹陷') return 'groove'
      else if (this.findProperties(PropertyGroupName.special, '边框样式')[0].value === '凸起') return 'ridge'
      else return 'solid'
    }
  }

  get borderRadius(): string {
    if (this.findProperties(PropertyGroupName.special, '圆角半径')[0]) {
      return (this.findProperties(PropertyGroupName.special, '圆角半径')[0].value as string) + 'px'
    }
  }

  get bordercolor(): string {
    if (this.findProperties(PropertyGroupName.special, '边框颜色')[0]) {
      return this.findProperties(PropertyGroupName.special, '边框颜色')[0].value as string
    }
  }

  get backGroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      //console.log('绝对路径背景图片URl：', this.findProperties(PropertyGroupName.normal, '背景色')[0].value)
      return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
    }
  }

  get backImage(): string {
    let findprop = this.findPropertyByName(PropertyGroupName.normal, '背景图片')
    if (findprop) {
      var imagUrl = findprop.value
      if (imagUrl && imagUrl[0]) {
        // console.log('相对路径背景图片URl：', this.findProperties(PropertyGroupName.normal, '背景图片')[0].value[0].url)
        let fullpath = BuildingFileUrlForShow(CurrentContext.FileServerAddress, imagUrl[0].url)

        // console.log('绝对路径背景图片URl：', fullpath)
        return fullpath
      } else {
        return ''
      }
    }
    return ''
  }

  get backImagesize(): string {
    if (this.findProperties(PropertyGroupName.special, '图片填充')[0]) {
      if (this.findProperties(PropertyGroupName.special, '图片填充')[0].value === '无缩放') {
        return 'auto'
      } else if (this.findProperties(PropertyGroupName.special, '图片填充')[0].value === '自适应') {
        return 'cover'
      } else if (this.findProperties(PropertyGroupName.normal, '图片填充')[0].value === '填充') {
        return 'contain'
      } else {
      }
      return 'auto'
    }
  }

  get borderWidth(): string {
    if (this.findProperties(PropertyGroupName.special, '边框宽度')[0]) {
      return (this.findProperties(PropertyGroupName.special, '边框宽度')[0].value as string) + 'px'
    }
  }

  get borderLeftWidth(): string {
    if (this.findProperties(PropertyGroupName.special, '左边框显示')[0]) {
      if (this.findProperties(PropertyGroupName.special, '左边框显示')[0].value === '显示') {
        if (this.findProperties(PropertyGroupName.special, '边框宽度')[0]) {
          return (this.findProperties(PropertyGroupName.special, '边框宽度')[0].value as string) + 'px'
        } else return '0px'
      } else return '0px'
    }
  }

  get borderTopWidth(): string {
    if (this.findProperties(PropertyGroupName.special, '上边框显示')[0]) {
      if (this.findProperties(PropertyGroupName.special, '上边框显示')[0].value === '显示') {
        if (this.findProperties(PropertyGroupName.special, '边框宽度')[0]) {
          return (this.findProperties(PropertyGroupName.special, '边框宽度')[0].value as string) + 'px'
        } else return '0px'
      } else return '0px'
    }
  }

  get borderRightWidth(): string {
    if (this.findProperties(PropertyGroupName.special, '右边框显示')[0]) {
      if (this.findProperties(PropertyGroupName.special, '右边框显示')[0].value === '显示') {
        if (this.findProperties(PropertyGroupName.special, '边框宽度')[0]) {
          return (this.findProperties(PropertyGroupName.special, '边框宽度')[0].value as string) + 'px'
        } else return '0px'
      } else return '0px'
    }
  }
  get borderBottomWidth(): string {
    if (this.findProperties(PropertyGroupName.special, '下边框显示')[0]) {
      if (this.findProperties(PropertyGroupName.special, '下边框显示')[0].value === '显示') {
        if (this.findProperties(PropertyGroupName.special, '边框宽度')[0]) {
          return (this.findProperties(PropertyGroupName.special, '边框宽度')[0].value as string) + 'px'
        } else return '0px'
      } else return '0px'
    }
  }
}
</script>
<style scoped lang="less">
// .designerThemeStyle {
//   .quadrangle {
//     background-color: blue !important;
//   }
// }
</style>



