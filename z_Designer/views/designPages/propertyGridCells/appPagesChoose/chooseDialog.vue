 
<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:600px" width="800px" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row style="height:480px;width:100%;background:#FFF">
      <el-col :span="12" draggable="true" lyl_candrop="true" @dragover="ondragOver_left" @drop="ondrop_left">
        <el-tree node-key="id" dropzone :data="selectedPageTree" default-expand-all @node-drag-start="handleDragStart_left"
          @node-drag-enter="handleDragEnter_left" @node-drag-leave="handleDragLeave_left" @node-drag-over="handleDragOver_left"
          @node-drag-end="handleDragEnd_left" @node-drop="handleDrop_left" :allow-drop="true" :allow-drag="true" :expand-on-click-node="false"
          draggable highlight-current>
          <template #default="{data}">
            <el-text>{{data.label}}</el-text>
          </template>
        </el-tree>
      </el-col>
      <!-- ****************************************** -->
      <el-col :span="12">
        <el-tree node-key="id" :data="allPageTree" default-expand-all @node-drag-start="handleDragStart_right"
          @node-drag-enter="handleDragEnter_right" @node-drag-leave="handleDragLeave_right" @node-drag-over="handleDragOver_right"
          @node-drag-end="handleDragEnd_right" @node-drop="handleDrop_right" :allow-drop="true" :allow-drag="true" :expand-on-click-node="false"
          draggable highlight-current>
          <template #default="{data}">
            <el-text>{{data.label}}</el-text>
          </template>
        </el-tree>
      </el-col>
    </el-row>
    <!-- ************************************************************ -->
    <template #footer>
      <el-row class="dialog-footer">
        <div class="steps-action">
          <el-button @click="onCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'

import propertyCellBase from '../common'
import { PropertyTypeEnum, AppPagesChoose_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { DesignPageGroupDC, DesignPageDC, TreeNodeDC, GetApplicationPages, ChangeGroupGroup, ChangePageGroup } from '@common/apis/designPage'

@Options({})
export default class chooseDialog extends Vue {
  private selectedPageTree: TreeNodeDC[] = []
  private allPageTree: TreeNodeDC[] = []

  private windowVisible: boolean = false
  @Prop()
  private currentApplication: ApplicationDC

  mounted() {}

  public show(selectedTree, allTree) {
    this.selectedPageTree = selectedTree
    this.allPageTree = allTree
    this.windowVisible = true
  }

  private onClose(e: MouseEvent) {
    this.windowVisible = false
  }
  private onConfirm() {
    this.onChangeTree(this.selectedPageTree)
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }

  @Emit('onChangeTree')
  private onChangeTree(val) {}

  // *********pageGroups管理**************************************************
  private searchNodeById(id: string, parentNodes: TreeNodeDC[]): TreeNodeDC {
    for (let index = 0; index < parentNodes.length; index++) {
      const node = parentNodes[index]
      if (node.id === id) {
        return node
      }
      let findnode = node.children.find((o) => o.id === id)
      if (findnode) {
        return findnode
      }
      let res = this.searchNodeById(id, node.children)
      if (res) {
        return res
      }
    }
    return null
  }
  private setNodeDefault(id: string, parentNodes: TreeNodeDC[]) {
    for (let index = 0; index < parentNodes.length; index++) {
      const node = parentNodes[index]
      if (node.id === id) {
        node.isDefault = true
      } else {
        node.isDefault = false
      }
      if (node.children) {
        this.setNodeDefault(id, node.children)
      }
    }
  }
  private deleteNodeById(id: string, parentNodes: TreeNodeDC[]) {
    for (let index = 0; index < parentNodes.length; index++) {
      const node = parentNodes[index]
      if (node.id === id) {
        parentNodes.splice(index, 1)
        continue
      }
      this.deleteNodeById(id, node.children)
    }
  }
  private cuteChildrenMaxIndex(node: TreeNodeDC) {
    let index = 0
    for (let index = 0; index < node.children.length; index++) {
      const childnode = node.children[index]
      if (childnode.index > index) {
        index = childnode.index
      }
    }
    return index
  }
  private cuteGroupMaxIndex(nodes: TreeNodeDC[]) {
    let index = 0
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (node.index > index) {
        index = node.index
      }
    }
    return index
  }
  private makeDesignPageDCByNode(node: TreeNodeDC): DesignPageDC {
    let data: any = {
      id: node.id,
      name: node.label,
      appId: this.currentApplication.id,
      index: node.index,
      parentGroupId: node.parentGroupId
    }
    return data
  }
  private makeDesignPageGroupDCByNode(node: TreeNodeDC): DesignPageGroupDC {
    let data: any = {
      id: node.id,
      name: node.label,
      appId: this.currentApplication.id,
      index: node.index,
      parentGroupId: node.parentGroupId
    }
    return data
  }
  // *******Tree 左边*****************************
  private handleDragStart_left(node, ev) {
    // console.log('drag start', node)
  }
  private handleDragEnter_left(draggingNode, dropNode, ev) {
    // console.log('tree drag enter: ', dropNode.label)
  }
  private handleDragLeave_left(draggingNode, dropNode, ev) {
    // console.log('tree drag leave: ', dropNode.label)
  }
  private handleDragOver_left(draggingNode, dropNode, ev) {
    // console.log('tree drag over: ', dropNode.label)
  }
  private handleDragEnd_left(draggingNode, dropNode, dropType, ev) {
    // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  private ondragOver_left(e) {
    e.preventDefault()
  }
  private ondrop_left(e) {}
  private async handleDrop_left(draggingNode, dropNode, dropType, ev) {
    let parentGroupId = null
    if (dropType === 'inner') {
      parentGroupId = dropNode.data.id
    } else if (dropType === 'before') {
      parentGroupId = dropNode.data.parentGroupId
    } else if (dropType === 'after') {
      parentGroupId = dropNode.data.parentGroupId
    }
    let dragingNodeData = this.searchNodeById(draggingNode.data.id, this.allPageTree)
    dragingNodeData.parentGroupId = parentGroupId
    if (dragingNodeData.type === 'page') {
      let data = this.makeDesignPageDCByNode(dragingNodeData)
      await ChangePageGroup(data)
    } else if (dragingNodeData.type === 'group') {
      let data = this.makeDesignPageGroupDCByNode(dragingNodeData)
      await ChangeGroupGroup(data)
    }
    // ****************************************
    let needOrderNodes = []
    if (parentGroupId) {
      let parentNodeData = this.searchNodeById(parentGroupId, this.selectedPageTree)
      needOrderNodes = parentNodeData.children
    } else {
      needOrderNodes = this.selectedPageTree
    }
    for (let index = 0; index < needOrderNodes.length; index++) {
      needOrderNodes[index].index = index
    }
    window.console.log('needOrderNodes:', needOrderNodes)
  }
  // ***********Tree 右边**************************************
  private nodedataRight = null
  private handleDragStart_right(node, ev) {
    this.nodedataRight = node.data
    // console.log('drag start', node)
  }
  private handleDragEnter_right(draggingNode, dropNode, ev) {
    // console.log('tree drag enter: ', dropNode.label)
  }
  private handleDragLeave_right(draggingNode, dropNode, ev) {
    // console.log('tree drag leave: ', dropNode.label)
  }
  private handleDragOver_right(draggingNode, dropNode, ev) {
    // console.log('tree drag over: ', dropNode.label)
  }
  private handleDragEnd_right(draggingNode, dropNode, dropType, ev) {
    this.nodedataRight = null
    // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  private async handleDrop_right(draggingNode, dropNode, dropType, ev) {}
}
</script>



<style scoped>
</style>