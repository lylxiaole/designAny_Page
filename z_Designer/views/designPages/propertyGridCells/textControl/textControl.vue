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
import { getUuid, deepClone } from '@src/utils'
import npColorPicker from '@src/components/commonComponents/npColorPicker.vue'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.text)
@Component
export default class textControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>