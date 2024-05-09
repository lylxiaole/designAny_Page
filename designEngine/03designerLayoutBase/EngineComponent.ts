import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { Property, Color_Setting, Boolean_Setting, PropertyGroupName, Number_Setting } from '.'
import { EnginePage, SaveInfo, EngineContainer } from './index'
import { factory, param } from '@behaviorEngine/index'

import { EngineLayout } from '..'

@Options({})
export default class EngineComponent extends EngineContainer {
  public get topParentPage(): EnginePage {
    let res: EngineLayout = this.parentLayout
    while (res && res.parentLayout) {
      res = res.parentLayout
    }
    return res as EnginePage
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
    this.registerProperty(PropertyGroupName.normal, '前景色', new Color_Setting(), '#000000')
    this.registerProperty(PropertyGroupName.normal, '是否禁用', new Boolean_Setting(), false)
    this.registerProperty(PropertyGroupName.normal, '是否显示', new Boolean_Setting(), true, true)
    this.registerProperty(PropertyGroupName.normal, '层级设置', new Number_Setting(), 1)

    this.width = 200
    this.height = 200
    /**注册事件 */
    var inparams: param[] = []
    this.registerEvents('控件加载完成事件', '', inparams, null)
  }

  mounted() {}

  // *******************************protecteds**************************************************************************************
  protected override async triggerEvent(name: string, inparam: any) {
    super.triggerEvent(name, inparam)
    if (!this.topParentPage) {
      return
    }
    if (this.isDesigning) {
      return
    }
    // window.console.log('触发事件:', name, this.$el)
    var event = this.designerEvents.find((o) => o.eventName == name)

    for (let index = 0; index < event.behaviorIds.length; index++) {
      const bid = event.behaviorIds[index]
      let behavior = this.topParentPage.behaviors.find((o) => o.id == bid)
      if (!behavior) {
        continue
      }
      behavior.inparam = null
      if (inparam) {
        behavior.inparam = inparam
      }
      let actfac = new factory(this, this.topParentPage, behavior)
      // console.info('behavior.inparam', behavior.inparam)
      try {
        await actfac.exacteAction()
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
  protected override loadCompleted(): void {
    super.loadCompleted()
    this.$nextTick(() => {
      this.triggerEvent('控件加载完成事件', null)
    })
  }
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
