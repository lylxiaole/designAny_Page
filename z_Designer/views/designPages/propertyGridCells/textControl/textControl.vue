/**
 * 文本设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input size="small" v-model="currentValue" placeholder="请输入"></el-input>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import npColorPicker from '@common/components/commonComponents/npColorPicker.vue'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.text)
@Options({})
export default class textControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>