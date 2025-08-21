<template>
  <div style="background: transparent; width: 100%; height: 100%; position: relative; box-sizing: border-box">
    <div style="width:100%; height:30px;">
      <div class="verticalAlignCenter flexHorilanLayout" style="width: 100%; height: 15px">
        <div style="height: 15px; font-size: 14px; font-weight: 600" class="verticalAlignCenter flexHorilanLayout">
          {{ actObj ? actObj.name : '' }}
        </div>
        <div v-if="isDebugging" style="height: 15px" class="verticalAlignCenter flexHorilanLayout">
          <img v-if="!isExcuted" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/待执行.png')" />
          <img v-if="isExcuted && excutedSuccess === true" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行完成.png')" />
          <img v-if="isExcuted && excutedSuccess === false" width="15px" height="15px" :src="require('@behaviorEngine/assets/imgs/执行失败.png')" />
        </div>
      </div>
      <!-- ********************************************** -->
      <div v-if="isDebugging&&isExcuted && excutedSuccess === false && excutedMsg" style="width: 100%; height: 15px; color: red"
        class="verticalAlignCenter flexHorilanLayout">
        {{ excutedMsg }}
      </div>
    </div>
    <!-- ********************************************** -->
    <el-row style="width:100%; height:calc(100% - 30px); box-sizing: border-box; position: relative; padding: 5px"
      class="topnodediv verticalAlignCenter flexHorilanLayout">
      <!-- **************************************************** -->
      <div style="width: 100%; height: 100%;" ref="renderContainer"></div>
      <!-- **************************************************** -->
      <div v-if="isDebugging" style="width: 100%; height: 100%; position: absolute; left: 0px; top: 0px" class="mengban"></div>
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
import { getLocale } from '@common/baseConfigs'

@Options({
  components: {}
})
export default class nodeBaseUI extends Vue {
  @Prop()
  private nodeModel: HtmlNodeModel

  private isDebugging: boolean = false
  private actObj: actionObj = null

  private onactObjchanged(val: actionObj) {
    this.nodeModel.setProperties({ actObj: val })
    this.nodeModel.updateAnchor()
    this.$forceUpdate()
  }
  /**********调试信息******************* */
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
    // ********清除数据*********************
    let cloneobj = deepClone(actObj) as actionObj
    cloneobj.excuted = false
    cloneobj.excutedMsg = null
    cloneobj.excutedSuccess = false
    for (let index = 0; index < cloneobj.inputParams.length; index++) {
      const element = cloneobj.inputParams[index]
      element.val = null
    }
    if (cloneobj.outParam) {
      cloneobj.outParam.val = null
    }
    // *****************************
    this.actObj = cloneobj
    this.onactObjchanged(this.actObj)
    // *****************************
    let flowNodeVue = findFlowNodeInner(funcCode)
    let r = h(flowNodeVue, { actObj: this.actObj, currentPage: behaviorContext.currentDesignPage, i18n: getLocale().t })
    let app = createApp({
      render: () => r
    })
    app.use(ElementPlus)
    app.mount(this.$refs.renderContainer as any)
    // *******************
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

/deep/ .funcNodeUI {
  box-sizing: border-box;
  padding: 5px 5%;
  background: #fff;
  border: 1px solid #cdcdcd;
}
</style>
