<template>
  <div>
    <van-cell title="物料流程">
      <template #label>
        <van-grid :column-num="3" :border="false">
          <van-grid-item style="height:8rem" v-for="item in positionList" :key="item.QYMC" @click="onItemClick(item)">
            <van-image width="100%" fit="contain" v-show="item.VAL==='0'" :src="positionIconNotFlow" />
            <van-image width="100%" fit="contain" v-show="item.VAL!=='0'" :src="positionIconFlow" />
            <span>{{item.QYMC}}</span>
          </van-grid-item>
        </van-grid>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'

@Component
export default class Index extends PageBase {
  private positionIconNotFlow = require('../../../assets/img/positionIcon.png')
  private positionIconFlow = require('../../../assets/img/positionIcon.gif')
  mounted() {
    this.getQyzt()
  }
  // *********************************************************************
  private positionList: any[] = []
  private async getQyzt() {
    var formData = new FormData()
    formData.append('action', 'getQyzt')
    let res = await jkzl(formData)
    this.positionList = []
    if (!res) {
      return
    }
    this.positionList = res
  }
  // ************************************************************************
  private onItemClick(item: any) {
    // window.console.log('onItemClick:', item)
    this.$router.push({ path: '/index/flowmeter', query: { area: item.QYMC } })
  }
}
</script>
<style>
</style>
