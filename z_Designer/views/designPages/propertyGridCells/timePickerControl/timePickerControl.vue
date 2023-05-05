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
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npDatePicker from '@src/components/commonComponents/npDatePicker.vue'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.timePicker)
@Options({
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