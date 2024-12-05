<template>
  <el-row style="width: 100%; height: 100%">
    <el-col>Func:</el-col>
    <el-col>
      <el-tree-select node-key="id" size="small" :check-on-click-node="true" v-model="currentSelectId" :data="allFuncsTree" :render-after-expand="true" @check-change="onCurrentNodeChange" default-expand-all check-strictly />
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
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'

import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'
import excuteJS from '@common/components/commonComponents/funcstrExcute'

@flowDesignNode(funcCode.jsFunction, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class JSFunc extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {
    this.loadAllApis()
    if (this.actObj.resourceFilter.funcId) {
      this.currentSelectId = this.actObj.resourceFilter.funcId
    }
  }

  private currentSelectId: string = null
  private allFuncsTree: any[] = []

  private async loadAllApis() {
    let allfuncs = await behaviorContext.getAllJSFuncs()
    this.allFuncsTree = this.orgnizeTree(allfuncs)
  }

  private orgnizeTree(allFuncs: any[]): any[] {
    let trees: any = []
    for (let index = 0; index < allFuncs.length; index++) {
      const funcInfo = allFuncs[index]
      if (funcInfo.groupName) {
        let children = funcInfo.childrenFuncs.concat(funcInfo.childrenGroups)
        let childrenTree = this.orgnizeTree(children)
        trees.push({
          type: 'group',
          id: funcInfo.id,
          label: funcInfo.groupName,
          children: childrenTree
        })
      } else {
        trees.push({
          type: 'func',
          id: funcInfo.id,
          label: funcInfo.name,
          funcInfo: funcInfo
        })
      }
    }

    return trees
  }

  private onCurrentNodeChange(nodedata, node, e: Event) {
    if (nodedata.type === 'group') {
      throw '分组不能被选中'
    }

    this.currentSelectId = nodedata.funcInfo.id
    this.actObj.resourceFilter.funcId = this.currentSelectId

    let excutejs = new excuteJS(nodedata.funcInfo.content)
    let res = excutejs.validate()

    this.actObj.inputParams = []
    for (let index = 0; index < res.inparams.length; index++) {
      const element = res.inparams[index]
      this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, element), name: element })
    }

    if (res.haveOutput) {
      this.actObj.outParam = { key: makeParamKey(this.actObj.id, 'output'), name: 'output' }
    } else {
      this.actObj.outParam = null
    }
  }
}
</script>

<style lang="less" scoped></style>
