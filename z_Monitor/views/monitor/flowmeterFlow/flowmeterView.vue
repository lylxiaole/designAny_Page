<template>
  <el-row style="height:100%;width:100%;">
    <el-col style="width:350px;height:100%">
      <el-tree></el-tree>
    </el-col>
    <el-col style="width:calc(100% - 350px);height:100%">

    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***流量计报警 */
@Component({
  components: {}
})
export default class flowmeterView extends ComponentBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
