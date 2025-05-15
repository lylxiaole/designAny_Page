<template>
  <el-row style="width: 100%; height: 100%">
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">Layout:</el-col>
      <el-col :span="18">
        <el-tree-select node-key="id" size="small" :check-on-click-node="true" check-strictly v-model="currentLayoutId" :data="allayouts"
          :render-after-expand="true" @check-change="onLayoutChange" default-expand-all />
      </el-col>
    </el-row>
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">Property:</el-col>
      <el-col :span="18">
        <el-select v-model="currentPropField" placeholder="Select" size="small">
          <el-option v-for="dprop in allProps" :key="dprop.field" :label="dprop.name" :value="dprop.field" />
        </el-select>
      </el-col>
    </el-row>
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
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.propertiesInParentPage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class propertyInPageNode extends Vue {
  @Prop()
  private i18n: any
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

    return this.currentPage.parentLayout.findLayoutRecursion(this.currentLayoutId, [this.currentPage.parentLayout])
  }

  private get allayouts(): any[] {
    let trees: any[] = []
    let topNode = {
      id: this.currentPage.parentLayout.Id,
      label: 'Current Page',
      children: []
    }

    let children = this.orgnizeTree(this.currentPage.parentLayout.children)
    topNode.children = children
    trees.push(topNode)
    return trees
  }

  private orgnizeTree(allayouts: EngineLayout[]): any[] {
    let trees: any[] = []
    for (let index = 0; index < allayouts.length; index++) {
      const layout = allayouts[index]
      trees.push({
        id: layout.Id,
        label: layout.name ? layout.name : 'No LayoutName'
      })
    }
    return trees
  }
  private onLayoutChange(nodedata, node, e: Event) {
    this.currentPropField = null
    this.actObj.resourceFilter.layoutId = nodedata.id
  }
  // *************方法*****************************
  private currentPropField: string = null
  private get allProps(): any[] {
    if (!this.currentLayout) {
      return []
    }

    let res = []
    for (let index = 0; index < this.currentLayout.properties.length; index++) {
      const dprop = this.currentLayout.properties[index]
      res.push({
        field: dprop.field,
        name: dprop.propertyName
      })
    }
    return res
  }

  @Watch('currentPropField')
  private oncurrentPropFieldChanged(val) {
    this.actObj.resourceFilter.propField = val
    if (!val) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
    } else {
      this.actObj.inputParams = []

      this.actObj.inputParams.push({
        key: makeParamKey(this.actObj.id, 'input'),
        name: 'input'
      } as any)
      //出参
      this.actObj.outParam = {
        key: makeParamKey(this.actObj.id, 'output'),
        name: 'output'
      } as any
    }
  }

  mounted() {
    this.currentLayoutId = this.actObj.resourceFilter.layoutId
    this.currentPropField = this.actObj.resourceFilter.propField
  }
}
</script>

<style lang="less" scoped></style>
