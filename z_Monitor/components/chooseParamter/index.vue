<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="370%" center>
    <div style="width:100%;height:100%">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="物理区域">
          <el-select v-model="searchInfo.area" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号">
          <el-input v-model="searchInfo.code" placeholder="位号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchInfoSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" height="250" highlight-current-row @current-change="tableChooseChange" border style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="date" label="位号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="计量表" width="180">
        </el-table-column>
        <el-table-column prop="address" label="厂家">
        </el-table-column>
        <el-table-column prop="address" label="报警状态">
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
import { jkzl, jlbjk } from '../../serviceAPIs/service'
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

  private searchInfo: any = {}
  private currentSelectedRow: any = null
  private tableData: any[] = []
  // ********************************************************************************
  mounted() {}
  // ********************************************************************************
  private async onSearchInfoSubmit() {
    //TODO 根据条件查询计量表
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
  // **************emits**********************************************
  @Emit('onSure')
  private onSure(row: any) {}

  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style scoped>
</style>
