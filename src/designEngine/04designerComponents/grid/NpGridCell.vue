<template>
  <div style="position:relative" :style="{'width':width+'px','height':height+'px','left':left+'px','top':top+'px','background':backgroundCute }"
    oncontextmenu="self.event.returnValue=false">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import LayoutBase, { LayoutType, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import common from '../../02common/commonMethod'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { AllComponents, ComponentBase } from '../../04designerComponents'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { Property, PropertyGroupName } from '../../03designerLayoutBase'
import { param } from '../../03designerLayoutBase'

@Component
export default class NpGridCell extends PageBase {
  public parentPage: PageBase
  public currentRow: any

  get backgroundCute(): string {
    let property = this.findPropertyByName('基础设置', '背景图片')
    if (!this.background_img || !this.background_img.url) {
      return this.background
    }
    return 'url("' + CurrentContext.FileServerAddress + this.background_img.url + '")'
  }

  inparam: param[]
  outparam: param
  @Emit('onCellLayoutRefresh')
  onCellLayoutRefresh() {}

  @Emit('onCellLayoutRefreshCurrentPage')
  onCellLayoutRefreshCurrentPage() {}

  @Prop()
  modelCode: string

  @Prop()
  currentRowData: any

  /** 行数据属性变更 */
  @Watch('currentRowData')
  currentRowDataChange(newval) {
    let property = this.findPropertyByName(PropertyGroupName.normal, '单元格数据')
    if (property) {
      property.value = { modelCode: this.modelCode, data: common.clone(newval) }
    }
  }

  //页面中包含的布局容器
  public PageComponentIncrustations: CompIncrustationPro[] = []
  created() {
    this.width = 200
    this.height = 200
    this.registerProperty('单元格数据', PropertyGroupName.normal, null)
    this.registerEvents('单元格加载完成', '', this.inparam, this.outparam)
  }

  mounted() {
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }
  protected async loadCompleted(childrenData: any[]) {
    this.$nextTick(() => {
      this.triggeEvent('单元格加载完成', null)
    })
  }

  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    let domCache = window.document.createDocumentFragment()
    let tmpNode = window.document.createElement('div')
    domCache.appendChild(tmpNode)
    /**实例化组件壳子 */
    let compIn = new CompIncrustationPro()
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    $(this.$el).append(domCache)

    if (this.IsDesigning == true) {
      this._dragHelper.makeDomCanDrag(compIn.$el)
    }
    compCon.parentPage = this
    compIn.AddComponent(compCon)
    this.PageComponentIncrustations.push(compIn)
    return compCon
  }

  // *******************************overrides**************************************************************************************
  public deleteChildComponents(compId: string): boolean {
    let find = this.PageComponentIncrustations.find((o) => o.InnerComponent.Id == compId)
    if (find) {
      let index = this.PageComponentIncrustations.indexOf(find)
      this.PageComponentIncrustations.splice(index, 1)
      // $(find.$el).remove()
      // find.$destroy()
      return true
    } else {
      return false
    }
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '单元格数据':
        this.$nextTick(() => {
          this.triggeEvent('单元格加载完成', null)
        })
        break
    }
  }
}
</script>



<style scoped>
</style>