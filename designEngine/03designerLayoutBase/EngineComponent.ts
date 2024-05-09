import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, SaveInfo, EngineContainer } from './index'
import { factory, param } from '@behaviorEngine/index'

import { EngineLayout } from '..'
import { DPropAttr } from './commonClasses/PropertyInfo'
import { Number_Setting, PropertyGroupName, Color_Setting, Boolean_Setting, Enum_Setting, CompPosition_Setting, Margin_Setting, Padding_Setting } from './commonClasses/PropertyInfo'

@Options({})
export default class EngineComponent extends EngineContainer {
  public get topParentPage(): EnginePage {
    let res: EngineLayout = this.parentLayout
    while (res && res.parentLayout) {
      res = res.parentLayout
    }
    return res as EnginePage
  }

  @DPropAttr(new Color_Setting('前景色', PropertyGroupName.normal, true, '#000000'))
  public foreground: string
  @DPropAttr(new Boolean_Setting('是否显示', PropertyGroupName.normal, true, true))
  public display: string
  @DPropAttr(new Boolean_Setting('是否禁用', PropertyGroupName.normal, true, false))
  public disabled: string
  @DPropAttr(new Number_Setting('层级设置', PropertyGroupName.normal, true, 1))
  public zIndex: string

  created() {
    this.width = 200
    this.height = 200
    /**注册事件 */
    this.registerEvents('控件加载完成事件', '', [], null)
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
