<template>
  <div style="height:100%;width:100%;position:relative">
    <funcList @onChooseFunc="onChooseFunc" style="width:250px;height:100%;float:left" />
    <funcDetail v-if="currentFuncContent" :currentFunc="currentFuncContent" ref="apiDetail" style="width:calc(100% - 250px);height:100%;float:left" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { JSFuncEntity, GetFuncDetail } from '@common/apis/designJSFunc'

import funcList from './funcList.vue'
import funcDetail from './funcDetail.vue'

@Options({
  components: {
    funcList: funcList,
    funcDetail: funcDetail
  }
})
export default class index extends PageBase {
  private currentFuncContent: JSFuncEntity = null
  mounted() {}
  activated() {}
  private async onChooseFunc(apiId) {
    if (!apiId) {
      this.currentFuncContent = null
    } else {
      this.currentFuncContent = await GetFuncDetail(apiId)
    }
  }
}
</script>

<style lang="less">
</style>