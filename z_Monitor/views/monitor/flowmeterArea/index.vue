<template>
  <div class="pageView" style="width:100%;height:100%">
    <div style="height:60px;width:100%; ">
      <el-form :inline="true" size="mini" :model="serachInfo" style="height:100%">
        <el-form-item label="作业区域">
          <el-select @change="onSearchInfoChanged" v-model="serachInfo.areaId" placeholder="作业区域">
            <el-option v-for="item in areaList" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select @change="onSearchInfoChanged" v-model="serachInfo.status" placeholder="状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号">
          <el-input v-model="serachInfo.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="展示方式">
          <el-select v-model="serachInfo.showType" placeholder="展示方式">
            <el-option label="卡片" :value="1"></el-option>
            <el-option label="表格" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:calc(100% - 60px);width:100%;display:flex;flex-wrap: wrap;justify-content:flex-start;align-content:flex-start;overflow-y:auto">
      <flowmeterCard v-for="item in filterFlowmeters" :key="item.code" :cardInfo="item" v-show="serachInfo.showType===1"
        style="box-sizing:border-box;width:330px;height:200px" class="flowmeterCard" />

      <el-table header-row-class-name="monitorTable" stripe :data="filterFlowmeters" border v-show="serachInfo.showType===2" size="small"
        height="calc(100% - 60px)" style="width: 100%">
        <el-table-column prop="code" label="位号"> </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column prop="temp" label="温度"> </el-table-column>
        <el-table-column prop="density" label="密度"> </el-table-column>
        <el-table-column prop="weight" label="累积量"> </el-table-column>
        <el-table-column prop="instantaneousFlow" label="瞬间流量"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="单表信息" placement="top">
              <el-image class="tableIcon" size="small" fit="contain" :src="infoIcon" @click="openFlowmeterInfo(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="报警信息" placement="top">
              <el-image class="tableIcon" size="small" fit="contain" :src="alarmIcon" @click="openAlarmInfo(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="历史信息" placement="top">
              <el-image class="tableIcon" size="small" fit="contain" :src="historyIcon" @click="openFlowmeterHis(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="双标对比" placement="top">
              <el-image class="tableIcon" size="small" fit="contain" :src="compareIcon" @click="openFlowmeterCompare(scope.row)" />
            </el-tooltip>

            <!-- <el-button @click="openFlowmeterInfo(scope.row)" type="text" size="small">单表信息</el-button>
            <el-button @click="openAlarmInfo(scope.row)" type="text" size="small">报警信息</el-button>
            <el-button @click="openFlowmeterHis(scope.row)" type="text" size="small">历史信息</el-button>
            <el-button @click="openFlowmeterCompare(scope.row)" type="text" size="small">双表对比</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, jlbzdcx, zdcx, getFlowmetersInArea } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import axios from 'axios'
// *****************************************************************
var alarmIcon = require('../../../assets/flowmeterAreaCard/alarm.png')
var compareIcon = require('../../../assets/flowmeterAreaCard/compare.png')
var historyIcon = require('../../../assets/flowmeterAreaCard/history.png')
var infoIcon = require('../../../assets/flowmeterAreaCard/info.png')

import flowmeterCard from './flowmeterCard.vue'
/***作业区流量计 */
@Component({
  components: { flowmeterCard }
})
export default class Index extends PageBase {
  private alarmIcon = alarmIcon
  private compareIcon = compareIcon
  private historyIcon = historyIcon
  private infoIcon = infoIcon
  // *********************************************
  private serachInfo: any = {
    code: '',
    areaId: 'shanghai',
    status: null,
    showType: 1 //1卡片，2表格
  }
  private areaList: any[] = []
  private statusList: any[] = []
  private get filterFlowmeters(): any[] {
    let res: any[] = []
    for (let index = 0; index < this.allFlowmeters.length; index++) {
      const element = this.allFlowmeters[index]
      if (this.serachInfo.status && this.serachInfo.status === element.status && element.code.indexOf(this.serachInfo.code) > -1) {
        res.push(element)
      } else if (!this.serachInfo.status && element.code.indexOf(this.serachInfo.code) > -1) {
        res.push(element)
      }
    }

    return res
  }
  private allFlowmeters: any[] = [
    {
      code: '123'
    },
    {
      code: '345'
    }
  ]
  // ********************************************************************************
  mounted() {
    axios.all([this.getAllArea(), this.getAllStatus()]).then(() => {
      let areaId = this.$route.query.areaId
      if (areaId) {
        this.serachInfo.areaId = areaId
      }
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
    this.serachInfo.areaId = this.areaList[0].value
  }
  private async getAllStatus() {
    let statusList = await zdcx()
    this.statusList = []
    this.statusList.push({ text: '全部', value: null })
    for (let index = 0; index < statusList.length; index++) {
      const statuinfo = statusList[index]
      this.statusList.push({ text: statuinfo.dicName, value: statuinfo.dicCode })
    }
    this.serachInfo.status = this.statusList[0].value
  }
  private async loadData() {
    let flowmeters = await getFlowmetersInArea(this.serachInfo.areaId)

    this.allFlowmeters = []
    for (let index = 0; index < flowmeters.length; index++) {
      const flowm = flowmeters[index]
      this.allFlowmeters.push({
        id: flowm.JLBID,
        code: flowm.WEIHAO,
        status: flowm.ZXZT,
        state: flowm.ZXZTMS,
        temp: flowm.WD + flowm.WDDW,
        density: flowm.MD + flowm.MDDW,
        weight: flowm.LJL + flowm.LJLJLDW,
        instantaneousFlow: flowm.LL + flowm.LLJLDW,
        alarmCount: flowm.BJSL
      })
    }

    // window.console.log('loadData:', flowmeters)
  }
  // ********************************************************************************
  private onSearchInfoChanged() {
    this.loadData()
  }
  // ************************************************************
  private async openFlowmeterInfo(row: any) {
    this.$router.push({ path: '/flowmeterInfo', query: { id: row.id } })
  }
  private async openAlarmInfo(row: any) {
    this.$router.push({ path: '/flowmeterAlarm', query: { id: row.id } })
  }
  private async openFlowmeterHis(row: any) {
    this.$router.push({ path: '/historyData', query: { id: row.id } })
  }
  private async openFlowmeterCompare(row: any) {
    //TODO 选择计量表参数
    this.$router.push({ path: '/flowmeterCompare', query: { id: row.id } })
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
.flowmeterCard {
  width: 400px;
  height: 225px;
  margin: 8px;
  box-sizing: border-box;
}

.tableIcon {
  margin-left: 8px;
  cursor: pointer;
}
</style>
