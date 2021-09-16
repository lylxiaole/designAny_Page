<template>
  <div style="position:relative" :style="{'width':width+'px','height':height+'px','left':left+'px','top':top+'px','background-color':'gray'}">
    <!-- <LayoutCell class="ppap" ref="firstCol" style="width:100%:height:100%"></LayoutCell> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import PageBase from '../PageBase'
import common from '../../02common/commonMethod'

import ComponentBase from '../../04designerComponents/ComponentBase'

import LayoutCell, { dataForSave } from './LayoutCell.vue'

import { Row } from 'ant-design-vue'
import { rowData, colData, colDataBase, rowDataBase } from './Layout_Classes'

@Component({
  components: {
    LayoutCell: LayoutCell,
  },
})
export default class Layout_Grid extends PageBase {
  //   private get currentControl(): LayoutCell {
  //     return this.$refs['firstCol'] as LayoutCell
  //   }
  //   mounted() {
  //     this.width = '100%'
  //     this.height = '100%'
  //     this.onDrop_Event = this.listenOnDropDown
  //     // window.console.log("栅栏布局完成");
  //   }
  //   /********************************************************************** */
  //   /*************数据保存和加载************************************************** */
  //   public getCompnentsData(): any {
  //     return this.currentControl.getData()
  //   }
  //   public loadComponentsData(data: any) {
  //     window.console.log('加载数据')
  //     this.loadComponentFromData(data as dataForSave, this.currentControl)
  //   }
  //   private listenOnDropDown(el: Element, targetContainer: Element, screenLeft: number, screenTop: number): boolean {
  //     if (this.IsDesigning == false) {
  //       return false
  //     }
  //     // window.console.log("栅栏页面----listenOnDropDown", el);
  //     var compInfo = null
  //     compInfo = this._dragHelper.getDragItemInfo(el) as ComponentInfo
  //     if (!compInfo) {
  //       compInfo = this._dragHelper.getDragItemInfo(el) as LayoutCell
  //       if (!compInfo) {
  //         return true
  //       }
  //     }
  //     screenLeft = $(this._dragHelper.dragCloneElement).offset().left
  //     screenTop = $(this._dragHelper.dragCloneElement).offset().top
  //     switch (compInfo.type) {
  //       case DragItemTypeEnum.drop_system_component:
  //         var compCon = this.insertComponentLayout(compInfo.name, compInfo.groupName, compInfo.type)
  //         if (!compCon) {
  //         }
  //         compCon.left = screenLeft - $(this.$el).offset().left
  //         compCon.top = screenTop - $(this.$el).offset().top
  //         break
  //       case DragItemTypeEnum.dragmove_component_inpage:
  //         window.console.log('栅栏页面----内部组件拖拽')
  //         var compCon2 = this.copyLayoutComponent(compInfo.compId)
  //         if (!compCon2) {
  //           window.console.log('compCon2 is null')
  //           return true
  //         } else {
  //           compCon2.left = screenLeft - $(this.$el).offset().left
  //           compCon2.top = screenTop - $(this.$el).offset().top
  //           window.console.log('compCon2', compCon2.$el)
  //           window.console.log('DeleteChildComponents')
  //           this.DeleteChildComponents(compInfo.compId)
  //         }
  //         break
  //       default:
  //         break
  //     }
  //     return false
  //   }
  //   private loadComponentFromData(data: dataForSave, control: LayoutCell) {
  //     control.createCellByData(data)
  //     if (control.centerCol.vueComp == null) {
  //       var compinfo = data.centerColData.layotCellData as ComponentSaveInfo
  //       control.IsListenedDrop = true
  //       var compCon = this.insertComponentLayout(compinfo.compInfo.name, compinfo.compInfo.groupName, compinfo.compInfo.type)
  //       if (compCon) {
  //         compCon.LoadData(compinfo)
  //       }
  //     } else {
  //       this.loadComponentFromData(data.centerColData.layotCellData, control.centerCol.vueComp as LayoutCell)
  //     }
  //     if (control.upRow.vueComp) {
  //       this.loadComponentFromData(data.upRowData.layotCellData, control.upRow.vueComp as LayoutCell)
  //     }
  //     if (control.downRow.vueComp) {
  //       this.loadComponentFromData(data.downRowData.layotCellData, control.downRow.vueComp as LayoutCell)
  //     }
  //     if (control.leftCol.vueComp) {
  //       this.loadComponentFromData(data.leftColData.layotCellData, control.leftCol.vueComp as LayoutCell)
  //     }
  //     if (control.rightCol.vueComp) {
  //       this.loadComponentFromData(data.rightColData.layotCellData, control.rightCol.vueComp as LayoutCell)
  //     }
  //   }
  //   /*************添加组件************************************************** */
  //   protected renderComponent(compCon: ComponentBase): boolean {
  //     var cell = this.findTargetContianer(this.currentControl)
  //     window.console.log('this.currentControl', this.currentControl.$el)
  //     window.console.log('cell', cell.$el)
  //     if (!cell) {
  //       return false
  //     }
  //     //先渲染，后指定节点
  //     compCon.$mount()
  //     cell.AddComponent(compCon)
  //     this.setIsListenedDrop_False(this.currentControl)
  //     return true
  //   }
  //   private findTargetContianer(target_cell: LayoutCell): LayoutCell {
  //     if (target_cell.IsListenedDrop) {
  //       return target_cell
  //     }
  //     var childCells: LayoutCell[] = []
  //     this.getChildCells(target_cell, childCells)
  //     var findCell: LayoutCell = null
  //     childCells.forEach((cell, index) => {
  //       var res = this.findTargetContianer(cell)
  //       if (res) {
  //         findCell = res
  //       }
  //     })
  //     return findCell
  //   }
  //   private getChildCells(target_cell: LayoutCell, childCells: LayoutCell[]) {
  //     if (target_cell.upRow.vueComp) {
  //       childCells.push(target_cell.upRow.vueComp)
  //     }
  //     if (target_cell.downRow.vueComp) {
  //       childCells.push(target_cell.downRow.vueComp)
  //     }
  //     if (target_cell.leftCol.vueComp) {
  //       childCells.push(target_cell.leftCol.vueComp as LayoutCell)
  //     }
  //     if (target_cell.rightCol.vueComp) {
  //       childCells.push(target_cell.rightCol.vueComp as LayoutCell)
  //     }
  //     if (target_cell.centerCol.vueComp instanceof LayoutCell) {
  //       childCells.push(target_cell.centerCol.vueComp as LayoutCell)
  //     }
  //   }
  //   private findParentCell(target_cell: LayoutCell, original_cell?: LayoutCell): LayoutCell {
  //     if (!target_cell) {
  //       return null
  //     }
  //     if (!original_cell) {
  //       original_cell = this.currentControl
  //     }
  //     var childCells: LayoutCell[] = []
  //     if (original_cell.upRow.vueComp) {
  //       if (original_cell.upRow.vueComp == target_cell) {
  //         return original_cell
  //       } else {
  //         childCells.push(original_cell.upRow.vueComp)
  //       }
  //     }
  //     if (original_cell.downRow.vueComp) {
  //       if (original_cell.downRow.vueComp == target_cell) {
  //         return original_cell
  //       } else {
  //         childCells.push(original_cell.downRow.vueComp)
  //       }
  //     }
  //     if (original_cell.leftCol.vueComp) {
  //       let theCell = original_cell.leftCol.vueComp as LayoutCell
  //       if (theCell == target_cell) {
  //         return original_cell
  //       } else {
  //         childCells.push(theCell)
  //       }
  //     }
  //     if (original_cell.rightCol.vueComp) {
  //       let theCell = original_cell.rightCol.vueComp as LayoutCell
  //       if (theCell == target_cell) {
  //         return original_cell
  //       } else {
  //         childCells.push(theCell)
  //       }
  //     }
  //     if (original_cell.centerCol.vueComp instanceof LayoutCell) {
  //       let theCell = original_cell.centerCol.vueComp as LayoutCell
  //       if (theCell == target_cell) {
  //         return original_cell
  //       } else {
  //         childCells.push(theCell)
  //       }
  //     }
  //     this.getChildCells(original_cell, childCells)
  //     var parentCell: LayoutCell = null
  //     childCells.forEach((cell, index) => {
  //       var res = this.findParentCell(target_cell, cell)
  //       if (res) {
  //         parentCell = res
  //       }
  //     })
  //     return parentCell
  //   }
  //   private findTargetContianerById(target_cell: LayoutCell, compId: string): LayoutCell {
  //     let isComp = target_cell.centerCol.vueComp instanceof ComponentBase
  //     if (isComp) {
  //       var comp = target_cell.centerCol.vueComp as ComponentBase
  //       if (comp.Id === compId) {
  //         return target_cell
  //       }
  //     }
  //     var childCells: LayoutCell[] = []
  //     this.getChildCells(target_cell, childCells)
  //     var findCell: LayoutCell = null
  //     childCells.forEach((cell, index) => {
  //       var res = this.findTargetContianerById(cell, compId)
  //       if (res) {
  //         findCell = res
  //       }
  //     })
  //     return findCell
  //   }
  //   private setIsListenedDrop_False(target_cell: LayoutCell) {
  //     target_cell.IsListenedDrop = false
  //     var childCells: LayoutCell[] = []
  //     this.getChildCells(target_cell, childCells)
  //     childCells.forEach((cell, index) => {
  //       this.setIsListenedDrop_False(cell)
  //     })
  //   }
  //   /**
  //    *转移栅栏页面的组件
  //    *
  //    * @param {string} compId 源组件ID
  //    * @returns {ComponentBase} 转移的组件
  //    * @memberof PageBase
  //    */
  //   public copyLayoutComponent(compId: string): ComponentBase {
  //     if (!compId) {
  //       return null
  //     }
  //     let theComp = this.innerComponents.find((o) => o.Id == compId)
  //     if (theComp) {
  //       window.console.log('copyLayoutComponent-theComp', theComp)
  //       var newComp = this.insertComponentLayout(theComp.compInfo.name, theComp.compInfo.groupName, theComp.compInfo.type)
  //       if (newComp) {
  //         var oldCompData = common.clone(theComp.GetSaveData())
  //         newComp.LoadData(oldCompData)
  //         newComp.Id = common.getUuid()
  //         return newComp
  //       } else {
  //         return null
  //       }
  //     } else {
  //       return null
  //     }
  //   }
  //   /*************overrides************************************************** */
  //   protected DeleteChildComponents(compId: string): boolean {
  //     window.console.log('栅栏页面----删除组件', compId)
  //     var cell = this.findTargetContianerById(this.currentControl, compId)
  //     // window.console.log("cell-el", cell.$el);
  //     if (!cell) {
  //       return false
  //     }
  //     cell.removeCenterColComp()
  //     this.currentControl.cuteSize()
  //     return true
  //   }
}
</script>



<style scoped>
</style>