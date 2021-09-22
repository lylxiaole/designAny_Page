/*
流程图
By LH
 */
<template>
  <div :style="{width:width+'px',height:height+'px'}">
    <GenoAnyEditor ref='editor' :key="reRender" :chart-data-node-items="treeData" :chart-data="flowData" @itemSelectedFunc="itemSelectedFunc"
      @itemsDeletedFunc="itemsDeletedFunc" @itemsPasteFunc="itemsPasteFunc" @itemsAddFunc="itemsAddFunc" @flowSaveFunc="flowSaveFunc"
      @flowCancleFunc="flowCancleFunc" :mode="mode" style="height:100%" :height="height" @itemsReUnDoFunc="itemsReUnDoFunc"
      @doubleClickFunc="doubleClickFunc" @flowClearFunc="flowClearFunc" :readOnly="readOnly" :showMiniMap="showMiniMap" :allowUnLinked="allowUnLinked"
      :allowLinkSelf="allowLinkSelf" :allowCopyPaste="allowCopyPaste" :allowReUndo="allowReUndo" :allowAddChild="allowAddChild"
      :rightwidth="rightwidth" :isNeedEnd="isNeedEnd" :isNeedStart="isNeedStart" :leftwidth="leftwidth" :showToolbar="showToolbar"
      :allowAdd="allowAdd" :canvaswidth="canvaswidth" :allowItemRemoveGroup="allowItemRemoveGroup" :allowAnyGroup="allowAnyGroup"
      :allowOrGroup="allowOrGroup" :allowGroupOrAny="allowGroupOrAny" :allowClear="allowClear" :allowUnCommonGroup="allowUnCommonGroup"
      :allowGroup="allowGroup" :enable_edit="enable_edit" :enable_add="enable_add" :enable_copy="enable_copy" :enable_set="enable_set"
      :transform="transform" :allowItemAddGroup="allowItemAddGroup" @addFunc="addFunc" @editFunc="editFunc" @copyFunc="copyFunc" @setFunc="setFunc"
      :allowEdit="allowEdit" :allowConfig="allowConfig">
    </GenoAnyEditor>
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
import GenoAnyEditor from '../../../x6/flow.vue'
import { param, paramType } from '../../03designerLayoutBase'
import $ from 'jquery'
@Component({
  components: {
    GenoAnyEditor: GenoAnyEditor
  }
})
export default class FlowX6Component extends ComponentBase {
  //流程图模式，view/edit
  mode: string = 'view'
  buttonTimeOut: boolean = false
  isDouble: boolean = false

  addFunc() {
    this.triggeEvent('新建事件', null)
  }

  editFunc() {
    this.triggeEvent('编辑事件', null)
  }

  copyFunc() {
    this.triggeEvent('复制事件', null)
  }

  setFunc() {
    this.triggeEvent('配置事件', null)
  }

  //流程图选中事件
  itemSelectedFunc(item: {}) {
    //console.info('元素选中事件', item)
    this.triggeEvent('元素选中事件', item as any)
  }
  //流程图元素删除事件
  itemsDeletedFunc(items: []) {
    this.triggeEvent('元素删除事件', items as any)
  }
  //流程图元素粘贴事件
  itemsPasteFunc(items: []) {
    this.triggeEvent('元素粘贴事件', items as any)
  }
  //流程图元素添加事件
  itemsAddFunc(items: []) {
    console.info('封装的组件', items as any)
    console.info(JSON.stringify(items as any))
    this.triggeEvent('元素添加事件', items as any)
  }
  //流程图保存事件
  flowSaveFunc(data: {}) {
    if (!this.buttonTimeOut) {
      this.buttonTimeOut = true
      this.triggeEvent('保存事件', data as any)
      setTimeout(() => {
        this.buttonTimeOut = false
      }, 2000)
    }
  }
  //流程图取消事件
  flowCancleFunc() {
    this.triggeEvent('取消事件', null)
    //console.info('取消事件缩放比例', this.detectZoom())
  }
  //元素撤销、重做事件
  itemsReUnDoFunc(data: []) {
    this.triggeEvent('元素撤销/重做事件', data)
  }
  //流程图清空事件
  flowClearFunc() {
    this.triggeEvent('清空事件', null)
  }

  flowSaveMethod() {
    let flowValidata = (this.$refs.editor as any).saveJson()
    if (flowValidata != null && flowValidata.code === -1) {
      throw flowValidata.msg
    }
    if (flowValidata.msg && flowValidata.msg.groups) {
      flowValidata.msg.groups.map((element) => {
        element.collapsed = false
        if (element.data) {
          if (element.data.tag) {
            element.data.tag = {}
          }
          if (element.data.children) {
            element.data.children = []
          }
        }
      })
    }
    if (flowValidata.msg && flowValidata.msg.nodes) {
      flowValidata.msg.nodes.map((element) => {
        if (element.data && element.data.tag) {
          element.data.tag = {}
        }
      })
    }
    return JSON.stringify(flowValidata.msg)
  }

  getStartNodeId() {
    // let flowValidata = (this.$refs.editor as any).saveJson()
    if (this.$refs.editor) {
      let start_node = (this.$refs.editor as any).getStartNode()
      return start_node
    } else {
      return null
    }
  }
  ChangeRatio() {
    var ratio = 0
    var screen = window.screen as any
    var ua = navigator.userAgent.toLowerCase()

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
    return ratio / 100
  }
  updateNodeTitle(param: any) {
    if (this.$refs.editor) {
      ;(this.$refs.editor as any).updateNodeTitle(param[0], param[1])
    }
  }

  updateNodeColor(param: any) {
    if (this.$refs.editor) {
      ;(this.$refs.editor as any).updateNodeColor(param[0], param[1])
    }
  }

  doubleClickFunc(e: {}) {
    if (!this.isDouble) {
      this.isDouble = true
      this.triggeEvent('元素双击事件', e as any)
      setTimeout(() => {
        this.isDouble = false
      }, 1500)
    }
  }

  getOrAnyNodes() {
    // let flowValidata = (this.$refs.editor as any).saveJson()
    if (this.$refs.editor) {
      let result = (this.$refs.editor as any).getOrAnyNodes()
      return result
    } else {
      return []
    }
  }

  getLastNode() {
    // let flowValidata = (this.$refs.editor as any).saveJson()
    if (this.$refs.editor) {
      let result = (this.$refs.editor as any).getLastNode()
      return result
    } else {
      return []
    }
  }

  reRender: number
  inparam: param[]
  outparam: param
  protected flowModes = ['只读', '编辑']

  mounted() {
    if (this.IsDesigning) {
      this.width = 1200
      this.height = 1000
      this.reRender = new Date().valueOf()
      this.registerProperty('节点数据源', PropertyGroupName.special, null, null)
      this.registerProperty('流程数据', PropertyGroupName.special, null, null)
      this.registerProperty('模式', PropertyGroupName.special, new Enum_Property(true, this.flowModes), '编辑')
      this.registerProperty('左侧宽度', PropertyGroupName.special, new Number_Property(), 1)
      this.registerProperty('画布宽度', PropertyGroupName.special, new Number_Property(), 5)
      this.registerProperty('右侧宽度', PropertyGroupName.special, new Number_Property(), 1.6)
      this.registerProperty('展示操作栏', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('展示缩略地图', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('开始节点', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('结束节点', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('允许清空', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许编组', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('允许或模式', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许任意模式', PropertyGroupName.special, new Boolean_Property(), false)
      // this.registerProperty('允许复制/粘贴', PropertyGroupName.special,new Boolean_Property(),false)
      // this.registerProperty('允许复制/粘贴', PropertyGroupName.special,new Boolean_Property(),false)
      this.registerProperty('允许撤销/重做', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许不连线', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许添加子元素', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('允许自身连线', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许新增节点', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许组元素改变', PropertyGroupName.special, new Boolean_Property(), true)
      this.registerProperty('允许取消编组', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许组内模式', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许组内添加元素', PropertyGroupName.special, new Boolean_Property(), false)
      //允许设置或任意模式
      this.registerProperty('允许设置或任意模式', PropertyGroupName.special, new Boolean_Property(), true)

      this.registerProperty('允许编辑', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许新增', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许复制', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('允许配置', PropertyGroupName.special, new Boolean_Property(), false)

      this.registerProperty('编辑可点击', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('新增可点击', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('复制可点击', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('配置可点击', PropertyGroupName.special, new Boolean_Property(), false)
    }
    //“allowItemRemoveGroup
    let selectedItem: param[] = []
    // selectedItem.push({ name: '当前激活节点', type: paramType.complexType, val: null })
    this.registerEvents('新建事件', '', null, null)
    this.registerEvents('编辑事件', '', null, null)
    this.registerEvents('复制事件', '', null, null)
    this.registerEvents('配置事件', '', null, null)

    this.registerEvents('元素选中事件', '', this.inparam, this.outparam)
    this.registerEvents('元素双击事件', '', this.inparam, this.outparam)
    let deleteItem: param[] = []
    this.registerEvents('元素删除事件', '', this.inparam, this.outparam)
    let pasteItem: param[] = []
    this.registerEvents('元素粘贴事件', '', this.inparam, this.outparam)
    let addItem: param[] = []
    this.registerEvents('元素添加事件', '', this.inparam, this.outparam)
    this.registerEvents('元素撤销/重做事件', '', null, this.outparam)
    this.registerEvents('清空事件', '', null, this.outparam)
    let data: param[] = []
    this.registerEvents('保存事件', '', data, this.outparam)
    this.registerEvents('取消事件', '', null, this.outparam)

    this.registerMethods('流程图保存', '', this.flowSaveMethod, null, null)
    this.registerMethods('获取开始节点', '', this.getStartNodeId, null, null)
    this.registerMethods('获取模式节点', '', this.getOrAnyNodes, null, null)
    this.registerMethods('获取末道节点', '', this.getLastNode, null, null)

    let updateinparam: param[] = []
    updateinparam.push({ name: '节点', type: paramType.string, val: null })
    updateinparam.push({ name: '文本', type: paramType.string, val: null })
    this.registerMethods('修改节点标题', '', this.updateNodeTitle, updateinparam, null)
    let updateColorinparam: param[] = []
    updateColorinparam.push({ name: '节点', type: paramType.string, val: null })
    updateColorinparam.push({ name: '背景色', type: paramType.string, val: null })
    this.registerMethods('修改节点背景色', '', this.updateNodeColor, updateColorinparam, null)
    /**注册组件事件 */
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    this.parentPage.$once('pageReadyToDraw', () => {
      ;(this.$refs.editor as any).initOver()
      //console.info('进来了')
    })
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    //window.console.log('--------------------------------流程树组件数据源变更', property)
    switch (property.propertyName) {
      case '节点数据源':
        // let items = this.findPropertyByName(PropertyGroupName.special, '节点数据源').value
        let items = property.value
        if (items) {
          this.treeData = items
        } else {
          this.treeData = []
        }
        break
      case '流程数据':
        // let flowItems = this.findPropertyByName(PropertyGroupName.special, '流程数据').value
        let flowItems = property.value
        if (!(!flowItems || flowItems == null || flowItems == '')) {
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
      default:
        break
    }
  }

  get transform(): any {
    return 1
  }

  set transform(val: any) {
    return
  }

  get treeData(): Array<Object> {
    var property = this.findPropertyByName(PropertyGroupName.special, '节点数据源')
    if (property == undefined) {
      return []
    }
    let nowvalue = property.value
    return nowvalue
  }
  set treeData(val: Array<Object>) {
    var property = this.findPropertyByName(PropertyGroupName.special, '节点数据源')
    if (val == null) {
      this.setPropertyVal(property.id, [])
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
    console.info('设置数据')
    ;(this.$refs.editor as any).readData(val)
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

  get showMiniMap(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示缩略地图')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set showMiniMap(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '展示缩略地图')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
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

  get allowClear(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许清空')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowClear(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许清空')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowOrGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许或模式')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowOrGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许或模式')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowGroupOrAny(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组内模式')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowGroupOrAny(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组内模式')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowItemAddGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组内添加元素')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowItemAddGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组内添加元素')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowAnyGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许任意模式')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowAnyGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许任意模式')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许编组')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许编组')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowUnLinked(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许自身连线')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowUnLinked(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许自身连线')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowOrAnyGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许设置或任意模式')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowOrAnyGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许设置或任意模式')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get leftwidth(): number {
    var property = this.findPropertyByName(PropertyGroupName.special, '左侧宽度')
    if (property == undefined) {
      return 0
    }
    return property.value
  }

  set leftwidth(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.special, '左侧宽度')
    if (val == null) {
      this.setPropertyVal(property.id, 0)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  set canvaswidth(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.special, '画布宽度')
    if (val == null) {
      this.setPropertyVal(property.id, 0)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get canvaswidth(): number {
    var property = this.findPropertyByName(PropertyGroupName.special, '画布宽度')
    if (property == undefined) {
      return 0
    }
    return property.value
  }

  set rightwidth(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.special, '右侧宽度')
    if (val == null) {
      this.setPropertyVal(property.id, 0)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get rightwidth(): number {
    var property = this.findPropertyByName(PropertyGroupName.special, '右侧宽度')
    if (property == undefined) {
      return 0
    }
    return property.value
  }

  get allowAddChild(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许添加子元素')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowAddChild(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许添加子元素')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowLinkSelf(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许不连线')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowLinkSelf(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许不连线')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowCopyPaste(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许复制')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowCopyPaste(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许复制')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowReUndo(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许撤销/重做')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set allowReUndo(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许撤销/重做')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get isNeedStart(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '开始节点')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set isNeedStart(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '开始节点')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get isNeedEnd(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '结束节点')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set isNeedEnd(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '结束节点')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowAdd(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许新增')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set allowAdd(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许新增')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
    console.info('允许新增', val)
  }

  get allowItemRemoveGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组元素改变')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set allowItemRemoveGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许组元素改变')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowUnCommonGroup(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许取消编组')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set allowUnCommonGroup(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许取消编组')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowEdit(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许编辑')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set allowEdit(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '允许编辑')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get allowConfig(): boolean {
    console.info('getConfig')
    var property = this.findPropertyByName(PropertyGroupName.special, '允许配置')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set allowConfig(val: boolean) {
    console.info('setConfig', val)
    var property = this.findPropertyByName(PropertyGroupName.special, '允许配置')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get enable_edit(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '编辑可点击')
    if (property == undefined) {
      return true
    }
    return property.value
  }

  set enable_edit(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '编辑可点击')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get enable_add(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '新增可点击')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set enable_add(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '新增可点击')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get enable_copy(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '复制可点击')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set enable_copy(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '复制可点击')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  get enable_set(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '配置可点击')
    if (property == undefined) {
      return false
    }
    return property.value
  }

  set enable_set(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.special, '配置可点击')
    if (val == null) {
      this.setPropertyVal(property.id, false)
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  beforeDestroy() {
    console.info('销毁流程图')
    if (this.$refs.editor) {
      ;(this.$refs.editor as any).resultNodes = null

      this.treeData = null
      if ((this.$refs.editor as any).$refs.flowChart) {
        ;(this.$refs.editor as any).$refs.flowChart = null
      }
      if ((this.$refs.editor as any).$refs.flowShow) {
        ;(this.$refs.editor as any).$refs.flowShow = null
      }
      if ((this.$refs.editor as any).$refs.vfeMain) {
        ;(this.$refs.editor as any).$refs.vfeMain = null
      }
      this.$refs.editor = null
    }
  }
}
</script>

<style>
</style>