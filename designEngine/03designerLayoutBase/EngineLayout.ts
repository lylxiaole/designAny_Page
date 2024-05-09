import { Options, Vue } from 'vue-class-component'
import { render } from 'vue'
import { DPropAttr } from './commonClasses/PropertyInfo'

import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'
import { paramType, param } from '@behaviorEngine/index'
import { layoutEvent, layoutMethod, layoutEventBehaviors } from './commonClasses/layoutEvent'
import { Property, PropertySetting, Text_Setting, Behavior_Setting, Number_Setting, PropertyGroupName, Color_Setting, UploadFile_Setting, Boolean_Setting, Enum_Setting, CompPosition_Setting, Margin_Setting, Padding_Setting } from './commonClasses/PropertyInfo'
import { getUuid, deepClone, serialize } from '@common/utils'
import designerContext from '../01designerContext/context'
import { property } from 'xe-utils'

type propertyValidatorHandle = (newval: any) => boolean
class propertyValidatorType {
  propertyId: string
  handle: propertyValidatorHandle
}
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
  public isDesigning: boolean = false
  public isNeedSave: boolean = false
  public designerContext: any = designerContext
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
  /**属性 */
  private properties_old: any[] = []
  public properties: PropertySetting[] = []
  /**父级布局 */
  public parentLayout: EngineLayout
  public get topLayout(): EngineLayout {
    if (!this.parentLayout) {
      return null
    }

    let top: EngineLayout = this.parentLayout

    while (top.parentLayout) {
      top = top.parentLayout
    }
    return top
  }
  /**子级布局 */
  public children: EngineLayout[] = []
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
  /***属性的值验证 */
  public propertyValidators: propertyValidatorType[] = []
  /**自定义事件,图形化编程就是定义自定义事件要做的事情*/
  // private _designerEvents: layoutEvent[] = []
  // public get designerEvents(): layoutEvent[] {
  //   if (!this._designerEvents) {
  //     this._designerEvents = []
  //   }
  //   var property = this.findPropertyByName(PropertyGroupName.normal, '行为绑定')
  //   if (property && !property.value) {
  //     property.value = []
  //   }
  //   /**布局中的所有事件和行为的对应关系 */
  //   var eventBehaviors = property.value as layoutEventBehaviors[]

  //   for (let index = 0; index < this._designerEvents.length; index++) {
  //     const event = this._designerEvents[index]
  //     let behaviorIds: any[] = []
  //     for (let index = 0; index < eventBehaviors.length; index++) {
  //       const o = eventBehaviors[index]
  //       if (o.eventName === event.eventName) {
  //         behaviorIds = o.behaviorIds
  //         break
  //       }
  //     }
  //     event.behaviorIds = behaviorIds
  //   }
  //   return this._designerEvents
  // }
  // public set designerEvents(val: layoutEvent[]) {
  //   var property = this.findPropertyByName(PropertyGroupName.normal, '行为绑定')
  //   var newvals: layoutEventBehaviors[] = []
  //   for (let index = 0; index < val.length; index++) {
  //     const element = val[index]
  //     var nval = new layoutEventBehaviors()
  //     nval.eventName = element.eventName
  //     nval.behaviorIds = element.behaviorIds
  //     newvals.push(nval)
  //   }
  //   property.value = newvals
  // }

  /** 自定义方法,图形化编程会库触发这个方法*/
  private _designerMethods: layoutMethod[] = []
  public get designerMethods(): layoutMethod[] {
    if (!this._designerMethods) {
      this._designerMethods = []
    }
    return this._designerMethods
  }
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
  public Id: string
  @DPropAttr(new Text_Setting('名称', PropertyGroupName.normal, true))
  public name: string
  @DPropAttr(new CompPosition_Setting('布局信息', PropertyGroupName.normal, true, { width: '100%', height: '100%', x: 0, y: 0 }))
  public positionInfo: any
  @DPropAttr(new Margin_Setting('外边距', PropertyGroupName.normal, true, { left: 0, right: 0, top: 0, bottom: 0 }))
  public marginInfo: any
  @DPropAttr(new Margin_Setting('内边距', PropertyGroupName.normal, true, { left: 0, right: 0, top: 0, bottom: 0 }))
  public paddingInfo: any
  @DPropAttr(new Number_Setting('字体大小', PropertyGroupName.normal, true, 14, 'px'))
  public fontSize: number
  @DPropAttr(new Color_Setting('背景色', PropertyGroupName.normal, true, '#FFFFFF'))
  public background: string
  @DPropAttr(new UploadFile_Setting('背景图片', PropertyGroupName.normal, true, [], null, 1, 'image'))
  public background_img: any
  @DPropAttr(new Behavior_Setting('行为绑定', PropertyGroupName.normal, true, []))
  public designerEvents: any

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

  // *************************privates****************************************************************************
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
  private watch_properties_onDesigning(newval: Property[]) {
    // window.console.log('属性变化了', newval)
    for (var j = 0; j < newval.length; j++) {
      var newproperty = newval[j]
      var filter_oldproperty = this.properties_old.find((o) => o.id == newproperty.id)
      if (!filter_oldproperty) {
        //..新增了一个属性
        this.properties_old.push(JSON.parse(JSON.stringify(newproperty)))
        this.isNeedSave = true
        this.$lylemit('onPropertyChanged', newproperty.id, newproperty, this)
      } else if (serialize(filter_oldproperty) != serialize(newproperty)) {
        //..修改了一个属性的内容
        var newpropertyClone = JSON.parse(JSON.stringify(newproperty)) as Property
        //var newpropertyClone = deepClone(newproperty) as Property
        // window.console.log('检测到数据变化:', newproperty)
        /**替换旧的属性 */
        var index = this.properties_old.indexOf(filter_oldproperty)
        this.properties_old.splice(index, 1, newpropertyClone)
        this.isNeedSave = true
        this.$lylemit('onPropertyChanged', newproperty.id, newpropertyClone, this)
      }
    }
  }
  // *************************protect方法****************************************************************************
  protected async renderChildFromData(data: SaveInfo) {}
  protected loadCompleted() {
    this.$lylemit('onLYLMounted', this)
    if (this.isDesigning == true) {
      this.properties_old = deepClone(this.properties)
      this.$watch('properties', this.watch_properties_onDesigning, { deep: true, immediate: false })
    }
  }
  /**添加子级 */
  protected addChild(child: EngineLayout) {
    if (!this.children) {
      this.children = []
    }
    if (this.children.indexOf(child) < 0) {
      this.children.push(child)
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
  protected addProperty(proper: PropertySetting) {
    let find: any = null
    for (let index = 0; index < this.properties.length; index++) {
      const o = this.properties[index]
      if (o.propertyName === proper.propertyName && o.groupName === proper.groupName) {
        find = o
        break
      }
    }

    if (find) {
      window.console.warn('已经存在相同分组相同名称的属性')
      return
    }
    this.properties.push(proper)
  }
  /**添加属性值验证，当属性值变化前进行验证，如果验证不通过则不设置值 */
  protected addPropertyValidator(propertyId: string, validatorHandle: propertyValidatorHandle) {
    var newvaildate = new propertyValidatorType()
    newvaildate.propertyId = propertyId
    newvaildate.handle = validatorHandle
    this.propertyValidators.push(newvaildate)
  }
  /**触发事件 */
  protected async triggerEvent(name: string, inparams: any[]) {}
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
      meta: (this as any).prototype ? (this as any).prototype.$Meta : {},
      properties: [],
      children: []
    }

    for (let index = 0; index < this.properties.length; index++) {
      const element = this.properties[index]
      saveinfo.properties.push({ id: element.id, field: element.field, value: element.value })
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
  /**注册方法 */
  public async registerMethods(name: string, description: string, inParams: param[], outParam: param) {
    var event = this.designerMethods.find((o) => o.eventName == name)
    if (event) {
      window.console.error('注册失败,已经有相同名称的事件存在')
      return
    }
    var newmethod = new layoutMethod()
    newmethod.eventName = name
    newmethod.description = description
    newmethod.inParams = inParams
    newmethod.outParam = outParam
    this.designerMethods.push(newmethod)
  }
  /**注册属性 */
  public async registerProperty(groupName: PropertyGroupName | string, name: string, propertySetting: PropertySetting, defaultVal?: any, canSetting: boolean = true, unit?: string) {
    let find = this.properties.find((o) => o.propertyName == name && o.groupName == groupName)
    if (find) {
      //window.console.warn('已经存在相同分组相同名称的属性！:' + name)
      return
    }

    var newperperty = new PropertySetting(name, groupName, true, defaultVal)
    newperperty.canSetting = canSetting
    if (unit) {
      newperperty.unit = unit
    }
    this.properties.push(newperperty)
  }
  /**注册事件 */
  public async registerEvents(name: string, description: string, inParams: param[], outParam: param) {
    var event = this.designerEvents.find((o) => o.eventName == name)
    if (event) {
      window.console.error('注册失败,已经有相同名称的事件存在')
      return
    }
    var newEvent = new layoutEvent()
    newEvent.eventName = name
    newEvent.description = description
    newEvent.inParams = inParams
    newEvent.outParam = outParam
    this.designerEvents.push(newEvent)
  }
  /**执行组件自定义方法 */
  public async excuteMethod(name: string, inparams: any[]) {
    let method: any = null
    for (let index = 0; index < this.designerMethods.length; index++) {
      const o = this.designerMethods[index]
      if (o.eventName === name) {
        method = o
        break
      }
    }
    if (!method) {
      window.console.error('方法调用失败,该方法不存在')
      return
    }
    return method.callback(inparams)
    //TODO 图形化编程工具会在此处调用注册的方法
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

    for (let index = 0; index < layout_properties.length; index++) {
      const item = layout_properties[index]
      let find = this.properties.find((o) => o.field == item.field)
      if (find) {
        find.id = item.id
        find.value = item.value
        this[item.field] = item.value
      }
    }
  }
  public findProperties(groupName: string, name: string): PropertySetting[] {
    let res: any[] = []
    for (let index = 0; index < this.properties.length; index++) {
      const o = this.properties[index]
      if (o.groupName === groupName && o.propertyName === name) {
        res.push(o)
      }
    }
    return res
  }
  public findPropertyByName(groupName: string, name: string): PropertySetting {
    for (let index = 0; index < this.properties.length; index++) {
      const o = this.properties[index]
      if (o.groupName === groupName && o.propertyName === name) {
        return o
      }
    }
  }
  public findPropertyById(Id: string): PropertySetting {
    for (let index = 0; index < this.properties.length; index++) {
      const o = this.properties[index]
      if (o.id == Id) {
        return o
      }
    }
  }
  public validatorPropertyValue(propertyId: string, val: any): boolean {
    let valodators: any[] = []
    for (let index = 0; index < this.propertyValidators.length; index++) {
      const o = this.propertyValidators[index]
      if (o.propertyId === propertyId) {
        valodators.push(o)
      }
    }

    for (var i = 0; i < valodators.length; i++) {
      var o = valodators[i]
      if (o.handle(val) == false) {
        window.console.error('设置属性值失败，不符合验证要求')
        return false
      }
    }
    return true
  }
  public setPropertyVal(propertyId: string, val: any, isForce: boolean = false): boolean {
    let findproperty: any = null
    for (let index = 0; index < this.properties.length; index++) {
      const o = this.properties[index]
      if (o.id == propertyId) {
        findproperty = o
      }
    }

    if (!findproperty) {
      // window.console.error('设置属性值失败，没有找到对应的属性')
      return false
    }

    let convert_value = findproperty.convert(val)
    if (isForce == false && serialize(findproperty.value) == serialize(convert_value)) {
      return false
    }

    findproperty.value = convert_value
    return true
  }

  // *************************对外公布事件****************************************************************************
  @Emit('onPropertyChanged')
  protected onPropertyChanged(propertyId: string, property: Property, layout: EngineLayout): void {}
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
