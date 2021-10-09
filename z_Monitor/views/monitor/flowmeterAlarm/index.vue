<template>
  <div style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:120px">
      <flowmeterHeader style="width:100%;height:100%" />
    </el-row>
    <el-row style=" height:calc(100% - 120px)">
      <el-col :span="8">
        <el-row style="height:50%">
          <currentAlarm style="height:100%;width:100%" />
        </el-row>
        <el-row style="height:50%">
          <alarmTop7 style="height:100%;width:100%" />
        </el-row>
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="16">
        <alarmHistory />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'
import currentAlarm from './currentAlarm.vue'
import alarmTop7 from './alarmTop7.vue'
import alarmHistory from './alarmHistory.vue'
// *****************************************************************
/***流量计报警 */
@Component({
  components: {
    flowmeterHeader,
    currentAlarm,
    alarmTop7,
    alarmHistory
  }
})
export default class Index extends PageBase {
  // ********************************************************************************
  mounted() {
    window.console.log('报警界面，计量表Id:', this.$route.query.flowmeterId)
  }
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
