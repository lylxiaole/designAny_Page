<template>
  <div style="width: 100%; height: 100%">
    <VxeTable :data="tableData" ref="table" stripe border :height="tableHeight" :style="{ 'background-color': cellBackground }"
      :row-config="{ isCurrent: true, isHover: true }" :column-config="{ resizable: true }"
      :header-cell-style="{ backgroundColor: headerBackground, color: headerFontColor }"
      :cell-style="{ backgroundColor: cellBackground, color: cellFontColor, 'border-color': 'black' }">
      <template v-for="col in tableColumns" :key="col.key">
        <VxeColumn v-if="col.isShow && col.type === 'image'" align="center" :title="col.title" :width="col.width" :field="col.field">
          <template #default="{ row }">
            <VxeImage width="100%" :src="row[col.field]"></VxeImage>
          </template>
        </VxeColumn>

        <VxeColumn v-else-if="col.isShow && col.type === 'template'" align="center" :title="col.title" :width="col.width" :field="col.field">
          <template #default="{ row }">
            <TableCell :parentLayout="this" :bingdingData="col.template" :rowData="row" />
          </template>
        </VxeColumn>

        <VxeColumn v-else-if="col.isShow" align="center" :type="col.type" :title="col.title" :width="col.width" :field="col.field"></VxeColumn>
      </template>
    </VxeTable>

    <vxe-pager v-if="isShowPager" style="height: 38px" size="small" v-model:currentPage="pageIndex" v-model:pageSize="pageSize"
      :total="dataTotalCount" @page-change="onPageChange"></vxe-pager>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  Number_Setting,
  PropertyGroupName,
  TableColumn_Setting,
  JsonContent_Setting,
  Boolean_Setting,
  Color_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DMethodAttr } from '@design-any/interface/dist/LayoutAttr/MethodInfo'
import TableCell from './TableCell.vue'
import { VxeTable, VxeColumn } from 'vxe-table'
import { VxeImage, VxePager } from 'vxe-pc-ui'
// 导入主题变量，也可以重写主题变量
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'

import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'
//自定义修改主题
import './tableThemeStyle.scss'
import platform from '@design-any/interface/dist/enums/platform'
import elementResizeDetectorMaker from 'element-resize-detector'
import { getLocale } from '@common/baseConfigs'

@DCompnentAttr(platform.page, getLocale().t('tip.basic'), getLocale().t('tip.classicTable'), 'Table_001', require('../compIcons/基础表格.png'))
@Options({
  components: {
    VxeTable,
    VxeColumn,
    VxePager,
    VxeImage,
    TableCell
  }
})
export default class Index extends EngineComponent {
  // ************** 属性************************
  @DPropAttr(new JsonContent_Setting(getLocale().t('tip.tableData'), PropertyGroupName.data, true, null))
  private tableData: any[] = []

  @DPropAttr(new TableColumn_Setting(getLocale().t('tip.columns'), PropertyGroupName.data, true, null))
  private tableColumns: any[] = []

  @DPropAttr(new Color_Setting(getLocale().t('tip.headersColor'), PropertyGroupName.style, true, null))
  private headerBackground: string = '#cdcdcd'

  @DPropAttr(new Color_Setting(getLocale().t('tip.headerFontColor'), PropertyGroupName.style, true, null))
  private headerFontColor: string = '#000000'

  @DPropAttr(new Color_Setting(getLocale().t('tip.cellColor'), PropertyGroupName.style, true, null))
  private cellBackground: string = '#cdcdcd'

  @DPropAttr(new Color_Setting(getLocale().t('tip.cellFontColor'), PropertyGroupName.style, true, null))
  private cellFontColor: string = '#000000'

  @DPropAttr(new Boolean_Setting(getLocale().t('tip.showPager'), PropertyGroupName.data, true, null))
  private isShowPager: boolean = true

  @DPropAttr(new Number_Setting(getLocale().t('tip.pageIndex'), PropertyGroupName.data, true, null))
  private pageIndex: number = 1

  @DPropAttr(new Number_Setting(getLocale().t('tip.pageSize'), PropertyGroupName.data, true, null))
  private pageSize: number = 50

  @DPropAttr(new Number_Setting(getLocale().t('tip.dataTotalCount'), PropertyGroupName.data, false, null))
  private dataTotalCount: number = 0

  @DEventAttr({
    eventName: 'onPageChange',
    inParams: [
      { key: 'pageSize', name: 'PageSize' },
      { key: 'currentPage', name: 'PageIndex' }
    ],
    hasOutParam: false
  })
  private onPageChange(pageSize, currentPage) {}

  @DMethodAttr({ methodName: getLocale().t('tip.getSelectedRows'), hasOutParam: true, inParams: [] })
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

  @DMethodAttr({ methodName: getLocale().t('tip.reloadData'), hasOutParam: false, inParams: [{ name: 'tableData', key: 'tableData' }] })
  private async reloadData(data: any[]) {
    await (this.$refs.table as any).reloadData([])
    await (this.$refs.table as any).reloadData(data)
  }
  // *********************************************************
  private resizeListener: any = null
  private tableHeight: number = 0

  mounted() {
    this.width = '70%'
    this.height = '50%'

    this.findPropertyInfo((o) => o.background_img).canSetting = false

    this.resizeListener = elementResizeDetectorMaker()
    this.resizeListener.listenTo(this.$el, () => {
      this.tableHeight = this.cuteTableHeight()
    })
  }

  unmounted() {
    this.resizeListener.uninstall(this.$el)
  }

  private cuteTableHeight() {
    if (!this.isShowPager) {
      return $(this.$el).height()
    }
    return $(this.$el).height() - 38
  }
}
</script>

<style lang="less" scoped></style>
