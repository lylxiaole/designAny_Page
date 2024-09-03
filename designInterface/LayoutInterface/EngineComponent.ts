import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import  {EngineContainer} from './EngineContainer'
 import { DPropAttr } from '../LayoutAttr/PropertyInfo'
import { DEventAttr } from '../LayoutAttr/EventInfo'

import { Number_Setting, PropertyGroupName, Color_Setting, Boolean_Setting  } from '../LayoutAttr/PropertyInfo'

import { DCompInfo } from '../LayoutAttr/ComponentInfo'

@Options({})
export   class EngineComponent extends EngineContainer {
  @Prop()
  protected compInfo: DCompInfo

  @DPropAttr(new Color_Setting('前景色', PropertyGroupName.normal, true))
  public foreground: string = '#000000'
  @DPropAttr(new Boolean_Setting('是否显示', PropertyGroupName.normal, true))
  public display: boolean = true
  @DPropAttr(new Boolean_Setting('是否禁用', PropertyGroupName.normal, true))
  public disabled: boolean = false
  @DPropAttr(new Number_Setting('层级设置', PropertyGroupName.normal, true))
  public zIndex: number = 1

  created() {
    this.width = 200
    this.height = 200
  }

  mounted() {}
  // *******************************publics**************************************************************************************
  protected override loadCompleted(): void {
    super.loadCompleted()
    this.onCompLoaded()
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

  @DEventAttr({ eventName: '控件加载完成事件', inParams: [], hasOutParam: false })
  private onCompLoaded() {}
}
