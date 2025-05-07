<template>
  <el-row v-if="selectedNodeType === 'node'" style="width: 100%; height: 100%">
    <div v-if="actObj" style="width: 100%; height: 60px">
      <div class="title">{{$t('tip.State')}}:</div>
      <div class="content">{{ isExcuted ?$t('tip.Excuted') : $t('tip.WaitingExcute') }}</div>
    </div>
    <!-- ********************************************************* -->
    <div v-if="isExcuted" style="width: 100%; height: 60px">
      <div v-if="isExcuted" class="title">{{$t('tip.ExcuteResult')}}:</div>
      <div v-if="isExcuted" class="content verticalAlignCenter">
        <img v-if="isExcuted && excutedSuccess === true" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行完成.png')" />
        <img v-if="isExcuted && excutedSuccess === false" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行失败.png')" />
        &nbsp;{{ isExcuted && excutedSuccess === true ?$t('tip.Success') :$t('tip.Faild') }}
      </div>
    </div>
    <!-- ********************************************************* -->
    <div v-if="isExcuted && excutedSuccess === false && excutedMsg" style="width: 100%; height: 80px">
      <div class="title">{{$t('tip.ExcuteErrorMsg')}}:{{ isExcuted ?$t('tip.Excuted'):$t('tip.Excuted')}}</div>
      <div class="content">{{ isExcuted && excutedSuccess === false && excutedMsg ? excutedMsg :$t('tip.None')  }}</div>
    </div>
    <!-- ********************************************************* -->
    <div v-if="isExcuted && inParams && inParams.length > 0" style="width: 100%; height: 300px">
      <div class="title">{{$t('tip.InpParams')}}:</div>
      <div class="content">
        <el-collapse :model-value="inParams.map(o=>o.name)">
          <el-collapse-item v-for="param in inParams" :key="param.key" :name="param.name" :title="param.name" :icon="CaretRight">
            <div>{{ (param.val===null||param.val===undefined) ?$t('tip.None'): param.val }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div v-if="isExcuted && (!inParams || inParams.length < 1)" style="width: 100%">
      <div class="title">{{$t('tip.InpParams')}}:</div>
      <div class="content">{{$t('tip.NoInParamsJustforConnect')}}</div>
    </div>
    <!-- ********************************************************* -->
    <div v-if="isExcuted && outParam" style="width: 100%; height: 300px">
      <div class="title">{{$t('tip.OutParam')}}:</div>
      <div class="content">
        <el-collapse :model-value="[outParam.name]">
          <el-collapse-item :title="outParam.name" :name="outParam.name" :icon="CaretRight">
            <div>{{ (outParam.val===null||outParam.val===undefined) ?$t('tip.None'): outParam.val}}</div>
          </el-collapse-item>
        </el-collapse>
        <!-- <div class="paramName">{{ outParam.name }}:</div>
        <div class="paramVal">
          {{ outParam.val ? outParam.val : 'None' }}
        </div> -->
      </div>
    </div>
    <div v-if="isExcuted && !outParam" style="width: 100%">
      <div class="title">{{$t('tip.OutParam')}}:</div>
      <div class="content">{{$t('tip.NoOutParamJustforConnect')}}</div>
    </div>
  </el-row>
  <!-- ********************************************************* -->
  <el-row v-if="selectedNodeType === 'edge'">
    <div v-if="edgeFilter" style="width: 100%">
      <div class="title">{{$t('tip.Filter')}}:</div>
      <div class="content">{{ edgeFilter }}</div>
    </div>
    <div v-if="edgeFilter" style="width: 100%">
      <div class="title">{{$t('tip.FilterValue')}}:</div>
      <div class="content">{{ edgeFilterVal }}</div>
    </div>
    <!-- ********************************************************* -->
    <div v-else style="width: 100%">
      <div class="title">{{$t('tip.Filter')}}:</div>
      <div class="content">{{$t('tip.NoFilter')}}</div>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
// import lylJSONEditor from '@common/components/commonComponents/lylJSONEditor.vue'

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
    this.currentFactory?.startDebugAction()
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
  height: 35px;
  box-sizing: border-box;
  padding: 8px;
  font-weight: 500;
  font-size: 16px;
}
.content {
  width: 100%;
  height: calc(100% - 35px);
  overflow-y: auto;
  box-sizing: border-box;
  padding-left: 16px;
  font-weight: 400;
  font-size: 12px;
  /deep/ .el-collapse-item {
    border: none;
  }
  /deep/.el-collapse-item__header {
    height: 30px;
    border: none;
  }
}

.paramName {
  font-size: 15px;
  font-weight: 500;
}
.paramVal {
  font-size: 12px;
}
</style>
