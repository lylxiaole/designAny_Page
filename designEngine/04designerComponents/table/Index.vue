<template>
  <div style="width:100%;height:100%;">
    <VxeTable :data="tableData">
      <VxeColumn type="seq" width="60"></VxeColumn>
      <VxeColumn field="name" title="Name"></VxeColumn>
      <VxeColumn field="sex" title="Sex"></VxeColumn>
      <VxeColumn field="age" title="Age"></VxeColumn>
    </VxeTable>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr, DPropAttr } from '@designEngine/03designerLayoutBase'
import { PropertyGroupName, UploadFile_Setting, Text_Setting } from '@designEngine/03designerLayoutBase'

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
  mounted() {
    this.width = 80
    this.height = 34
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
  }

  private onClick(e) {}
}
</script>

<style lang="less" scoped>
</style>

