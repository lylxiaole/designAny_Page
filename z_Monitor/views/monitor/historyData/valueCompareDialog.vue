<template>
  <el-dialog :show-close="false" title="提示" :visible.sync="dialogVisible" width="700px" center>
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
      </el-form>
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
import { jkzl, jlbjk, getFlowmetersInArea, jlbzdcx } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class index extends ComponentBase {
  private dialogVisible: boolean = false
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  public showCompareData(data: any) {
    this.dialogVisible = true
  }
  // ************************************************************
  private async onSureChoose() {
    this.dialogVisible = false
    this.onSure()
  }
  private async onCancelChoose() {
    this.dialogVisible = false
    this.onCancel()
  }
  @Emit('onSure')
  private onSure() {}

  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style scoped>
</style>
