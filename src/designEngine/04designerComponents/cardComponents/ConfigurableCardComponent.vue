/**
 * 可配置卡片
 * By GG
 */
<template>
  <a-card hoverable style="width: 300px">
    <img referrer="no-referrer|origin|unsafe-url" :alt="coverAlt" v-lazy="coverPath" slot="cover" />
    <template class="ant-card-actions" slot="actions">
      <a-icon v-for="item in types" :type="item" :key="item" />
      <!-- <a-button v-for="item in types" :icon="item" :key="item" style="border:none" @click='handelClick(item)'></a-button> -->
    </template>
    <a-card-meta :title="title" :description="desc">
      <a-avatar slot="avatar" :src="head" />
    </a-card-meta>
  </a-card>
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
  UploadFile_Property
} from '../../03designerLayoutBase'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import fileUpload from '../../02common/uploadFile/fileUpload'
import { ComponentBase } from '../../03designerLayoutBase'
import BaseEvents from '../../03designerLayoutBase/BaseEvents'
import { getUuid, deepClone } from '@src/utils'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import TextComponent from '../textComponents/TextComponent.vue'
import { CurrentContext } from '../../01designerContext'
import { param, paramType } from '../../03designerLayoutBase'

@Component({
  components: {}
})
export default class ConfigurableCardComponent extends ComponentBase {
  fileUploadClass: fileUpload = null
  coverFileName: string = ''
  inparam: param[]

  data() {
    return {}
  }
  created() {}

  mounted() {
    this.width = 259
    this.height = 300
    this.CaptureEvent()
    this.canDrop = true
    this.canDrag = true
    this.onDrag_Event = this.ListenDrag_Event
    //注册特有属性
    this.registerProperty('卡片标题', PropertyGroupName.special, new Text_Property(), '请设置')
    this.registerProperty('描述', PropertyGroupName.special, new Text_Property(), '描述')
    this.registerProperty('封面', PropertyGroupName.special, new UploadFile_Property(1, ''))
    this.registerProperty('头像', PropertyGroupName.special, new UploadFile_Property(1, ''))
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    this.types.forEach((element) => {
      this.registerEvents(element + '事件', '', this.inparam, null)
    })
  }
  private image(propertyName: string): string {
    if (this.findProperties(PropertyGroupName.special, propertyName)[0]) {
      let selectValues = this.findProperties(PropertyGroupName.special, propertyName)[0].value
      if (selectValues && selectValues.length > 0) {
        let fullpath = BuildingFileUrlForShow(CurrentContext.FileServerAddress, selectValues[0].url)
        if (propertyName === '封面') {
          const names = selectValues[0].name.split('/')
          if (names && names.length > 0) {
            this.coverFileName = names[1]
          }
        }
        return fullpath
      }
      return ''
    } else {
      return ''
    }
  }
  get title(): string {
    if (this.findProperties(PropertyGroupName.special, '卡片标题')[0]) {
      return this.findProperties(PropertyGroupName.special, '卡片标题')[0].value
    } else {
      return ''
    }
  }
  get desc(): string {
    if (this.findProperties(PropertyGroupName.special, '描述')[0]) {
      return this.findProperties(PropertyGroupName.special, '描述')[0].value
    } else {
      return ''
    }
  }
  get coverPath(): string {
    return this.image('封面')
  }
  get coverAlt(): string {
    if (this.coverFileName !== '') {
      return this.coverFileName
    } else {
      return ''
    }
  }
  get head() {
    return this.image('头像')
  }
  //后面根据iocn库选择对应的图标
  get types(): string[] {
    return ['setting', 'edit', 'smile', 'ellipsis']
  }

  // 右侧组件拖拽信息，属性的设置
  private ListenDrag_Event(el: Element, dragdata: DragItemData<any>) {}

  //  拖到容器后获取信息
  private ListenDrop_Event(el: Element, targetContainer: Element) {}
}
</script>
<style scoped>
</style>