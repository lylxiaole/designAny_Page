/** * 栅格组件 * By dzd */
<template>
  <div>
    <a-row ref="gridRow" type="flex" :style="rowStyle" :gutter="rowGutter" :align="rowAlign" :justify="rowJustify">
      <div id="tempCol"></div>
    </a-row>
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
  PropertyGroupName
} from '../../03designerLayoutBase'
// import dragHelper, { dragulaExtand } from '../../02common/dragHelper'

import { ComponentBase } from '../../03designerLayoutBase'

import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'

import common from '../../02common/commonMethod'
// import { CurrentContext } from '../../01designerContext'
import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import NpGridCol from './NpGridCol.vue'

@Component({
  name: 'gridEx',
  components: {}
})
export default class NpGrid extends ComponentBase {
  // private cacheChildData: SaveInfo[] = []

  created() {
    this.width = 200
    this.height = 200

    this.registerProperty('栅格间隔', PropertyGroupName.special, new Number_Property(), 0)
    let cellData: any[] = [{ key: common.getUuid(), value: 12 }, { key: common.getUuid(), value: 12 }]
    this.registerProperty('列设置', PropertyGroupName.special, new NumberList_Property(0, 24), cellData)
    this.registerProperty('垂直对齐方式', PropertyGroupName.special, new Enum_Property(true, ['顶部对齐', '居中', '底部对齐']), '顶部对齐')
    this.registerProperty(
      '水平排列方式',
      PropertyGroupName.special,
      new Enum_Property(true, ['左对齐', '右对齐', '居中', '两侧间隔相等', '两端对齐']),
      '左对齐'
    )
  }

  mounted() {
    if (this.IsDesigning) {
      this.canDrop = false
      this.canDrag = true
      // this.onDrop_Event = this.onDrop
    }
  }

  get rowStyle(): any {
    if (this.parentPage && this.parentPage.IsDesigning) {
      return {
        'flex-flow': 'inherit',
        'padding-bottom': 0,
        padding: '5px',
        position: 'relative',
        border: '1px dashed hsla(0, 0%, 66.7%, 0.5)',
        'background-color': 'rgba(236, 245, 255, 0.3)',
        margin: '2px',
        height: 'inherit',
        overflow: 'hidden'
      }
    } else {
      return {
        'flex-flow': 'inherit',
        'padding-bottom': 0,
        padding: '5px',
        position: 'relative',
        margin: '2px',
        height: 'inherit',
        overflow: 'hidden'
      }
    }
  }

  get rowGutter(): number {
    var property = this.findPropertyByName(PropertyGroupName.special, '栅格间隔')
    let val: number = 0
    if (property) {
      val = property.value ? property.value : 0
    }
    this.layoutChildren.forEach((x) => {
      $(x.$el).css('padding-left', val / 2)
      $(x.$el).css('padding-right', val / 2)
    })
    return val
  }

  get rowColumns(): any[] {
    var property = this.findPropertyByName(PropertyGroupName.special, '列设置')
    if (property) {
      return property.value
    }
    return []
  }

  @Watch('rowColumns', { deep: true, immediate: false })
  onRowColumnsChanged(newVal: any[], oldVal: any[]) {
    if (newVal) {
      newVal.forEach((col) => {
        let child = this.layoutChildren.find((x) => x.Id === col.key)
        if (child) {
          ;(child as NpGridCol).colSpan = col.value
        } else {
          this.createNpGridCol(col)
        }
      })
      let oldCompIds: string[] = this.layoutChildren.map((x) => x.Id)
      let compIds: string[] = newVal.map((x) => x.key)
      let delIds = oldCompIds.filter((x) => compIds.indexOf(x) < 0)
      delIds.forEach((cId) => {
        this.RemoveChildRecursion(cId)
      })
    }
  }

  get rowAlign(): string {
    var property = this.findPropertyByName(PropertyGroupName.special, '垂直对齐方式')
    if (property && property.value) {
      let propertyValue: string
      let selectedValue = property.value as string
      switch (selectedValue) {
        case '顶部对齐':
          propertyValue = 'top'
          break
        case '居中':
          propertyValue = 'middle'
          break
        case '底部对齐':
          propertyValue = 'bottom'
          break
        default:
          propertyValue = selectedValue
          break
      }
      return propertyValue
    }
    return null
  }

  get rowJustify(): string {
    var property = this.findPropertyByName(PropertyGroupName.special, '水平排列方式')
    if (property && property.value) {
      let propertyValue: string
      let selectedValue = property.value as string
      switch (selectedValue) {
        case '左对齐':
          propertyValue = 'start'
          break
        case '右对齐':
          propertyValue = 'end'
          break
        case '居中':
          propertyValue = 'center'
          break
        case '两侧间隔相等':
          propertyValue = 'space-around'
          break
        case '两端对齐':
          propertyValue = 'space-between'
          break
        default:
          propertyValue = selectedValue
          break
      }
      return propertyValue
    }
    return null
  }

  private createNpGridCol(rowData: any): void {
    let layoutInfo = this.findSystemCompByCode('NpGridCol')
    layoutInfo.isNew = true
    layoutInfo.sourceId = rowData.key
    var comp = this.insertComponentLayout(layoutInfo.component, layoutInfo)
    ;(comp as NpGridCol).colSpan = rowData.value
  }

  protected renderComponent(dropcomp: NpGridCol, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    let newDomId = common.getUuid()
    dropcomp.colSpan = 12
    dropcomp.parentLayout = this
    dropcomp.parentPage = this.parentPage
    $(this.$refs['gridRow']['$el']).append('<div id="' + newDomId + '"></div>')
    dropcomp.$mount('#' + newDomId)
    dropcomp.Id = layoutInfo.sourceId
    // //自定义的组件事件
    // dropcomp.$on('onItemSelected', this.onItemSelected)

    return dropcomp
  }
}
</script>
<style scoped>
.np-grid-row {
  flex-flow: inherit;
  /* min-height: 50px; */
  /* height: 100%; */
  padding-bottom: 0;
  padding: 5px;
  /* padding-bottom: 18px; */
  position: relative;
  border: 1px dashed hsla(0, 0%, 66.7%, 0.5);
  background-color: rgba(236, 245, 255, 0.3);
  margin: 2px;
  overflow: hidden;
}
</style>
