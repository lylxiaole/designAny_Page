<template>
  <el-dialog title="提示" :show-close="false" :visible.sync="dialogVisible" width="700px" destroy-on-close center>
    <div style="width:100%;height:400px">
      <el-form :model="dealInfo">
        <el-form-item label="处理人">
          <el-input size="small" v-model="dealInfo.user" :disabled="true" placeholder="处理人"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" type="textarea" :disabled="!canedit" v-model="dealInfo.desc" placeholder="备注"></el-input>
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
import { jkzl, jlbjk, getFlowmetersInArea, jlbzdcx, dealAlarmMethod } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class dealAlarm extends ComponentBase {
  private dialogVisible: boolean = false
  private canedit: boolean = true
  // *********************************
  private dealInfo: any = { user: '当前登录人', desc: '' }
  private currentAlarm: any = null
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  private async onSureChoose() {
    if (!this.dealInfo.user || !this.dealInfo.desc) {
      this.$message.error('信息不全,请补全信息!')
      return
    }

    await dealAlarmMethod([this.currentAlarm.BJZID], this.dealInfo.user, this.dealInfo.desc)
    this.onSure(this.dealInfo)
    this.dialogVisible = false
    this.$message.success('处理成功!')
  }
  private async onCancelChoose() {
    this.onCancel()
    this.dialogVisible = false
  }
  public async dealCurrentAlarm(alarm: any) {
    window.console.log('dealCurrentAlarm:', alarm)
    if (window.parent && window.parent.window) {
      this.dealInfo.user = window.parent.window.localStorage.getItem('yhqm')
    }
    if (process.env.NODE_ENV === 'development') {
      this.dealInfo.user = '123'
    }
    this.dialogVisible = true
    this.currentAlarm = alarm
    this.canedit = true
  }

  public async watchAlarmDeal(alarm: any) {
    this.dialogVisible = true
    this.currentAlarm = alarm
    this.dealInfo.user = alarm.CLR
    this.dealInfo.desc = alarm.BZ
    this.canedit = false
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
