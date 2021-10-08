<template>
  <div style="height:100%;width:100%">

    <el-steps :active="2" align-center>
      <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>
      <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
      <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
    </el-steps>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { Route } from 'vue-router'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
})
export default class flowmeterChooseModal extends PageBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
