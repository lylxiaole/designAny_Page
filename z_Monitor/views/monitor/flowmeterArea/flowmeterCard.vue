<template>
  <div style="box-sizing:border-box;" :style="{'border-left-style': 'solid','border-left-width': '5px','border-left-color':borderColor}">
    <el-card class="box-card" style="height:100%">
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

  public get borderColor(): string {
    if (!this.cardInfo) {
      return '#29CC40'
    }
    // 0 绿色为正常；1 橙色为有信息提醒；2 红色为有故障；
    //          3 深蓝色为数采错误；4 紫色为数据以前的，长时间未数采。
    //          6 通讯失败，用橙色
    switch (this.cardInfo.status) {
      case '0':
        return '#29CC40'
        break
      case '1':
        return '#6E87FF'
        break
      case '2':
        return '#FF5959'
        break
      case '3':
        return '#C50B0B'
        break
      case '4':
        return '#000000'
        break
      case '5':
        return '#ED5F00'
        break
      case '6':
        return '#ED0F5D'
        break
      default:
        return '#DBAE03'
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
  box-sizing: border-box;
  padding: 7px 4px;
}

/deep/ .el-card > .el-card__body {
  padding: 10px !important;
}
</style>
