<template>
  <div style="height:100%;width:100%">
    计量表历史信息
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***历史数据分析 */
@Component({
  components: {}
})
export default class Index extends PageBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
