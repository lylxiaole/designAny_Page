import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'
import { Property, Authority_Property, Color_Property, BindingModels_Property, Boolean_Property, PropertyGroupName, Number_Property } from '.'
import { EnginePage, SaveInfo, EngineContainer, DragItemData, DragItemTypeEnum, param, factory } from './index'
import { LayoutType } from './commonClasses/componentInfos'

@Component
export default class EngineComponent extends EngineContainer {
  public parentPage: EnginePage

  public get topParentPage(): EnginePage {
    let res: EnginePage = this.parentPage
    while (res && res.parentPage) {
      res = res.parentPage
    }
    return res
  }
  get foreground(): string {
    var property = this.findPropertyByName(PropertyGroupName.normal, '前景色')
    if (property) {
      return property.value
    } else {
      return '#000000'
    }
  }
  get display(): boolean {
    // window.console.log('是否显示')
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否显示')
    if (property) {
      return property.value as boolean
    }
    return false
  }
  set display(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否显示')
    if (property) {
      property.value = val
    }
  }
  get disabled(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    if (property) {
      return property.value as boolean
    }
    return false
  }
  set disabled(val: boolean) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    if (property) {
      property.value = val
    }
  }
  get zIndex(): number {
    var property = this.findPropertyByName(PropertyGroupName.normal, '层级设置')
    if (property) {
      return property.value
    } else {
      return null
    }
  }
  set zIndex(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '层级设置')
    if (property) {
      property.value = val
    }
  }
  get tooltipText(): string {
    return null
  }
  created() {
    /**注册事件 */
    var inparams: param[] = []
    this.registerEvents('控件加载完成事件', '', inparams, null)
  }

  initDesignContext() {
    this.registerProperty(PropertyGroupName.normal, '前景色', new Color_Property(), '#000000')
    this.registerProperty(PropertyGroupName.normal, '权限设置', new Authority_Property())
    this.registerProperty(PropertyGroupName.normal, '绑定模型', new BindingModels_Property(), [], true, false)
    this.registerProperty(PropertyGroupName.normal, '是否禁用', new Boolean_Property(), false)
    this.registerProperty(PropertyGroupName.normal, '是否显示', new Boolean_Property(), true, true)
    this.registerProperty(PropertyGroupName.normal, '层级设置', new Number_Property(), 1)
    var numberproperty = new Number_Property()
    numberproperty.min = -99999
    this.registerProperty(PropertyGroupName.normal, '外边距-左', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '外边距-右', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '外边距-上', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '外边距-下', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '内边距-左', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '内边距-右', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '内边距-上', numberproperty, 0, false, false, 'px')
    this.registerProperty(PropertyGroupName.normal, '内边距-下', numberproperty, 0, false, false, 'px')
    this.canDrop = false
    this.canDrag = false
    this.width = 200
    this.height = 200
    this.onDrag_Event = this.listenOnDrag
  }
  mounted() {
    // this.onDragMove_Event = this.onDragMove
    this.$nextTick(() => {
      this.triggeEvent('控件加载完成事件', null)
    })
  }
  rendered(dom: Element) {}
  // *******************************privates**************************************************************************************
  protected listenOnDrag(el: Element, dragdata: DragItemData<any>) {
    dragdata.type = DragItemTypeEnum.dragmove_component_inpage
    //window.console.log('comp listenOnDrag')
    dragdata.dragData = { compId: this.Id }
  }
  // *******************************protecteds**************************************************************************************
  protected async triggeEvent(name: string, inparam: any) {
    if (!this.parentPage || this.parentPage.isDesigning == true) {
      return
    }
    // window.console.log('触发事件:', name, this.$el)
    var event = this.designerEvents.find((o) => o.eventName == name)
    if (!event) {
      window.console.error('事件调用失败,该事件不存在')
      return
    }

    for (let index = 0; index < event.behaviorIds.length; index++) {
      const bid = event.behaviorIds[index]
      let behavior = this.parentPage.behaviors.find((o) => o.id == bid)
      if (!behavior) {
        continue
      }
      behavior.inparam = null
      if (inparam) {
        behavior.inparam = inparam
      }
      let actfac = new factory(this, this.parentPage, behavior)
      // console.info('behavior.inparam', behavior.inparam)
      try {
        actfac.exacteAction()
      } catch (error) {
        break
      } finally {
        behavior = null
        actfac = null
      }
    }
    //TODO 在事件设计的数据中找到事件,并调用事件
    return
  }
  // *******************************publics**************************************************************************************
  protected loadCompleted(childrenData: SaveInfo[]): void {}
  /**通用的验证方法，根据编码获取 */
  public commonValid(validatorArr: any[], value: any, callback: any, message: any) {
    if (value === 0) {
      value = '0'
    }
    //根据模型编码获取验证库的验证方法
    if (value == Number.NaN || value == undefined || value == null || value == '') {
      callback()
      return
    }
    //解析方法，然后返回错误信息，funcCode就是方法名，入参固定传value，出参传boolean，根据出参判断是否提示
    for (let index = 0; index < validatorArr.length; index++) {
      const element = validatorArr[index]
      if (element.customFunction && element.customFunction.funcContent) {
        let func = element.customFunction.funcContent
        let validateRes = eval(func + ' ' + element.customFunction.funcCode + '(' + value + ')')
        if (!validateRes) {
          callback(element.errorMsg)
          return
        }
      }
    }
  }
  public getModelValidate(propCode: string) {}
}
