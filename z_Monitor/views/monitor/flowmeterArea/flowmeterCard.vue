<template>
  <div>
    <el-card class="box-card">
      <el-row class="row">
        <el-col :span="12">位号:{{cardInfo.code}}</el-col>
        <el-col :span="12">状态:{{cardInfo.state}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">温度:{{cardInfo.temp}}</el-col>
        <el-col :span="12">密度:{{cardInfo.density}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">累积量:{{cardInfo.weight}}</el-col>
        <el-col :span="12">瞬间流量:{{cardInfo.instantaneousFlow}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">是否有报警:{{cardInfo.alarmCount?cardInfo.alarmCount:'无'}}</el-col>
      </el-row>
      <el-row class="row">
        <el-button class="button" size="mini" @click="openFlowmeterInfo">单表信息</el-button>
        <el-button class="button" size="mini" @click="openAlarmInfo">报警信息</el-button>
        <el-button class="button" size="mini" @click="openFlowmeterHis">历史信息</el-button>
        <el-button class="button" size="mini" @click="openFlowmeterCompare">双表对比</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
})
export default class flowmeterCard extends ComponentBase {
  @Prop({
    default: () => {
      return { id: '', code: 'HT-4009', status: '0', state: '正常', temp: ' ', density: ' ', weight: '', instantaneousFlow: '', alarmCount: 4 }
    }
  })
  cardInfo: any

  public get backgroundColor(): string {
    if (!this.cardInfo) {
      return ''
    }

    switch (this.cardInfo.status) {
      case '0':
        break
      case '1':
        break
      case '2':
        break
      case '3':
        break
      case '4':
        break
      default:
        break
    }
  }

  //
  mounted() {}
  // ************************************************************
  private async openFlowmeterInfo() {
    this.$router.push({ path: '/flowmeterInfo', query: { id: this.cardInfo.id } })
  }
  private async openAlarmInfo() {
    this.$router.push({ path: '/flowmeterAlarm', query: { id: this.cardInfo.id } })
  }
  private async openFlowmeterHis() {
    this.$router.push({ path: '/historyData', query: { id: this.cardInfo.id } })
  }
  private async openFlowmeterCompare() {
    //TODO 选择计量表参数
    this.$router.push({ path: '/flowmeterCompare', query: { code: this.cardInfo.code } })
  }
}
</script>
<style lang="less" scoped>
.row {
  margin: 12px 0px;
}
.button {
  padding: 7px 8px;
}

/deep/ .el-card > .el-card__body {
  padding: 10px !important;
}
</style>
