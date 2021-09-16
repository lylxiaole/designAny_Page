<template>
  <div>
    <Table ref="gTable" 
    :oddRowBackgroundColor="oddRowBackgroundColor" 
    :evenRowBackgroundColor="evenRowBackgroundColor"
    :fontColor="fontColor"
    :rowClickColor="rowClickColor"
    :rowHoverColor="rowHoverColor"
    :rowHeight="rowHeight"
    ></Table>
  </div>
</template>

<script lang="ts">
import Table from './tableComponent.vue'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '../../ComponentBase'
import { PropertyGroupName, Color_Property,  Number_Property, } from '../../../02common/commonClasses/LayoutProperty'

@Component({
  components: {
    Table: Table,
  },
})
export default class GanttTableComponent extends ComponentBase {
  mounted() {
    this.height = 500
    this.width = 800

    this.RegisterProperty('表格奇数行颜色', PropertyGroupName.special, new Color_Property(), '#2196F3')
    this.RegisterProperty('表格偶数行颜色', PropertyGroupName.special, new Color_Property(), '#ffffff')
    this.RegisterProperty('表格行字体颜色', PropertyGroupName.special, new Color_Property(), '#000000')
    this.RegisterProperty('表格行选中颜色', PropertyGroupName.special, new Color_Property(), '#00ffff')
    this.RegisterProperty('表格行悬浮颜色', PropertyGroupName.special, new Color_Property(), '#FFC10770')
    this.RegisterProperty('行高度', PropertyGroupName.special, new Number_Property(), 70)
  }

  get oddRowBackgroundColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格奇数行颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格奇数行颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格奇数行颜色')[0].value as string
      }
    }
  }

  get evenRowBackgroundColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格偶数行颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格偶数行颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格偶数行颜色')[0].value as string
      }
    }
  }
  get fontColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格行字体颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格行字体颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格行字体颜色')[0].value as string
      }
    }
  }

   get rowClickColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格行选中颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格行选中颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格行选中颜色')[0].value as string
      }
    }
  }
  get rowHoverColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格行悬浮颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格行悬浮颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格行悬浮颜色')[0].value as string
      }
    }
  }
  get rowHeight(): number {
    if (this.FindProperties(PropertyGroupName.special, '行高度')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '行高度')[0].value)
        return this.FindProperties(PropertyGroupName.special, '行高度')[0].value
    }
  }
}
</script>

<style lang="less" scoped>
</style>