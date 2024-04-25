/**
 * 颜色设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <bcolorPicker :color.sync="currentValue" style="height:25px"></bcolorPicker>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

import propertyCellBase from '../common'
import { propertyCellSettingAttr, PropertyTypeEnum } from '../common'

import bcolorPicker from '@common/components/colorPickr/colorPicker.vue'

@propertyCellSettingAttr(PropertyTypeEnum.color)
@Options({
  components: {
    bcolorPicker
  }
})
export default class colorPicker extends propertyCellBase {
  mounted() {
    window.console.log('图片组件加载')
  }
}
</script>



<style scoped>
</style>