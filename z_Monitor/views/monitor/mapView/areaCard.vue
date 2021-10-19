<template>
  <el-card class="box-card" :style="{'border-left-style': 'solid','border-left-width': '5px','border-left-color':borderColor}">
    <div style="height:100%;width:100%">
      <el-row class="inforow">
        <span style="font-size:22px;">{{cardInfo.areaName}}</span>
      </el-row>
      <el-row class="inforow">
        <el-col :span="8">
          <span class="infotext">总数: {{cardInfo.totalCount}}</span>
        </el-col>
        <el-col :span="8">
          <span class="infotext">正常: {{cardInfo.normalCount}}</span>
        </el-col>
        <el-col :span="8">
          <span class="infotext">正常率: {{cardInfo.normalRate}}</span>
        </el-col>
      </el-row>
      <el-row class="inforow">
        <el-col :span="8">
          <span class="infotext">故障: {{cardInfo.errorCount}}</span>
        </el-col>
        <el-col :span="8">
          <span class="infotext">信息: {{cardInfo.infoCount}}</span>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
      <el-row class="inforow">
        <el-col :span="8">
          <span class="infotext">数采异常: {{cardInfo.datacollectErrorCount}}</span>
        </el-col>
        <el-col :span="8">
          <span class="infotext">禁止通讯: {{cardInfo.forbiddenConntectCount}}</span>
        </el-col>
        <el-col :span="8">
          <span class="infotext">通讯失败: {{cardInfo.conntectErrorCount}}</span>
        </el-col>
      </el-row>
      <el-row class="inforow">
        <el-button @click="leadToDetail" type="text">流量计明细</el-button>
      </el-row>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import { Interface } from 'readline'
import { get } from 'xe-utils'
// *****************************************************************
export interface cardInfo {
  areaId: string
  areaName: string
  status: string //状态
  totalCount: number //总数
  normalCount: number //正常数量
  normalRate: string //正常率
  errorCount: number //故障数量
  infoCount: number //信息数量
  datacollectErrorCount: number //数采异常数量
  forbiddenConntectCount: number //禁止通讯数量
  conntectErrorCount: number //通讯失败数量
}

/***贮运厂总览 */
@Component({
  components: {}
})
export default class areaCard extends ComponentBase {
  @Prop({
    default: () => {
      return {
        areaId: '1',
        areaName: '油品作业区',
        status: '0',
        totalCount: 12, //总数
        normalCount: 13, //正常数量
        normalRate: '30%', //正常率
        errorCount: 50, //故障数量
        infoCount: 20, //信息数量
        datacollectErrorCount: 10, //数采异常数量
        forbiddenConntectCount: 2, //禁止通讯数量
        conntectErrorCount: 3 //通讯失败数量
      }
    }
  })
  private cardInfo: cardInfo

  get borderColor(): string {
    if (!this.cardInfo) {
      return ''
    }

    let dqzt = parseInt(this.cardInfo.status)
    switch (dqzt) {
      case 0:
        return '#29CC40'
        break
      case 1:
        return '#DBAE03'
        break
      case 2:
        return '#C50B0B'
        break
      case 3:
        return '#DBAE03'
        break
      case 4:
        return '#DBAE03'
        break
      case 5:
        return '#DBAE03'
        break
      case 6:
        return '#DBAE03'
        break
      default:
        return '#29CC40'
        break
    }
  }
  // ********************************************************************************
  mounted() {}
  // *************** *********************************************
  private leadToDetail() {
    this.$router.push({ path: '/flowmeterArea', query: { areaId: this.cardInfo.areaId } })
  }
}
</script>
<style scoped>
.infotext {
  font-size: 14px;
}
.inforow {
  margin: 4px 0px;
}
</style>
