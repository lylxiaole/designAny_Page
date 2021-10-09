<template>
  <div style="width:100%;height:100%">
    <div style="height:60px;width:100%; ">
      <el-form :inline="true" size="mini" :model="serachInfo" style="height:100%">
        <el-form-item label="位号">
          <el-input v-model="serachInfo.code" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="作业区域">
          <el-select v-model="serachInfo.areaId" placeholder="活动区域">
            <el-option v-for="item in areaList" :key="item.value" :label="item.text" :value="item.value"></el-option>

            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="serachInfo.state" placeholder="活动区域">
            <el-option label="状态一" value="shanghai"></el-option>
            <el-option label="状态二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:calc(100% - 60px);width:100%;display:flex;flex-wrap: wrap;">
      <flowmeterCard class="flowmeterCard" v-for="item in allFlowmeters" :key="item.code" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, jlbzdcx } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
import flowmeterCard from './flowmeterCard.vue'
/***作业区流量计 */
@Component({
  components: { flowmeterCard }
})
export default class Index extends PageBase {
  private serachInfo: any = {
    code: '123',
    areaId: 'shanghai',
    state: 'shanghai'
  }
  private areaList: any[] = [{ text: '全部区域', value: 0 }, { text: '区域1', value: 1 }, { text: '区域2', value: 2 }]

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
    this.getAllArea().then(() => {
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
  private async loadData() {
    let areaId = this.$route.query.areaId
    if (areaId) {
      this.serachInfo.areaId = areaId
    }
  }
}
</script>
<style lang="less" scoped>
.flowmeterCard {
  width: 340px;
  height: 250px;
  margin: 8px;
}
</style>
