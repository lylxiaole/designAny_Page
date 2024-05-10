/**
 * 数字设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input-number size="small" controls-position="right" :step="currentProperty.step" v-model="currentValue" :min="currentProperty.min"
      :max="currentProperty.max">
    </el-input-number>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, Number_Setting } from '@designEngine/index'

@CellSettingAttr(PropertyTypeEnum.number)
@Options({})
export default class numberControl extends propertyCellBase<Number_Setting> {
  mounted() {}
}
</script>



<style scoped>
</style>