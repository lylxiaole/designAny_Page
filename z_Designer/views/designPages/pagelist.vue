<template>
  <div style="height:100%;width:100%">
    <el-row style="height: 50px; width: 100%;border-bottom: 1px solid rgb(223, 223, 223);">
      <el-row style="margin: 3px 15px">
        <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="请输入内容"></el-input>
      </el-row>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px">
      <div style="overflow: auto; width: 100%; height: 100%; " @contextmenu.prevent="onTreeRightClick">
        <el-tree size="small" node-key="id" @node-contextmenu="onTreeNodeRightClick" :data="pageGroups" default-expand-all
          @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd" @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag" draggable>
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
import { DesignPageGroupDC, DesignPageDC, AddPage, AddGroup } from '@src/apis/designPage'
let VueContextMenu = require('vue-context-menu')

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
    VueContextMenu: VueContextMenu
  }
})
export default class index extends ComponentBase {
  @Prop()
  private currentAppId: string

  @Prop({
    default: () => {
      return []
    }
  })
  private pageGroups: DesignPageGroupDC[]
  private seachVal: string = ''
  private rightMenus: string[] = []

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
  // ***************右键弹窗**************************************
  private onTreeNodeRightClick(e: any, data: any) {
    window.console.log('右击菜单树节点', data)
    e.stopPropagation()
    e.preventDefault()

    this.rightMenus = []
    this.rightMenus = [rightMenus.addPage, rightMenus.addGroup]
    ;(this.$refs.ctxMenu as any).open()
  }

  private onTreeRightClick(e: any) {
    window.console.log('右击菜单树', e)

    e.stopPropagation()
    e.preventDefault()
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
    let res = await AddGroup({ name: '新建分组', appId: this.currentAppId } as any)
    window.console.log('addGroup:', res)
  }
  private async addPage() {
    let res = await AddPage({ name: '新建页面', appId: this.currentAppId } as any)
    window.console.log('addPage:', res)
  }
}
</script>

<style lang="less" scoped>
@import (less) '@src/assets/iconfont1/iconfont.css';
</style>