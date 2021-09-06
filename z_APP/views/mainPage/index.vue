<template>
  <div>
    <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />

    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item icon="home-o">标签1</van-tabbar-item>
      <van-tabbar-item icon="search">标签2</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签3</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签4</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  constructor() {
    super()
  }
}
</script>
<style>
</style>
