/**
 * 枚举设置
 * By LYL
 * 日期
 为了兼容之前的数据，value使用显示值，勿改 xuww 2020-08-31 add
 */
<template>
  <div>
    <a-select size="small" v-model="currentValue" :defaultValue="currentValue">
      <a-select-option v-for="(enumm,index) in currentPropertyType.enums" :key="index" :value="enumm">{{enumm}}</a-select-option>
    </a-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import npColorPicker from '../../07commonComponents/npColorPicker.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.enum)
@Component({
  components: {
    npColorPicker: npColorPicker,
  },
})
export default class enumControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>