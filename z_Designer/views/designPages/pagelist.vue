<template>
  <div style="height:100%;width:100%">
    <el-row style="height: 50px; width: 100%;border-bottom: 1px solid rgb(223, 223, 223);">
      <el-row style="margin: 3px 15px">
        <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="请输入内容"></el-input>
      </el-row>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px">
      <div style="overflow: auto; width: 100%; height: 100%; " @contextmenu.prevent="onTreeRightClick">
        <el-tree node-key="id" @node-contextmenu="onTreeNodeRightClick" :data="treeData" default-expand-all @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd"
          @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag" :expand-on-click-node="false" draggable>

          <div slot-scope="{node,data}">
            <div v-if="data.type==='page'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1;" :nodeKey="data.id"
                @onValueChanged="(id,title)=>onNodeNameChanged(id,title,data)" @onSureNodeName="(id,title)=>onSureNodeName(id,title,data)">
              </btreeNode>
            </div>
            <div v-if="data.type==='group'">
              <btreeNode :value="data.label" style="margin-left: 3px; z-index: 1;" :nodeKey="data.id"
                @onValueChanged="(id,title)=>onNodeNameChanged(id,title,data)" @onSureNodeName="(id,title)=>onSureNodeName(id,title,data)">
              </btreeNode>
            </div>
          </div>

        </el-tree>

        <VueContextMenu id="context-menu" ref="ctxMenu" style="cursor: pointer">
          <li v-for="(menu, index) in rightMenus" :key="index" class="themeHover pageListItem" style="padding-left: 5px"
            @click="onRightMenuChoose(menu)">
            <span class="icon iconfont gad-plc-menu-icon" v-html="getMenuIconByRightMenus(menu)"></span>
            <span style="margin-left: 3px">&nbsp;&nbsp;{{ menu }}</span>
          </li>
        </VueContextMenu>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { DesignPageGroupDC, DesignPageDC, AddPage, AddGroup, UpdatePageName, UpdateGroupName } from '@src/apis/designPage'
let VueContextMenu = require('vue-context-menu')
import btreeNode from '@src/components/Treenode/bTreeNode.vue'

enum rightMenus {
  addPage = '新建页面',
  addGroup = '新建分组',
  saveAs = '另存为',
  rename = '重命名',
  edit = '编辑',
  delete = '删除'
}
@Component({
  components: {
    VueContextMenu: VueContextMenu,
    btreeNode: btreeNode
  }
})
export default class index extends ComponentBase {
  private seachVal: string = ''
  private rightMenus: string[] = []
  private treeData: any[] = []

  @Prop()
  private currentAppId: string

  @Prop({
    default: () => {
      return []
    }
  })
  private pageGroups: DesignPageGroupDC[]

  @Watch('pageGroups', { deep: true })
  private onPageGroupsChanged(newval: DesignPageGroupDC[]) {
    this.treeData = this.loopPageGroups(newval, [])
    window.console.log('xxxxxxxxxxxxx:', this.treeData)
  }
  private loopPageGroups(groups: DesignPageGroupDC[], pages: DesignPageDC[]) {
    let res = []

    for (let index = 0; index < pages.length; index++) {
      const page = pages[index]
      res.push({ id: page.id, label: page.name, type: 'page', children: [] })
    }

    for (let index = 0; index < groups.length; index++) {
      const group = groups[index]

      let groupchildren = []
      for (let index = 0; index < group.childrenPages.length; index++) {
        const childpage = group.childrenPages[index]
        groupchildren.push({ id: childpage.id, type: 'page', label: childpage.name, children: [] })
      }

      for (let index = 0; index < group.childrenGroups.length; index++) {
        const childgroup = group.childrenGroups[index]
        groupchildren.push({
          id: childgroup.id,
          label: childgroup.name,
          type: 'group',
          children: this.loopPageGroups(childgroup.childrenGroups, childgroup.childrenPages)
        })
      }

      res.push({ id: group.id, label: group.name, type: 'group', children: groupchildren })
    }
    return res
  }

  private searchNodeById(id: string, pageGroups: DesignPageGroupDC[]) {
    for (let index = 0; index < pageGroups.length; index++) {
      const group = pageGroups[index]
      if (group.id === id) {
        return group
      }
      let findPage = group.childrenPages.find((o) => o.id === id)
      if (findPage) {
        return findPage
      }
      let res = this.searchNodeById(id, group.childrenGroups)
      if (res) {
        return res
      }
    }
    return null
  }

  mounted() {}
  // ***************树********************************************
  private async handleDragStart(node, ev) {
    console.log('drag start', node)
  }
  private async handleDragEnter(draggingNode, dropNode, ev) {
    console.log('tree drag enter: ', dropNode.label)
  }
  private async handleDragLeave(draggingNode, dropNode, ev) {
    console.log('tree drag leave: ', dropNode.label)
  }
  private async handleDragOver(draggingNode, dropNode, ev) {
    console.log('tree drag over: ', dropNode.label)
  }
  private async handleDragEnd(draggingNode, dropNode, dropType, ev) {
    console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  private async handleDrop(draggingNode, dropNode, dropType, ev) {
    console.log('tree drop: ', dropNode.label, dropType)
  }
  private async allowDrop(draggingNode, dropNode, type) {
    if (dropNode.data.label === '二级 3-1') {
      return type !== 'inner'
    } else {
      return true
    }
  }
  private async allowDrag(draggingNode) {
    return draggingNode.data.label.indexOf('三级 3-2-2') === -1
  }

  /**当节点名称改变后 */
  private async onNodeNameChanged(id: string, newtitle: string, nodedata: any) {
    let find = this.searchNodeById(id, this.pageGroups)

    if (nodedata.type === 'page') {
    } else {
    }
  }

  /**当确定节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {
    window.console.log('onSureNodeName:', newtitle)
    let find = this.searchNodeById(id, this.pageGroups)
    find.name = newtitle
    if (nodedata.type === 'page') {
      await UpdatePageName(find)
    } else {
      await UpdateGroupName(find)
    }
  }
  // ***************右键弹窗**************************************
  private currentRightClickNode: any = null
  private onTreeNodeRightClick(e: any, data: any) {
    window.console.log('右击菜单树节点', data)
    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = data
    this.rightMenus = []
    if (data.type === 'page') {
      this.rightMenus = [rightMenus.saveAs, rightMenus.delete]
    } else if (data.type === 'group') {
      this.rightMenus = [rightMenus.addPage, rightMenus.addGroup, rightMenus.delete]
    }

    ;(this.$refs.ctxMenu as any).open()
  }

  private onTreeRightClick(e: any) {
    window.console.log('右击菜单树', e)

    e.stopPropagation()
    e.preventDefault()
    this.currentRightClickNode = null
    this.rightMenus = []
    this.rightMenus = [rightMenus.addGroup]
    ;(this.$refs.ctxMenu as any).open()
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
    window.console.log('onRightMenuChoose:', menuName)
    switch (menuName) {
      case rightMenus.addPage:
        this.addPage()
        break
      case rightMenus.addGroup:
        this.addGroup()
        break
      default:
        break
    }
  }

  private async addGroup() {
    let parentGroupId = this.currentRightClickNode ? this.currentRightClickNode.id : null
    let res = await AddGroup({ name: '新建分组', appId: this.currentAppId, parentGroupId: parentGroupId } as any)
    window.console.log('addGroup:', res)
  }
  private async addPage() {
    let parentGroupId = this.currentRightClickNode ? this.currentRightClickNode.id : null
    let res = await AddPage({ name: '新建页面', appId: this.currentAppId, parentGroupId: parentGroupId } as any)
    window.console.log('addPage:', res)
  }
}
</script>

<style lang="less" scoped>
@import (less) '@src/assets/iconfont1/iconfont.css';

/deep/.el-tree-node__content {
  height: 32px !important;
}
</style>