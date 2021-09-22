/**
 * 颜色设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <npColorPicker :color.sync="currentValue"></npColorPicker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npColorPicker from '../../07commonComponents/npColorPicker.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.color)
@Component({
  components: {
    npColorPicker: npColorPicker
  }
})
export default class colorControl extends propertyCellBase {
  mounted() {
    window.console.log('图片组件加载')
  }
}
</script>



<style scoped>
</style>