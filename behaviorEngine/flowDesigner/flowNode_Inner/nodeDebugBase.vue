<template>
  <div style="border: 1px solid #cdcdcd; background: #fff; width: 100%; height: 100%; position: relative; box-sizing: border-box">
    <div style="width: 100%; height: 15px" class="verticalAlignCenter flexHorilanLayout">
      <img v-if="!isExcuted" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/待执行.png')" />
      <img v-if="isExcuted && excutedSuccess === true" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行完成.png')" />
      <img v-if="isExcuted && excutedSuccess === false" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行失败.png')" />
    </div>
    <!-- ********************************************** -->
    <div v-if="isExcuted && excutedSuccess === false && excutedMsg" style="width: 100%; height: 15px; color: red" class="verticalAlignCenter flexHorilanLayout">{{ excutedMsg }}</div>
    <!-- ********************************************** -->
    <el-row style="width: 100%; height: calc(100% - 30px); box-sizing: border-box; position: relative; padding: 5px" class="topnodediv verticalAlignCenter flexHorilanLayout">
      <el-row style="height: 25px; width: 100%; font-size: 14px; font-weight: 600" class="verticalAlignCenter flexHorilanLayout">
        {{ actObj ? actObj.name : '' }}
      </el-row>
      <!-- **************************************************** -->
      <div style="width: 100%; height: calc(100% - 25px); box-sizing: border-box; padding: 0px 10px" ref="renderContainer"></div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { inject, createApp, h, VNode, render, ref, watch } from 'vue'
import { Options, prop, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { HtmlNode, HtmlNodeModel } from '@logicflow/core'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@Options({
  components: {}
})
export default class nodeBase extends Vue {
  @Prop()
  private nodeModel: HtmlNodeModel

  private actObj: actionObj = null
  private onactObjchanged(val: actionObj) {
    debugger
    this.nodeModel.setProperties({ actObj: val })
    this.nodeModel.updateAnchor()
    this.$forceUpdate()
  }

  public get inParamAnchors(): any[] {
    if (!this.nodeModel) {
      return []
    }

    var inparamsAnchors = this.nodeModel.anchors.filter((o) => o.type === anchorType.inParam || o.type === anchorType.justIn)
    return inparamsAnchors
  }
  public get inParamHeight() {
    if (!this.inParamAnchors || this.inParamAnchors.length < 1) {
      return '0px'
    } else {
      return 100 / this.inParamAnchors.length + '%'
    }
  }
  public get outParamAnchors(): any[] {
    if (!this.nodeModel) {
      return []
    }

    var outparamsAnchors = this.nodeModel.anchors.filter((o) => o.type === anchorType.outParam || o.type === anchorType.justOut)
    return outparamsAnchors
  }
  public get outParamHeight() {
    if (!this.outParamAnchors || this.outParamAnchors.length < 1) {
      return '0px'
    } else {
      return 100 / this.outParamAnchors.length + '%'
    }
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

  mounted() {
    let { actObj } = this.nodeModel.getProperties()
    let funcCode = actObj.funcCode
    this.actObj = deepClone(actObj)
    let flowNodeVue = findFlowNodeInner(funcCode)

    let r = h(flowNodeVue, { actObj: this.actObj, currentPage: behaviorContext.currentDesignPage })
    let app = createApp({
      render: () => r
    })
    app.use(ElementPlus)
    app.mount(this.$refs.renderContainer as any)

    this.$nextTick(() => {
      this.$watch('actObj', this.onactObjchanged, { deep: true })
    })
  }
}
</script>

<style lang="less" scoped>
.topnodediv {
  font-size: 12px;
}
</style>
