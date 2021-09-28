<template>
  <div style="height:100%">
    <van-row style="height:4rem;background-color:white;padding:0.9rem 0.4rem;box-sizing:border-box">
      <van-col :span="12" style="height:2.2rem">
        <van-field v-model="searchStr" class="smallInput" placeholder="请输入位号" />
      </van-col>
      <van-col :span="12" style="padding-left:3rem">
        <van-dropdown-menu>
          <van-dropdown-item v-model="currentArea" :options="areaList" @change="chooseAreaChanged" />
        </van-dropdown-menu>
      </van-col>
    </van-row>
    <van-list style="height:calc(100% - 4rem);width:100%">
      <jiliangCard class="jiliangCard" v-for="item in list" :key="item.jlbid" :cardInfo="item" @onCardClick="onClickCard(item)" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import jiliangCard from './jiliangCard.vue'
import { jkzl, jlbjk, jlbzdcx } from '../../../serviceAPIs/service'

@Component({
  components: {
    jiliangCard: jiliangCard
  }
})
export default class Index extends PageBase {
  mounted() {
    this.getAllArea()
  }

  activated() {
    // **************************************************************************
    let chooseArea = this.$router.currentRoute.query.area
    // window.console.log('chooseArea:', chooseArea)
    if (chooseArea) {
      let find = this.areaList.find((o) => o.text === chooseArea)
      if (find) {
        this.currentArea = find.value
      }
    }
    this.getJlbTagInfo()
    // **************************************************************************
  }

  // **********模糊搜索条件*****************************************
  private searchStr: string = ''
  private currentArea: string = '1'
  private areaList: any[] = [{ text: '全部区域', value: 0 }, { text: '区域1', value: 1 }, { text: '区域2', value: 2 }]
  private async getAllArea() {
    this.areaList = []
    let res = await jlbzdcx()
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.areaList.push({ text: element.QYMC, value: element.QYID })
    }
    this.currentArea = this.areaList[0].value
    await this.getJlbTagInfo()
  }
  private chooseAreaChanged(e: any) {
    this.currentArea = e
    this.getJlbTagInfo()
  }
  // **********获取流量计数据列表*****************************************
  private get list(): any[] {
    if (!this.searchStr) {
      return this.flowmeterList
    }
    return this.flowmeterList.filter((o) => o.wh.indexOf(this.searchStr) > -1)
  }
  private flowmeterList: any[] = []
  private async getJlbTagInfo() {
    var formData = new FormData()
    formData.append('action', 'getJlbTagInfo')
    formData.append('qyid', this.currentArea)
    let res = await jkzl(formData)
    this.flowmeterList = []
    if (!res) {
      return
    }
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.flowmeterList.push({
        jlbid: element.jlbid,
        wh: element.wh,
        temp: element.dataVals.wd + '℃',
        instantaneousFlow: element.dataVals.sjllbl + 'L',
        density: element.dataVals.md,
        cumulativeFlow: element.dataVals.ljll + 'L',
        isAlarm: element.dataVals.bj.indexOf('有报警') > -1
      })
    }
  }
  private onClickCard(item: any) {
    this.$router.push({ path: '/index/flowmeterDetail', query: { jlbid: item.jlbid } })
  }

  // *******************************************************
}
</script>
<style lang="less" scoped>
.jiliangCard {
  height: 6.8rem;
  box-sizing: border-box;
  margin-top: 0.4rem;
  background-color: white;
}
.smallInput {
  height: 2.1rem;
  padding: 0.3rem 0.4rem;
  border: 1px solid #979797;
  border-radius: 5px;
}
/deep/ .van-dropdown-menu {
  .van-dropdown-menu__bar {
    box-shadow: none !important;
    height: 2.1rem !important;
  }
}

/deep/ .van-dropdown-item {
  .van-popup {
    margin: 0rem 0.5rem !important;
    width: calc(100% - 1rem);
    .van-cell__title {
      font-size: 0.6rem !important;
      font-weight: 400 !important;
    }
  }
}
</style>
