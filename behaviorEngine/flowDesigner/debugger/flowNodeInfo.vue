<template>
  <el-row style="height: 100%; width: 100%">
    <!-- ********************************************************* -->
    <el-row style="width: 100%; height: 60px">
      <el-col :span="6">Add Breakpoint</el-col>
      <el-col :span="6">Next Step</el-col>
      <el-col :span="6">Next Point</el-col>
    </el-row>
    <!-- ********************************************************* -->
    <el-row style="width: 100%; height: calc(100% - 60px)"></el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'

@Options({
  components: {}
})
export default class flowNodeInfo extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  private currentFactory: factory
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  font-weight: 500;
  font-size: 16px;
}
.content {
  width: 100%;
  box-sizing: border-box;
  padding-left: 16px;
  font-weight: 400;
  font-size: 12px;
}
</style>
