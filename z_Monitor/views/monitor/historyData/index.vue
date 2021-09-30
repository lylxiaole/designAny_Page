<template>
  <div style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:120px">
      <flowmeterHeader style="width:100%;height:100%" />
    </el-row>
    <el-row style=" height:calc(100% - 120px)">
      <el-col :span="18">
        <historyInfo />
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="6">
        <dataCompare />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import importantMeasure from '../flowmeterInfo/importantMeasure.vue'
import historyInfo from './historyInfo.vue'
import dataCompare from './dataCompare.vue'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'

// *****************************************************************
/***历史数据分析 */
@Component({
  components: {
    flowmeterHeader,
    importantMeasure,
    historyInfo,
    dataCompare
  }
})
export default class Index extends PageBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
