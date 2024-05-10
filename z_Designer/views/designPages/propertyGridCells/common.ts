import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { PropertyTypeEnum, Property, PropertySetting, EnginePage, EngineLayout } from '@designEngine/index'

var cellControls = []

export function CellSettingAttr(type: PropertyTypeEnum) {
  return function (target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.celltype = type
    // window.console.log('类型访问器:', target)
    cellControls.push(target)
  }
}

export { cellControls }

@Options({})
export default class propertyCellBase<T> extends Vue {
  @Prop()
  private property: PropertySetting

  /**当前的布局页面 */
  @Prop()
  protected currentPage: EnginePage
  /**当前需要设置的布局类 */
  @Prop()
  protected currentLayouts: EngineLayout[] | EngineLayout

  /**当前属性类型,包含属性的配置（请查看PropertyType类型的子类） */
  protected get currentProperty(): T {
    if (!this.property) {
      return
    }
    return this.property as any as T
  }
  /**获取当前属性值 */
  protected get currentValue(): any {
    let field = this.property.field
    return this.currentLayouts[0][field]
  }
  /**设置当前属性值 */
  protected set currentValue(val: any) {
    let field = this.property.field
    for (let index = 0; index < this.currentLayouts.length; index++) {
      const element = this.currentLayouts[index]
      element[field] = val
    }
  }

  protected get currentLayouts(): EngineLayout[] {
    if (!this.currentLayouts) {
      return null
    }
    var newlayouts_extra: EngineLayout[] = []
    if (this.currentLayouts instanceof EngineLayout) {
      newlayouts_extra = [this.currentLayouts as EngineLayout]
    } else {
      newlayouts_extra = this.currentLayouts as EngineLayout[]
    }
    return newlayouts_extra
  }
}
