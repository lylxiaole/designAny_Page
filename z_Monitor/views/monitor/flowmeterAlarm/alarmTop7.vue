<template>
  <div>
    <el-card class="box-card">

    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
})
export default class alarmTop7 extends ComponentBase {
  //
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>
