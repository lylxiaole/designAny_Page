/*
流程图
By LH
 */
<template>
  <div :style="{width:width+'px',height:height+'px'}">
    <GenoAnyMind ref='editor' :chart-data="flowData" @itemSelectedFunc="itemSelectedFunc" style="height:100%" @doubleClickFunc="doubleClickFunc"
      :showToolbar="showToolbar" :showRightMenu="showRightMenu" :readOnly="readOnly" :title="title" :transform="transform">
    </GenoAnyMind>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  BindingModels_Property,
  PropertyGroupName,
  Boolean_Property,
  TableStyleSetting_Property,
  Number_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { GenoAnyMind } from 'genoany-g6-v2/src/main'
import { param, paramType } from '../../03designerLayoutBase'
@Component({
  components: {
    GenoAnyMind: GenoAnyMind
  }
})
export default class FlowComponent extends ComponentBase {
  //流程图模式，view/edit
  mode: string = 'view'

  //流程图选中事件
  itemSelectedFunc(e: {}) {
    //console.info('itemSelectedFunc', e)
    var newItem = { type: (e as any).type, item: { id: (e as any).item.id, model: (e as any).item.model } }
    this.triggeEvent('元素选中事件', newItem as any)
  }

  doubleClickFunc(e: any) {
    var newItem = { type: (e as any).type, item: { id: (e as any).item.id, model: (e as any).item.model } }
    this.triggeEvent('元素双击事件', newItem)
  }

  reRender: Date = new Date()
  inparam: param[]
  outparam: param
  protected flowModes = ['只读', '编辑']
  public detectZoom() {
    var ratio = 0,
      screen: any = window.screen,
      ua = navigator.userAgent.toLowerCase()

    if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio
    } else if (~ua.indexOf('msie')) {
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI
      }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
      ratio = window.outerWidth / window.innerWidth
    }

    if (ratio) {
      ratio = Math.round(ratio * 100)
    }
    if (this.parentPage.currentScaleSize) {
      this.$nextTick(() => {
        ;(this.$refs.editor as any).zoomOn({ x: 150, y: 150 }, this.parentPage.currentScaleSize)
      })
    }

    return ratio
  }
  mounted() {
    if (this.IsDesigning) {
      this.width = 1200
      this.height = 1000
      this.transform = 1 / this.parentPage.currentScaleSize
      this.registerProperty('模式', PropertyGroupName.special, new Enum_Property(true, this.flowModes), '编辑')
      this.registerProperty('标题', PropertyGroupName.special, new Text_Property(), '脑图设计')
      this.registerProperty('流程数据', PropertyGroupName.special, null, null)

      this.registerProperty('展示操作栏', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('展示右键菜单', PropertyGroupName.special, new Boolean_Property(), false)
    }
    let selectedItem: param[] = []
    this.registerEvents('元素选中事件', '', this.inparam, this.outparam)
    this.registerEvents('元素双击事件', '', this.inparam, this.outparam)

    /**注册组件事件 */
    this.$on('onPropertyChanged', this.onPropertyChangedInner)

    let appendinparam: param[] = []
    appendinparam.push({ name: '父节点', type: paramType.string, val: null })
    appendinparam.push({ name: 'Key值', type: paramType.string, val: null })
    appendinparam.push({ name: '文本', type: paramType.string, val: null })
    appendinparam.push({ name: '数据', type: paramType.complexType, val: null })
    this.registerMethods('添加节点', '', this.appendChild, appendinparam, null)

    let appendMoreParams: param[] = []
    appendMoreParams.push({ name: '数据', type: paramType.string, val: null })
    this.registerMethods('批量添加节点', '', this.appendMoreChild, appendMoreParams, null)

    this.parentPage.$once('pageReadyToDraw', () => {
      ;(this.$refs.editor as any).initOver()
    })
  }
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    //window.console.log('--------------------------------流程树组件数据源变更', property)
    switch (property.propertyName) {
      case '流程数据': {
        let flowItemsProp = this.findPropertyByName(PropertyGroupName.special, '流程数据')
        if (flowItemsProp && flowItemsProp.value !== undefined && flowItemsProp.value !== null && flowItemsProp.value !== '') {
          let flowItems = flowItemsProp.value
          if (flowItems.nodes || flowItems.edges || flowItems.groups) {
            this.flowData = flowItems
          } else {
            flowItems = flowItems.replace(/\n/g, '\\\\n')
            this.flowData = JSON.parse(flowItems)
          }
        } else {
          this.flowData = null
        }
        break
      }
      default:
        break
    }
  }

  get transform(): any {
    if (this.parentPage) {
      if (this.$refs.editor) {
        ;(this.$refs.editor as any).zoomOn({ x: 0, y: 0 }, this.parentPage.currentScaleSize)
      }
      return 1 / this.parentPage.currentScaleSize
    } else {
      return 1
    }
  }

  set transform(val: any) {
    return
  }

  get readOnly(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '模式')
    if (property == undefined) {
      return true
    }
    let nowvalue = property.value == '编辑' ? false : true
    return nowvalue
  }

  set readOnly(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '模式')
    if (val == null) {
      this.setPropertyVal(property.id, true)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get title(): string {
    var property = this.findPropertyByName(PropertyGroupName.special, '标题')
    if (property == undefined) {
      return ''
    }
    return property.value
  }

  set title(val: string) {
    var property = this.findPropertyByName(PropertyGroupName.special, '标题')
    if (val == null || val == undefined) {
      this.setPropertyVal(property.id, '')
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get flowData(): Object {
    var property = this.findPropertyByName(PropertyGroupName.special, '流程数据')
    if (property == undefined) {
      return []
    }
    let nowvalue = property.value
    return nowvalue
  }

  set flowData(val: Object) {
    var property = this.findPropertyByName(PropertyGroupName.special, '流程数据')
    if (!val || val == null || val == '') {
      val = null
      this.setPropertyVal(property.id, null)
    } else {
      this.setPropertyVal(property.id, val)
    }
    ;(this.$refs.editor as any).readData(val)
  }

  get showToolbar(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示操作栏')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set showToolbar(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示操作栏')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }
  get showRightMenu(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示右键菜单')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set showRightMenu(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示右键菜单')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  appendChild(param: any) {
    //console.info('appendChild', param)
    let appendObj = { parent: param[0], id: param[1], label: param[2], tag: param[3], children: [] } as any
    ;(this.$refs.editor as any).appendChild(appendObj)
  }
  appendMoreChild(param: any) {
    let appendObj = param[0] as any
    ;(this.$refs.editor as any).appendChild(appendObj)
  }
}
</script>

<style>
</style>