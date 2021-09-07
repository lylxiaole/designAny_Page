<template>
  <div style="height:100%">
    <van-row>
      <van-col :span="12">
        <van-field v-model="searchStr" placeholder="请输入位号或计量表名称" />
      </van-col>
      <van-col :span="12">
        <van-dropdown-menu>
          <van-dropdown-item v-model="currentArea" :options="areaList" @change="chooseAreaChanged" />
        </van-dropdown-menu>
      </van-col>
    </van-row>
    <van-list style="height:calc(100% - 3rem);overflow-y:auto">
      <jiliangCard class="jiliangCard" v-for="item in list" :key="item" :cardInfo="item" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import jiliangCard from './jiliangCard.vue'
@Component({
  components: {
    jiliangCard: jiliangCard
  }
})
export default class Index extends PageBase {
  private list: any[] = [
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    },
    {
      temp: '30C',
      instantaneousFlow: '100L',
      density: '300m3',
      cumulativeFlow: '20000L'
    }
  ]
  // **********模糊搜索条件*****************************************
  private searchStr: string = '模糊搜索'
  // ******************区域筛选条件***********************************
  private currentArea: number = 0
  private areaList: any[] = [{ text: '全部区域', value: 0 }, { text: '区域1', value: 1 }, { text: '区域2', value: 2 }]
  private chooseAreaChanged(e: any) {
    this.currentArea = e
  }
}
</script>
<style scoped>
.jiliangCard {
  height: 6rem;
  box-sizing: border-box;
  margin: 0.3rem;
}
</style>
