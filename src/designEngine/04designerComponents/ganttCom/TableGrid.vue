<template>
  <div v-show="IsDesigning || isReadyToDraw" style="position:relative"
    :style="{'width':width+'px','height':height+'px','left':left+'px','top':top+'px','background':backgroundCute }"
    oncontextmenu="self.event.returnValue=false">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import LayoutBase, { LayoutType, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import PageBase from '../../05designerLayouts/PageBase'
import common from '../../02common/commonMethod'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { AllComponents, ComponentBase } from '../../04designerComponents'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { Property, PropertyGroupName } from '../../02common/commonClasses/LayoutProperty'
import { param } from '../../02common/commonClasses/layoutEvent'

@Component
export default class TableGrid extends PageBase {
  //父页面
  public parentPage: PageBase

  public currentRow: any

  get backgroundCute(): string {
    var property = this.FindPropertyByName('基础设置', '背景图片')
    //window.console.log('获取计算图片', property)
    if (!this.background_img || !this.background_img.url) {
      return this.background
    }
    return 'url("' + common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.background_img.url) + '")'
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
    // window.console.log('---------------当前行变更currentRowDataChange', newval)
    let property = this.FindPropertyByName(PropertyGroupName.normal, '表格行')
    if (property) {
      property.value = { modelCode: this.modelCode, data: common.clone(newval) }
    }
    let tempproperty = this.FindPropertyByName(PropertyGroupName.normal, '表格行模型')
    if (tempproperty) {
      tempproperty.value = common.clone(newval)
    }
    // window.console.log('---------------当前行变更propertyproperty', property)
  }

  private domCache: DocumentFragment = null
  //页面中包含的布局容器
  public PageComponentIncrustations: CompIncrustationPro[] = []
  mounted() {
    this.domCache = window.document.createDocumentFragment()
    this.RegisterProperty('表格行', PropertyGroupName.normal, null)
    this.RegisterProperty('表格行模型', PropertyGroupName.normal, null, null, false)
    this.RegisterMethods('表格刷新', '', this.onCellLayoutRefresh, null, null)
    this.RegisterMethods('表格刷新当前页', '', this.onCellLayoutRefreshCurrentPage, null, null)
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    this.RegisterEvents('表格行变更事件', '', this.inparam, this.outparam)
    //window.console.log('----------------------表格行初始化mounted')
    this.$once('pageReadyToDraw', () => {
      $(this.$el).append(this.domCache)
      this.domCache = null
    })
  }
  activated() {
    // window.console.log('----------------------表格行初始化activated')
  }
  beforeUpdate() {
    // window.console.log('----------------------表格行初始化beforeUpdate')
  }
  beforeCreate() {
    // window.console.log('----------------------表格行初始化beforeCreate')
  }
  created() {
    // window.console.log('----------------------表格行初始化created')
  }
  beforeMount() {
    // window.console.log('----------------------表格行初始化beforeMount')
  }

  protected loadCompleted(childrenData: any[]) {
    // window.console.log('----------------------表格行初始化完成')
    this.$nextTick(() => {
      this.TriggeEvent('表格行变更事件', null)
    })
  }

  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    if (this.parentPage) {
      //window.console.log('当前列的父页面', this.parentPage)
    }

    var tmpNode = window.document.createElement('div')
    if (this.IsDesigning == true) {
      $(this.$el).append(tmpNode)
    } else {
      if (this.domCache) {
        this.domCache.appendChild(tmpNode)
      } else {
        $(this.$el).append(tmpNode)
      }
    }
    /**实例化组件壳子 */
    var compIn = new CompIncrustationPro()
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    if (this.IsDesigning == true) {
      this._dragHelper.makeDomCanDrag(compIn.$el)
    }
    /**在组件壳子中添加组件 */
    // if (this.parentPage) {
    //   compCon.parentPage = this.parentPage
    // } else {
    //   compCon.parentPage = this
    // }
    compCon.parentPage = this
    //compCon.RegisterProperty('表格行')
    //compCon.RegisterProperty('表格行数据', PropertyGroupName.normal, null, this.currentRow)
    compIn.AddComponent(compCon)
    this.PageComponentIncrustations.push(compIn)
    // setTimeout(() => {
    //   $(this.$el).css('transform', 'scale(1)')
    // }, 100)
    // // this.onChangedScale_Event = (sizeChange: number) => {
    // //   //this.scaleSize(sizeChange)
    // //   $(this.$el).css('transform', 'scale(1)')
    // // }
    // this.onWindowResize_Event = () => {
    //   //this.scaleSize(sizeChange)
    //   $(this.$el).css('transform', 'scale(1)')
    // }
    return compCon
  }

  // *******************************overrides**************************************************************************************
  public deleteChildComponents(compId: string): boolean {
    var find = this.PageComponentIncrustations.find((o) => o.InnerComponent.Id == compId)
    if (find) {
      var index = this.PageComponentIncrustations.indexOf(find)
      this.PageComponentIncrustations.splice(index, 1)
      //window.console.log('专业页面----删除组件', find.$el)
      // $(find.$el).remove()
      // find.$destroy()
      return true
    } else {
      return false
    }
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '表格行':
        //window.console.log('----------------表格行数据变更', property)
        this.$nextTick(() => {
          this.TriggeEvent('表格行变更事件', null)
        })
        break
    }
  }
}
</script>



<style scoped>
</style>