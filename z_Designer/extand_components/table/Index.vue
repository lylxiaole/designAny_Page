<template>
  <div style="width: 100%; height: 100%">
    <VxeTable
      :data="tableData"
      ref="table"
      stripe
      border
      style="overflow-y: auto"
      :style="{ height: isShowPager ? 'calc(100% - 38px)' : '100%', 'background-color': cellBackground }"
      :row-config="{ isCurrent: true, isHover: true }"
      :column-config="{ resizable: true }"
      :header-cell-style="{ backgroundColor: headerBackground, color: headerFontColor }"
      :cell-style="{ backgroundColor: cellBackground, color: cellFontColor, 'border-color': 'black' }"
    >
      <template v-for="columnconfig in tableColumns" :key="columnconfig.key">
        <VxeColumn v-if="columnconfig.isShow" :type="columnconfig.type" :title="columnconfig.title" :field="columnconfig.field"></VxeColumn>
      </template>
    </VxeTable>

    <VxePager v-if="isShowPager" style="height: 38px" size="small" v-model:currentPage="pageIndex" v-model:pageSize="pageSize" :total="dataTotalCount" @page-change="onPageChange"></VxePager>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { DPropAttr, Number_Setting, PropertyGroupName, TableColumn_Setting, JsonContent_Setting, Boolean_Setting, Color_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DMethodAttr } from '@design-any/interface/dist/LayoutAttr/MethodInfo'

import { VxeTable, VxeColumn, VxeColgroup, VxePager } from 'vxe-table'
// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss'
import 'vxe-table/lib/style.css'
//自定义修改主题
import './tableThemeStyle.scss'
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.webpc, '基础组件', '表格', 'Table_001', null)
@Options({
  components: {
    VxeTable,
    VxeColumn,
    VxePager
  }
})
export default class Index extends EngineComponent {
  // ************** 属性************************
  @DPropAttr(new JsonContent_Setting('数据', PropertyGroupName.data, true, null))
  private tableData: any[] = []

  @DPropAttr(new TableColumn_Setting('列设置', PropertyGroupName.data, true, null))
  private tableColumns: any[] = []

  @DPropAttr(new Color_Setting('表头背景色', PropertyGroupName.style, true, null))
  private headerBackground: string = '#cdcdcd'

  @DPropAttr(new Color_Setting('表头字体颜色', PropertyGroupName.style, true, null))
  private headerFontColor: string = '#000000'

  @DPropAttr(new Color_Setting('表身背景色', PropertyGroupName.style, true, null))
  private cellBackground: string = '#cdcdcd'

  @DPropAttr(new Color_Setting('表身字体颜色', PropertyGroupName.style, true, null))
  private cellFontColor: string = '#000000'

  @DPropAttr(new Boolean_Setting('是否有分页', PropertyGroupName.data, true, null))
  private isShowPager: boolean = true

  @DPropAttr(new Number_Setting('当前页', PropertyGroupName.data, true, null))
  private pageIndex: number = 1
  @DPropAttr(new Number_Setting('页大小', PropertyGroupName.data, true, null))
  private pageSize: number = 50
  @DPropAttr(new Number_Setting('数据总条数', PropertyGroupName.data, false, null))
  private dataTotalCount: number = 0

  @DEventAttr({
    eventName: '分页变化',
    inParams: [
      { key: 'pageSize', name: '页大小' },
      { key: 'currentPage', name: '当前页' }
    ],
    hasOutParam: false
  })
  private onPageChange(pageSize, currentPage) {}

  @DMethodAttr({ methodName: '获取选择行', hasOutParam: true })
  private getSelectedRows() {
    let findradioCol = this.tableColumns.find((o) => o.type === 'radio')

    let findcheckCol = this.tableColumns.find((o) => o.type === 'checkbox')
    if (findradioCol) {
      let row = (this.$refs.table as any).getRadioRecord(true)
      return [row]
    } else if (findcheckCol) {
      let rows = (this.$refs.table as any).getCheckboxRecords(true)
      return rows
    } else {
      let row = (this.$refs.table as any).getCurrentRecord()
      return [row]
    }
  }

  mounted() {
    this.width = '70%'
    this.height = '50%'
    this.findPropertyByName(PropertyGroupName.style, '背景图片').canSetting = false
  }
}
</script>

<style lang="less" scoped></style>
