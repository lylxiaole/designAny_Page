<template style="height: 100%; width: 100%">
  <el-row v-if="selectedNodeType === 'node'" style="width: 100%">
    <el-row v-if="inParams && inParams.length > 0" style="width: 100%">
      <div class="title">{{$t('tip.InpParams')}}:</div>
      <div class="content" v-for="param in inParams" :key="param.key">{{ param.name }}({{ param.refOutParamId ? 'connected' : 'disconnected' }})</div>
    </el-row>
    <el-row v-else style="width: 100%">
      <div class="title">{{$t('tip.InpParams')}}:</div>
      <div class="content">{{$t('tip.NoInParamsJustforConnect')}} </div>
    </el-row>

    <el-row v-if="outParam" style="width: 100%">
      <div class="title">{{$t('tip.OutParam')}}:</div>
      <div class="content">{{ outParam.name }}</div>
    </el-row>
    <el-row v-if="!outParam" style="width: 100%">
      <div class="title">{{$t('tip.OutParam')}}:</div>
      <div class="content">{{$t('tip.NoOutParamJustforConnect')}}</div>
    </el-row>
  </el-row>
  <!-- ********************************************************* -->
  <el-row v-if="selectedNodeType === 'edge'">
    <el-row v-if="edgeFilter" style="width: 100%">
      <div class="title">{{$t('tip.Filter')}}:</div>
      <div class="content">{{ edgeFilter }}</div>
    </el-row>
    <el-row v-else style="width: 100%">
      <div class="title">{{$t('tip.Filter')}}:</div>
      <div class="content">{{$t('tip.NoFilter')}}</div>
    </el-row>
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
  //
  private get selectedNodeType() {
    if (this.currentFlow && this.currentSelected && this.currentSelected.properties && this.currentSelected.properties.actObj) {
      return 'node'
    } else if (this.currentFlow && this.currentSelected && this.currentSelected.text && (this.currentSelected as any).text.value) {
      return 'edge'
    } else {
      return 'edge'
    }
  }
  //流程节点-入参
  private get inParams(): any[] {
    if (!this.currentFlow) {
      return []
    }
    if (!this.currentSelected || !this.currentSelected.properties.actObj) {
      return []
    }
    return (this.currentSelected.properties.actObj as any).inputParams
  }
  //流程节点-出参
  private get outParam(): any[] {
    if (!this.currentSelected || !this.currentSelected.properties.actObj) {
      return []
    }
    return (this.currentSelected.properties.actObj as any).outParam
  }
  //流程连线-filter条件
  private get edgeFilter(): string {
    if (!this.currentSelected || !(this.currentSelected as any).pointsList) {
      return null
    }

    if ((this.currentSelected as any).text) {
      return (this.currentSelected as any).text.value
    } else {
      return null
    }
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
    // debugger
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
