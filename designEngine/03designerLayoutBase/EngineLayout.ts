import { Options, Vue } from 'vue-class-component'
import { render, toRaw } from 'vue'
import { DPropAttr } from './commonClasses/PropertyInfo'
import { DMethodAttr } from './commonClasses/MethodInfo'
import { LayoutEvent, LayoutEventBehaviors, DEventAttr } from './commonClasses/EventInfo'
import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'
import { paramType, param } from '@behaviorEngine/index'
import { LayoutMethod } from './commonClasses/MethodInfo'
import { Property, PropertySetting, Text_Setting, Behavior_Setting, Number_Setting, PropertyGroupName, Color_Setting, UploadFile_Setting, Boolean_Setting, Enum_Setting, CompPosition_Setting, Margin_Setting, Padding_Setting } from './commonClasses/PropertyInfo'
import { getUuid, deepClone, serialize } from '@common/utils'

export class SaveInfo {
  id: string
  meta: any
  properties: Property[]
  children: SaveInfo[]
}
export class Point {
  X: number = -1
  Y: number = -1
}

@Options({})
export default class EngineLayout extends Vue {
  public renderContainer: any = {}
  public isNeedSave: boolean = false
  // ******实现vue2.0中的事件监听**************************
  private lylevents: any = {}
  private lyleventsOnce: any = {}
  public $on(eventname, callback) {
    if (!this.lylevents[eventname]) {
      this.lylevents[eventname] = []
    }
    this.lylevents[eventname].push(callback)
  }
  public $once(eventname, callback) {
    if (!this.lyleventsOnce[eventname]) {
      this.lyleventsOnce[eventname] = []
    }
    this.lyleventsOnce[eventname].push(callback)
  }
  public $off() {
    this.lylevents = {}
    this.lyleventsOnce = {}
  }
  public $lylemit(event: string, ...args: any[]) {
    this.$emit(event, args)
    if (this.lylevents[event]) {
      for (let index = 0; index < this.lylevents[event].length; index++) {
        const callback = this.lylevents[event][index]
        callback(...args)
      }
    }
    if (this.lyleventsOnce[event]) {
      for (let index = 0; index < this.lyleventsOnce[event].length; index++) {
        const callback = this.lyleventsOnce[event][index]
        callback(...args)
      }
    }
  }
  // ********************************
  public isSelected: boolean = false

  /**父级布局 */
  public parentLayout: EngineLayout
  /**子级布局 */
  public children: EngineLayout[] = []

  public get topLayout(): EngineLayout {
    if (!this.parentLayout) {
      return this
    }

    let top: EngineLayout = this.parentLayout

    while (top.parentLayout) {
      top = top.parentLayout
    }
    return top
  }
  /**当前选中的直接子级布局 */
  public get selectedChildren(): EngineLayout[] {
    let res: any[] = []
    for (let index = 0; index < this.children.length; index++) {
      const o = this.children[index]
      if (o.isSelected == true) {
        res.push(o)
      }
    }

    return res
  }

  @Prop()
  public isDesigning: boolean
  @Prop()
  public designerMethods: LayoutMethod[]
  @Prop()
  public designerEvents: LayoutEvent[]
  @Prop()
  public properties: PropertySetting[]
  @Prop()
  public designerContext: any

  /**生命周期 */
  created() {}
  /**生命周期 */
  mounted() {}
  /**生命周期 */
  updated() {
    this.$lylemit('onLYLUpdated', this)
  }
  /**生命周期 */
  unmounted() {
    // window.console.log('销毁了页面组件:', this.Id)
    this.$lylemit('onLYLDestroyed', this)
  }
  // *************************基础属性****************************************************************************
  @DPropAttr(new Text_Setting('唯一ID', PropertyGroupName.normal, false))
  public Id: string = getUuid()
  @DPropAttr(new Text_Setting('名称', PropertyGroupName.normal, true))
  public name: string = ''
  @DPropAttr(new CompPosition_Setting('布局信息', PropertyGroupName.normal, true))
  public positionInfo: any = { width: '100%', height: '100%', x: 0, y: 0 }
  @DPropAttr(new Margin_Setting('外边距', PropertyGroupName.normal, true))
  public marginInfo: any = { left: 0, right: 0, top: 0, bottom: 0 }
  @DPropAttr(new Margin_Setting('内边距', PropertyGroupName.normal, true))
  public paddingInfo: any = { left: 0, right: 0, top: 0, bottom: 0 }
  @DPropAttr(new Number_Setting('字体大小', PropertyGroupName.normal, true, 'px'))
  public fontSize: number = 14
  @DPropAttr(new Color_Setting('背景色', PropertyGroupName.normal, true))
  public background: string = '#FFFFFF'
  @DPropAttr(new UploadFile_Setting('背景图片', PropertyGroupName.normal, true, null, 1, 'image'))
  public background_img: any = []
  @DPropAttr(new Behavior_Setting('行为绑定', PropertyGroupName.normal, true))
  public behaviorBinds: LayoutEventBehaviors[] = []

  public get width(): any {
    return this.positionInfo.width
  }
  public set width(val: any) {
    this.positionInfo.width = val
  }
  public get height(): any {
    return this.positionInfo.height
  }
  public set height(val: any) {
    this.positionInfo.height = val
  }
  public get left(): any {
    return this.positionInfo.x
  }
  public set left(val: any) {
    this.positionInfo.x = val
  }
  public get top(): any {
    return this.positionInfo.y
  }
  public set top(val: any) {
    this.positionInfo.y = val
  }
  public get margin_left(): number {
    return this.marginInfo.left as number
  }
  public set margin_left(val: number) {
    this.marginInfo.left = val
  }
  public get margin_right(): number {
    return this.marginInfo.right as number
  }
  public set margin_right(val: number) {
    this.marginInfo.right = val
  }
  public get margin_top(): number {
    return this.marginInfo.top
  }
  public set margin_top(val: number) {
    this.marginInfo.top = val
  }
  public get margin_bottom(): number {
    return this.marginInfo.bottom
  }
  public set margin_bottom(val: number) {
    this.marginInfo.bottom = val
  }
  public get padding_left(): number {
    return this.paddingInfo.left
  }
  public set padding_left(val: number) {
    this.paddingInfo.left = val
  }
  public get padding_right(): number {
    return this.paddingInfo.right
  }
  public set padding_right(val: number) {
    this.paddingInfo.right = val
  }
  public get padding_top(): number {
    return this.paddingInfo.top
  }
  public set padding_top(val: number) {
    this.paddingInfo.top = val
  }
  public get padding_bottom(): number {
    return this.paddingInfo.bottom
  }
  public set padding_bottom(val: number) {
    this.paddingInfo.bottom = val
  }

  // *************************privates***********************************************************************
  public async destorymethod() {
    this.$off()
    for (let index = 0; index < this.children.length; index++) {
      const o = this.children[index]

      o.destorymethod()
    }
    render(null, this.renderContainer)
    $(this.$el).remove()
    for (const key in (this as any).prototype) {
      delete (this as any).prototype[key]
    }
    for (const key in this) {
      delete this[key]
    }
  }
  private async getChildrenData(): Promise<SaveInfo[]> {
    var res: SaveInfo[] = []
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index]
      var childdata = await child.getSaveData()
      res.push(childdata)
    }
    return res
  }
  private async loadChildrenData(childrendatas: SaveInfo[]) {
    for (let index = 0; index < childrendatas.length; index++) {
      const o = childrendatas[index]
      await this.renderChildFromData(o)
    }
  }
  private watch_properties_onDesigning(field: string, newval: any) {
    // console.log('***************watch_properties_onDesigning:', field, newval)
    this.isNeedSave = true
    this.onDPropertyChange(this, field, newval)
  }
  // *************************protect方法**********************************************************************
  protected async renderChildFromData(data: SaveInfo) {}
  protected loadCompleted() {
    this.$lylemit('onLYLMounted', this)
  }
  /**添加子级 */
  protected addChild(child: EngineLayout) {
    if (!this.children) {
      this.children = []
    }
    if (this.children.indexOf(child) < 0) {
      this.children.push(child)
      this.isNeedSave = true
      this.$lylemit('onChildrenCountChange')
    }
  }
  protected addChilds(childs: EngineLayout[]) {
    if (!this.children) {
      this.children = []
    }
    if (childs && childs.length > 0) {
      for (let index = 0; index < childs.length; index++) {
        const child = childs[index]
        this.addChild(child)
      }
    }
  }
  protected removeChild(child: EngineLayout) {
    let index = this.children.indexOf(child)
    if (index < 0) {
      return
    }
    try {
      $(child.$el).remove()
      child.destorymethod()
    } catch (error) {
      window.console.error(error)
    }
    this.children.splice(index, 1)
    this.isNeedSave = true
    this.$lylemit('onChildrenCountChange')
  }
  protected removeChilds(childs: EngineLayout[]) {
    if (childs && childs.length > 0) {
      for (let index = 0; index < childs.length; index++) {
        const child = childs[index]
        this.removeChild(child)
      }
    } else {
      return
    }
  }
  protected removeAllChilds() {
    if (this.children && this.children.length > 0) {
      this.removeChilds(this.children)
    } else {
      return
    }
  }
  // *************************对外公布方法****************************************************************************
  public async loadData(data: SaveInfo) {
    this.children = []
    if (data && data.id) {
      await this.loadingProperties(data.properties)
      this.Id = data.id
    }

    if (data && data.children) {
      await this.loadChildrenData(data.children)
    }
    ///监听属性变化
    if (this.isDesigning == true) {
      await this.$nextTick()
      for (let index = 0; index < this.properties.length; index++) {
        const prop = this.properties[index]
        this.$watch(
          prop.field,
          (newval) => {
            this.watch_properties_onDesigning(prop.field, newval)
          },
          { deep: true }
        )
      }
    }
    this.loadCompleted()
  }
  public async reLoadData(data: SaveInfo) {
    for (let index = 0; index < this.children.length; index++) {
      const element = this.children[index]
      element.destorymethod()
    }
    this.children = []

    await this.loadData(data)
  }
  public async getSaveData(): Promise<SaveInfo> {
    var saveinfo: SaveInfo = {
      id: this.Id,
      meta: (this as any).compInfo,
      properties: [],
      children: []
    }

    let initProperties = this.properties

    for (let index = 0; index < initProperties.length; index++) {
      const element = initProperties[index]
      let field = element.field
      saveinfo.properties.push({ field: element.field, value: this[field] })
    }

    saveinfo.children = await this.getChildrenData()
    return saveinfo
  }

  public findSelectedLayoutsRecursion(comps: EngineLayout[]): EngineLayout[] {
    var res: EngineLayout[] = []
    for (let index = 0; index < comps.length; index++) {
      const comp = comps[index]
      if (comp.isSelected == true) {
        res.push(comp)
      }
      if (comp.children) {
        var finds = this.findSelectedLayoutsRecursion(comp.children)
        res = res.concat(finds)
      }
    }
    return res
  }
  public findLayoutRecursion(id: string, lays: EngineLayout[]): EngineLayout {
    //添加空值判断
    if (!lays) {
      return null
    }
    for (let index = 0; index < lays.length; index++) {
      const layout = lays[index]
      if (layout.Id == id) {
        return layout
      }
      var findc = this.findLayoutRecursion(id, layout.children)
      if (findc) {
        return findc
      }
    }
    return null
  }

  /**递归删除子组件 */
  public removeChildRecursion(childId: string) {
    var find = this.findLayoutRecursion(childId, this.children)
    find.parentLayout.removeChild(find)
  }
  /**通过已有数据加载 */
  public async loadingProperties(layout_properties: Property[]) {
    if (!layout_properties) {
      return
    }

    let initProperties = this.properties
    for (let index = 0; index < layout_properties.length; index++) {
      const item = layout_properties[index]
      let find = initProperties.find((o) => o.field == item.field)
      if (find) {
        this[item.field] = item.value
      }
    }
  }
  public findProperties(groupName: string, name: string): PropertySetting[] {
    let res: any[] = []
    let initProperties = this.properties

    for (let index = 0; index < initProperties.length; index++) {
      const o = initProperties[index]
      if (o.groupName === groupName && o.propertyName === name) {
        res.push(o)
      }
    }
    return res
  }
  public findPropertyByName(groupName: string, name: string): PropertySetting {
    let initProperties = this.properties
    for (let index = 0; index < initProperties.length; index++) {
      const o = initProperties[index]
      if (o.groupName === groupName && o.propertyName === name) {
        return o
      }
    }
  }
  public findPropertyById(Id: string): PropertySetting {
    let initProperties = this.properties
    for (let index = 0; index < initProperties.length; index++) {
      const o = initProperties[index]
      if (o.id == Id) {
        return o
      }
    }
  }
  // *************************对外公布事件****************************************************************************
  @Emit('onDPropertyChange')
  protected onDPropertyChange(layout: EngineLayout, field: string, val: any) {}

  @Emit('onChildrenCountChange')
  protected onChildrenCountChange() {}
  @Emit('onLYLCreated')
  protected onLYLCreated(layout: EngineLayout) {}
  @Emit('onLYLMounted')
  protected onLYLMounted(layout: EngineLayout) {}
  @Emit('onLYLUpdated')
  protected onLYLUpdated(layout: EngineLayout) {}
  @Emit('onLYLSizeChanged')
  protected onLYLSizeChanged(e: any) {}
  @Emit('onLYLDestroyed')
  protected onLYLDestroyed(layout: EngineLayout): void {}
}
