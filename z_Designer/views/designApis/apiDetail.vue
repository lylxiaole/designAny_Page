<template>
  <div>
    <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">

    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ApiContentDC, UpdateSertAPIContent } from '@common/apis/designApi'
@Options({})
export default class apiDetail extends ComponentBase {
  @Prop({ default: null })
  private currentApiContent: ApiContentDC

  mounted() {}

  private async startDesignApp() {
    // this.$router.push({ path: '/designPages', query: { appId: this.currentApplication.id } })
  }
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>