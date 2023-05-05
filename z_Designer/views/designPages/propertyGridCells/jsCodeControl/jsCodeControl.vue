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
import { Prop, Component, Emit } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npAceEditor from '@src/components/commonComponents/npAceEditor.vue'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.javaScriptCode)
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