<template>
  <div v-if="backgroundImage!='unset'" :style="{'width':width+'px','height':height+'px'}" v-lazy:background-image='{src:backgroundImage}'
    oncontextmenu="self.event.returnValue=false">
    <div ref="drawCont" style="position:relative;width:100%;height:100%"
      :style="{ display: Display, flexWrap: FlexWrap,justifyContent: Horienten,alignItems: AlignItems}">
    </div>
  </div>
  <div v-else :style="{'width':width+'px','height':height+'px','backgroundColor':backgroundColor}" oncontextmenu="self.event.returnValue=false">
    <div ref="drawCont" style="position:relative;width:100%;height:100%"
      :style="{ display: Display, flexWrap: FlexWrap,justifyContent: Horienten,alignItems: AlignItems}">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName } from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { SaveInfo, LayoutType, LayoutInfo, DragItemTypeEnum, LayoutBase } from '../../03designerLayoutBase'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import common from '../../02common/commonMethod'

@Component
export default class componentTemplate extends ComponentBase {
  get backgroundCute(): string {
    var property = this.findPropertyByName('基础设置', '背景图片')
    // window.console.log('获取计算图片', property)
    if (!this.background_img || !this.background_img.url) {
      return this.background
    }
    return 'url("' + common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.background_img.url) + '")'
  }

  get backgroundColor(): string {
    var property = this.findPropertyByName('基础设置', '背景图片')
    // window.console.log('获取计算图片', property)
    if (!this.background_img || !this.background_img.url) {
      return this.background
    }
    return 'unset'
  }

  get backgroundImage(): string {
    //console.info('backgroundImagebackgroundImagebackgroundImagebackgroundImage',this.background_img)
    var property = this.findPropertyByName('基础设置', '背景图片')
    // window.console.log('获取计算图片', property)
    if (!this.background_img || !this.background_img.url) {
      return 'unset'
    }
    return common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.background_img.url)
  }

  public PageComponentIncrustations: CompIncrustationPro[] = []

  mounted() {
    if (this.IsDesigning) {
      this.width = 600
      this.height = 600
      this.canDrag = true
      this.canDrop = true
      /**解决旧数据的问题 */
      this.registerProperty('页面入参', PropertyGroupName.normal, null, null, false, false)
      this.registerProperty('排布方式', PropertyGroupName.special, new Enum_Property(true, ['无', '靠左排布', '靠右排布']), '无')
    }
  }

  private get layoutType() {
    let findprop = this.findPropertyByName(PropertyGroupName.special, '排布方式')

    if (findprop) {
      if (findprop.value === '无') {
        return ''
      } else {
        return this.findPropertyByName(PropertyGroupName.special, '排布方式').value
      }
    } else {
      return ''
    }
  }

  get Horienten(): string {
    var type = this.layoutType
    if (!type) {
      return ''
    } else if (type === '靠左排布') {
      return 'flex-start'
    } else if (type === '靠右排布') {
      return 'flex-end'
    } else {
      return ''
    }
  }

  get Display(): string {
    var type = this.layoutType
    if (!type) {
      return ''
    } else {
      return 'flex'
    }
  }

  get FlexWrap(): string {
    var type = this.layoutType
    if (!type) {
      return ''
    } else {
      return 'nowrap'
    }
  }

  get AlignItems(): string {
    var type = this.layoutType
    if (!type) {
      return ''
    } else {
      return 'center'
    }
  }

  rendered(dom: Element) {
    // window.console.log('rendered')
    for (let index = 0; index < this.PageComponentIncrustations.length; index++) {
      const element = this.PageComponentIncrustations[index]
      if (!this.layoutType) {
        element.positionval = 'absolute'
      } else {
        element.positionval = 'relative'
      }
    }
  }

  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    if (!this.$el) {
      return compCon
    }
    var tmpNode = window.document.createElement('div')
    $(this.$refs.drawCont).append(tmpNode)
    /**实例化组件壳子 */
    var compIn = new CompIncrustationPro()
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    if (this.IsDesigning == true) {
      this._dragHelper.makeDomCanDrag(compIn.$el)
    }

    /**在组件壳子中添加组件 */
    compCon.parentPage = this.parentPage
    compIn.AddComponent(compCon)
    this.PageComponentIncrustations.push(compIn)
    this.rendered(this.$el)
    if (this.layoutType) {
      compCon.left = 0
      compCon.top = 0
    }
    return compCon
  }
  public deleteChildComponents(compId: string): boolean {
    var find = this.PageComponentIncrustations.find((o) => o.InnerComponent.Id == compId)
    if (find) {
      var index = this.PageComponentIncrustations.indexOf(find)
      this.PageComponentIncrustations.splice(index, 1)
      // $(find.$el).remove()
      // find.$destroy()
      return true
    } else {
      return false
    }
    this.rendered(this.$el)
  }
}
</script>
 
<style scoped>
</style>