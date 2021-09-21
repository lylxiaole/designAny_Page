/**
 * 文本设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <a-input size="small" placeholder="请输入" v-model="currentValue" :defaultValue="currentValue" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import npColorPicker from '../../07commonComponents/npColorPicker.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.text)
@Component
export default class textControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>