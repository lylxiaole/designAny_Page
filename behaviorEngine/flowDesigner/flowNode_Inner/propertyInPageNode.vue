<template>
  <el-row style="width:100%;height:100%">
    <el-row style="width:100%;height:50%">
      <el-col :span="6">选择布局:</el-col>
      <el-col :span="18">
        <el-tree-select node-key="id" size="small" :check-on-click-node="true" check-strictly v-model="currentLayoutId" :data="allayouts"
          :render-after-expand="true" @check-change="onLayoutChange" default-expand-all />
      </el-col>
    </el-row>
    <el-row style="width:100%;height:50%">
      <el-col :span="6">选择属性:</el-col>
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
import { actionObj } from '@design-any/interface/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage, EngineLayout } from '@design-any/interface/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.propertiesInPage, flowNodeType.funcNormalNode)
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
        key: makeParamKey(this.actObj.id, '设定值'),
        name: '设定值'
      } as any)
      //出参
      this.actObj.outParam = {
        key: makeParamKey(this.actObj.id, '输出'),
        name: '输出'
      } as any
    }
  }

  mounted() {
    this.currentLayoutId = this.actObj.resourceFilter.layoutId
    this.currentPropField = this.actObj.resourceFilter.propField
  }
}
</script>


<style lang="less" scoped>
</style>