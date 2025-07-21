<template>
  <div style="height:100%;width:100%;position:relative">
    <apisTable />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
 import { GetApiContent, ApiContentDC } from '@common/apis/designApi'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import apisTable from './apisTable.vue'

@Options({
  components: {
    apisTable: apisTable
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