<template>
  <el-row style="border:1px solid #cdcdcd;width：100%;height:100%;box-sizing:border-box;background:#fff" class="verticalAlignCenter flexHorilanLayout">
    <div style="width:40px;height:100%">
      <template v-if="actObj&&actObj.inputParams&&actObj.inputParams.length>0">
        <div v-for="inParam in actObj.inputParams" :key="inParam.key" :style="{'height':inParamHeight}" class="verticalAlignCenter">
          {{inParam.name}}
        </div>
      </template>
      <template v-else>
        <div style="height:100%;width:100%" class="verticalAlignCenter">
          无输入
        </div>
      </template>
    </div>
    <!-- **************************************************** -->
    <div style="width:calc(100% - 80px)">
      <div ref="renderContainer"></div>
    </div>
    <!-- **************************************************** -->
    <div style="width:40px">
      <template v-if="actObj&&actObj.outParam">
        <el-row>
          输出
        </el-row>
      </template>
      <template v-else>
        <el-row>
          无输出
        </el-row>
      </template>
    </div>
  </el-row>
</template>

<script lang="ts">
import { inject, createApp, h, VNode, render, ref, watch } from 'vue'
import { Options, prop, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import ElementPlus from 'element-plus'

@Options({
  components: {}
})
export default class nodeBase extends Vue {
  // private getNode: Function = inject('getNode')
  public get inParamHeight() {
    if (!this.actObj.inputParams || this.actObj.inputParams.length < 1) {
      return '0px'
    } else {
      return 100 / this.actObj.inputParams.length + '%'
    }
  }

  @Prop()
  private nodeModel: any

  @Prop()
  private funcCode: funcCode

  private actObj: actionObj = null

  private onActObjChanged(val) {
    this.nodeModel.setProperties({ actObj: val })
    this.nodeModel.updateAnchor()
    this.$forceUpdate()
  }

  mounted() {
    let { actObj } = this.nodeModel.getProperties()
    let newActObj = deepClone(actObj)
    //
    this.actObj = newActObj
    let flowNodeVue = findFlowNodeInner(this.funcCode)
    let r = h(flowNodeVue, { actObj: this.actObj })
    let app = createApp({
      render: () => r
    })
    app.use(ElementPlus)
    app.mount(this.$refs.renderContainer as any)
    //
    this.$watch('actObj', this.onActObjChanged, { deep: true })
  }
}
</script>


<style lang="less" scoped>
</style>