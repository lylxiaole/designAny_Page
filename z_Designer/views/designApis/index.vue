<template>
  <div style="height:100%;width:100%;position:relative">
    <apiList @onChooseApi="onChooseApi" style="width:250px;height:100%;float:left" />
    <apiDetail ref="apiDetail" :currentApiContent="currentApiContent" style="width:calc(100% - 250px);height:100%;float:left" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import apiList from './apiList.vue'
import apiDetail from './apiDetail.vue'
import { GetApiContent, ApiContentDC } from '@common/apis/designApi'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: {
    apiList: apiList,
    apiDetail: apiDetail
  }
})
export default class index extends PageBase {
  private currentApiContent: ApiContentDC = null
  mounted() {}

  private async onChooseApi(apiId) {
    if (!apiId) {
      this.currentApiContent = null
      return
    }

    this.currentApiContent = await GetApiContent(apiId)

    let behav: behavior = null
    if (this.currentApiContent && this.currentApiContent.content) {
      behav = JSON.parse(this.currentApiContent.content)
    } else {
      behav = new behavior()
    }

    ;(this.$refs.apiDetail as any).setCurrentApi(behav)
  }
}
</script>

<style>
</style>