<template>
  <el-row style="width: 100%; height: 100%">
    <el-col :span="6">Behavior:</el-col>
    <el-col :span="18">
      <el-select v-model="currentBehaviorId" placeholder="Select" size="small">
        <el-option v-for="behavior in allBehaviors" :key="behavior.id" :label="behavior.name" :value="behavior.id" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.behaviorsInParentPage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class behaviorInParentPageNode extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  // *************方法*****************************
  private currentBehaviorId: string = null
  private get allBehaviors(): any[] {
    if (!this.currentPage) {
      return []
    }

    let res = []

    let parentPage = this.currentPage.parentLayout as EnginePage

    for (let index = 0; index < parentPage.behaviors.length; index++) {
      const behavior = parentPage.behaviors[index]
      res.push({
        id: behavior.id,
        desc: behavior.description,
        name: behavior.name
      })
    }
    return res
  }

  @Watch('currentBehaviorId')
  private oncurrentMethodFieldChanged(val) {
    this.actObj.resourceFilter.behaviorId = val
    if (!val) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
      return
    }
    let parentPage = this.currentPage.parentLayout as EnginePage

    let behavior = parentPage.behaviors.find((o) => o.id === val)
    let inparams = []
    if (behavior.inParams) {
      for (let jndex = 0; jndex < behavior.inParams.length; jndex++) {
        const inparam = behavior.inParams[jndex]
        inparams.push({
          key: makeParamKey(this.actObj.id, inparam.key),
          name: inparam.name
        } as any)
      }
    }

    this.actObj.inputParams = inparams
    //行为暂时无反参
    // if (behavior.hasOutParam) {
    //   this.actObj.outParam = {
    //     key: makeParamKey(this.actObj.id, 'output'),
    //     name: 'output'
    //   } as any
    // }
  }

  mounted() {
    this.currentBehaviorId = this.actObj.resourceFilter.behaviorId
  }
}
</script>

<style lang="less" scoped></style>
