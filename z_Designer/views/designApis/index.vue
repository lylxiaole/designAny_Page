<template>
  <div style="height:100%;width:100%;position:relative">
    <!-- <apiList @onChooseApi="onChooseApi" style="width:250px;height:100%;float:left" />

    <apiDetail :currentApiContent="currentApiContent" style="width:calc(100% - 250px);height:100%;float:left" /> -->

    正在开发......
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import apiList from './apiList.vue'
import apiDetail from './apiDetail.vue'

import { GetApiContent, ApiContentDC } from '@common/apis/designApi'

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
  }
}
</script>

<style>
</style>