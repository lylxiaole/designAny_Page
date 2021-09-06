<template>
  <div style="height:100%">
    <van-cell-group style="height:3rem">
      <van-field placeholder="请输入用户名" />
    </van-cell-group>
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
}
</script>
<style scoped>
.jiliangCard {
  height: 10rem;
  box-sizing: border-box;
  margin: 1rem;
}
</style>
