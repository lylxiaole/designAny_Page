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
          <el-tree node-key="id" :data="treeData" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop"
            :allow-drop="allowDrop" :allow-drag="allowDrag" :expand-on-click-node="false" draggable highlight-current>
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
import { object_group, getFuncObjByType } from '@behaviorEngine/actResource'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { objectBase } from '@behaviorEngine/actObject'
//
import { EnginePage, EngineContainer } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'
import LogicFlow from '@logicflow/core'

class TreeNodeDC {
  id: string
  label: string
  type: string
  actObj: objectBase
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

  @Prop()
  currentPage: EnginePage
  @Watch('currentPage', { deep: true, immediate: true })
  private onCurrentPageChanged(page: EnginePage) {
    //计算当前页面可用资源
    let findObjGroupIndex = this.objGroup.findIndex((o) => o.key == page.Id)
    if (findObjGroupIndex > -1) {
      this.objGroup.splice(findObjGroupIndex, 1)
    }
    //
    let findObjGroup = new object_group()
    findObjGroup.key = page.Id
    findObjGroup.title = '当前页面:' + page.name
    this.makeCurrentPageGroup(findObjGroup, page)
    //
    this.objGroup.push(findObjGroup)
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
      let newObj = deepClone(node.data.actObj)
      newObj.id = getUuid()

      event.dataTransfer.setData('application/vueflow', JSON.stringify(newObj))
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  private handleDragEnter(draggingNode, dropNode, ev) {
    // console.log('tree drag enter: ', dropNode.label)
  }
  private handleDragLeave(draggingNode, dropNode, ev) {
    // console.log('tree drag leave: ', dropNode.label)
  }
  private handleDragOver(draggingNode, dropNode, ev) {
    // console.log('tree drag over: ', dropNode.label)
  }
  private handleDragEnd(draggingNode, dropNode, dropType, ev) {
    // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  private async handleDrop(draggingNode, dropNode, dropType, ev) {}
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
  /**当节点名称改变后 */
  private async onNodeNameChanged(id: string, newtitle: string, nodedata: any) {}
  /**当确定节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {}

  // **********组织页面资源**************************************************************
  private makeCurrentPageGroup(targetGroup: object_group, currentPage: EngineContainer) {
    //页面方法
    for (let index = 0; index < currentPage.designerMethods.length; index++) {
      const dmethod = currentPage.designerMethods[index]
      let actObj = getFuncObjByType(funcCode.methodsInPage) as objectBase
      actObj.name = '方法:' + dmethod.methodName
      //入参
      for (let jndex = 0; jndex < dmethod.inParams.length; jndex++) {
        const inparam = dmethod.inParams[jndex]
        actObj.inputParams.push({
          key: getUuid(),
          name: inparam.name
        } as any)
      }
      //出参
      if (dmethod.hasOutParam) {
        actObj.outParam = {
          key: getUuid(),
          name: ''
        } as any
      }

      targetGroup.childrenObjs.push(actObj)
    }
    //页面属性
    for (let index = 0; index < currentPage.properties.length; index++) {
      const pageProp = currentPage.properties[index]
      if (pageProp.canSetting === false) {
        continue
      }

      let actObj = getFuncObjByType(funcCode.propertiesInPage) as objectBase
      actObj.name = '属性:' + pageProp.propertyName
      targetGroup.childrenObjs.push(actObj)
    }
    //页面子组件
    if (currentPage.children.length > 0) {
      for (let index = 0; index < currentPage.children.length; index++) {
        let child = currentPage.children[index]
        let childrenGroup = new object_group()
        childrenGroup.title = '子组件:' + child.name
        childrenGroup.key = child.Id
        this.makeCurrentPageGroup(childrenGroup, child as EngineContainer)
        //子组件的分组信息添加到页面的分组中
        targetGroup.childrenGroups.push(childrenGroup)
      }
    }
  }
  // ***********计算后端接口资源树*******************************************************
}
</script>

<style>
</style>