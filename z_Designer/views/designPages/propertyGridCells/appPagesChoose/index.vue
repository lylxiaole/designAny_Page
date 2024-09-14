 
<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(0,103,138,0.1);border-color:rgba(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEdit" size="small">
      选择页面
    </el-button>

    <chooseDialog ref="chooseDialog" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import propertyCellBase from '../common'
import { PropertyTypeEnum, AppPagesChoose_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'
import { GetApplicationPages } from '@common/apis/designPage'
import chooseDialog from './chooseDialog.vue'

@CellSettingAttr(PropertyTypeEnum.appPagesChoose)
@Options({ components: { chooseDialog } })
export default class index extends propertyCellBase<AppPagesChoose_Setting> {
  mounted() {}

  private async startEdit() {
    let allPages = await GetApplicationPages(this.application.id)
    ;(this.$refs.chooseDialog as chooseDialog).show(this.currentValue, allPages)
  }
}
</script>



<style scoped>
</style>