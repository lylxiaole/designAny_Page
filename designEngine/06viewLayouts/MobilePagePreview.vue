<template>
  <div style="width:100%;height:100%">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, DPageAttr } from '@design-any/interface/dist/index'
@DPageAttr('mobile', 'preview')
@Options({})
export default class MobilePagePreview extends EnginePage {}
</script>
 
<style scoped>
</style>