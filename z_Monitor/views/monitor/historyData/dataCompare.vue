<template>
  <div style="height:100%;width:100%">
    <el-row style="height:50px">
      <el-button type="primary" @click="clearTableData">清空对比数据</el-button>
      <el-button type="primary" @click="startCompare">参数数据对比</el-button>
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-table size="small" :data="data" height="100%" highlight-current-row @current-change="tableChooseChange" border style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="WEIHAO" label="位号">
        </el-table-column>
        <el-table-column prop="JLBMC" label="计量表">
        </el-table-column>
        <el-table-column prop="JLBCJMC" label="厂家">
        </el-table-column>
        <el-table-column prop="ZXZTMS" label="状态">
        </el-table-column>
      </el-table>
    </el-row>
    <valueCompareDialog ref="valueCompareDialog" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import valueCompareDialog from './valueCompareDialog.vue'
// *****************************************************************
/***贮运厂总览 */
@Component({
  components: {
    valueCompareDialog
  }
})
export default class dataCompare extends ComponentBase {
  private columns: any[] = []
  private data: any[] = []
  private flowmeterParams: any[]
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  public setParams(params: any[]) {
    this.flowmeterParams = params
    //TODO 计算动态列
  }
  public setData(params: any[]) {
    this.flowmeterParams = params
    //TODO 计算动态列
  }
  // ************************************************************
  private clearTableData() {}
  private startCompare() {
    ;(this.$refs.valueCompareDialog as valueCompareDialog).showCompareData(this.data)
  }
  private tableChooseChange(val: any[]) {}
}
</script>
<style scoped>
</style>
