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
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import npAceEditor from '@common/components/commonComponents/npAceEditor.vue'

import propertyCellBase from '../common'
import { propertyCellSettingAttr, PropertyTypeEnum } from '../common'

@propertyCellSettingAttr(PropertyTypeEnum.javaScriptCode)
@Options({
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