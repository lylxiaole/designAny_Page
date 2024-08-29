/**
 * 文本设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input size="small" v-model="currentValue" @change="onValueChanged" placeholder="请输入" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import propertyCellBase from '../common'
import { PropertyTypeEnum, Text_Setting } from '@design-any/interface/dist/index'

import { CellSettingAttr } from '../common'

@CellSettingAttr(PropertyTypeEnum.text)
@Options({})
export default class textControl extends propertyCellBase<Text_Setting> {
  mounted() {}

  private onValueChanged(val) {}
}
</script>



<style scoped>
</style>