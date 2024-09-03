<template>
  <div>
    <DatePicker v-model="currentValue" :dateType="currentProperty.dateType" :showTime="currentProperty.showTime" :format="currentProperty.format" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import npDatePicker from '@common/components/commonComponents/npDatePicker.vue'
import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, TimePickerFile_Setting } from '@design-any/interface/LayoutAttr/PropertyInfo'

@CellSettingAttr(PropertyTypeEnum.timePicker)
@Options({
  components: {
    DatePicker: npDatePicker
  }
})
export default class timePickerControl extends propertyCellBase<TimePickerFile_Setting> {
  mounted() {}
}
</script>



<style scoped>
</style>