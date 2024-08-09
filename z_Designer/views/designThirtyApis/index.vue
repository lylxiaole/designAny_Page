<template>
  <div style="height:100%;width:100%;position:relative">
    <apiList @onChooseApi="onChooseApi" style="width:250px;height:100%;float:left" />
    <apiDetail v-if="currentApiContent" ref="apiDetail" style="width:calc(100% - 250px);height:100%;float:left" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ThirtyApiDC, GetApiDetail } from '@common/apis/designThirtyApi'

import apiList from './apiList.vue'
import apiDetail from './apiDetail.vue'
@Options({
  components: {
    apiList: apiList,
    apiDetail: apiDetail
  }
})
export default class index extends PageBase {
  private currentApiContent: ThirtyApiDC = null

  mounted() {}

  private async onChooseApi(apiId) {
    if (!apiId) {
      this.currentApiContent = null
    } else {
      this.currentApiContent = await GetApiDetail(apiId)
    }

    await this.$nextTick()
    ;(this.$refs.apiDetail as apiDetail).setApiContent(this.currentApiContent)
  }
}
</script>

<style lang="less">
</style>