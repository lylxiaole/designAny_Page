<template>
  <div>
    <van-cell title="流程">
      <template #label>
        <van-grid :column-num="3" :border="false">
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
          <van-grid-item>
            <van-image fit="cover" :src="positionIcon" />
          </van-grid-item>
        </van-grid>

      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  private positionIcon = require('../../../assets/img/positionIcon.png')
  private list: any[] = []
}
</script>
<style>
</style>
