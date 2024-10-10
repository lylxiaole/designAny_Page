<template>
  <div style="height: 100%; width: 100%; position: relative">
    <applicationList ref="applicationList" @onCurrentApplicationChanged="onCurrentApplicationChanged" style="width: 400px; height: 100%; float: left"></applicationList>
    <applicationDetail ref="applicationDetail" :currentApplication="currentApplication" style="width: calc(100% - 400px); height: 100%; float: left"></applicationDetail>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import applicationList from './applicationList.vue'
import applicationDetail from './applicationDetail.vue'
@Options({
  components: {
    applicationList: applicationList,
    applicationDetail: applicationDetail
  }
})
export default class index extends PageBase {
  private currentApplication: any = null
  mounted() {}
  // ******************************************************************
  private async onCurrentApplicationChanged(app: any) {
    this.currentApplication = app
  }
}
</script>

<style></style>
