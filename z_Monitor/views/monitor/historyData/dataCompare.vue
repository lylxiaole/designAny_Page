<template>
  <div style="height: 100%; width: 100%">
    <el-row style="height: 50px" class="verticalAlignCenter">
      <el-button type="primary" size="small" @click="clearTableData">清空对比数据</el-button>
      <el-button type="primary" size="small" @click="startCompare">参数数据对比</el-button>
    </el-row>
    <el-row style="height: calc(100% - 50px)">
      <el-table :data="data" height="100%" highlight-current-row @current-change="tableChooseChange" @selection-change="handleSelectionChange" border
        style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column v-for="(item, index) in this.columns" :key="item.index" :prop="item.prop" :label="item.label" width="150"></el-table-column>
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
  private seletRows: any[] = []
  // ********************************************************************************
  mounted() {}
  // ************************************************************

  public setParams(params: any[]) {
    let colObj = {
      prop: 'clickTime',
      label: '采集时间'
    }
    this.columns.push(colObj)
    params.forEach((element) => {
      //TODO 计算动态列
      let colObj = {
        prop: element.PHDTAG,
        label: element.TAGMC
      }
      this.columns.push(colObj)
    })

    console.log(' this.flowmeterParams', this.columns)
  }
  public setData(data: any[]) {
    this.data.push(data)
    //TODO 计算表格事故局
  }
  // ************************************************************
  private clearTableData() {
    this.data = []
    this.seletRows = []
  }
  private startCompare() {
    if (this.seletRows.length != 2) {
      this.$message.warning('请选择两行要对比的数据！')
      return
    }
    let row1 = this.seletRows[0]
    let row2 = this.seletRows[1]
    let puts: any[] = []
    let row = new Object()
    for (let item in row1) {
      if (item != 'clickTime' && item != 'id') {
        if (!row.hasOwnProperty(item)) {
          row[item] = (row1[item] - row2[item]).toFixed(4)
          if (row[item] < 0) row[item] = row[item] * -1
          puts.push({
            val: row[item],
            label: this.columns.find((o) => o.prop === item).label + '：'
          })
        }
      }
    }
    //{ val: "123", label: "mingzhi" }
    this.columns.forEach((col) => {})
    ;(this.$refs.valueCompareDialog as valueCompareDialog).showCompareData(puts)
  }
  private tableChooseChange(val: any[]) {}
  private handleSelectionChange(val: any[]) {
    console.log('选中数据', val)
    this.seletRows = val
  }
}
</script>
<style scoped>
</style>
