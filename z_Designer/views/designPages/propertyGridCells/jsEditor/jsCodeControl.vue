/**
 * 拓展js设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <AceEditor v-model:currentCode="currentValue"></AceEditor>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import npAceEditor from '@common/components/commonComponents/npAceEditor.vue'

import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, JsonContent_Setting } from '@design-any/interface/dist'

// @CellSettingAttr(PropertyTypeEnum.jsonContent)
@Options({
  components: {
    AceEditor: npAceEditor
  }
})
export default class jsCodeControl extends propertyCellBase<JsonContent_Setting> {
  mounted() {}
}
</script>



<style scoped>
</style>