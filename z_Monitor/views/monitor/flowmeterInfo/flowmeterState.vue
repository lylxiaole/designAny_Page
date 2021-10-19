<template>
  <div style="height:100%;width:100%">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getFlowmeterDetail, getParamsCompareData, getFlowmeterCompareData } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj, deepClone } from '@src/utils'
import * as echarts from 'echarts'
import flowmeterChooseModal from '../../../components/choosePamaterCompare/flowmeterChooseModal.vue'
import moment from 'moment'
import resizer from 'element-resize-detector'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class flowmeterState extends ComponentBase {
  // ********************************************************************************
  mounted() {}
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
</style>
