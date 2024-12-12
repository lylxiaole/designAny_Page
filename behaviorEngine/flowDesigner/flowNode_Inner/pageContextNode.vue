<template>
  <el-row style="width: 100%; height: 100%">
    <el-col :span="6">Context:</el-col>
    <el-col :span="18">
      <el-select v-model="currentContextKey" placeholder="Select" size="small">
        <el-option v-for="context in allContexts" :key="context.id" :label="context.name" :value="context.id" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.pageContext, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class pageContextNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  private currentContextKey: string = null
  private get allContexts(): any[] {
    if (!this.currentPage) {
      return []
    }

    let res = []
    for (let index = 0; index < this.currentPage.pageContext.length; index++) {
      const context = this.currentPage.pageContext[index]
      res.push({
        id: context.key,
        desc: context.name,
        name: context.name
      })
    }
    return res
  }

  @Watch('currentContextKey')
  private oncurrentContextKeyChanged(val) {
    this.actObj.resourceFilter.contextKey = val
    if (!val) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
      return
    }
    // *******************************************
    let context = this.currentPage.pageContext.find((o) => o.key === val)
    let inparams = []
    inparams.push({
      key: makeParamKey(this.actObj.id, context.key),
      name: 'input'
    } as any)

    this.actObj.inputParams = inparams
    // *******************************************
    this.actObj.outParam = {
      key: makeParamKey(this.actObj.id, 'output'),
      name: 'output'
    } as any
  }

  mounted() {
    this.currentContextKey = this.actObj.resourceFilter.contextKey
  }
}
</script>

<style lang="less" scoped></style>
