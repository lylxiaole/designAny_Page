import { Component } from 'vue-property-decorator'
import BaseEvents from './BaseEvents'
import { layoutEvent, layoutMethod, param, paramType } from './commonClasses/layoutEvent'
import { layoutEventBehaviors } from './behavior/behaviorTypes'
import { Property, PropertyType, Text_Property, Behavior_Property, Number_Property, PropertyGroupName, Color_Property, UploadFile_Property, Boolean_Property, EnumModal_Property, Enum_Property } from './commonClasses/LayoutProperty'
import { getUuid, deepClone, serialize, drawVueOnVirtualDom } from '@src/utils'

export enum LayoutType {
  /**系统组件 */
  system_component = 'system_component',
  /**组件模板 */
  component_template = 'component_template',
  /**功能组件 */
  functional_component = 'functional_component'
}
export class LayoutInfo {
  constructor(_type: LayoutType, _groupName: string, _name: string, _component: any, _icon: any, _sourceId?: string, _compCode?: string) {
    this.type = _type
    this.groupName = _groupName
    this.name = _name
    this.component = _component
    this.sourceId = _sourceId
    this.icon = _icon
    this.compCode = _compCode
  }
  type: LayoutType
  compCode: string
  groupName: string = ''
  name: string = ''
  component: any
  icon: any
  ///
  sourceId: string
  isNew: boolean
  data: any
}
type propertyValidatorHandle = (newval: any) => boolean
class propertyValidatorType {
  propertyId: string
  handle: propertyValidatorHandle
}
export class SaveInfo {
  id: string
  properties: Property[]
  children: SaveInfo[]
}
export class Point {
  X: number = -1
  Y: number = -1
}
@Component
export default class LayoutBase extends BaseEvents {
  public isSelected: boolean = false
  /**属性 */
  private properties_old: any[] = []
  public properties: Property[] = []
  /**父级布局 */
  public parentLayout: LayoutBase
  /**子级布局 */
  public children: LayoutBase[] = []
  /**当前选中的直接子级布局 */
  public get selectedChildren(): LayoutBase[] {
    return this.children.filter((o) => o.isSelected == true)
  }
  /***属性的值验证 */
  public propertyValidators: propertyValidatorType[] = []
  /**自定义事件,图形化编程就是定义自定义事件要做的事情*/
  private _designerEvents: layoutEvent[] = []
  public get designerEvents(): layoutEvent[] {
    if (!this._designerEvents) {
      this._designerEvents = []
    }
    var property = this.findPropertyByName(PropertyGroupName.normal, '行为设置')

    if (property && !property.value) {
      property.value = []
    }
    /**布局中的所有事件和行为的对应关系 */
    var eventBehaviors = property.value as layoutEventBehaviors[]

    for (let index = 0; index < this._designerEvents.length; index++) {
      const event = this._designerEvents[index]
      var find = eventBehaviors.find((o) => o.eventName == event.eventName)
      if (find) {
        event.behaviorIds = find.behaviorIds
      }
    }
    return this._designerEvents
  }
  public set designerEvents(val: layoutEvent[]) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '行为设置')
    var newvals: layoutEventBehaviors[] = []
    for (let index = 0; index < val.length; index++) {
      const element = val[index]
      var nval = new layoutEventBehaviors()
      nval.eventName = element.eventName
      nval.behaviorIds = element.behaviorIds
      newvals.push(nval)
    }
    property.value = newvals
  }
  /** 自定义方法,图形化编程会库触发这个方法*/
  private _designerMethods: layoutMethod[] = []
  public get designerMethods(): layoutMethod[] {
    if (!this._designerMethods) {
      this._designerMethods = []
    }
    return this._designerMethods
  }
  /**生命周期 */
  created() {
    if (this.isDesigning) {
      this.registerProperty(PropertyGroupName.normal, '唯一Id', new Text_Property(), getUuid(), false, false)
      this.registerProperty(PropertyGroupName.normal, '名称', new Text_Property())
      this.registerProperty(PropertyGroupName.normal, '宽度', new Number_Property(), 1624, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '高度', new Number_Property(), 786, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '左边位置', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '顶部位置', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '外边距-左', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '外边距-右', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '外边距-上', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '外边距-下', new Number_Property(-100000), 0, true, true, 'px')

      this.registerProperty(PropertyGroupName.normal, '内边距-左', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '内边距-右', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '内边距-上', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '内边距-下', new Number_Property(-100000), 0, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '字体', new Number_Property(), 14, true, true, 'px')
      this.registerProperty(PropertyGroupName.normal, '字体样式', new Enum_Property(true, ['微软雅黑', 'times new roman', '宋体', '楷体', '黑体', '隶书']), '微软雅黑', true, true)
      this.registerProperty(PropertyGroupName.normal, '背景图片', new UploadFile_Property(1, 'image'))
      this.registerProperty(PropertyGroupName.normal, '背景色', new Color_Property(), 'white')
      this.registerProperty(PropertyGroupName.normal, '是否使用主题', new Boolean_Property(), false)
      this.registerProperty(PropertyGroupName.normal, '行为设置', new Behavior_Property())
    }
    this.onCreated(this)
  }
  /**生命周期 */
  mounted() {
    super.mounted()
    //开始捕捉鼠标键盘事件
    if (this.isDesigning == true) {
      this.CaptureEvent()
    }
  }
  /**生命周期 */
  updated() {
    this.onUpdated(this)
  }
  /**生命周期 */
  destroyed() {
    // window.console.log('销毁了页面组件:', this.Id)
    this.onDestroyed(this)
    this.destorymethod()
  }
  // *************************基础属性****************************************************************************
  get Id(): string {
    if (!this.findPropertyByName) {
      return ''
    }
    var pro = this.findPropertyByName('基础设置', '唯一Id')
    if (!pro) {
      return ''
    }
    return pro.value
  }
  set Id(val: string) {
    if (!this.findPropertyByName) {
      return
    }
    var pro = this.findPropertyByName('基础设置', '唯一Id')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, val)
  }
  get name(): string {
    var pro = this.findPropertyByName('基础设置', '名称')
    if (!pro) {
      return ''
    }
    return pro.value
  }
  set name(val: string) {
    var pro = this.findPropertyByName('基础设置', '名称')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, val)
  }
  get width(): any {
    var pro = this.findPropertyByName('基础设置', '宽度')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as any
  }
  set width(val: any) {
    var pro = this.findPropertyByName('基础设置', '宽度')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get height(): any {
    var pro = this.findPropertyByName('基础设置', '高度')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as any
  }
  set height(val: any) {
    var pro = this.findPropertyByName('基础设置', '高度')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get left(): number {
    var pro = this.findPropertyByName('基础设置', '左边位置')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set left(val: number) {
    var pro = this.findPropertyByName('基础设置', '左边位置')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get top(): number {
    var pro = this.findPropertyByName('基础设置', '顶部位置')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set top(val: number) {
    var pro = this.findPropertyByName('基础设置', '顶部位置')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get margin_left(): number {
    var pro = this.findPropertyByName('基础设置', '外边距-左')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set margin_left(val: number) {
    var pro = this.findPropertyByName('基础设置', '外边距-左')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get margin_right(): number {
    var pro = this.findPropertyByName('基础设置', '外边距-右')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set margin_right(val: number) {
    var pro = this.findPropertyByName('基础设置', '外边距-右')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get margin_top(): number {
    var pro = this.findPropertyByName('基础设置', '外边距-上')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set margin_top(val: number) {
    var pro = this.findPropertyByName('基础设置', '外边距-上')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get margin_bottom(): number {
    var pro = this.findPropertyByName('基础设置', '外边距-下')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set margin_bottom(val: number) {
    var pro = this.findPropertyByName('基础设置', '外边距-下')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get padding_left(): number {
    var pro = this.findPropertyByName('基础设置', '内边距-左')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set padding_left(val: number) {
    var pro = this.findPropertyByName('基础设置', '内边距-左')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get padding_right(): number {
    var pro = this.findPropertyByName('基础设置', '内边距-右')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set padding_right(val: number) {
    var pro = this.findPropertyByName('基础设置', '内边距-右')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get padding_top(): number {
    var pro = this.findPropertyByName('基础设置', '内边距-上')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set padding_top(val: number) {
    var pro = this.findPropertyByName('基础设置', '内边距-上')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get padding_bottom(): number {
    var pro = this.findPropertyByName('基础设置', '内边距-下')
    if (!pro) {
      return 0
    }
    return parseInt(pro.value) as number
  }
  set padding_bottom(val: number) {
    var pro = this.findPropertyByName('基础设置', '内边距-下')
    if (!pro) {
      return
    }
    this.setPropertyVal(pro.id, parseInt(val.toString()))
  }
  get fontFamily(): string {
    // '宋体', '楷体', '黑体', '隶书'
    var property = this.findPropertyByName(PropertyGroupName.normal, '字体样式')
    if (!property) {
      return ''
    }
    switch (property.value) {
      case '微软雅黑':
        return 'Microsoft YaHei'
        break
      case 'times new roman':
        return 'Times New Roman'
        break
      case '宋体':
        return 'SimSun'
        break
      case '楷体':
        return 'KaiTi'
        break
      case '黑体':
        return 'SimHei'
        break
      case '隶书':
        return 'LiSu'
        break
      default:
        break
    }
    return ''
  }
  get background(): string {
    var property = this.findPropertyByName(PropertyGroupName.normal, '背景色')
    if (property) {
      return property.value
    } else {
      return '#ffffff'
    }
  }
  set background(val: string) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '背景色')
    if (!property) {
      return
    }
    this.setPropertyVal(property.id, val)
  }
  get background_img(): any {
    // window.console.log('获取背景图片')
    var property = this.findPropertyByName(PropertyGroupName.normal, '背景图片')
    if (property && property.value && property.value.length > 0) {
      return property.value[0]
    } else {
      return null
    }
  }
  set background_img(val: any) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '背景图片')
    if (!property) {
      return
    }
    if (val) {
      this.setPropertyVal(property.id, [val])
    } else {
      this.setPropertyVal(property.id, [])
    }
  }
  get isUseTheme(): boolean {
    var pro = this.findPropertyByName(PropertyGroupName.normal, '是否使用主题')
    if (!pro) {
      return false
    }
    return pro.value as boolean
  }
  // *************************privates****************************************************************************
  private isLoaded: boolean = false
  private async destorymethod() {
    for (let index = 0; index < this.properties.length; index++) {
      const element = this.properties[index]
      element.destory()
    }
    for (let index = 0; index < this.children.length; index++) {
      const o = this.children[index]
      o.destorymethod()
    }

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
  private loadChildrenData(childrendatas: SaveInfo[]) {
    for (let index = 0; index < childrendatas.length; index++) {
      const o = childrendatas[index]
      this.renderChildFromData(o)
    }
  }
  private watch_properties(newval: Property[]) {
    // window.console.log('布局属性变化了')
    for (var j = 0; j < newval.length; j++) {
      var newproperty = newval[j]
      var filter_oldproperty = this.properties_old.find((o) => o.id == newproperty.id)
      if (!filter_oldproperty) {
        //..新增了一个属性
        this.properties_old.push(JSON.parse(JSON.stringify(newproperty)))
        this.onPropertyChanged(newproperty.id, newproperty, this)
      } else if (serialize(filter_oldproperty) != serialize(newproperty)) {
        //..修改了一个属性的内容
        var newpropertyClone = JSON.parse(JSON.stringify(newproperty)) as Property
        //var newpropertyClone = deepClone(newproperty) as Property
        // window.console.log('检测到数据变化:', newproperty)
        /**替换旧的属性 */
        var index = this.properties_old.indexOf(filter_oldproperty)
        this.properties_old.splice(index, 1, newpropertyClone)
        this.onPropertyChanged(newproperty.id, newpropertyClone, this)
      }
    }
  }
  // *************************protect方法****************************************************************************
  protected renderChildFromData(data: SaveInfo) {}
  protected loadCompleted(childrenData: SaveInfo[]) {}
  /**添加子级 */
  protected addChild(child: LayoutBase) {
    if (!this.children) {
      this.children = []
    }
    if (this.children.indexOf(child) < 0) {
      this.children.push(child)
      this.onChildrenCountChange()
    }
  }
  protected addChilds(childs: LayoutBase[]) {
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
  protected removeChild(child: LayoutBase) {
    let index = this.children.indexOf(child)
    if (index < 0) {
      return
    }
    this.removeLayout(child)
    this.children.splice(index, 1)
    this.onChildrenCountChange()
  }
  protected removeChilds(childs: LayoutBase[]) {
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
  protected addProperty(proper: Property) {
    let find = this.properties.find((o) => o.propertyName == proper.propertyName && o.groupName == proper.groupName)
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
  protected async triggeEvent(name: string, inparams: any[]) {
    var event = this.designerEvents.find((o) => o.eventName == name)
    if (!event) {
      window.console.error('事件调用失败,该事件不存在')
      return
    }

    //TODO 在事件设计的数据中找到事件,并调用事件
    return
  }
  // *************************对外公布方法****************************************************************************
  public async loadData(data: SaveInfo) {
    this.children = []
    if (this.isLoaded) {
      return
    }
    this.Id = data.id
    this.loadingProperties(data.id, data.properties)
    this.isLoaded = true
    if (data.children) {
      this.loadChildrenData(data.children)
    }
  }
  public async reLoadData(data: SaveInfo) {
    for (let index = 0; index < this.children.length; index++) {
      const element = this.children[index]
      element.destorymethod()
    }
    this.children = []
    this.isLoaded = false
    this.loadData(data)
  }
  public async getSaveData(): Promise<SaveInfo> {
    var saveinfo: SaveInfo = {
      id: this.Id,
      properties: this.properties,
      children: []
    }
    saveinfo.children = await this.getChildrenData()
    return saveinfo
  }
  public async removeLayout(layout: LayoutBase) {
    try {
      $(layout.$el).remove()
      layout.$destroy()
    } catch (error) {
      window.console.error(error)
    }
  }
  public findSelectedLayoutsRecursion(comps: LayoutBase[]): LayoutBase[] {
    var res: LayoutBase[] = []
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
  public findLayoutRecursion(id: string, lays: LayoutBase[]): LayoutBase {
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
  public async registerMethods(name: string, description: string, callback: Function, inParams: param[], outParam: param) {
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
    newmethod.callback = callback
    this.designerMethods.push(newmethod)
  }
  /**注册属性 */
  public async registerProperty(groupName: PropertyGroupName | string, name: string, propertyType: PropertyType, defaultVal?: any, canSetting: boolean = true, canBindModel: boolean = true, unit?: string, secondGroup?: string) {
    let find = this.properties.find((o) => o.propertyName == name && o.groupName == groupName)
    if (find) {
      //window.console.warn('已经存在相同分组相同名称的属性！:' + name)
      return
    }

    var newperperty = new Property(name, groupName, propertyType, defaultVal)
    newperperty.canSetting = canSetting
    newperperty.secondGroup = secondGroup
    if (unit) {
      newperperty.propertyType.unit = unit
    }
    newperperty.canBindModel = canBindModel
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
    var method = this.designerMethods.find((o) => o.eventName == name)
    if (!method) {
      window.console.error('方法调用失败,该方法不存在')
      return
    }
    return method.callback(inparams)
    //TODO 图形化编程工具会在此处调用注册的方法
  }
  /**递归删除子组件 */
  public async removeChildRecursion(childId: string) {
    var find = this.findLayoutRecursion(childId, this.children)
    var toparent = find.parentLayout.children.find((x) => x.Id === childId)
    find.parentLayout.removeChild(toparent)
  }
  /**通过已有数据加载 */
  public loadingProperties(layoutId: string, layout_properties: Property[]) {
    this.Id = layoutId
    if (layout_properties) {
      for (let index = 0; index < layout_properties.length; index++) {
        const item = layout_properties[index]
        let find = this.properties.find((o) => o.groupName == item.groupName && o.propertyName == item.propertyName)
        if (find) {
          find.id = item.id
          this.setPropertyVal(item.id, item.value, true)
        } else {
          var newperperty = new Property(item.propertyName, item.groupName, item.propertyType)
          newperperty.canSetting = item.canSetting
          newperperty.canBindModel = item.canBindModel
          newperperty.id = item.id
          this.addProperty(newperperty)
          this.setPropertyVal(item.id, item.value, true)
        }
      }
    }
  }
  public findProperties(groupName: string, name: string): Property[] {
    return this.properties.filter((o) => o.groupName == groupName && o.propertyName == name)
  }
  public findPropertyByName(groupName: string, name: string): Property {
    return this.properties.find((o) => o.groupName == groupName && o.propertyName == name)
  }
  public findPropertyById(Id: string): Property {
    return this.properties.find((o) => o.id == Id)
  }
  public validatorPropertyValue(propertyId: string, val: any): boolean {
    var valodators = this.propertyValidators.filter((o) => o.propertyId == propertyId)
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
    var findproperty = this.properties.find((p) => p.id == propertyId)
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
  /**对外公布方法 尺寸向上变化*/
  public sizeChange_Up(changeVal: number) {
    if (this.height - changeVal >= 20) {
      this.top += changeVal
      this.height -= changeVal
    }
  }
  /**对外公布方法 尺寸向下变化*/
  public sizeChange_Down(changeVal: number) {
    if (this.height + changeVal >= 20) {
      this.height += changeVal
    }
  }
  /**对外公布方法 尺寸向左变化*/
  public sizeChange_Left(changeVal: number) {
    if (this.width - changeVal >= 20) {
      this.left += changeVal
      this.width -= changeVal
    }
  }
  /**对外公布方法 尺寸向右变化*/
  public sizeChange_Right(changeVal: number) {
    if (this.width + changeVal >= 20) {
      this.width += changeVal
    }
  }
  /**对外公布方法 尺寸左上变化*/
  public sizeChange_Up_Left(changeVal_ver: number, changeVal_hor: number) {
    this.sizeChange_Up(changeVal_ver)
    this.sizeChange_Left(changeVal_hor)
  }
  /**对外公布方法 尺寸右上变化*/
  public sizeChange_Up_Right(changeVal_ver: number, changeVal_hor: number) {
    this.sizeChange_Up(changeVal_ver)
    this.sizeChange_Right(changeVal_hor)
  }
  /**对外公布方法 尺寸左下变化*/
  public sizeChange_Down_Left(changeVal_ver: number, changeVal_hor: number) {
    this.sizeChange_Down(changeVal_ver)
    this.sizeChange_Left(changeVal_hor)
  }
  /**对外公布方法 尺寸右下变化*/
  public sizeChange_Down_Right(changeVal_ver: number, changeVal_hor: number) {
    this.sizeChange_Down(changeVal_ver)
    this.sizeChange_Right(changeVal_hor)
  }
  // *************************对外公布事件****************************************************************************
  protected onPropertyChanged(propertyId: string, property: Property, layout: LayoutBase): void {}
  protected onChildrenCountChange() {}
  protected onCreated(layout: LayoutBase) {}
  protected onMounted(layout: LayoutBase) {}
  protected onUpdated(layout: LayoutBase) {}
  protected onSizeChanged(e: any) {}
  protected onDestroyed(layout: LayoutBase): void {}
}
