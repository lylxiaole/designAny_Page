<template style="height: 100%; width: 100%">
  <el-row style="width: 100%">
    <!-- ********************************************************* -->
    <el-row v-if="inParams" style="width: 100%">
      <div class="title">InpParams</div>
      <div v-if="inParams.length < 1" class="content">No InParams,Just for Connect</div>
      <div v-else class="content" v-for="param in inParams" :key="param.key">{{ param.name }}({{ param.refOutParamId ? 'connected' : 'disconnected' }})</div>
    </el-row>
    <el-row v-if="inParams && outParam" style="width: 100%">
      <div class="title">OutParam</div>
      <div class="content">{{ outParam.name }}</div>
    </el-row>
    <el-row v-if="inParams && !outParam" style="width: 100%">
      <div class="title">OutParam</div>
      <div class="content">No OutParam,Just for Connect</div>
    </el-row>
    <!-- ********************************************************* -->
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'

@Options({
  components: {}
})
export default class flowNodeInfo extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  private currentFlow: LogicFlow

  @Prop({
    default: () => {
      return null
    }
  })
  private currentSelected: NodeConfig | EdgeConfig

  private get inParams(): any[] {
    if (!this.currentFlow) {
      return []
    }
    if (!this.currentSelected || !this.currentSelected.properties.actObj) {
      return []
    }
    return (this.currentSelected.properties.actObj as any).inputParams
  }
  private get outParam(): any[] {
    if (!this.currentSelected || !this.currentSelected.properties.actObj) {
      return []
    }
    return (this.currentSelected.properties.actObj as any).outParam
  }

  @Watch('currentSelected')
  private onselectedConfigchengd(val) {
    if (!val) {
      return
    }

    if (val.properties.actObj) {
      //流程节点
    } else {
      //线
    }

    debugger
  }
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
