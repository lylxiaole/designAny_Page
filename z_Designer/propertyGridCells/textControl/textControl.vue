<template>
  <div>
    <el-input size="small" v-model="currentValue" @change="onValueChanged" placeholder="Please Input" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import propertyCellBase from '../common'
import { PropertyTypeEnum, Text_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'

@CellSettingAttr(PropertyTypeEnum.text)
@Options({})
export default class textControl extends propertyCellBase<Text_Setting> {
  mounted() {}

  private onValueChanged(val) {}
}
</script>

<style scoped></style>
