<template>
  <div>
    <div v-if="!currentAlrams||currentAlrams.length<1" style="height:100%;width:100%;" class="verticalAlignCenter flexHorilanLayout">
      暂无当前报警数据
    </div>
    <el-carousel v-else :interval="5000" type="card" height="100%" indicator-position="outside">
      <el-carousel-item style="width:70%;  margin-left: -10%;" v-for="item in currentAlrams" :key="item.BJID">
        <alarmCard @onDealAlarm="onDealAlarm(item)" :cardInfo="item" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getCurrentAlarm } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import alarmCard from './alarmCard.vue'
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {
    alarmCard
  }
})
export default class currentAlarm extends ComponentBase {
  @Prop({
    default: () => {
      return null
    }
  })
  private flowmeterId: string
  @Watch('flowmeterId')
  private async watchflowmeterIdChange(val: any) {
    if (val) {
      this.loadData(val)
    }
  }
  private currentAlrams: any[] = []
  //
  mounted() {}
  // ************************************************************
  private async loadData(flowmeterId: string) {
    let res = await getCurrentAlarm(flowmeterId)
    window.console.log('getCurrentAlarm:', res)
    if (!res) {
      this.currentAlrams = []
    } else {
      this.currentAlrams = res
    }
  }
  @Emit('onDealAlarm')
  private onDealAlarm(alarmData: any): any {}
}
</script>
<style lang="less" scoped>
</style>
