<template>
  <div style="width:100%;height:100%;">
    <VxeTable :data="tableData">
      <VxeColumn v-for="columnconfig in tableColumns" :key="columnconfig.key" :type="columnconfig.type" :title="columnconfig.title"
        :field="columnconfig.field"></VxeColumn>
    </VxeTable>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr, DPropAttr } from '@designEngine/03designerLayoutBase'
import { PropertyGroupName, TableColumn_Setting, Text_Setting } from '@designEngine/03designerLayoutBase'

import { VxeUI, VxeIcon, VxeLoading, VxeButton } from 'vxe-pc-ui'
import { VxeTable, VxeColumn } from 'vxe-table'
// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss'
import 'vxe-pc-ui/styles/cssvar.scss'
// 导入默认的语言
import zhCN from 'vxe-pc-ui/lib/language/zh-CN'
VxeUI.setI18n('zh-CN', zhCN)
VxeUI.setLanguage('zh-CN')
VxeUI.component(VxeIcon)
VxeUI.component(VxeLoading)
VxeUI.component(VxeTable)
VxeUI.component(VxeColumn)

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '表格', 'Table1', null)
@Options({
  components: {
    VxeTable,
    VxeColumn
  }
})
export default class Index extends EngineComponent {
  @DPropAttr(new Text_Setting('数据', PropertyGroupName.special, false, null))
  private tableData: any[] = []

  @DPropAttr(new TableColumn_Setting('列设置', PropertyGroupName.special, true, null))
  private tableColumns: any[] = []

  mounted() {
    this.width = 500
    this.height = 300
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
  }
}
</script>

<style lang="less" scoped>
</style>

