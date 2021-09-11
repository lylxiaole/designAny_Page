<template>
  <div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { getApplicationList } from '@src/apis/designApplication'
@Component
export default class applicationList extends PageBase {
  mounted() {
    this.getAppList()
  }

  private async getAppList() {
    let apps = getApplicationList()
    window.console.log('apps:', apps)
  }
}
</script>

<style>
</style>