<template>
  <div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  NumberList_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
} from '../../02common/commonClasses/LayoutProperty'
// import dragHelper, { dragulaExtand } from "../../02common/dragHelper";
import common from '../../02common/commonMethod'
import LayoutBase, { SaveInfo, LayoutType, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import { AllComponents, ComponentBase } from '../index'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'

import $ from 'jquery'

@Component({
  components: {},
})
export default class TabContent extends ComponentBase {
  mounted() {
    // this.compDragInfo = new ComponentInfo(DragItemTypeEnum.functional_component, '栅格布局', 'DragCell', DragCell, 'icon-gantetu')
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = false
      this.onDrop_Event = this.onDrop
      this.onDelete_Event = this.onDeleteClick
    }
  }

  private onDrop(el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragItemData?: DragItemData<any>): boolean {
    window.console.log('dragcell组件 -------有东西拖进来了-el', dragItemData)
    //let compInfo = this._dragHelper.getDragItemInfo(el) as ComponentInfo
    let compId = dragItemData.dragData['compId']
    if (compId && this.children && this.children.length > 0 && this.children[0].Id === compId) {
      return false
    }
    this.removeComp()
    if (compId) {
      let theComp = this.parentPage.FindLayoutRecursion(compId)
      let newComp = this.insertComponent(theComp.layoutInfo)
      if (newComp) {
        newComp.$once('onMounted', () => {
          newComp.LoadData(theComp.GetSaveData())
          newComp.Id = common.getUuid()
        })
        this.parentPage.RemoveChildRecursion(compId)
      }
    } else {
      let compInfo = dragItemData.dragData
      let compclass = this.findSystemComp(compInfo.groupName, compInfo.name)
      let compCon = this.insertComponentLayout(compclass, compInfo, dragItemData.type)
      if (!compCon) {
        return true
      }
    }
    return false
  }

  protected insertComponentLayout(dropcompclass: any, compInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    var dropcomp = new dropcompclass()
    dropcomp.parentLayout = this
    dropcomp.layoutInfo = compInfo
    dropcomp = this.renderComponent(dropcomp, compInfo, dragType)
    this.AddChild(dropcomp)

    dropcomp.$on('onChildrenCountChange', this.onComponentChildrenCountChange)
    dropcomp.$on('onComponentChildrenCountChange', this.onComponentChildrenCountChange)
    dropcomp.$on('onPropertyChanged', this.onComponentPropertyChanged)
    dropcomp.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
    let comp = dropcomp as ComponentBase
    comp.parentPage = this.parentPage
    return comp
  }

  public insertComponent(newCompInfo: LayoutInfo): ComponentBase {
    if (!newCompInfo.name || !newCompInfo.groupName) {
      return
    }
    let comp = AllComponents.filter((o) => o.groupName == newCompInfo.groupName && o.name == newCompInfo.name)[0]
    //实例化组件
    let compCon = new (comp.component as any)() as ComponentBase
    compCon.layoutInfo = newCompInfo
    compCon.name = newCompInfo.name
    return this.addComp(compCon)
  }

  public recoveryComponent(compData: SaveInfo): void {
    let currentComp = AllComponents.filter((o) => o.groupName == compData.layoutInfo.groupName && o.name == compData.layoutInfo.name)[0]
    //实例化组件
    let compCon = new (currentComp.component as any)() as ComponentBase
    compCon.layoutInfo = compData.layoutInfo
    compCon.name = compData.layoutInfo.name
    compCon.Id = compData.id
    let rvComp = this.addComp(compCon)
    rvComp.$once('onMounted', () => {
      rvComp.LoadData(compData)
    })
  }

  public addComp(compCon: ComponentBase): ComponentBase {
    //绘制组件--不通画布的绘制逻辑不一样
    this.renderComponent(compCon, compCon.layoutInfo)
    if (!compCon) {
      return null
    }
    this.AddChild(compCon)
    /**注册组件事件 */
    compCon.$on('onChildrenCountChange', this.onComponentChildrenCountChange)
    compCon.$on('onPropertyChanged', this.onComponentPropertyChanged)
    compCon.onClick_Event = this.onComponentClick
    compCon.onDelete_Event = this.onCompDeleteClick
    compCon.onDrag_Event = (el, dragdata) => {
      dragdata.type = DragItemTypeEnum.drag_gridLayout_col
      dragdata.dragData = { compId: compCon.Id }
    }
    compCon.parentPage = this.parentPage
    return compCon
  }

  protected renderComponent(compCon: LayoutBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    $(this.$el).html('')
    $(this.$el).append('<div id="' + compCon.Id + '"></div>')
    compCon.$mount('#' + compCon.Id)
    return compCon
  }

  /**删除组件 */
  private removeComp(): void {
    if (this.children && this.children.length > 0) {
      let component = this.children[0]
      this.RemoveChildRecursion(component.Id)
    }
  }

  private onComponentClick(e: Event, target: ComponentBase): void {
    e.stopPropagation()
    this.chooseComps([target])
  }

  private chooseComps(comps: ComponentBase[]) {
    ;(this.children as ComponentBase[]).filter((o) => {
      if (comps.indexOf(o) < 0) {
        o.isSelected = false
      }
    })
    comps.filter((o) => {
      o.isSelected = true
    })
  }

  /**当子组件数据加载*/
  protected onLoadChild(comp: LayoutBase, data: SaveInfo) {
    // this.recoveryComponent(comp, data)
  }

  // protected loadCompleted(data: SaveInfo[]): void {
  //   if (data && data.length > 0) {
  //     this.recoveryComponent(data[0])
  //   }
  // }

  /** DragCell的删除事件*/
  private onDeleteClick(e: Event): void {
    this.removeComp()
  }

  private onCompDeleteClick(e: Event): void {
    window.console.log('cell-onCompDelete', e)
  }

  @Emit('onComponentMovedIn')
  private onComponentMovedIn(cellComp: TabContent, compId: string): void {}
}
</script>

<style scoped>
</style>