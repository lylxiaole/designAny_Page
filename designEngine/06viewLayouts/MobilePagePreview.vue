<template>
  <div style="width:100%;height:100%">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import paltform from '@design-any/interface/dist/enums/paltform'

@DPageAttr(paltform.webapp, 'preview')
@Options({})
export default class MobilePagePreview extends EnginePage {}
</script>
 
<style scoped>
</style>