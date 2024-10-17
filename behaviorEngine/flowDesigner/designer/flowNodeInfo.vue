<template style="height: 100%; width: 100%">
  <el-row>
    <el-row v-if="inparams">入参</el-row>
    <el-row v-if="inparams">
      <el-row></el-row>
    </el-row>

    <el-row>出参</el-row>
    <el-row></el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'
import { watch } from 'vue'

@Options({
  components: {}
})
export default class flowNodeInfo extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  private currentSelected: NodeConfig | EdgeConfig

  private get inparams(): any[] {
    if (!this.currentSelected || !this.currentSelected.properties.actObj) {
      return []
    }
    return (this.currentSelected.properties.actObj as any).inputParams
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

<style scoped></style>
