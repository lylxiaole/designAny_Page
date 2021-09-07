<template>
  <div>
    <van-cell title="流程">
      <template #label>
        <div>
          <van-image width="7rem" height="7rem" fit="cover" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </div>
      </template>
    </van-cell>
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
