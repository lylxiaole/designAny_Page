import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { PropertyTypeEnum, Property, PropertyType, EnginePage, EngineLayout } from '@designEngine'

var cellControls = []
export { PropertyTypeEnum, cellControls }

export function propertyCellTypeAttr(type: PropertyTypeEnum) {
  return function (target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.celltype = type
    // window.console.log('类型访问器:', target)
    cellControls.push(target)
  }
}

@Options({})
export default class propertyCellBase extends Vue {
  @Prop()
  private outerProperty: Property
  @Prop()
  private outerPropertyValue: any
  @Emit('update:outerPropertyValue')
  private updateValue_Inner(val: any) {}

  /**************当前页面中的所有上下文****************************** */

  /**当前属性类型,包含属性的配置（请查看PropertyType类型的子类） */
  protected get currentPropertyType(): PropertyType {
    return this.outerProperty.propertyType
  }
  /**获取当前属性值 */
  protected get currentValue(): any {
    return this.outerPropertyValue
  }
  /**设置当前属性值 */
  protected set currentValue(val: any) {
    this.updateValue_Inner(val)
  }

  /**当前的布局页面 */
  @Prop()
  protected currentPage: EnginePage
  /**当前需要设置的布局类 */
  @Prop()
  protected currentLayouts: EngineLayout[] | EngineLayout

  protected get currentLayoutsGetter(): EngineLayout[] {
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
