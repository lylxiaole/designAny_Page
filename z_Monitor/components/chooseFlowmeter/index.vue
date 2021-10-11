<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="700px" center>
    <div style="width:100%;height:400px">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="物理区域">
          <el-select size="small" v-model="searchInfo.areaId" placeholder="物理区域">
            <el-option v-for="item in areaList" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号">
          <el-input size="small" v-model="searchInfo.code" placeholder="位号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSearchInfoSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" height="250" highlight-current-row @current-change="tableChooseChange" border style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="WEIHAO" label="位号" width="180">
        </el-table-column>
        <el-table-column prop="JLBMC" label="计量表" width="180">
        </el-table-column>
        <el-table-column prop="JLBCJMC" label="厂家">
        </el-table-column>
        <el-table-column prop="ZXZTMS" label="状态">
        </el-table-column>
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
import { jkzl, jlbjk, getFlowmetersInArea, jlbzdcx } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class index extends ComponentBase {
  @Prop({
    default: () => {
      return false
    }
  })
  private dialogVisible: boolean

  @Emit('update:dialogVisible')
  private updateValue_dialogVisible(val: boolean) {}
  // *********************************
  private searchInfo: any = { code: '', areaId: '' }
  private areaList: any[] = []
  private allFlowmeters: any[] = []
  private currentSelectedRow: any = null
  private get tableData(): any[] {
    return this.allFlowmeters.filter((o) => o.WEIHAO.indexOf(this.searchInfo.code) > -1)
  }
  // ********************************************************************************
  mounted() {
    this.getAllArea().then(() => {
      this.loadData()
    })
  }
  private async getAllArea() {
    this.areaList = []
    let res = await jlbzdcx()
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.areaList.push({ text: element.QYMC, value: element.QYID })
    }
    this.searchInfo.areaId = this.areaList[0].value
  }
  private async loadData() {
    let flowmeters = await getFlowmetersInArea(this.searchInfo.areaId)
    // window.console.log('loadData:', flowmeters)
    this.allFlowmeters = flowmeters
  }
  // ********************************************************************************
  private async onSearchInfoSubmit() {
    //TODO 根据条件查询计量表
    this.loadData()
  }
  private async tableChooseChange(val: any) {
    this.currentSelectedRow = val
  }
  // ************************************************************
  private async onSureChoose() {
    this.onSure(this.currentSelectedRow)
    this.updateValue_dialogVisible(false)
  }
  private async onCancelChoose() {
    this.onCancel()
    this.updateValue_dialogVisible(false)
  }
  // ************************************************************
  @Emit('onSure')
  private onSure(row: any) {}

  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style scoped>
</style>
