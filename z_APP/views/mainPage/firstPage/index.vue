<template>
  <div>
    <van-cell title="采集站状态">
      <template #label>
        <van-row>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" :src="zhuangxieIcon" />
            </div>
            <div class="middleAlign">
              装卸作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" :src="youpinIcon" />
            </div>
            <div class="middleAlign">
              油品作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" :src="matouIcon" />
            </div>
            <div class="middleAlign">
              码头作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" :src="chengpinIcon" />
            </div>
            <div class="middleAlign">
              成品作业区
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="物理区域">
      <template #label>
        <van-grid :column-num="3" :border="false">
          <van-grid-item v-for="item in realLocationStatus" :key="item.QYMC">
            <div class="middleAlign">
              <van-circle :value="item.zclv" :rate="100" :speed="100" :text="item.zclvPersent" size="4rem" />
            </div>
            <div class="middleAlign">
              {{item.QYMC}}
            </div>
          </van-grid-item>
        </van-grid>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="最近报警信息">
      <template #right-icon>
        <div class="moreBtn" @click="leadToAlarmInfo">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <alarmInfoCard v-for="item in alarmInfoList" :key="item.key" :cardInfo="item" style="margin-top:0.8rem" />
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="维保/巡检计划">
      <template #right-icon>
        <div class="moreBtn" @click="leadToPlanInfo">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <van-grid :column-num="2" :border="false">
          <van-grid-item class="firstGridItem">
            <equipment :cardInfo="WBPlanData"></equipment>
          </van-grid-item>
          <van-grid-item>
            <equipment :cardInfo="XJPlanData"></equipment>
          </van-grid-item>
        </van-grid>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import alarmInfoCard from '../alarmInformation/alarmInfoCard.vue'
import equipment from './equipment.vue'
import moment from 'moment'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { getDateStr } from '@src/utils/dateUtils'
const caijiStateNormal = require('../../../assets/img/caijiStateNormal.png')
const caijiStateError = require('../../../assets/img/caijiStateError.png')

@Component({
  components: {
    alarmInfoCard: alarmInfoCard,
    equipment: equipment
  }
})
export default class Index extends PageBase {
  mounted() {
    this.getCollectionStatus()
    this.getQyztHz()
    this.getWranInfo()
    this.getWBJL()
    this.getXJJL()
  }
  // ***********采集站状态*********************************************************************
  private collectionStatus: any[] = []
  // 装卸
  private get zhuangxieIcon() {
    let find = this.collectionStatus.find((o) => o.sjwz === '装卸作业区')
    if (find && find.ycbs === '0') {
      return caijiStateNormal
    } else {
      return caijiStateError
    }
  }
  // 油品
  private get youpinIcon() {
    let find = this.collectionStatus.find((o) => o.sjwz === '油品作业区')
    if (find && find.ycbs === '0') {
      return caijiStateNormal
    } else {
      return caijiStateError
    }
  }
  // 码头
  private get matouIcon() {
    let find = this.collectionStatus.find((o) => o.sjwz === '码头作业区')
    if (find && find.ycbs === '0') {
      return caijiStateNormal
    } else {
      return caijiStateError
    }
  }
  // 成品
  private get chengpinIcon() {
    let find = this.collectionStatus.find((o) => o.sjwz === '成品作业区')
    if (find && find.ycbs === '0') {
      return caijiStateNormal
    } else {
      return caijiStateError
    }
  }
  private async getCollectionStatus() {
    var formData = new FormData()
    formData.append('action', 'getXwjsczt')
    let res = await jkzl(formData)
    if (!res) {
      this.collectionStatus = []
      return
    }
    this.collectionStatus = res
  }
  // ***********物理区域查询*********************************************************************
  private realLocationStatus: any[] = []
  private async getQyztHz() {
    var formData = new FormData()
    formData.append('action', 'getQyztHz')
    let res = await jkzl(formData)
    if (!res) {
      this.realLocationStatus = []
      return
    }
    for (let index = 0; index < res.length; index++) {
      let element = res[index]
      element.zclv = parseFloat(element.zclv)
      element.zclvPersent = element.zclv + '%'
    }
    this.realLocationStatus = res
  }
  // ***********报警信息查询*********************************************************************
  private alarmInfoList: any[] = []
  private async getWranInfo() {
    var formData = new FormData()
    formData.append('action', 'getWranInfo')
    formData.append('rq', getDateStr(new Date()))
    let res = await jkzl(formData)
    window.console.log('getWranInfo:', res)
    this.alarmInfoList = []
    if (!res) {
      return
    }

    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      let startTime = moment(element.KSSJ)
      let endTime = moment(element.JSSJ)

      this.alarmInfoList.push({
        code: element.WEIHAO,
        time: element.KSSJ,
        desc: element.CWXXZW,
        timeLength: endTime.diff(startTime, 'hour') + '小时'
      })
    }
  }

  private leadToAlarmInfo() {
    this.$store.commit('app/changeBottomBarActive', 2)
  }
  // ***********维保计划*********************************************************************
  private WBPlanData: any = {}
  private async getWBJL() {
    var formData = new FormData()
    formData.append('action', 'getWBJL')
    formData.append('rq', getDateStr(new Date()))
    let res = await jkzl(formData)
    window.console.log('getWBJL:', res)
    if (!res) {
      this.WBPlanData = {}
      return
    }
    this.WBPlanData = {
      type: '维保',
      count: res.count,
      desc: res.data.bz,
      timeLength: res.data.yjwbsc + '分钟',
      status: res.data.wbzt,
      result: res.data.wbjg,
      time: res.data.wbjssj
    }
  }
  private leadToPlanInfo() {
    this.$store.commit('app/changeBottomBarActive', 4)
  }
  // ***********巡检计划*********************************************************************
  private XJPlanData: any = {}
  private async getXJJL() {
    var formData = new FormData()
    formData.append('action', 'getXJJL')
    formData.append('rq', getDateStr(new Date()))
    let res = await jkzl(formData)
    window.console.log('getXJJL:', res)
    if (!res) {
      this.XJPlanData = {}
      return
    }
    this.XJPlanData = {
      type: '巡检',
      count: res.count,
      desc: res.data.bz,
      timeLength: res.data.yjxjsc + '分钟',
      status: res.data.xjzt,
      result: res.data.xjjg,
      time: res.data.xjjssj
    }
  }
}
</script>
<style lang="less" scoped>
.jiliangCard {
  height: 10rem;
  box-sizing: border-box;
  margin: 1rem;
}

.moreBtn {
  display: flex;
  vertical-align: middle;
  text-align: center;
  height: 1.5rem;
  span {
    line-height: 1.5rem;
  }
  i {
    line-height: 1.5rem;
  }
  i:before {
    vertical-align: middle;
    text-align: center;
  }
}

/deep/ .firstGridItem .van-grid-item__content {
  border-right: 1px solid #808080 !important;
}
</style>
