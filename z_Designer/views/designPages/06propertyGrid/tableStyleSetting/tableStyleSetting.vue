/**
 * 表格属性设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <a-button type="primary" class="themeButton" @click="showTableStyleSettingModal" size="small">开始设置</a-button>
    <geno-modal :maskClosable="false" title="设置列样式" :destroyOnClose="true" v-model="tableStyleSettingVisible" :height="709" :width="1420"
      @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}"
      :cancelButtonProps="{ props: {icon: 'close'}}">
      <div style="height:600px;overflow:hidden">
        <styleSetting :currentTableStyle="currentTableStyle" :parrentTableStyle="null" :parentPage="currentPage"></styleSetting>
      </div>
    </geno-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import { columnInfo, tableStyle } from '../../04designerComponents/table/tableCommonTypes'
import styleSetting from './styleSetting.vue'
import PageBase from '../../03designerLayoutBase/PageBase'

@propertyCellTypeAttr(PropertyTypeEnum.tableStyleSetting)
@Component({
  components: {
    styleSetting: styleSetting
  }
})
export default class tableStyleSetting extends propertyCellBase {
  private currentTableStyle: tableStyle = new tableStyle()
  private tableStyleSettingVisible: boolean = false

  mounted() {
    this.currentTableStyle = common.clone(this.currentValue)
  }

  private showTableStyleSettingModal() {
    this.currentTableStyle = common.clone(this.currentValue)
    this.tableStyleSettingVisible = true
  }
  private handleOk() {
    this.currentValue = common.clone(this.currentTableStyle)
    //this.currentValue.columnInfos = []
    this.tableStyleSettingVisible = false
  }
  private handleCancel() {
    this.tableStyleSettingVisible = false
  }
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>