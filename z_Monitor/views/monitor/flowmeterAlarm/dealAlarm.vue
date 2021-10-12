<template>
  <el-dialog title="提示" :show-close="false" :visible.sync="dialogVisible" width="700px" center>
    <div style="width:100%;height:400px">
      <el-form :inline="true" :model="dealInfo">
        <el-form-item label="处理人">
          <el-input size="small" v-model="dealInfo.user" placeholder="处理人"></el-input>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-input size="small" v-model="dealInfo.code" placeholder="处理结果"></el-input>
        </el-form-item>
        <el-form-item label="处理时长">
          <el-input size="small" v-model="dealInfo.code" placeholder="处理结果"></el-input>
        </el-form-item>
        <el-form-item label="处理过程">
          <el-input size="small" v-model="dealInfo.code" placeholder="处理结果"></el-input>
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
export default class dealAlarm extends ComponentBase {
  @Prop({
    default: () => {
      return false
    }
  })
  private dialogVisible: boolean

  @Emit('update:dialogVisible')
  private updateValue_dialogVisible(val: boolean) {}
  // *********************************
  private dealInfo: any = { code: '', areaId: '' }
  private currentAlarm: any = null

  // ********************************************************************************
  mounted() {}
  // ************************************************************
  private async onSureChoose() {
    this.onSure(this.dealInfo)
    this.updateValue_dialogVisible(false)
  }
  private async onCancelChoose() {
    this.onCancel()
    this.updateValue_dialogVisible(false)
  }
  public setCurrentAlarm(alarm: any) {
    this.currentAlarm = alarm
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
