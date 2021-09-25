<template>
  <div>
    <geno-layoutProfessional v-if="CurrentPage.PageType==2" :pageId="CurrentPage.Id" @onMounted="onPageMounted" />
    <geno-layoutSimple v-else style="height:100%;width:100%" :pageId="CurrentPage.Id" @onMounted="onPageMounted" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { PageBase } from '../03designerLayoutBase'

@Component
export default class pc_preview extends PageBase {
  @Prop() private CurrentPage: PageBase
  private onPageMounted(layout: PageBase) {
    layout.loadPageById(this.CurrentPage.Id) //给layout加载新数据
    layout.startShow()
  }
}
</script>
 
<style scoped>
</style>