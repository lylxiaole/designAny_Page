<template>
  <div style="height:100%;width:100%">
    <el-row style="height:100%">
      <el-col :span="12" style="padding:6px 16px;box-sizing:border-box">
        <el-row class="flexHorilanLayout">
          <span>流量计:&nbsp;{{flowmeter1?flowmeter1.JLBMC:''}}</span>
        </el-row>
        <el-row class="flexHorilanLayout" style="margin-top:8px">
          <span style="width:80px">参数名:</span>
          <el-input style="width:calc(100% - 80px)" v-model="paramName1"></el-input>
        </el-row>
        <el-row class="flexHorilanLayout" style="margin-top:8px">
          <el-table :data="tableData1" height="220" highlight-current-row @selection-change="tableChooseChange1" border style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="TAGMC" label="参数">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="12" style="padding:6px 16px;box-sizing:border-box">
        <el-row class="flexHorilanLayout">
          <span>流量计:&nbsp;{{flowmeter2?flowmeter2.JLBMC:''}}</span>
        </el-row>
        <el-row class="flexHorilanLayout" style="margin-top:8px">
          <span style="width:80px">参数名:</span>
          <el-input style="width:calc(100% - 80px)" v-model="paramName2"></el-input>
        </el-row>
        <el-row class="flexHorilanLayout" style="margin-top:8px">
          <el-table :data="tableData2" height="220" highlight-current-row @selection-change="tableChooseChange2" border style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="TAGMC" label="参数">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/PageBase'
import { jkzl, jlbjk, getFlowmeterParams } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class choosePamaters extends ComponentBase {
  private flowmeter1: any = null
  private flowmeter2: any = null
  private paramName1: string = ''
  private paramName2: string = ''
  private allParams1: any[] = []
  private allParams2: any[] = []

  @Prop({
    default: () => {
      return null
    }
  })
  private firstChooseParams: any
  @Emit('update:firstChooseParams')
  private updateValue_firstChooseParams(val: any) {}

  @Prop({
    default: () => {
      return null
    }
  })
  private secondChooseParams: any
  @Emit('update:secondChooseParams')
  private updateValue_secondChooseParams(val: any) {}

  private get tableData1(): any[] {
    return this.allParams1.filter((o) => o.TAGMC.toLowerCase().indexOf(this.paramName1.toLowerCase()) > -1)
  }
  private get tableData2(): any[] {
    return this.allParams2.filter((o) => o.TAGMC.toLowerCase().indexOf(this.paramName2.toLowerCase()) > -1)
  }
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  private tableChooseChange1(params: any[]) {
    this.updateValue_firstChooseParams(params)
  }
  private tableChooseChange2(params: any[]) {
    this.updateValue_secondChooseParams(params)
  }
  // ************************************************************

  public async setFlowmeter(flowmeter1: any, flowmeter2: any) {
    this.flowmeter1 = flowmeter1
    this.flowmeter2 = flowmeter2
    this.allParams1 = await getFlowmeterParams(flowmeter1.JLBID, null)
    this.allParams2 = await getFlowmeterParams(flowmeter2.JLBID, null)
  }
  public async setCurrentParams(firstParams: any[], secondParams: any[]) {
    this.updateValue_firstChooseParams(firstParams)
    this.updateValue_secondChooseParams(secondParams)
  }
}
</script>
<style scoped>
</style>
