<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <div style="height:100%;width:100%">
      <el-row style="height: 50px; width: 100%;border-bottom: 1px solid rgb(223, 223, 223);">
        <el-row style="margin: 3px 15px">
          <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="请输入内容"></el-input>
        </el-row>
      </el-row>
      <el-row style="overflow: hidden; width: 100%; bottom: 0px;height:calc(100% - 50px)">
        <div style="overflow: auto; width: 100%; height: 100%; ">
          <el-tree node-key="id" :data="treeData" @node-drag-start="handleDragStart" :allow-drop="allowDrop" :allow-drag="allowDrag"
            :expand-on-click-node="true" draggable highlight-current default-expand-all>
            <template #default="{data}">
              <div draggable="true" v-if="data.type==='page'">
                <span class="icon iconfont">&#xe627;</span>
                <span>{{data.label}}</span>
              </div>
              <div draggable="true" v-if="data.type==='group'">
                <span class="icon iconfont">&#xe626;</span>
                <span>{{data.label}}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { reactive } from 'vue'
//
import { getFuncObjByType, getFuncObjsTree, funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { object_group, actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { EnginePage, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import { deepClone, getUuid } from '@common/utils'
import LogicFlow from '@logicflow/core'
import { findFlowNode, flowNodeType, anchorType } from './flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'

import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

class TreeNodeDC {
  id: string
  label: string
  type: string
  actObj: actionObj
  children: TreeNodeDC[] = []
}
@Options({
  components: {}
})
export default class index extends ComponentBase {
  //所有可用资源
  private objGroup: object_group[] = reactive([])
  private currentFlow: LogicFlow
  public setCurrentFlow(flow) {
    this.currentFlow = flow
  }

  currentPage: EnginePage

  public async init(page: EnginePage) {
    this.objGroup = getFuncObjsTree()
  }

  mounted() {}

  // **********资源树操作**************************************************************
  private seachVal: string = ''
  private treeData: TreeNodeDC[] = []
  @Watch('objGroup', { deep: true, immediate: true })
  public onObjGroupChanged(val: object_group[]) {
    this.treeData = []
    if (!val) {
      return
    }
    this.treeData = this.organizeTree(val)
  }

  private organizeTree(groups: object_group[]): TreeNodeDC[] {
    let res: TreeNodeDC[] = []
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index]
      let treeNodeg = new TreeNodeDC()
      treeNodeg.id = group.key
      treeNodeg.label = group.title
      treeNodeg.type = 'group'
      treeNodeg.children = []

      for (let jndex = 0; jndex < group.childrenObjs.length; jndex++) {
        const childBoj = group.childrenObjs[jndex]
        let treeNodec = new TreeNodeDC()
        treeNodec.id = childBoj.id
        treeNodec.label = childBoj.name
        treeNodec.type = 'node'
        treeNodec.actObj = childBoj
        treeNodeg.children.push(treeNodec)
      }
      let childrenGroups = this.organizeTree(group.childrenGroups)
      treeNodeg.children = childrenGroups.concat(treeNodeg.children)
      res.push(treeNodeg)
    }

    return res
  }

  private handleDragStart(node, event) {
    if (node.data.type === 'group') {
      return
    }

    if (event.dataTransfer) {
      let newObj = deepClone(node.data.actObj) as actionObj
      newObj.id = getUuid()

      if (newObj.inputParams) {
        for (let index = 0; index < newObj.inputParams.length; index++) {
          const element = newObj.inputParams[index]
          element.key = makeParamKey(newObj.id, element.name)
        }
      }
      if (newObj.outParam) {
        newObj.outParam.key = makeParamKey(newObj.id, '输出')
      }
      // ********************
      let flowNode = findFlowNode(newObj.funcCode)
      let dragData = {
        id: newObj.id,
        type: flowNode,
        properties: { actObj: newObj }
      }

      this.currentFlow.dnd.startDrag(dragData)
    }
  }

  private allowDrop(draggingNode, dropNode, type) {
    return false
  }
  private allowDrag(draggingNode) {
    if (draggingNode.data.type === 'node') {
      return true
    } else {
      return false
    }
  }
}
</script>

<style>
</style>