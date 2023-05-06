/**
 * 数字设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input-number size="mini" controls-position="right" :step="currentPropertyType.step" v-model="currentValue" :min="currentPropertyType.min"
      :max="currentPropertyType.max">
    </el-input-number>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.number)
@Options({})
export default class numberControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>