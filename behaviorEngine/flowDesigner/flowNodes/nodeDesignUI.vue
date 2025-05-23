<template>
  <el-row style="border: 1px solid #cdcdcd; width: 100%; height: 100%; box-sizing: border-box; background: #fff; position: relative; padding: 5px"
    class="topnodediv verticalAlignCenter flexHorilanLayout">
    <el-row style="height: 25px; width: 100%; font-size: 14px; font-weight: 600" class="verticalAlignCenter flexHorilanLayout">
      {{ actObj ? actObj.name : '' }}
    </el-row>
    <!-- **************************************************** -->
    <div style="width: 100%; height: calc(100% - 25px); box-sizing: border-box; padding: 0px 10px" ref="renderContainer"></div>
    <!-- **************************************************** -->
  </el-row>
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
import { getLocale } from '@common/baseConfigs'

@Options({
  components: {}
})
export default class nodeDesignUI extends Vue {
  @Prop()
  private nodeModel: HtmlNodeModel

  private actObj: actionObj = null

  private onactObjchanged(val: actionObj) {
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

  mounted() {
    let { actObj } = this.nodeModel.getProperties()
    let funcCode = actObj.funcCode

    this.actObj = deepClone(actObj)
    let flowNodeVue = findFlowNodeInner(funcCode)
    debugger
    let r = h(flowNodeVue, { actObj: this.actObj, currentPage: behaviorContext.currentDesignPage, i18n: getLocale().t })

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
