<template>
  <div style="width:100%;height:100%">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePage } from '../03designerLayoutBase'

@Component
export default class PCPagePreview extends EnginePage {}
</script>
 
<style lang="less" scoped>
/deep/ .container {
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0px;
}
</style>