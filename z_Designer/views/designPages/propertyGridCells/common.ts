import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineLayout } from '@design-any/interface/LayoutInterface'
import { PropertyTypeEnum, Property, PropertySetting } from '@design-any/interface/LayoutAttr/PropertyInfo'

var cellControls = []

export function CellSettingAttr(type: PropertyTypeEnum) {
  return function (target: Function) {
    !target.prototype.$lyl_cellSetting && (target.prototype.$lyl_cellSetting = {})
    target.prototype.$lyl_cellSetting.celltype = type
    // window.console.log('类型访问器:', target)
    cellControls.push(target)
  }
}

export function getCellControl(propertySettingType: PropertyTypeEnum): typeof propertyCellBase {
  return cellControls.filter((o) => o.prototype.$lyl_cellSetting.celltype == propertySettingType)[0] as typeof propertyCellBase
}

@Options({})
export default class propertyCellBase<T> extends Vue {
  @Prop()
  private property: PropertySetting
  /**当前的布局页面 */
  @Prop()
  protected page: EnginePage
  /**当前需要设置的布局类 */
  @Prop()
  protected layouts: EngineLayout[] | EngineLayout

  /**当前属性类型,包含属性的配置（请查看PropertyType类型的子类） */
  protected get currentProperty(): T {
    if (!this.property) {
      return
    }
    return this.property as any as T
  }

  protected get currentLayouts(): EngineLayout[] {
    if (!this.layouts) {
      return null
    }
    var newlayouts_extra: EngineLayout[] = []
    if (this.layouts instanceof EngineLayout) {
      newlayouts_extra = [this.layouts as EngineLayout]
    } else {
      newlayouts_extra = this.layouts as EngineLayout[]
    }
    return newlayouts_extra
  }
  /**获取当前属性值 */
  protected get currentValue(): any {
    let field = this.property.field
    // for (let index = 0; index < this.currentLayouts.length; index++) {
    //   const element = this.currentLayouts[index]
    //   console.log('get currentValue:', element, field, element[field])
    // }

    return this.currentLayouts[0][field]
  }
  /**设置当前属性值 */
  protected set currentValue(val: any) {
    let field = this.property.field
    for (let index = 0; index < this.currentLayouts.length; index++) {
      const element = this.currentLayouts[index]
      console.log('set currentValue:', element, field, val)
      element[field] = val
    }
  }
}
