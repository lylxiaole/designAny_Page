/**
 * 拓展js设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <AceEditor :currentCode.sync="currentValue"></AceEditor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npAceEditor from '../../07commonComponents/npAceEditor.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.javaScriptCode)
@Component({
  components: {
    AceEditor: npAceEditor
  }
})
export default class jsCodeControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>