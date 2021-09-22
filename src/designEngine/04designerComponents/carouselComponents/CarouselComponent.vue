/**
 * 走马灯
 * By CS
 */
<template>
  <div>
    <a-row style="background:transparent;width:100%;height:100%;border: 1px solid skyblue">
      <a-carousel ref="carousel" :autoplay="autoplay" :autoplaySpeed="autoplaySpeed" :vertical="vertical" :effect="effect" :dots="dots">
        <div v-for="item in imgSrcList" :key="item.key"
          :style="{'background-image':'url(' + item + ')' ,'background-size':backImagesize,'height':divHeight}">
        </div>
      </a-carousel>
    </a-row>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  Boolean_Property,
  PropertyGroupName,
  Number_Property,
  UploadFile_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { CurrentContext } from '../../01designerContext'

@Component
export default class CarouselComponent extends ComponentBase {
  get imgSrcList() {
    if (this.findProperties(PropertyGroupName.special, '选择文件')[0]) {
      let imgSrcArr: string[] = []
      let selectValues = this.findProperties(PropertyGroupName.special, '选择文件')[0].value
      if (selectValues && selectValues.length > 0) {
        for (let index = 0; index < selectValues.length; index++) {
          let element = selectValues[index]
          let fullpath = CurrentContext.FileServerAddress + element.url
          imgSrcArr.push(fullpath)
          //imgSrcArr.push("http://172.16.50.87:30040/fileservice/"+element.url)
        }
        return imgSrcArr
      }
      return ''
    } else {
      return ''
    }

    // return ['https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/abstract01.jpg',
    // 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/abstract02.jpg',
    // 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/abstract03.jpg',
    // 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/abstract04.jpg']
  }

  get autoplay(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否轮播')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否轮播')[0].value as boolean
    }
    return false
  }

  get autoplaySpeed(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '轮播速度')) {
      return this.findPropertyByName(PropertyGroupName.special, '轮播速度').value as number
    } else {
      return 0
    }
  }

  get vertical(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '垂直显示')) {
      return this.findPropertyByName(PropertyGroupName.special, '垂直显示').value as boolean
    }
    return false
  }

  get backImagesize(): string {
    if (this.findProperties(PropertyGroupName.special, '图片填充方式')[0]) {
      if (this.findProperties(PropertyGroupName.special, '图片填充方式')[0].value === '无缩放') {
        return 'auto'
      } else if (this.findProperties(PropertyGroupName.special, '图片填充方式')[0].value === '自适应') {
        return 'cover'
      } else if (this.findProperties(PropertyGroupName.special, '图片填充方式')[0].value === '填充') {
        return 'contain'
      }
      return 'auto'
    } else {
      return 'auto'
    }
  }

  get divHeight(): string {
    return this.height + 'px'
  }

  //动画效果函数，可取 scrollx, fade
  get effect(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '动画效果')) {
      return this.findPropertyByName(PropertyGroupName.special, '动画效果').value === '滚动' ? 'scrollx' : 'fade'
    } else {
      return 'scrollx'
    }
  }

  get dots(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否显示面板指示点')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否显示面板指示点').value as boolean
    }
    return false
  }

  next(): void {
    var carousel = this.$refs.carousel as any
    carousel.next()
  }

  mounted() {
    this.width = 200
    this.height = 200
    this.registerProperty('选择文件', PropertyGroupName.special, new UploadFile_Property(10, 'image'))
    this.registerProperty('是否轮播', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('轮播速度(毫秒)', PropertyGroupName.special, new Number_Property(), 500)
    this.registerProperty('图片填充方式', PropertyGroupName.special, new Enum_Property(true, ['自适应', '填充', '无缩放']), '无缩放')
    this.registerProperty('垂直显示', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('动画效果', PropertyGroupName.special, new Enum_Property(true, ['滚动', '渐变']), '滚动')
    this.registerProperty('是否显示面板指示点', PropertyGroupName.special, new Boolean_Property(), true)

    this.registerMethods('切换到下一张', '', this.next, null, null)
  }
}
</script>

<style scoped>
/* .ant-carousel >>> .slick-slide img{
    margin: auto;
    max-width: 100%;
} */
</style>