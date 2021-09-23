/**
 * 事件设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <DatePicker :value.sync="currentValue" :dateType="currentPropertyType.dateType" :showTime="currentPropertyType.showTime"
      :format="currentPropertyType.format" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npDatePicker from '@src/components/commonComponents/npDatePicker.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.timePicker)
@Component({
  components: {
    DatePicker: npDatePicker
  }
})
export default class timePickerControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>