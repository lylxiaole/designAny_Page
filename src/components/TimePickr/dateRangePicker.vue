<template>
  <el-row style="width:100%" class="verticalAlignCenter">
    <el-col style="width:80px" class="verticalAlignCenter">
      <span>时间范围:</span>
    </el-col>
    <el-col style="width:calc(50% - 52px)" class="verticalAlignCenter">
      <el-date-picker size="small" v-model="startTimeInner" @change="onStartTimeChange" type="datetime" placeholder="选择开始日期" />
    </el-col>
    <el-col style="width:24px" class="verticalAlignCenter">
      <span>至</span>
    </el-col>
    <el-col style="width:calc(50% - 52px)" class="verticalAlignCenter">
      <el-date-picker size="small" v-model="endTimeInner" @change="onEndTimeChange" type="datetime" placeholder="选择结束日期" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { watchFile } from 'fs'
// *****************************************************************
/***流量计数据对比 */
@Options({})
export default class index extends ComponentBase {
  private startTimeInner: any = new Date()
  private endTimeInner: any = new Date()

  @Prop({
    default: () => {
      return new Date()
    }
  })
  private startTime: any
  @Emit('update:startTime')
  private updateStartTime_inner(val: any) {}
  @Watch('startTime', { deep: true, immediate: true })
  private watchStartTimeChange(val: any) {
    this.startTimeInner = val
  }

  @Prop({
    default: () => {
      return new Date()
    }
  })
  private endTime: any
  @Emit('update:endTime')
  private updateEndtime_inner(val: any) {}
  @Watch('endTime')
  private watchEndTimeChange(val: any) {
    this.endTimeInner = val
  }

  // ************************************************************
  mounted() {}
  private onStartTimeChange(val: any) {
    window.console.log('onStartTimeChange:', val)
    if (this.endTime && this.endTime < val) {
      this.$message.warning('开始日期不能大于结束日期')
      this.startTimeInner = this.startTime
    } else {
      this.updateStartTime_inner(val)
    }
  }
  private onEndTimeChange(val: any) {
    window.console.log('onEndTimeChange:', val)
    if (this.startTime && this.startTime > val) {
      this.$message.warning('结束日期不能小于开始日期')
      this.endTimeInner = this.endTime
    } else {
      this.updateEndtime_inner(val)
    }
  }
  // ************************************************************
  @Emit('onSure')
  private onSure(rows: any[]) {}
  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style scoped>
</style>
