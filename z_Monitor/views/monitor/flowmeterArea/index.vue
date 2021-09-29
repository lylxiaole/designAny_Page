<template>
  <div style="height:100%;width:100%;display:flex;flex-wrap: wrap;">
    <flowmeterCard class="flowmeterCard" v-for="item in allFlowmeters" :key="item.code" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
import flowmeterCard from './flowmeterCard.vue'
/***作业区流量计 */
@Component({
  components: { flowmeterCard }
})
export default class Index extends PageBase {
  private allFlowmeters: any[] = [
    {
      code: '123'
    },
    {
      code: '345'
    }
  ]
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style lang="less" scoped>
.flowmeterCard {
  width: 300px;
  height: 250px;
}
</style>
