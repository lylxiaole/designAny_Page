<template>
  <div style="height:100%;width:100%">
    <el-table :data="tableData" height="250" border style="width: 100%">
      <el-table-column prop="date" label="位号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="流量计名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="温度">
      </el-table-column>
      <el-table-column prop="address" label="密度">
      </el-table-column>
      <el-table-column prop="address" label="质量流量">
      </el-table-column>
      <el-table-column prop="address" label="质量累计量">
      </el-table-column>
      <el-table-column prop="address" label="状态">
      </el-table-column>
      <el-table-column prop="address" label="是否又报警">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="viewFlowmeterInfo(scope.row)" type="text" size="small">主要信息</el-button>
          <el-button type="text" size="small">历史信息</el-button>
          <el-button type="text" size="small">报警信息</el-button>
          <el-button type="text" size="small">参数对比</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class flowmeterTable extends ComponentBase {
  // ********************************************************************************
  mounted() {}
  // *************** *********************************************
  private async viewFlowmeterInfo(rowdata: any) {}
}
</script>
<style scoped>
</style>
