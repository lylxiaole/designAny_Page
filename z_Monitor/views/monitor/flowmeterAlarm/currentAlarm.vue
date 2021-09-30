<template>
  <div>
    <el-carousel :interval="4000" type="card" height="100%">
      <el-carousel-item>
        <alarmCard />
      </el-carousel-item>
      <el-carousel-item>
        <alarmCard />
      </el-carousel-item>
      <el-carousel-item>
        <alarmCard />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
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
  //
  mounted() {}
  // ************************************************************
}
</script>
<style lang="less" scoped>
</style>
