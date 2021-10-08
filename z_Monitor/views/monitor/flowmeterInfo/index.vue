<template>
  <div style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:120px">
      <flowmeterHeader style="width:100%;height:100%" />
    </el-row>
    <el-row style=" height:calc(100% - 120px)">
      <el-col :span="12">
        <el-row style="height:33%;">
          <el-col :span="12" desc="重要测量" style="border:1px solid #000">
            <importantMeasure />
          </el-col>
          <el-col :span="12" desc="仪表状态" style="border:1px solid #000">
          </el-col>
        </el-row>
        <el-row desc="关键测量" style="height:33%;border:1px solid #000">
          <el-table :data="KeyMeasurementPoint" border>
            <el-table-column prop="date" label="数据采集点" width="180">
            </el-table-column>
            <el-table-column prop="name" label="实时数值" width="180">
            </el-table-column>
            <el-table-column prop="address" label="计量单位">
            </el-table-column>
            <el-table-column prop="address" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
        <el-row desc="仪表状态" style="height:33%;border:1px solid #000">
          <el-table :data="deviceStatus" border style="width: 100%">
            <el-table-column prop="date" label="数据采集点" width="180">
            </el-table-column>
            <el-table-column prop="name" label="实时数值" width="180">
            </el-table-column>
            <el-table-column prop="address" label="计量单位">
            </el-table-column>
            <el-table-column prop="address" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="12">
        <el-row desc="仪表报警" style="height:50%;border:1px solid #000"></el-row>
        <el-row desc="仪表系数" style="height:50%;border:1px solid #000">
          <el-table :data="instrumentCoefficient" border>
            <el-table-column prop="date" label="数据采集点" width="180">
            </el-table-column>
            <el-table-column prop="name" label="实时数值" width="180">
            </el-table-column>
            <el-table-column prop="address" label="计量单位">
            </el-table-column>
            <el-table-column prop="address" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'
import importantMeasure from './importantMeasure.vue'

// *****************************************************************
/***流量计信息 */
@Component({
  components: {
    flowmeterHeader,
    importantMeasure
  }
})
export default class Index extends PageBase {
  mounted() {}

  // ***************关键测量表格*********************************************
  private keyMeasurementPoint: any[] = []
  // ***************仪表状态表格*********************************************
  private deviceStatus: any[] = []
  // ***************仪表系数表格*********************************************
  private instrumentCoefficient: any[] = []
}
</script>
<style scoped>
</style>
