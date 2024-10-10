<template>
  <el-row style="width: 100%; height: 100%">
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">选择布局:</el-col>
      <el-col :span="18">
        <el-tree-select node-key="id" size="small" :check-on-click-node="false" check-strictly v-model="currentLayoutId" :data="allayouts" :render-after-expand="true" @check-change="onLayoutChange" default-expand-all />
      </el-col>
    </el-row>
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">选择方法:</el-col>
      <el-col :span="18">
        <el-select v-model="currentMethodField" placeholder="Select" size="small">
          <el-option v-for="method in allMethods" :key="method.field" :label="method.name" :value="method.field" />
        </el-select>
      </el-col>
    </el-row>
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

@flowDesignNode(funcCode.methodsInPage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class propertyInPageNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  // ***********布局*******************************
  private currentLayoutId: string = null
  private get currentLayout(): EngineLayout {
    if (!this.currentLayoutId) {
      return null
    }

    return this.currentPage.findLayoutRecursion(this.currentLayoutId, [this.currentPage])
  }

  private get allayouts(): any[] {
    return this.orgnizeTree([this.currentPage])
  }
  private orgnizeTree(allayouts: EngineLayout[]): any[] {
    let trees: any[] = []
    for (let index = 0; index < allayouts.length; index++) {
      const layout = allayouts[index]
      if (!layout.parentLayout) {
        let childrenTree = this.orgnizeTree(layout.children)
        trees.push({
          id: layout.Id,
          label: '当前页面',
          children: childrenTree
        })
      } else {
        trees.push({
          id: layout.Id,
          label: layout.name ? layout.name : '未命名控件'
        })
      }
    }

    return trees
  }
  private onLayoutChange(nodedata, node, e: Event) {
    this.currentMethodField = null
    this.actObj.resourceFilter.layoutId = nodedata.id
  }
  // *************方法*****************************
  private currentMethodField: string = null
  private get allMethods(): any[] {
    if (!this.currentLayout) {
      return []
    }

    let res = []
    for (let index = 0; index < this.currentLayout.designerMethods.length; index++) {
      const method = this.currentLayout.designerMethods[index]
      res.push({
        field: method.methodField,
        desc: method.description,
        name: method.methodName
      })
    }
    return res
  }

  @Watch('currentMethodField')
  private oncurrentMethodFieldChanged(val) {
    this.actObj.resourceFilter.methodField = val
    if (!val) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
    } else {
      let method = this.currentLayout.designerMethods.find((o) => o.methodField === val)
      let inparams = []
      for (let jndex = 0; jndex < method.inParams.length; jndex++) {
        const inparam = method.inParams[jndex]
        inparams.push({
          key: makeParamKey(this.actObj.id, inparam.name),
          name: inparam.name
        } as any)
      }
      this.actObj.inputParams = inparams

      if (method.hasOutParam) {
        this.actObj.outParam = {
          key: makeParamKey(this.actObj.id, 'output'),
          name: 'output'
        } as any
      }
    }
  }

  mounted() {
    this.currentLayoutId = this.actObj.resourceFilter.layoutId
    this.currentMethodField = this.actObj.resourceFilter.methodField
  }
}
</script>

<style lang="less" scoped></style>
