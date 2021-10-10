/**
 * 数字设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input-number size="mini" controls-position="right" :step="currentPropertyType.step" v-model="currentValue" @change="handleChange"
      :min="currentPropertyType.min" :max="currentPropertyType.max">
    </el-input-number>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.number)
@Component
export default class numberControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>