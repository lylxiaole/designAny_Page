<template>
  <el-row v-if="selectedNodeType === 'node'" style="width: 100%">
    <el-row v-if="actObj" style="width: 100%">
      <div class="title">State:</div>
      <div class="content">{{ isExcuted ? 'Excuted' : 'Waiting Excute' }}</div>

      <div v-if="isExcuted" class="title">Excute Result:</div>

      <div v-if="isExcuted" class="content verticalAlignCenter">
        <img v-if="isExcuted && excutedSuccess === true" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行完成.png')" />
        <img v-if="isExcuted && excutedSuccess === false" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行失败.png')" />
        &nbsp;{{ isExcuted && excutedSuccess === true ? 'Success' : 'Faild' }}
      </div>

      <div v-if="isExcuted && excutedSuccess === false && excutedMsg" class="title">Excute ErrorMsg:{{ isExcuted ? 'Excuted' : 'No Excuted' }}</div>
      <div v-if="isExcuted && excutedSuccess === false && excutedMsg" class="content">{{ isExcuted && excutedSuccess === false && excutedMsg ? excutedMsg : 'None' }}</div>
    </el-row>
    <!-- ********************************************************* -->
    <el-row v-if="isExcuted && inParams && inParams.length > 0" style="width: 100%">
      <div class="title">InpParams:</div>
      <div class="content" v-for="param in inParams" :key="param.key">{{ param.name }}:{{ param.val }}</div>
    </el-row>
    <el-row v-if="isExcuted && (!inParams || inParams.length < 1)" style="width: 100%">
      <div class="title">InpParams:</div>
      <div class="content">No InParams,Just for Connect</div>
    </el-row>
    <!-- ********************************************************* -->
    <el-row v-if="isExcuted && outParam" style="width: 100%">
      <div class="title">OutParam:</div>
      <div class="content">{{ outParam.name }}:{{ outParam.val }}</div>
    </el-row>
    <el-row v-if="isExcuted && !outParam" style="width: 100%">
      <div class="title">OutParam:</div>
      <div class="content">No OutParam,Just for Connect</div>
    </el-row>
  </el-row>
  <!-- ********************************************************* -->
  <el-row v-if="selectedNodeType === 'edge'">
    <el-row v-if="edgeFilter" style="width: 100%">
      <div class="title">Filter:</div>
      <div class="content">{{ edgeFilter }}</div>
      <div class="title">Filter value:</div>
      <div class="content">{{ edgeFilterVal }}</div>
    </el-row>
    <!-- ********************************************************* -->
    <el-row v-else style="width: 100%">
      <div class="title">Filter:</div>
      <div class="content">No Filter</div>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'

@Options({
  components: {}
})
export default class flowNodeDebuggerInfo extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  private currentSelected: NodeConfig | EdgeConfig

  // *************************************************
  private currentFactory: factory
  public startDebugger(val: factory) {
    this.currentFactory = val
    this.currentFactory.startDebugAction()
  }
  // ****************************************************
  private get actObj(): actionObj {
    if (!this.currentSelected) {
      return null
    }

    return this.currentSelected.properties.actObj as actionObj
  }
  public get isExcuted(): boolean {
    if (!this.actObj) {
      return false
    }

    return this.actObj.excuted
  }
  public get excutedSuccess(): boolean {
    if (!this.actObj) {
      return false
    }

    if (!this.isExcuted) {
      return null
    }

    return this.actObj.excutedSuccess
  }
  public get excutedMsg(): string {
    if (!this.actObj) {
      return null
    }

    if (!this.isExcuted) {
      return null
    }

    if (this.excutedSuccess === false) {
      return this.actObj.excutedMsg
    } else {
      return null
    }
  }

  private get selectedNodeType() {
    if (this.currentSelected && this.currentSelected.properties && this.currentSelected.properties.actObj) {
      return 'node'
    } else if (this.currentSelected && this.currentSelected.text && (this.currentSelected as any).text.value) {
      return 'edge'
    } else {
      return 'edge'
    }
  }
  //流程节点-入参
  private get inParams(): any[] {
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

  private get edgeFilterVal(): any {
    if (!this.currentSelected || !(this.currentSelected as any).pointsList) {
      return null
    }

    if (!(this.currentSelected as any).text) {
      return null
    }

    let filterTxt = (this.currentSelected as any).text.value
    let edge = this.currentSelected as EdgeConfig
    return this.currentFactory.debugCuteFilter(filterTxt, edge.sourceNodeId)
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
