/**
 * 数字设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <a-input-number size="small" v-model="currentValue" :min="currentPropertyType.min" :max="currentPropertyType.max"
      :step="currentPropertyType.step" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.number)
@Component
export default class numberControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>