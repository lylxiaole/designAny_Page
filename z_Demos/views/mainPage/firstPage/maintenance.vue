/** 维保巡检信息*/ 
<template>
  <div>
    <div style="position:relative">
      <span style="float:left">{{cardInfo.code}}</span>
      <span style="float:right">{{cardInfo.time}}</span>
    </div>
    <div>
      {{card.alarmInfoString}}
    </div>
    <div>
      <span>{{card.timeLength}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  @Prop({ default: {} })
  cardInfo: any
}
</script>
<style>
</style>
