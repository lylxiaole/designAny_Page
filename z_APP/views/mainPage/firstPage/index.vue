<template>
  <div>
    <van-row>
      <van-image round width="10rem" height="10rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
    </van-row>
    <van-row>
      <van-col span="8">计量表</van-col>
      <van-col span="8">正常</van-col>
      <van-col span="8">异常</van-col>
    </van-row>
    <van-cell-group>
      <van-field v-model="value" label="文本" placeholder="请输入用户名" />
    </van-cell-group>

    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  private get showLeftArrow() {
    return true
  }

  private active: string = null
  private onClickLeft() {
    this.$router.back()
  }
  private onTabChange(index: number) {}
}
</script>
<style>
</style>
