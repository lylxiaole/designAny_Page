<template>
  <div style="height: 100%; width: 100%" @mousedown="onClickBlankArea">
    <el-row style="height: 35px; width: 100%; border-bottom: 1px solid rgb(223, 223, 223)">
      <el-row style="margin: 3px 15px">
        <!-- <el-input size="small" style="margin-bottom: 8px" v-model="seachVal" placeholder="请输入内容"></el-input> -->
      </el-row>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px; height: calc(100% - 35px)">
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
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :expand-on-click-node="false"
          draggable
          highlight-current
        >
          <template #default="{ data }">
            <div v-if="data.type === 'page'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1" :nodeKey="data.id" @onValueChanged="(id, title) => onNodeNameChanged(id, title, data)" @onSureNodeName="(id, title) => onSureNodeName(id, title, data)">
                <template #icon>
                  <div>
                    <span class="icon iconfont">&#xe627;</span>
                    <span v-if="data.isDefault">【首页】</span>
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
import { DesignPageGroupDC, DesignPageDC, TreeNodeDC, GetApplicationPages, ChangeGroupGroup, ChangePageGroup, AddPage, AddGroup, SetDefaultPage, UpdatePageName, UpdateGroupName, UpdateNodesSort, DeletePage, DeleteGroup, pageType } from '@common/apis/designPage'
import { behaviorList, behaviorContext } from '@behaviorEngine/index'

import btreeNode from '@common/components/Treenode/bTreeNode.vue'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'

enum rightMenus {
  addPage = '新建页面',
  setDefault = '设置默认页',
  addGroup = '新建分组',
  saveAs = '另存为',
  rename = '重命名',
  edit = '编辑',
  delete = '删除'
}

@Options({
  components: {
    btreeNode: btreeNode
  }
})
export default class index extends ComponentBase {
  private seachVal: string = ''
  private rightMenus: string[] = []
  private treeData: TreeNodeDC[] = []
  @Prop()
  private currentApplication: ApplicationDC
  @Watch('currentApplication', { deep: true })
  private async onApplicationChanged(application: ApplicationDC) {
    if (application) {
      this.treeData = await GetApplicationPages(application.id)
    } else {
      this.treeData = []
    }

    behaviorContext.getAllPageInfos = () => {
      return this.treeData
    }
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
  mounted() {}
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
      let parentNodeData = this.searchNodeById(parentGroupId, this.treeData)
      needOrderNodes = parentNodeData.children
    } else {
      needOrderNodes = this.treeData
    }
    for (let index = 0; index < needOrderNodes.length; index++) {
      needOrderNodes[index].index = index
    }
    window.console.log('needOrderNodes:', needOrderNodes)
    await UpdateNodesSort(needOrderNodes)
  }
  private allowDrop(draggingNode, dropNode, type) {
    // window.console.log('allowDrop 1:', dropNode.data.type)
    if (dropNode.data.type === 'page') {
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
    let find = this.searchNodeById(id, this.treeData)
    if (nodedata.type === 'page') {
    } else {
    }
  }
  /**当确定节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {
    let find = this.searchNodeById(id, this.treeData)
    find.label = newtitle
    if (nodedata.type === 'page') {
      let data = this.makeDesignPageDCByNode(find)
      await UpdatePageName(data)
    } else {
      let data = this.makeDesignPageGroupDCByNode(find)
      await UpdateGroupName(data)
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
    if (data.type === 'page') {
      this.rightMenus = [rightMenus.edit, rightMenus.setDefault, rightMenus.saveAs, rightMenus.delete]
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
      case rightMenus.setDefault: {
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
        this.onDeletePage(this.currentRightClickNode.id)
        break
      case rightMenus.edit:
        this.onEditPage(this.currentRightClickNode.id)
        break
      case rightMenus.setDefault:
        this.setDefaultPage()
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
    let res = await AddGroup({ name: '新建分组', appId: this.currentApplication.id, parentGroupId: parentGroupId, index: index } as any)
    let newnode: TreeNodeDC = {
      id: res.id,
      parentGroupId: res.parentGroupId,
      label: res.name,
      type: 'group',
      isDefault: false,
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
    let pType = pageType.pcPage
    switch (this.currentApplication.type) {
      case applicationType.dashBoard:
      case applicationType.report:
      case applicationType.webSystem:
        pType = pageType.pcPage
        break

      default:
        break
    }

    let res = await AddPage({ name: '新建页面', appId: this.currentApplication.id, parentGroupId: parentGroupId, index: index, type: pType } as any)

    let newnode: TreeNodeDC = {
      id: res.id,
      isDefault: false,
      parentGroupId: res.parentGroupId,
      label: res.name,
      type: 'page',
      index: res.index,
      children: []
    }

    datadc.children.push(newnode)
  }
  private async setDefaultPage() {
    let pageId = this.currentRightClickNode.id

    let res = await SetDefaultPage(pageId)
    if (res) {
      this.setNodeDefault(pageId, this.treeData)
    } else {
      alert('设置首页失败')
    }
  }
  private async deleteNode() {
    let nodeId = this.currentRightClickNode.id
    let nodeType = this.currentRightClickNode.type
    let nodedata = this.searchNodeById(nodeId, this.treeData)

    if (nodeType === 'page') {
      let data = this.makeDesignPageDCByNode(nodedata)
      await DeletePage(data)
    } else if (nodeType === 'group') {
      let data = this.makeDesignPageGroupDCByNode(nodedata)
      await DeleteGroup(data)
    }
    this.deleteNodeById(nodeId, this.treeData)
  }
  private onClickBlankArea() {
    ;(this.$refs.ctxMenu as any).hide()
  }
  // **************对外事件*****************************************************
  @Emit('onEditPage')
  private async onEditPage(pageId: string) {}
  @Emit('onDeletePage')
  private async onDeletePage(pageId: string) {}
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
