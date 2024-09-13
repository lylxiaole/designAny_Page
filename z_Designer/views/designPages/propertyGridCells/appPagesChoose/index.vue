 
<template>
  <div>
    <el-input size="small" v-model="currentValue" @change="onValueChanged" placeholder="请输入" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import propertyCellBase from '../common'
import { PropertyTypeEnum, AppPagesChoose_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'

@CellSettingAttr(PropertyTypeEnum.appPagesChoose)
@Options({})
export default class index extends propertyCellBase<AppPagesChoose_Setting> {
  mounted() {}

  private onValueChanged(val) {}
}
</script>



<style scoped>
</style>