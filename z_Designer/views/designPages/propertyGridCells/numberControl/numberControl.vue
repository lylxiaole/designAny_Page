/**
 * 数字设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-input-number size="small" controls-position="right" :step="currentPropertySetting.step" v-model="currentValue"
      :min="currentPropertySetting.min" :max="currentPropertySetting.max">
    </el-input-number>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

import propertyCellBase from '../common'
import { propertyCellSettingAttr, PropertyTypeEnum } from '../common'

@propertyCellSettingAttr(PropertyTypeEnum.number)
@Options({})
export default class numberControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>