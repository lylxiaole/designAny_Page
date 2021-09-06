<template>
  <div>
    <van-row style="height:15rem;padding:3rem;box-sizing:border-box">
      <van-row>
        <van-image round width="1.5rem" height="1.5rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
      </van-row>
      <van-row>
        <van-col span="8">计量表</van-col>
        <van-col span="8">正常</van-col>
        <van-col span="8">异常</van-col>
      </van-row>
    </van-row>

    <van-cell-group>
      <van-field label="文本" placeholder="请输入用户名" />
    </van-cell-group>

    <van-list>
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  private list: any[] = []
}
</script>
<style>
</style>
