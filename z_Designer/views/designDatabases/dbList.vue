<template>
  <div style="height: 100%; width: 100%" @mousedown="onClickBlankArea">
    <el-row style="height: 35px; width: 100%; border-bottom: 1px solid rgb(223, 223, 223)">
      <el-button @click="createDB">新建数据库</el-button>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px; height: calc(100% - 35px)">
      <div style="overflow: auto; width: 100%; height: 100%" @contextmenu.prevent="onTreeRightClick">
        <el-tree node-key="id" @node-contextmenu="onTreeNodeRightClick" :data="treeData" default-expand-all :expand-on-click-node="false"
          :draggable="false" highlight-current>
          <template #default="{ data }">
            <div v-if="data.type === 'table'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1" :nodeKey="data.id"
                @onSureNodeName="(id, title) => onSureNodeName(id, title, data)">
                <template #icon>
                  <el-image draggable="false" style="width: 20px; height: 20px" fit="contain" :src="normalPageIcon"></el-image>
                </template>
              </btreeNode>
            </div>
            <div v-if="data.type === 'db'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1" :nodeKey="data.id"
                @onSureNodeName="(id, title) => onSureNodeName(id, title, data)">
                <template #icon>
                  <span class="icon iconfont">&#xe626;</span>
                </template>
              </btreeNode>
            </div>
          </template>
        </el-tree>

        <v-contextmenu ref="ctxMenu">
          <v-contextmenu-item v-for="(menu, index) in rightMenus" :key="index" class="themeHover" style="padding-left: 5px"
            @click="onRightMenuChoose(menu)">
            <span class="icon iconfont gad-plc-menu-icon" v-html="getMenuIconByRightMenus(menu)"></span>
            <span style="margin-left: 3px">&nbsp;&nbsp;{{ menu }}</span>
          </v-contextmenu-item>
        </v-contextmenu>

        <addOrUpdateDBDialog ref="addOrUpdateDBDialog" @onSure="onSureAddOrUpdateDB" />
        <addOrUpdateTableDialog ref="addOrUpdateTableDialog" @onSure="onSureAddOrUpdateTable" />
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { GetDataBases, AddDataBase, DeleteDatabase, DataBaseDC, TableDC, DeleteTable, UpdateTable, UpdateDatabaseName } from '@common/apis/designDB'
import btreeNode from '@common/components/Treenode/bTreeNode.vue'
import { getLocale } from '@common/baseConfigs'

import { normalPageIcon, customPageIcon, dialogPageIcon, icondotIcon } from '@/assets/designIcons'
import { ElMessageBox } from 'element-plus'

import addOrUpdateDBDialog from './addOrUpdateDBDialog.vue'
import addOrUpdateTableDialog from './addOrUpdateTableDialog.vue'

class TreeNode {
  id: string
  label: string
  type: string
  dbId?: string
  index: number
  code: string
  children: TreeNode[] = []
}

@Options({
  components: {
    btreeNode: btreeNode,
    addOrUpdateDBDialog: addOrUpdateDBDialog,
    addOrUpdateTableDialog: addOrUpdateTableDialog
  }
})
export default class index extends ComponentBase {
  // *********************************
  private normalPageIcon = normalPageIcon
  private customPageIcon = customPageIcon
  private dialogPageIcon = dialogPageIcon
  private icondotIcon = icondotIcon

  private rightMenus: string[] = []
  private treeData: TreeNode[] = []
  private allDBS: DataBaseDC[] = []

  mounted() {
    this.refreshData()
  }
  private async refreshData() {
    this.allDBS = await GetDataBases()
    this.treeData = this.cuteTree(this.allDBS)
  }
  private cuteTree(dbs: DataBaseDC[]): TreeNode[] {
    var res: TreeNode[] = []
    for (let index = 0; index < dbs.length; index++) {
      const db = dbs[index]
      let dbtreenode: TreeNode = {
        id: db.id,
        label: db.databaseName,
        type: 'db',
        code: db.databaseCode,
        index: index,
        children: []
      }
      //
      for (let jndex = 0; jndex < db.tables.length; jndex++) {
        const table = db.tables[jndex]
        dbtreenode.children.push({
          id: table.tableId,
          dbId: db.id,
          label: table.tableName,
          code: table.tableCode,
          index: jndex,
          type: 'table',
          children: null
        })
      }
      res.push(dbtreenode)
    }
    return res
  }
  // *********pageGroups管理********************************************
  private searchNodeById(id: string, parentNodes: TreeNode[]): TreeNode {
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
  private deleteNodeById(id: string, parentNodes: TreeNode[]) {
    for (let index = 0; index < parentNodes.length; index++) {
      const node = parentNodes[index]
      if (node.id === id) {
        parentNodes.splice(index, 1)
        continue
      }
      this.deleteNodeById(id, node.children)
    }
  }
  private cuteChildrenMaxIndex(node: TreeNode) {
    let index = 0
    for (let index = 0; index < node.children.length; index++) {
      const childnode = node.children[index]
      if (childnode.index > index) {
        index = childnode.index
      }
    }
    return index
  }
  private cuteGroupMaxIndex(nodes: TreeNode[]) {
    let index = 0
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (node.index > index) {
        index = node.index
      }
    }
    return index
  }
  private findTableDCByNode(tableId: string): TableDC {
    for (let index = 0; index < this.allDBS.length; index++) {
      const db = this.allDBS[index]
      for (let jndex = 0; jndex < db.tables.length; jndex++) {
        const table = db.tables[jndex]
        if (table.tableId == tableId) {
          return table
        }
      }
    }
    return null
  }
  private findDbDCByNode(dbId: string): DataBaseDC {
    for (let index = 0; index < this.allDBS.length; index++) {
      const db = this.allDBS[index]
      if (db.id == dbId) {
        return db
      }
    }
    return null
  }
  // ***************树********************************************
  private allowDrop(draggingNode, dropNode, type) {
    return false
  }
  private allowDrag(draggingNode) {
    return false
  }
  /**当Sure节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {
    if (nodedata.type === 'table') {
      let table = this.findTableDCByNode(nodedata.id)
      table.tableName = newtitle
      await UpdateTable(table)
    } else {
      let db = this.findDbDCByNode(nodedata.id)
      db.databaseName = newtitle
      await UpdateDatabaseName(db)
    }
    this.refreshData()
  }
  // ***************右键弹窗**************************************
  private currentRightClickNode: any = null
  private onTreeNodeRightClick(e: any, data: any) {
    // window.console.log('右击菜单树节点', data)
    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = data
    this.rightMenus = []
    if (data.type === 'table') {
      this.rightMenus = [getLocale().t('opts.edit'), getLocale().t('opts.delete')]
    } else if (data.type === 'db') {
      this.rightMenus = ['新建表', getLocale().t('opts.edit'), getLocale().t('opts.delete')]
    }
    ;(this.$refs.ctxMenu as any).show({ top: e.clientY, left: e.clientX })
  }
  private onTreeRightClick(e: any) {
    //window.console.log('右击菜单树', e)
    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = null
    this.rightMenus = ['新建数据库']
    ;(this.$refs.ctxMenu as any).show({ top: e.clientY, left: e.clientX })
  }
  private getMenuIconByRightMenus(rm: string): string {
    let iconString
    switch (rm) {
      case getLocale().t('opts.edit'): {
        iconString = '&#xe628;'
        break
      }
      case getLocale().t('opts.delete'): {
        iconString = '&#xe62b;'
        break
      }
      case '新建表': {
        iconString = '&#xe62b;'
        break
      }
      case '新建数据库': {
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
      case getLocale().t('opts.edit'):
        if (this.currentRightClickNode.type === 'table') {
          this.editTable(this.currentRightClickNode)
        } else if (this.currentRightClickNode.type === 'db') {
          this.editDB(this.currentRightClickNode)
        }
        break
      case getLocale().t('opts.delete'):
        this.deleteNode()
        break
      case '新建数据库':
        ;(this.$refs.addOrUpdateDBDialog as addOrUpdateDBDialog).show()
        break
      case '新建表':
        let db = this.findDbDCByNode(this.currentRightClickNode)
        ;(this.$refs.addOrUpdateTableDialog as addOrUpdateTableDialog).show(db)
        break
      default:
        break
    }
  }
  // *****************************************************
  private async createDB() {
    ;(this.$refs.addOrUpdateDBDialog as any).show()
  }
  private async editDB(node) {
    let db = this.findDbDCByNode(node.id)
    ;(this.$refs.addOrUpdateDBDialog as addOrUpdateDBDialog).show(db)
  }
  private async editTable(node) {
    let table = this.findTableDCByNode(node.id)
    let db = this.findDbDCByNode(table.databaseId)
    ;(this.$refs.addOrUpdateTableDialog as addOrUpdateTableDialog).show(db, table)
  }
  private async onSureAddOrUpdateDB() {
    await this.refreshData()
    this.$forceUpdate()
  }
  private async onSureAddOrUpdateTable() {
    await this.refreshData()
    this.$forceUpdate()
  }
  private async deleteNode() {
    try {
      await ElMessageBox.confirm('删除后不能恢复，是否要继续?', 'Warning', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
    } catch (error) {
      return
    }

    let nodeId = this.currentRightClickNode.id
    let nodeType = this.currentRightClickNode.type
    if (nodeType === 'table') {
      let table = this.findTableDCByNode(this.currentRightClickNode.id)
      await DeleteTable(table)
      await this.refreshData()
    } else if (nodeType === 'db') {
      let db = this.findDbDCByNode(this.currentRightClickNode.id)
      await DeleteDatabase(db)
      await this.refreshData()
    }
    this.deleteNodeById(nodeId, this.treeData)
  }
  private onClickBlankArea() {
    ;(this.$refs.ctxMenu as any).hide()
  }
  // **************对外事件********************************
  @Emit('onCurrentTableChanged')
  private async onCurrentTableChanged(table: TableDC) {}
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
