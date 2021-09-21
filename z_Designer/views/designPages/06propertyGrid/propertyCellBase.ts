import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'
import { Property, PropertyType } from '@src/designEngine'
import { PageBase, LayoutBase } from '@src/designEngine'

@Component
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
  protected currentPage: PageBase
  /**当前需要设置的布局类 */
  @Prop()
  protected currentLayouts: LayoutBase[] | LayoutBase

  protected get currentLayoutsGetter(): LayoutBase[] {
    if (!this.currentLayouts) {
      return null
    }
    var newlayouts_extra: LayoutBase[] = []
    if (this.currentLayouts instanceof LayoutBase) {
      newlayouts_extra = [this.currentLayouts as LayoutBase]
    } else {
      newlayouts_extra = this.currentLayouts as LayoutBase[]
    }
    return newlayouts_extra
  }
}
