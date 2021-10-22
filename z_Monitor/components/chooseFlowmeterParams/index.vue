<template>
  <el-dialog :show-close="false" title="选择流量计参数" :visible.sync="dialogVisible" top="0px" width="700px" center :close-on-click-modal="false"
    destroy-on-close append-to-body>
    <div style="width: 100%; height: 400px">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="监控类型">
          <el-select size="small" v-model="searchInfo.watchType" @change="onTypeChanged" placeholder="监控类型">
            <el-option v-for="item in watchTypes" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input size="small" v-model="searchInfo.paramName" placeholder="参数名称"></el-input>
        </el-form-item>
      </el-form>

      <el-table size="small" ref="multipleTable" header-row-class-name="monitorTable" stripe :data="tableData" height="250" highlight-current-row
        @selection-change="tableChooseChange" tooltip-effect="dark" border style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="TAGMC" label="参数"> </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancelChoose">取 消</el-button>
      <el-button type="primary" @click="onSureChoose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, jlbzdcx, getFlowmeterParams, getParamsTypeList } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class index extends ComponentBase {
  private dialogVisible: boolean = false
  // *********************************
  private flowmeterId: string
  // *********************************
  private searchInfo: any = { watchType: '', paramName: '' }
  private watchTypes: any[] = []
  private allParams: any[] = []
  private currentSelectedRows: any[] = []

  private get tableData(): any[] {
    return this.allParams.filter((o) => o.TAGMC.toLowerCase().indexOf(this.searchInfo.paramName.toLowerCase()) > -1)
  }
  // ********************************************************************************
  mounted() {}
  private async getAllWatchType() {
    let typelist = await getParamsTypeList()
    this.watchTypes = []
    this.watchTypes.push({ text: '全部类型', value: null })
    for (let index = 0; index < typelist.length; index++) {
      const element = typelist[index]
      this.watchTypes.push({ text: element.dicName, value: element.dicCode })
    }
    this.searchInfo.watchType = null
  }
  private async loadParams() {
    let res = await getFlowmeterParams(this.flowmeterId, this.searchInfo.watchType)
    if (!res) {
      res = []
    }
    this.allParams = res
    //window.console.log("loadParams:", this.allParams);
  }
  // ********************************************************************************
  private async tableChooseChange(val: any) {
    window.console.log('tableChooseChange:', val)
    this.currentSelectedRows = val
  }
  private onTypeChanged(val: any) {
    window.console.log('onTypeChanged:', val)
    this.searchInfo.watchType = val
    this.loadParams()
  }
  // ************************************************************
  public async showDialog(flowmeterId: string) {
    window.console.log('showDialog:', flowmeterId)
    this.flowmeterId = flowmeterId
    this.dialogVisible = true
    await this.getAllWatchType()
    await this.loadParams()
    this.allParams.forEach((element) => {
      //根据条件 让某些行选中  sfssll, 1  流量，2 温度，3 密度，4 驱动，5累积量
      if (element.SFSSLL == '1' || element.SFSSLL == '2' || element.SFSSLL == '3' || element.SFSSLL == '5')
        this.$refs.multipleTable.toggleRowSelection(element)
    })
  }

  public async initParams(flowmeterId: string) {
    this.flowmeterId = flowmeterId
    await this.loadParams()
    this.allParams.forEach((element) => {
      //根据条件 让某些行选中  sfssll, 1  流量，2 温度，3 密度，4 驱动，5累积量
      if (element.SFSSLL == '1' || element.SFSSLL == '2' || element.SFSSLL == '3' || element.SFSSLL == '5')
        this.$refs.multipleTable.toggleRowSelection(element)
    })
  }

  private async onSureChoose() {
    this.onSure(this.currentSelectedRows)
    this.dialogVisible = false
  }
  private async onCancelChoose() {
    this.onCancel()
    this.dialogVisible = false
  }
  // ************************************************************
  @Emit('onSure')
  private onSure(rows: any[]) {}

  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style lang="less" scoped>
@import '../../assets/monitorStyle.less';
</style>
