<template>
  <div style="width: 100%; height: 100%; position: relative"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import platform from '@design-any/interface/dist/enums/platform'

@DPageAttr(platform.webapp, 'design')
@Options({})
export default class MobilePageDesign extends EnginePage {
  //页面中包含的布局容器
}
</script>

<style scoped></style>
