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
      </el-form>
    </div>
    <div style="height:calc(100% - 60px);width:100%;display:flex;flex-wrap: wrap;justify-content:flex-start;align-content:flex-start">
      <flowmeterCard style="box-sizing:border-box;width:380px" class="flowmeterCard" v-for="item in filterFlowmeters" :key="item.code"
        :cardInfo="item" />
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
import flowmeterCard from './flowmeterCard.vue'
/***作业区流量计 */
@Component({
  components: { flowmeterCard }
})
export default class Index extends PageBase {
  private serachInfo: any = {
    code: '',
    areaId: 'shanghai',
    status: null
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
      this.loadData()
      let areaId = this.$route.query.areaId
      if (areaId) {
        this.serachInfo.areaId = areaId
      }
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
</style>
