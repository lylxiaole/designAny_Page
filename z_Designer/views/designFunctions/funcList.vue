<template>
  <div style="height: 100%; width: 100%" @mousedown="onClickBlankArea">
    <el-row style="height: 50px; width: 100%; border-bottom: 1px solid rgb(223, 223, 223)">
      <el-row style="margin: 3px 15px">
        <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="Please Input"></el-input>
      </el-row>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px; height: calc(100% - 50px)">
      <div style="overflow: auto; width: 100%; height: 100%" @contextmenu.prevent="onTreeRightClick">
        <el-tree
          node-key="id"
          @node-contextmenu="onTreeNodeRightClick"
          :data="treeData"
          default-expand-all
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          @current-change="onCurrentNodeChange"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :expand-on-click-node="false"
          draggable
          highlight-current
        >
          <template #default="{ data }">
            <div v-if="data.type === 'func'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1" :nodeKey="data.id" @onValueChanged="(id, title) => onNodeNameChanged(id, title, data)" @onSureNodeName="(id, title) => onSureNodeName(id, title, data)">
                <template #icon>
                  <div>
                    <span class="icon iconfont">&#xe627;</span>
                  </div>
                </template>
              </btreeNode>
            </div>
            <div v-if="data.type === 'group'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1" :nodeKey="data.id" @onValueChanged="(id, title) => onNodeNameChanged(id, title, data)" @onSureNodeName="(id, title) => onSureNodeName(id, title, data)">
                <template #icon>
                  <span class="icon iconfont">&#xe626;</span>
                </template>
              </btreeNode>
            </div>
          </template>
        </el-tree>

        <v-contextmenu ref="ctxMenu">
          <v-contextmenu-item v-for="(menu, index) in rightMenus" :key="index" class="themeHover" style="padding-left: 5px" @click="onRightMenuChoose(menu)">
            <span class="icon iconfont gad-plc-menu-icon" v-html="getMenuIconByRightMenus(menu)"></span>
            <span style="margin-left: 3px">&nbsp;&nbsp;{{ menu }}</span>
          </v-contextmenu-item>
        </v-contextmenu>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { JSFuncEntity, JSFuncGroupDC } from '@common/apis/designJSFunc'
import { UpdateNodesSort, AddFuncGroup, DeleteFuncGroup, UpdateFuncGroup, GetGroupFuncsAll, AddOrUpdateFunc, AddOrUpdateFunTreeInfo, DeleteFunc } from '@common/apis/designJSFunc'
import btreeNode from '@common/components/Treenode/bTreeNode.vue'

class TreeNodeDC {
  id: string
  parentGroupId: string
  label: string
  type: string
  index: number
  desc: string
  children: TreeNodeDC[] = []
}

enum rightMenus {
  addPage = 'New Func',
  addGroup = 'New Group',
  saveAs = 'Save As',
  rename = 'Rename',
  edit = 'Edit',
  delete = 'Delete'
}

@Options({
  components: {
    btreeNode: btreeNode
  }
})
export default class funcList extends ComponentBase {
  private seachVal: string = ''
  private rightMenus: string[] = []
  private treeData: TreeNodeDC[] = []

  private async loadData() {
    let data = await GetGroupFuncsAll()
    let treeData = this.organizeGroupTreeData(data as any)
    this.treeData = treeData
  }

  private organizeGroupTreeData(data: JSFuncGroupDC[]) {
    let tree: TreeNodeDC[] = []
    for (let index = 0; index < data.length; index++) {
      const group = data[index]
      let treenodegroup: TreeNodeDC = {
        id: group.id,
        parentGroupId: group.parentGroupId,
        label: group.groupName,
        index: group.index,
        desc: '',
        type: 'group',
        children: []
      }

      let childrenGroup = this.organizeGroupTreeData(group.childrenGroups)
      let childrenApi = this.organizeApiTreeData(group.childrenFuncs)
      treenodegroup.children = treenodegroup.children.concat(childrenApi)
      treenodegroup.children = treenodegroup.children.concat(childrenGroup)
      tree.push(treenodegroup)
    }
    return tree
  }
  private organizeApiTreeData(data: JSFuncEntity[]) {
    let tree: TreeNodeDC[] = []
    for (let index = 0; index < data.length; index++) {
      const apidata = data[index]
      let treenodegroup: TreeNodeDC = {
        id: apidata.id,
        parentGroupId: apidata.groupId,
        label: apidata.name,
        index: apidata.index,
        desc: apidata.desc,
        type: 'func',
        children: []
      }
      tree.push(treenodegroup)
    }
    return tree
  }

  mounted() {
    this.loadData()
  }
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
  private makeDesignApiDCByNode(node: TreeNodeDC): JSFuncEntity {
    let data: any = {
      id: node.id,
      groupId: node.parentGroupId,
      name: node.label,
      index: node.index,
      desc: node.desc
    }
    return data
  }
  private makeDesignApiGroupDCByNode(node: TreeNodeDC): JSFuncGroupDC {
    let data: any = {
      id: node.id,
      groupName: node.label,
      index: node.index,
      parentGroupId: node.parentGroupId
    }
    return data
  }

  private onCurrentNodeChange(nodedata, node) {
    if (nodedata && nodedata.type === 'func') {
      this.onChooseFunc(nodedata.id)
    } else {
      this.onChooseFunc(null)
    }
  }
  // ***************树********************************************
  private handleDragStart(node, ev) {
    // console.log('drag start', node)
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
  private async handleDrop(draggingNode, dropNode, dropType, ev) {
    // ****************************************
    let parentGroupId = null
    if (dropType === 'inner') {
      parentGroupId = dropNode.data.id
    } else if (dropType === 'before') {
      parentGroupId = dropNode.data.parentGroupId
    } else if (dropType === 'after') {
      parentGroupId = dropNode.data.parentGroupId
    }
    let dragingNodeData = this.searchNodeById(draggingNode.data.id, this.treeData)
    dragingNodeData.parentGroupId = parentGroupId
    if (dragingNodeData.type === 'func') {
      let data = this.makeDesignApiDCByNode(dragingNodeData)
      await AddOrUpdateFunTreeInfo(data)
    } else if (dragingNodeData.type === 'group') {
      let data = this.makeDesignApiGroupDCByNode(dragingNodeData)
      await UpdateFuncGroup(data)
    }
    // ****************************************
    let needOrderNodes = []
    if (parentGroupId) {
      let parentNodeData = this.searchNodeById(parentGroupId, this.treeData)
      needOrderNodes = parentNodeData.children
    } else {
      needOrderNodes = this.treeData
    }
    for (let index = 0; index < needOrderNodes.length; index++) {
      needOrderNodes[index].index = index
    }
    await UpdateNodesSort(needOrderNodes)
  }
  private allowDrop(draggingNode, dropNode, type) {
    // window.console.log('allowDrop 1:', dropNode.data.type)
    if (dropNode.data.type === 'func') {
      if (type === 'inner') {
        return false
      }

      return true
    } else if (dropNode.data.type === 'group') {
      if (type !== 'inner' && !dropNode.data.parentGroupId) {
        return false
      }
      return true
    }
  }
  private allowDrag(draggingNode) {
    window.console.log('allowDrag', draggingNode)
    return true
  }
  /**当节点名称改变后 */
  private async onNodeNameChanged(id: string, newtitle: string, nodedata: any) {
    // let find = this.searchNodeById(id, this.treeData)
    // if (nodedata.type === 'func') {
    // } else {
    // }
  }
  /**当确定节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {
    let find = this.searchNodeById(id, this.treeData)
    find.label = newtitle
    if (nodedata.type === 'func') {
      let data = this.makeDesignApiDCByNode(find)
      await AddOrUpdateFunTreeInfo(data)
    } else {
      let data = this.makeDesignApiGroupDCByNode(find)
      await UpdateFuncGroup(data)
    }
  }
  // ***************右键弹窗**************************************
  private currentRightClickNode: any = null
  private onTreeNodeRightClick(e: any, data: any) {
    // window.console.log('右击菜单树节点', data)
    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = data
    this.rightMenus = []
    if (data.type === 'func') {
      this.rightMenus = [rightMenus.saveAs, rightMenus.delete]
    } else if (data.type === 'group') {
      this.rightMenus = [rightMenus.addPage, rightMenus.addGroup, rightMenus.delete]
    }

    ;(this.$refs.ctxMenu as any).show({ top: e.clientY, left: e.clientX })
  }
  private onTreeRightClick(e: any) {
    //window.console.log('右击菜单树', e)
    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = null
    this.rightMenus = []
    this.rightMenus = [rightMenus.addGroup]
    ;(this.$refs.ctxMenu as any).show({ top: e.clientY, left: e.clientX })
  }
  private getMenuIconByRightMenus(rm: rightMenus): string {
    let iconString
    switch (rm) {
      case rightMenus.addPage:
        iconString = '&#xe625;'
        break
      case rightMenus.addGroup: {
        iconString = '&#xe626;'
        break
      }
      case rightMenus.edit:
        iconString = '&#xe628;'
        break
      case rightMenus.saveAs: {
        iconString = '&#xe61a;'
        break
      }
      case rightMenus.rename: {
        iconString = '&#xe628;'
        break
      }
      case rightMenus.delete: {
        iconString = '&#xe62b;'
        break
      }
      default:
        break
    }
    return iconString
  }
  private async onRightMenuChoose(menuName: string) {
    //window.console.log('onRightMenuChoose:', menuName)
    switch (menuName) {
      case rightMenus.addPage:
        this.addPage()
        break
      case rightMenus.addGroup:
        this.addGroup()
        break
      case rightMenus.delete:
        this.deleteNode()
        this.onChooseFunc(null)
        break
      default:
        break
    }
  }
  private async addGroup() {
    let parentGroupId = this.currentRightClickNode ? this.currentRightClickNode.id : null
    let index = 0
    if (parentGroupId) {
      let datadc = this.searchNodeById(parentGroupId, this.treeData)
      index = this.cuteChildrenMaxIndex(datadc) + 1
    } else {
      index = this.cuteGroupMaxIndex(this.treeData) + 1
    }
    let res = await AddFuncGroup({ groupName: '新建分组', parentGroupId: parentGroupId, index: index } as any)
    let newnode: TreeNodeDC = {
      id: res.id,
      desc: '',
      parentGroupId: res.parentGroupId,
      label: res.groupName,
      type: 'group',
      index: res.index,
      children: []
    }

    if (parentGroupId) {
      let nodedata = this.searchNodeById(parentGroupId, this.treeData)
      nodedata.children.push(newnode)
    } else {
      this.treeData.push(newnode)
    }
  }
  private async addPage() {
    //parentGroupId 必定有值,因为页面必须添加到分组底下
    let parentGroupId = this.currentRightClickNode.id
    let datadc = this.searchNodeById(parentGroupId, this.treeData)
    let index = this.cuteChildrenMaxIndex(datadc) + 1
    let res = await AddOrUpdateFunTreeInfo({ name: '新建接口', groupId: parentGroupId, index: index, desc: '' } as any)

    let newnode: TreeNodeDC = {
      id: res.id,
      parentGroupId: res.groupId,
      label: res.name,
      type: 'func',
      index: res.index,
      desc: '',
      children: null
    }

    datadc.children.push(newnode)
    this.$forceUpdate()
  }
  private async deleteNode() {
    let nodeId = this.currentRightClickNode.id
    let nodeType = this.currentRightClickNode.type
    let nodedata = this.searchNodeById(nodeId, this.treeData)

    if (nodeType === 'func') {
      let data = this.makeDesignApiDCByNode(nodedata)
      await DeleteFunc(data.id)
    } else if (nodeType === 'group') {
      let data = this.makeDesignApiGroupDCByNode(nodedata)
      await DeleteFuncGroup(data.id)
    }
    this.deleteNodeById(nodeId, this.treeData)
  }
  private onClickBlankArea() {
    ;(this.$refs.ctxMenu as any).hide()
  }
  // **************对外事件*****************************************************
  @Emit('onChooseFunc')
  private async onChooseFunc(apiId: string) {}
}
</script>

<style lang="less" scoped>
/deep/.el-tree-node__content {
  height: 32px !important;
}
.themeHover:hover {
  background: #83c346;
  cursor: pointer;
  color: white;
}
.rightMenuNode {
  padding-left: 5px;
}

.pageListItem .iconfont {
  color: #9e9e9e;
}

.pageListItem:hover .iconfont {
  color: white;
}

.pageFontHover:hover {
  color: #ffffff;
}

.ant-tree-node-content-wrapper:hover .pageListItem {
  background-color: rgba(121, 169, 229, 0.3);
}

.ant-tree-node-selected .pageListItem {
  background-color: rgba(121, 169, 229, 0.3) !important;
}

.ant-tree-node-selected .pageFontHover {
  color: #ffffff !important;
}

.gad-plc-menu-icon {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65) !important;
}

.gad-plc {
  padding: 10px 0px;
  position: relative;
}
</style>
