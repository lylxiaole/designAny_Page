<template>
  <div>

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
