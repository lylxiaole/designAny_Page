<template>
  <div style="height:100%;width:100%;position:relative">
    <apiList @onChooseApi="onChooseApi" style="width:250px;height:100%;float:left" />
    <apiDetail v-if="currentApiContent" :currentApi="currentApiContent" ref="apiDetail" :allDictorys="allDictorys"
      style="width:calc(100% - 250px);height:100%;float:left" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ThirtyApiDC, GetApiDetail } from '@common/apis/designThirtyApi'

import apiList from './apiList.vue'
import apiDetail from './apiDetail.vue'
import { GetAll } from '@common/apis/designDictionary'

@Options({
  components: {
    apiList: apiList,
    apiDetail: apiDetail
  }
})
export default class index extends PageBase {
  private currentApiContent: ThirtyApiDC = null
  private allDictorys: any[] = []
  mounted() {
    GetAll().then((res) => {
      this.allDictorys = res
    })
  }
  activated() {}
  private async onChooseApi(apiId) {
    if (!apiId) {
      this.currentApiContent = null
    } else {
      this.currentApiContent = await GetApiDetail(apiId)
      if (!this.currentApiContent.headers) {
        this.currentApiContent.headers = []
      }
      if (!this.currentApiContent.bodyContent) {
        this.currentApiContent.bodyContent = []
      }
      if (!this.currentApiContent.inParams) {
        this.currentApiContent.inParams = []
      }
    }

    // await this.$nextTick()
    // ;(this.$refs.apiDetail as apiDetail).setApiContent(this.currentApiContent)
  }
}
</script>

<style lang="less">
</style>