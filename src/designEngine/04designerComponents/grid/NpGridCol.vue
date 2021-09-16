<template>
  <a-col class="np-grid-col" :span="colSpan">
    <div class="np-grid-comp-shell" :style="cellStyle">
    </div>
  </a-col>
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
  PropertyGroupName
} from '../../02common/commonClasses/LayoutProperty'
import common from '../../02common/commonMethod'
import LayoutBase, { SaveInfo, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import { ComponentBase } from '../index'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import $ from 'jquery'

@Component({
  name: 'grid-col-ex',
  components: {}
})
export default class NpGridCol extends ComponentBase {
  mounted() {
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = false
      this.onDrop_Event = this.onDrop
    } 
  }

  public colSpan: number = 0

  get cellStyle(): any {
    if (this.parentPage && this.parentPage.IsDesigning) {
      return {
        width: 'initial',
        // 'min-height': '50px',
        border: '1px dashed #ccc',
        background: '#fff',
        height: 'inherit'
        /* height: 100%; */
      }
    } else {
      return {
        width: 'initial',
        height: 'inherit'
        // 'min-height': '100px',
      }
    }
  }

  private onDrop(el: Element, targetContainer: Element, screenLeft: number, screenTop: number, dragItemData?: DragItemData<any>): boolean {
    let compId = dragItemData.dragData['compId']
    if (compId && this.children && this.children.length > 0 && this.children[0].Id === compId) {
      return false
    }
    if (this.parentLayout.Id === compId || compId === this.Id) {
      return false
    }
    this.removeComp()
    if (compId) {
      let theComp = this.parentPage.FindLayoutRecursion(compId)
      let compclass = this.findSystemComp(theComp.layoutInfo.groupName, theComp.layoutInfo.name)
      let newComp = this.insertComponentLayout(compclass, theComp.layoutInfo, dragItemData.type)
      if (newComp) {
        newComp.LoadData(theComp.GetSaveData())
        newComp.Id = common.getUuid()
        let cpname = theComp.layoutInfo.compCode ? theComp.layoutInfo.compCode : theComp.layoutInfo.name
        newComp.name = cpname + '-' + newComp.Id
        // newComp.$once('onMounted', () => {})
        this.parentPage.RemoveChildRecursion(compId)
      }
    } else {
      let compInfo = dragItemData.dragData
      window.console.log('拖拽的组件', compInfo)
      let compclass = this.findSystemComp(compInfo.groupName, compInfo.name)
      let compCon = this.insertComponentLayout(compclass, compInfo, dragItemData.type)
      if (!compCon) {
        return true
      }
      compCon.name = compInfo.compCode + '-' + compCon.Id
    }
    return false
  }

  protected renderComponent(dropcomp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    var tmpNode = window.document.createElement('div')
    dropcomp.parentPage = this.parentPage
    dropcomp.parentLayout = this

    $(this.$el)
      .find('.np-grid-comp-shell')
      .append(tmpNode)
    dropcomp.$mount(tmpNode)
    $(dropcomp.$el).css('height', 'inherit')
    dropcomp.canDrag = true
    dropcomp.onDrag_Event = (el, dragdata) => {
      dragdata.type = DragItemTypeEnum.drag_gridLayout_col
      dragdata.dragData = { compId: dropcomp.Id }
    }
    return dropcomp
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

  public chooseComps(comps: ComponentBase[]) {
    ;(this.children as ComponentBase[]).filter((o) => {
      if (comps.indexOf(o) < 0) {
        o.isSelected = false
      }
    })
    comps.filter((o) => {
      o.isSelected = true
    })
  }

  /** DragCell的删除事件*/
  private onDeleteClick(e: Event): void {
    this.removeComp()
  }

  // private onCompDeleteClick(e: Event): void {
  //   window.console.log('cell-onCompDelete', e)
  // }
}
</script>

<style scoped>
.np-grid-col {
  display: block;
  float: left;
  /* min-height: 20px; */
  /* outline: 1px dashed; */
  padding-left: 1px;
  padding-right: 1px;
  height: 100%;
  flex: inherit;
}
</style>