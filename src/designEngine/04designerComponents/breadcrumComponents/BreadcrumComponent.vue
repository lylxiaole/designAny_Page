/**
 *面包屑组件
 * By LQW
 */
<template>
  <div :style="{background:background}">
    <a-breadcrumb v-if="arrLength>0" style="{height:auto;}">
      <span slot="separator" :style="{color:fontColor,fontSize:fontSize+'px',}">{{separatorIcon}}</span>
      <!--自己使用href属性不会跳转连接，在渲染时，会渲染出a标签，但是没有href属性-->
      <a-breadcrumb-item v-for="(info,index) in breadcrumInfos" :key="index">
        <a-icon v-if="info.breadcrumIconType==1" :type="info.breadcrumIcon" />
        <img referrer="no-referrer|origin|unsafe-url" v-if="info.breadcrumIconType==2" v-lazy="imageUrl[index]"  alt="image" :width="fontSize+'px'" :height="fontSize+'px'" />
        
        <a v-if="info.breadcrumRef" :id="index" :href="outparam" :style="{color:fontColor,fontSize:fontSize+'px',}" @click="onClick"
          @mouseover="e=>onMouseHover(e.target.id)" @mouseout="e=>onMouseOut(e.target.id)">{{info.breadcrumName}}</a>
        <span v-else :id="index" :style="{color:fontColor,fontSize:fontSize+'px',}" @mouseover="e=>onMouseHover(e.target.id)"
          @mouseout="e=>onMouseOut(e.target.id)">{{info.breadcrumName}}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>

  </div>
</template>
<script lang="ts">
//:src="imageUrl[index]"
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '../ComponentBase'
import {
  Property,
  Number_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  UploadFile_Property,
  Color_Property,
  Button_Property,
  PageInParams_Property,
  Boolean_Property,
  Breadcrum_Property,
} from '../../02common/commonClasses/LayoutProperty'
import breadcrumAttributeInfos from '../../02common/commonClasses/breadcrumAttributeInfo'
import breadcrumIcons from '../../02common/commonClasses/breadcrumAttributeInfo'
import { CurrentContext } from '../../01designerContext'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import common from '../../02common/commonMethod'

@Component
export default class BreadcrumComponent extends ComponentBase {
  arrLength: number = 2
  imageUrl: string[] = []
  @Prop() infos: breadcrumIcons[]
  inparam: param[]
  outparam: param

  mounted() {
    this.width = 200
    this.height = 50

    this.RegisterProperty('间隔符', PropertyGroupName.special, new Text_Property(), '>')
    this.RegisterProperty('鼠标悬浮色', PropertyGroupName.special, new Color_Property(), '')
    this.RegisterProperty('属性值', PropertyGroupName.special, new Breadcrum_Property())

    this.RegisterEvents('点击事件', '', this.inparam, this.outparam)

    this.$watch('breadcrumInfos', this.watchBreadcrumAttributeInfo, { deep: true })
  }

  /**鼠标悬浮事件 */
  private onMouseHover(id: string) {
    if (this.FindProperties(PropertyGroupName.special, '鼠标悬浮色')[0]) {
      var hoverColor = this.FindProperties(PropertyGroupName.special, '鼠标悬浮色')[0].value as string
      $(this.$el)
        .find('#' + id)
        .css('color', hoverColor)
    } else {
      $(this.$el)
        .find('#' + id)
        .css('color', '#40a9ff')
    }
  }
  private onMouseOut(id: string) {
    if (this.FindProperties(PropertyGroupName.normal, '前景色')[0]) {
      var outColor = this.FindProperties(PropertyGroupName.normal, '前景色')[0].value as string
      $(this.$el)
        .find('#' + id)
        .css('color', outColor)
    } else {
      return '#000000'
    }
  }
  /**
   * 监听属性值变化事件
   */
  watchBreadcrumAttributeInfo() {
    this.arrLength = this.breadcrumInfos.length
    this.imageUrl.length = this.arrLength
    if (this.arrLength > 0) {
      let valResult = this.breadcrumInfos
      for (let i = 0; i < valResult.length; i++) {
        if (typeof valResult[i].breadcrumImage != 'undefined' && valResult[i].breadcrumImage.length > 0) {
          this.imageUrl[i] = CurrentContext.FileServerAddress + valResult[i].breadcrumImage[0].url.split('?')[0]
        } else {
          this.imageUrl[i] = ''
        }
      }
    }
  }
  /**获取属性值 */
  get breadcrumInfos(): breadcrumAttributeInfos[] {
    var val
    if (this.FindProperties(PropertyGroupName.special, '属性值')[0]) {
      val = this.FindProperties(PropertyGroupName.special, '属性值')[0].value
    }

    if (!val) {
      return [
        {
          key: common.getUuid(),
          breadcrumName: 'Home',
          breadcrumRef: false,
          breadcrumIconType: 1,
          breadcrumIcon: undefined,
          breadcrumImage: [],
          allBreadcrumIcons: null,
        },
        {
          key: common.getUuid(),
          breadcrumName: 'Application',
          breadcrumRef: false,
          breadcrumIconType: 1,
          breadcrumIcon: undefined,
          breadcrumImage: [],
          allBreadcrumIcons: null,
        },
      ]
    }
    return val as breadcrumAttributeInfos[]
  }

  get fontColor(): string {
    if (this.FindProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.FindProperties(PropertyGroupName.normal, '前景色')[0].value as string
    } else {
      return ''
    }
  }
  get fontSize(): string {
    if (this.FindProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.FindProperties(PropertyGroupName.normal, '字体')[0].value as string
    } else {
      return ''
    }
  }

  get separatorIcon(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '间隔符')) {
      return this.FindPropertyByName(PropertyGroupName.special, '间隔符').value as string
    } else {
      return ''
    }
  }

  /**对外公布的事件 */
  onClick() {
    this.TriggeEvent('点击事件', null)
  }
}
</script>
<style scoped>
</style>