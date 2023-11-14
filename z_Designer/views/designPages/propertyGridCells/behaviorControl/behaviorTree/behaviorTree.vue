<template>
  <div style="padding:0px 10px;height:100%;width:100%;">
    <a-button icon="plus" style="width:100%;height:32px;" type="dashed" size="small" @click="addNewAction">添加动作</a-button>
    <div style="height:94%;width:100%;overflow-y:auto;background:#fff" @contextmenu.prevent="onTreeNodeRightClick">
      <a-tree size="small" style="height:100%;width:inherit" :treeData="dataTree" @select="onNodeSelect" :selectedKeys.sync="currentSelectedKeys"
        draggable defaultExpandAll :multiple="false" @rightClick="onTreeNodeRightClick" @drop="onNodeDrop">
        <div slot="action" slot-scope="{key,title}" style="position:relative; ">
          <a-tooltip placement="topLeft" :title="title" class="flexHorilanLayout pageFontHover">
            <div style="width:100%;height:26px;position:relative;justify-content:left;" tabindex="1" @keydown="onNodeKeyDown"
              class="flexHorilanLayout pageFontHover  ">
              <span class="pageListItem" style="height:26px;position:absolute;left:-300px;right:-300px"></span>
              <btreeNode :value="title" :nodeKey="key" @onValueChanged="onNodeNameChanged" style="width:80%;z-index:1" />
              <a-icon style="margin-left:8px;z-index:1" type="edit" @click="settingAction(key)" />
            </div>
          </a-tooltip>
        </div>

        <div slot="actionDetail" slot-scope="{key,title}" style="position:relative;">
          <a-tooltip placement="topLeft" :title="title" class="flexHorilanLayout pageFontHover">
            <div style="width:100%;height:26px;position:relative;justify-content:left" tabindex="1" @keydown="onNodeKeyDown"
              class="flexHorilanLayout pageFontHover ">
              <span class="pageListItem" style="height:26px;position:absolute;left:-300px;right:-300px"></span>
              <btreeNode :value="title" :nodeKey="key" @onValueChanged="onNodeNameChanged" style="margin-left:3px;z-index:1">
              </btreeNode>
            </div>
          </a-tooltip>
        </div>
      </a-tree>
      <actionFilterSetting :currentLayout="currentLayout" :currentPage="currentPage" :currentSettingBehavior="currentSettingBehavior"
        :isVisible.sync="actionSettingVisible" :currentAction.sync="currentSettingAction" />
    </div>
    <VueContextMenu id="context-menu" ref="ctxMenu">
      <li class="themeHover ppapaaaap" v-for="(menu,index) in rightMenus" :key="index" @click="onRightMenuChoose(menu)">&nbsp;&nbsp;{{menu}}</li>
    </VueContextMenu>

    <button v-show="false" ref="copyBtn"></button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid, serialize } from '@common/utils'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../../common'
import {
  layoutEventBehaviors,
  behavior,
  action,
  actionDetail,
  allCuteSigns,
  formulaType,
  allFilterSigns,
  objectBase,
  objectType,
  resourceType,
  object_Method,
  object_callback,
  factory
} from '@behaviorEngine/index'
import actionFilterSetting from './actionFilterSetting.vue'
import { EnginePage, EngineComponent, EngineLayout } from '@designEngine/index'
import btreeNode from './bTreeNode.vue'
import Clipboard from 'clipboard'

let VueContextMenu = require('vue-context-menu')

class behaviorTreeNodeData {
  key: string
  title: string
  isAction: boolean = true
  children: behaviorTreeNodeData[] = []
  get scopedSlots(): any {
    if (this.isAction == true) {
      return {
        title: 'action'
      }
    }
    return {
      title: 'actionDetail'
    }
  }
}

enum rightMenuEnum {
  addAction = '新增动作',
  addActionDetail = '新增动作细节',
  delete = '删除'
}

@Options({
  components: {
    VueContextMenu: VueContextMenu,
    btreeNode: btreeNode,
    actionFilterSetting: actionFilterSetting
  }
})
export default class behaviorTree extends Vue {
  /**当前正在设置的行为 */
  @Prop() currentLayout: EngineLayout
  @Prop() currentPage: EnginePage
  @Prop() currentSettingBehavior: behavior
  @Prop() actionFactory: factory

  private currentSelectedKeys: string[] = []

  private get dataTree(): behaviorTreeNodeData[] {
    if (!this.currentSelectedKeys) {
      return []
    }
    if (!this.currentSettingBehavior.actions) {
      this.currentSettingBehavior.actions = []
    }
    return this.cuteDataTree(this.currentSettingBehavior.actions)
  }

  private onNodeSelect(keys: string[], e: any) {
    if (keys.length < 1) {
      this.currentActionChanged(null)
      return
    }
    let findnode = this.getNodeDataById(keys[0], this.currentSettingBehavior.actions)
    this.currentActionChanged(findnode)
  }

  private clipboard: any
  private get copyBtn(): any {
    return this.$refs.copyBtn
  }

  @Emit('currentActionChanged')
  private currentActionChanged(newval: actionDetail | action) {}
  /*********************************************** */
  /**重写组件的render行为 */
  private oldrender: Function = null
  private newrender(createElement: any, hack: any): any {
    this.$nextTick(() => {
      this.renderDom(this.$el)
    })
    return this.oldrender(createElement, hack)
  }

  mounted() {
    this.oldrender = this.$options.render
    this.$options.render = this.newrender
    this.loadClipboardComp()
    window.addEventListener('paste', this.pasteActions)
  }

  destoryed() {
    this.clipboard.destroy()
    window.removeEventListener('paste', this.pasteActions)
  }

  private renderDom(dom: Element) {
    $(this.$el).find('.ant-tree-switcher').css('z-index', 5)
  }

  private loadClipboardComp() {
    this.clipboard = new Clipboard(this.copyBtn, {
      text: () => {
        let selectAct = this.getCurrentSelectedNode(this.currentSettingBehavior.actions)
        return serialize(selectAct)
      }
    })
    this.clipboard.on('success', (e) => {
      this.$message.success('复制行为成功', 2)
    })
    this.clipboard.on('error', (e) => {
      this.$message.success('复制行为失败', 2)
    })
  }

  /*******右键列表************************** */
  private rightMenus: string[] = []
  /**右击 */
  private onTreeNodeRightClick(e: any) {
    if (e.node) {
      ;(e.event as Event).stopPropagation()
    } else {
      ;(e as Event).stopPropagation()
    }
    let currentRightNode: behaviorTreeNodeData = null
    if (e.node) {
      currentRightNode = e.node.dataRef as behaviorTreeNodeData
    }
    if (currentRightNode) {
      this.currentSelectedKeys = [currentRightNode.key]
    } else {
      this.currentSelectedKeys = []
    }

    //window.console.log('右击了')
    ;(this.$refs.ctxMenu as any).open()
    this.makeRightMenus(currentRightNode)
  }
  private onRightMenuChoose(menuName: string) {
    //window.console.log(menuName)
    switch (menuName) {
      case rightMenuEnum.addAction:
        this.addNewAction()
        break
      case rightMenuEnum.addActionDetail:
        this.addNewActionDetail()
        break
      case rightMenuEnum.delete:
        {
          let selectAct = this.getCurrentSelectedNode(this.currentSettingBehavior.actions)
          this.deleteNode(selectAct)
        }
        break
      default:
        break
    }
  }
  private makeRightMenus(node: behaviorTreeNodeData) {
    this.rightMenus = []
    if (!node) {
      this.rightMenus.push(rightMenuEnum.addAction)
      this.rightMenus.push(rightMenuEnum.addActionDetail)
      return
    }
    if (node.isAction == true) {
      this.rightMenus.push(rightMenuEnum.addAction)
      this.rightMenus.push(rightMenuEnum.addActionDetail)
      this.rightMenus.push(rightMenuEnum.delete)
    } else {
      this.rightMenus.push(rightMenuEnum.delete)
    }
  }
  private onNodeNameChanged(nodeKey: string, newname: string) {
    this.getNodeDataById(nodeKey, this.currentSettingBehavior.actions).name = newname
  }
  /************行为列表维护*********************************************************************** */
  /**添加一个动作 */
  private addNewAction() {
    //window.console.log('添加动作')
    let newaction = new action()
    newaction.id = getUuid()
    newaction.name = '新建动作'
    newaction.actionDetails = []

    let selectAct = this.getCurrentSelectedNearestAction(this.currentSettingBehavior.actions)
    if (!selectAct) {
      this.currentSettingBehavior.actions.push(newaction)
    } else if (this.nodeIsAction(selectAct) == true) {
      selectAct.actionDetails.push(newaction)
    }
  }
  /**添加一个动作 */
  private addNewActionDetail() {
    //window.console.log('添加动作细节')
    let newactionDetail = new actionDetail()
    newactionDetail.id = getUuid()
    newactionDetail.name = '新建动作细节'
    newactionDetail.objs = []
    let first = this.actionFactory.makeObject(getUuid(), '新建变量', objectType.variable, resourceType.variables)
    newactionDetail.objs.push(first)

    let selectAct = this.getCurrentSelectedNearestAction(this.currentSettingBehavior.actions)
    if (!selectAct) {
      //window.console.error('只能在动作节点下，添加动作细节')
    } else if (this.nodeIsAction(selectAct) == true) {
      selectAct.actionDetails.push(newactionDetail)
    }
  }
  private addAction(act: action) {
    this.redomActionIds(act)
    let selectAct = this.getCurrentSelectedNearestAction(this.currentSettingBehavior.actions)
    if (!selectAct) {
      this.currentSettingBehavior.actions.push(act)
    } else if (this.nodeIsAction(selectAct) == true) {
      selectAct.actionDetails.push(act)
    }
  }
  private addActionDetail(actd: actionDetail) {
    let selectAct = this.getCurrentSelectedNearestAction(this.currentSettingBehavior.actions)
    if (!selectAct) {
      //window.console.error('只能在动作节点下，添加动作细节')
    } else if (this.nodeIsAction(selectAct) == true) {
      actd.id = getUuid()
      selectAct.actionDetails.push(actd)
    }
  }

  private redomActionIds(act: action) {
    if (!act) {
      return
    }
    act.id = getUuid()

    for (let index = 0; index < act.actionDetails.length; index++) {
      const element = act.actionDetails[index]
      if (this.nodeIsAction(element) == true) {
        this.redomActionIds(element as action)
      } else {
        element.id = getUuid()
      }
    }
  }

  private deleteNode(selectAct: actionDetail | action) {
    if (!selectAct) {
      return
    }
    window.console.log('删除动作节点')
    let parentNode = this.getNodeParent(selectAct, this.currentSettingBehavior.actions)
    if (!parentNode) {
      let index = this.currentSettingBehavior.actions.indexOf(selectAct as any)
      this.currentSettingBehavior.actions.splice(index, 1)
    } else {
      let index = parentNode.actionDetails.indexOf(selectAct as any)
      parentNode.actionDetails.splice(index, 1)
    }
  }
  /**判断节点是否是动作 */
  private nodeIsAction(node: actionDetail | action): boolean {
    if ((node as actionDetail).isActionDetail) {
      return false
    } else {
      return true
    }
  }
  /**获取父级节点 */
  private getNodeParent(node: actionDetail | action, parents: (actionDetail | action)[]): action {
    for (let n in parents) {
      if (this.nodeIsAction(parents[n]) == false) {
        continue
      }
      let parent = parents[n] as action
      if (parent.actionDetails.indexOf(node) > -1) {
        return parent
      }

      let find = this.getNodeParent(node, parent.actionDetails)
      if (find) {
        return find
      }
    }
    return null
  }
  /** 根据currentSelectedKeys查找当前选中的节点*/
  private getCurrentSelectedNode(actions: (actionDetail | action)[]): actionDetail | action {
    if (this.currentSelectedKeys.length < 1) {
      return null
    }
    for (let i = 0; i < actions.length; i++) {
      let act = actions[i]
      if (act.id == this.currentSelectedKeys[0]) {
        return act
      }
      let res = null
      if (this.nodeIsAction(act) == true) {
        res = this.getCurrentSelectedNode((act as action).actionDetails)
      }

      if (!res) {
        continue
      }
      return res
    }
    return null
  }
  /**根据currentSelectedKeys查找当前选中节点最近的 动作节点*/
  private getCurrentSelectedNearestAction(actions: (actionDetail | action)[]): action {
    if (this.currentSelectedKeys.length < 1) {
      return null
    }
    for (let i = 0; i < actions.length; i++) {
      let act = actions[i]
      if (act.id == this.currentSelectedKeys[0]) {
        return act as action
      }
      let res = null
      if (this.nodeIsAction(act) == true) {
        res = this.getCurrentSelectedNearestAction((act as action).actionDetails)
      }

      if (!res) {
        continue
      }
      if (this.nodeIsAction(res) == false) {
        return act as action
      }
      if (this.nodeIsAction(res) == true) {
        return res
      }
    }
    return null
  }

  /**计算树结构 */
  private cuteDataTree(actions: (actionDetail | action)[]): behaviorTreeNodeData[] {
    let res: behaviorTreeNodeData[] = []
    actions.filter((o) => {
      let data = new behaviorTreeNodeData()
      data.key = o.id
      data.title = o.name
      data.isAction = this.nodeIsAction(o)
      if (data.isAction == true) {
        data.children = this.cuteDataTree((o as action).actionDetails)
      }
      res.push(data)
    })
    return res
  }
  /**根据ID获取节点 */
  private getNodeDataById(id: string, actions: (actionDetail | action)[]): actionDetail | action {
    for (let i = 0; i < actions.length; i++) {
      let act = actions[i]
      if (act.id == id) {
        return act
      }
      let res = null
      if (this.nodeIsAction(act) == true) {
        res = this.getNodeDataById(id, (act as action).actionDetails)
      }

      if (!res) {
        continue
      }
      return res
    }
    return null
  }

  private onNodeKeyDown(e: any) {
    var keyCode = e.keyCode || e.which || e.charCode
    var ctrlKey = e.ctrlKey || e.metaKey
    if (keyCode == 67 && ctrlKey == true) {
      //ctrl+c
      e.preventDefault()
      this.copyActions()
    }
  }
  private copyActions() {
    $(this.copyBtn).trigger('click')
  }
  private pasteActions(e: ClipboardEvent) {
    let selectAct = this.getCurrentSelectedNode(this.currentSettingBehavior.actions)
    if (selectAct && (selectAct as any).isActionDetail) {
      return
    }
    try {
      let actionData = JSON.parse(e.clipboardData.getData('text'))
      if (this.nodeIsAction(actionData)) {
        this.addAction(actionData)
      } else {
        this.addActionDetail(actionData)
      }
      this.$message.success('粘贴行为成功', 2)
    } catch (error) {
      this.$message.success('粘贴行为失败', 2)
    }

    // window.console.log('pasteActions:', actionData)
  }

  // ************节点拖拽*******************************************************************************************************
  private dropTopOrBottom: string = null
  private cuteCurrentDragPosition(node: any) {
    if (node.dragOverGapBottom == true) {
      this.dropTopOrBottom = 'bottom'
    } else if (node.dragOverGapTop == true) {
      this.dropTopOrBottom = 'top'
    } else if (node.dragOverGapBottom == false && node.dragOverGapTop == false) {
      this.dropTopOrBottom = null
    }
  }
  /**节点拖放*/
  private onNodeDrop({ event, node, dragNode, dragNodesKeys }: any) {
    this.cuteCurrentDragPosition(node)
    //window.console.log('onNodeDragLeave:', this.dropTopOrBottom)
    let targetNode = this.getNodeDataById(node.dataRef.key, this.currentSettingBehavior.actions)
    let sourceNode = this.getNodeDataById(dragNode.dataRef.key, this.currentSettingBehavior.actions)
    //目标节点是动作明细，且当前拖拽到它的正中间
    if (this.nodeIsAction(targetNode) == false && this.dropTopOrBottom == null) {
      this.dropTopOrBottom = 'bottom'
    }
    if (this.dropTopOrBottom) {
      this.dropBrotherNode(sourceNode, targetNode, this.dropTopOrBottom)
    } else if (this.nodeIsAction(targetNode) == true && this.dropTopOrBottom == null) {
      this.dropChildrenNode(sourceNode, targetNode as action)
    }
  }
  /**topOrBottom:top|bottom */
  private dropBrotherNode(sourceNode: actionDetail | action, targetNode: actionDetail | action, topOrBottom: string) {
    let parentNode = this.getNodeParent(targetNode, this.currentSettingBehavior.actions)
    let indexadder = topOrBottom == 'bottom' ? 1 : 0

    if (parentNode) {
      let index = parentNode.actionDetails.indexOf(targetNode) + indexadder
      parentNode.actionDetails.splice(index, 0, deepClone(sourceNode))
      this.deleteNode(sourceNode)
    } else if (this.nodeIsAction(sourceNode) == true) {
      let index = this.currentSettingBehavior.actions.indexOf(targetNode as action) + indexadder
      this.currentSettingBehavior.actions.splice(index, 0, deepClone(sourceNode))
      this.deleteNode(sourceNode)
    } else if (this.nodeIsAction(sourceNode) == false) {
      this.$message.warn('动作细节不能作为最顶级节点')
    }
  }

  private dropChildrenNode(sourceNode: actionDetail | action, targetNode: action) {
    targetNode.actionDetails.push(deepClone(sourceNode))
    this.deleteNode(sourceNode)
  }
  // ************动作条件设计*******************************************************************************************************

  private actionSettingVisible: boolean = false
  private currentSettingAction: action = null
  private settingAction(key: string) {
    let findAction = this.getNodeDataById(key, this.currentSettingBehavior.actions)
    window.console.log('开始编辑action条件', findAction)
    this.currentSettingAction = findAction as action
    this.actionSettingVisible = true
  }
}
</script>



<style scoped lang="less">
.ant-tree-switcher {
  z-index: 5 !important;
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
  background-color: #18aeb7;
}

.ant-tree-node-selected .pageListItem {
  background-color: #18aeb7 !important;
}

.ant-tree-node-selected .pageFontHover {
  color: #ffffff !important;
}
</style>