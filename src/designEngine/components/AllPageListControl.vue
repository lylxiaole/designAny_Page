<template>
  <div style="padding: 10px 0px; position: relative">
    <a-row style="height: 80px; width: 100%; position: absolute" :style="{ borderBottom: '1px #DFDFDF solid' }">
      <a-row style="margin: 3px 15px">
        <a-input-search size="small" style="margin-bottom: 8px; height: 30px" placeholder="搜索" v-model="seachVal" />
      </a-row>
      <a-row style="margin: 3px 15px">
        <a-col :span="24" class="flexHorilanLayout">
          <a-button icon="plus" tabindex="-1" :style="{ width: '100%' }" size="small" @click="addNewProPage">
            <span style="margin-left: 4px">新建专业页面</span>
          </a-button>
        </a-col>
        <a-col :span="0"></a-col>
      </a-row>
    </a-row>
    <a-row style="overflow: hidden; width: 100%; position: absolute; top: 90px; bottom: 0px">
      <div style="overflow: auto; width: 100%; height: 100%; padding-bottom: 90px" @contextmenu.prevent="onTreeNodeRightClick">
        <a-tree size="small" style="height: 100%; width: 100%; margin-left: 18px" :treeData="dataListForShow" @select="onSelect"
          :selectedKeys.sync="selectedKeys" draggable defaultExpandAll :multiple="false" @rightClick="onTreeNodeRightClick" @expand="onTreeExpand"
          @drop="onNodeDrop">
          <div slot="group" slot-scope="{ key, title, iconMenuUrl }" style="position: relative; justify-content: left"
            class="flexHorilanLayout pageFontHover">
            <span class="pageListItem" style="height: 26px; position: absolute; left: -300px; right: -200px"></span>
            <span v-if="iconMenuUrl == null" style="z-index: 1" class="icon iconfont">&#xe626;</span>
            <img v-if="iconMenuUrl != null" style="height: 18px; width: 18px" v-lazy="iconMenuUrl" referrer="no-referrer|origin|unsafe-url" />
            <btreeNode :value="title" style="margin-left: 3px; z-index: 1; min-width: 80px; min-height: 20px" :nodeKey="key"
              @onValueChanged="onNodeNameChanged" @onSureNodeName="onSureNodeName"></btreeNode>
          </div>
          <div slot="pro" slot-scope="{ key, title }" style="position: relative; justify-content: left" class="flexHorilanLayout pageFontHover">
            <span class="pageListItem" style="height: 26px; position: absolute; left: -300px; right: -200px"></span>
            <span style="z-index: 1" class="icon iconfont">&#xe625;</span>
            <btreeNode :value="title" style="margin-left: 3px; z-index: 1; min-width: 80px; min-height: 20px" :nodeKey="key"
              @onValueChanged="onNodeNameChanged" @onSureNodeName="onSureNodeName"></btreeNode>
          </div>
          <div slot="grid" slot-scope="{ key, title }" style="position: relative; justify-content: left" class="flexHorilanLayout pageFontHover">
            <span class="pageListItem" style="height: 26px; position: absolute; left: -300px; right: -200px"></span>
            <span style="z-index: 1" class="icon iconfont">&#xe62a;</span>
            <btreeNode :value="title" style="margin-left: 3px; z-index: 1; min-width: 80px; min-height: 20px" :nodeKey="key"
              @onValueChanged="onNodeNameChanged" @onSureNodeName="onSureNodeName"></btreeNode>
          </div>
        </a-tree>

<v-contextmenu ref="contextmenu">
  <v-contextmenu-item  v-for="(menu, index) in rightMenus" :key="index" class="themeHover pageListItem" style="padding-left: 5px"
            @click="onRightMenuChoose(menu)">
             <span v-if="menu == '新增专业布局页面'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '新增分组'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe626;</span>
            <span v-if="menu == '新增菜单'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe626;</span>
            <span v-if="menu == '选择页面'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '编辑'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '另存为'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe61a;</span>
            <span v-if="menu == '重命名'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe628;</span>
            <span v-if="menu == '还原默认'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '隐藏'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '显示'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '设置图标'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
            <span v-if="menu == '删除'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe62b;</span>
            <span v-if="menu == '导入'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe619;</span>
            <span v-if="menu == '导出'" style="font-size: 14px; color: rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe618;</span>
            <span style="maegin-left: 3px">&nbsp;&nbsp;{{ menu }}</span>
        </v-contextmenu-item> 
</v-contextmenu>

     
      </div>
    </a-row>
    <!-- ************************页面另存为*********************************** -->
    <geno-modal :maskClosable="false" title="另存为" :destroyOnClose="true" v-model="renameWindowVisible" :width="400" @ok="onRenameOk"
      @cancel="onRenameCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: { icon: 'check' } }"
      :cancelButtonProps="{ props: { icon: 'close' } }">
      <a-row>
        <a-col :span="5">
          <span>新名称:</span>
        </a-col>
        <a-col :span="19">
          <a-input v-model="renameNewName" />
        </a-col>
      </a-row>
    </geno-modal>

    <geno-modal :maskClosable="false" title="资源列表" :destroyOnClose="true" v-model="pageResourceWindowVisible" :width="400" :height="500"
      @ok="onSelectPageOk" @cancel="onSelectPageCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: { icon: 'check' } }"
      :cancelButtonProps="{ props: { icon: 'close' } }">
      <a-row>
        <a-tree size="small" style="height: 100%; width: 100%; margin-left: 18px; max-height: 500px" :treeData="pageSourceTree" defaultExpandAll
          :multiple="false" @select="onSelectPage"></a-tree>
      </a-row>
    </geno-modal>

    <input ref="fileuploadcomp" type="file" value="请选择文件" style="display: none" @change="onSelectFileChanged" />

    <div style="display: none">
      <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" accept=".jpg, .jpeg, .png">
        <a-button id="uploadMenuIcon">
          <a-icon type="upload" />
          上传图标
        </a-button>
      </a-upload>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { CurrentApis, CurrentContext, pagenNodeType, APIRequestClass, PageOrderClass } from '../01designerContext'
import { getUuid, deepClone, serialize } from '@src/utils'

import fileUpload from '../02common/uploadFile/fileUpload'
 import btreeNode from '../06propertyGrid/behaviorControl/behaviorTree/bTreeNode.vue'
import { behavior, factory, action, actionDetail, resourceType, objectType, object_Method, object_callback, objectBase } from '../02common/behavior'
 
import PageBase from '../05designerLayouts/PageBase'
import Layout_Professional from '../05designerLayouts/layout_Professional/Layout_Professional.vue'
import { modelAnalysis, functionCache, dictCache, modelMapperCache, pageCache, pageContentTable } from '../02common/impResourcesCache'

enum rightMenus {
  addGridPage = '新增栅栏布局页面',
  addProPage = '新增专业布局页面',
  addGroup = '新增分组',
  addMenu = '新增菜单',
  choosePage = '选择页面',
  saveAs = '另存为',
  rename = '重命名',
  revert = '还原默认',
  hide = '隐藏',
  show = '显示',
  edit = '编辑',
  setMenuIcon = '设置图标',
  delete = '删除',
  leadOut = '导出',
  leadIn = '导入'
}

class treeNodeData {
  key: string
  title: string
  nodeType: pagenNodeType //group|pro|grid
  children: treeNodeData[] = []
  isNeedSave: boolean = false
  isSystem: boolean
  iconMenuUrl: string

  class: string = '' //样式class
  get scopedSlots(): any {
    if (this.nodeType == pagenNodeType.group) {
      return { title: 'group' }
    } else if (this.nodeType == pagenNodeType.pro) {
      return { title: 'pro' }
    } else {
      return { title: 'grid' }
    }
  }
  get isLeaf(): boolean {
    if (this.nodeType == pagenNodeType.group) {
      return false
    } else {
      return true
    }
  }

  style: string = ''
}

@Options({
  components: {
     btreeNode: btreeNode
  }
})
export default class PageListControl extends Vue {
  private pageResourceWindowVisible: boolean = false
  private activeKey: string = '2'

  private dataList: treeNodeData[] = []
  private seachVal: string = ''

  private fileList: any[] = []
  private fileUploadClass: fileUpload = null

  get dataListForShow(): treeNodeData[] {
    if (this.seachVal == '' || !this.seachVal) {
      return this.dataList
    }
    var x = this.search(this.seachVal, deepClone(this.dataList))
    return x
  }

  private selectedKeys: string[] = []
  private rightMenus: string[] = []
  /**重写组件的render行为 */
  private oldrender: Function = null
  private newrender(createElement: any, hack: any): any {
    this.$nextTick(() => {
      this.renderDom(this.$el)
    })
    return this.oldrender(createElement, hack)
  }

  mounted() {
    // window.console.log('页面列表加载')
    this.oldrender = this.$options.render
    this.$options.render = this.newrender
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    var loading = common.showLoading_Async()
    CurrentApis.GetAllTreeList()
      .then((res) => {
        this.dataList = this.pageNodeToTreeNode(res as any[])
      })
      .catch((error) => {
        this.$message.error(error)
      })
      .finally(() => {
        common.closeLoading_Async(loading)
      })
  }
  /*********样式重绘********************************************************************* */
  private renderDom(dom: Element) {
    $(this.$el).find('.ant-tree-switcher').css('z-index', 5)
  }
  // ***************树节点数据********************************************************************
  private searchNodes(title: string, tree: treeNodeData[]): treeNodeData[] {
    var res = tree.filter((o) => o.title.toUpperCase().indexOf(title ? title.toUpperCase() : '') > -1 && o.nodeType != pagenNodeType.group)
    tree.filter((o) => {
      var childrenNodes = this.searchNodes(title, o.children)
      childrenNodes.filter((p) => {
        res.push(p)
      })
    })
    return res
  }

  /**新增树查询 */
  private search(paramSearch: any, tree: treeNodeData[]) {
    if (paramSearch !== '') {
      let res = tree.filter((o) => o.title.toUpperCase().indexOf(paramSearch ? paramSearch.toUpperCase() : '') > -1)
      tree.filter((o) => {
        if (o.children) {
          let childrenNodes = this.onSearChildren(paramSearch, o.children)
          o.children = []
          childrenNodes.filter((p) => {
            let exist = false
            res.forEach((element) => {
              let temp = element.children.find((item) => item.key === p.key)
              if (temp) {
                exist = true
              }
            })
            if (!exist) {
              o.children.push(p)
              let aaa = res.find((single) => single.key === o.key)
              if (aaa) {
                aaa = o
              } else {
                res.push(o)
              }
            }
          })
        }
      })
      return res
    } else {
      return tree
    }
    //this.inputValue = paramSearch
  }

  private onSearChildren(title: any, tree: any) {
    //window.console.log('开始筛选')
    let res = tree.filter((o) => o.title.toUpperCase().indexOf(title ? title.toUpperCase() : '') > -1)
    tree.filter((o) => {
      if (o.children) {
        let childrenNodes = this.onSearChildren(title, o.children)
        o.children = []
        childrenNodes.filter((p) => {
          let exist = false
          res.forEach((element) => {
            let temp = element.children.find((item) => item.key === p.key)
            if (temp) {
              exist = true
            }
          })
          if (!exist) {
            o.children.push(p)
            res.push(o)
          }
        })
      }
    })
    return res
  }

  private searchNodeByKey(key: string, tree: treeNodeData[]): treeNodeData {
    for (let index = 0; index < tree.length; index++) {
      const treenode = tree[index]
      if (treenode.key == key) {
        return treenode
      }
      var find = this.searchNodeByKey(key, treenode.children)
      if (find) {
        return find
      }
    }
    return null
  }
  /**把后端数据转换成tree的数据源数据 */
  private pageNodeToTreeNode(nodes: any[]): treeNodeData[] {
    var treeNodes: treeNodeData[] = []
    nodes.filter((n) => {
      var treenode = new treeNodeData()
      treenode.key = n.id
      treenode.title = n.text
      treenode.nodeType = !n.obj.pageType ? pagenNodeType.group : n.obj.pageType
      treenode.isNeedSave = false
      treenode.isSystem = n.obj.isSystem
      treenode.iconMenuUrl = n.obj.iconUrl == null ? null : CurrentContext.FileServerAddress + n.obj.iconUrl
      treenode.children = []
      if (n.children) {
        treenode.children = this.pageNodeToTreeNode(n.children)
      }
      treeNodes.push(treenode)
    })
    return treeNodes
  }
  private insertTreeNode(nodeKey: string, type: pagenNodeType, name: string, parentId?: string) {
    var newnode = new treeNodeData()
    newnode.key = nodeKey
    newnode.title = name
    newnode.nodeType = type
    newnode.isNeedSave = false
    newnode.isSystem = false
    if (parentId) {
      var findNode = this.searchNodeByKey(parentId, this.dataList)
      findNode.children.push(newnode)
    } else {
      this.dataList.push(newnode)
    }
    this.refreshListOrderIndex(parentId)
  }
  private onTreeExpand(expandedKeys: string[], { expanded: bool, node }: any) {
    this.$nextTick(() => {
      this.renderDom(this.$el)
    })
  }
  // ***************快捷按钮********************************************************************
  public addNewProPage() {
    let node: treeNodeData = this.searchNodeByKey(this.selectedKeys[0], this.dataList)
    if (node.nodeType != pagenNodeType.group) {
      this.$info({ title: '提示', content: '只能在分组下添加页面' })
      return
    }
    this.addTreeNode(pagenNodeType.pro, '新建专业页面', this.selectedKeys[0])
  }
  // ***************树节点操作********************************************************************
  public onSelect(keys: any, e: any) {
    if (!e.selectedNodes[0]) {
      return
    }
    var finddata = this.searchNodeByKey(keys[0], this.dataList)
    if (finddata.nodeType == pagenNodeType.group) {
      return
    }
    //window.console.log(123123)
    //this.onOpenCommonPage(keys[0], finddata.title, finddata.nodeType)
  }

  public addTreeNode(type: pagenNodeType, name: string, parentId?: string) {
    var newId = CurrentApis.GetServerUUID()
    if (type == pagenNodeType.pro) {
      this.addNewPage(newId, type, name, parentId)
    } else {
      CurrentApis.AddGroup(newId, name, parentId)
        .then((res) => {
          this.insertTreeNode(newId, type, name, parentId)
        })
        .catch((error) => {
          this.$message.error(error)
        })
    }
  }

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
  private onNodeDrop({ event, node, dragNode, dragNodesKeys }: any) {
    this.cuteCurrentDragPosition(node)
    // window.console.log('onNodeDragLeave:', this.dropTopOrBottom)
    var targetNode = this.searchNodeByKey(node.dataRef.key, this.dataList)
    var sourceNode = this.searchNodeByKey(dragNode.dataRef.key, this.dataList)
    //拖拽的节点是分组，目标节点不是分组
    if (targetNode.nodeType != pagenNodeType.group && this.dropTopOrBottom == null) {
      this.$message.warning('该节点下不能添加节点', 3)
      return
    }
    this.dropChildrenNode(sourceNode, targetNode)
  }
  private dropChildrenNode(sourceNode: treeNodeData, targetNode: treeNodeData) {
    var targetList = []
    var findParent = null
    var index = 0
    // window.console.log('drop 树节点')
    if (this.dropTopOrBottom == null) {
      findParent = targetNode
      index = 0
      targetList = targetNode.children
    } else {
      findParent = this.getNodeParent(targetNode, this.dataList)
      if (!findParent) {
        targetList = this.dataList
      } else {
        targetList = findParent.children
      }
    }

    var parentId = findParent == null ? null : findParent.key
    var promiseres: Promise<any> = null
    if (sourceNode.nodeType == pagenNodeType.group) {
      promiseres = CurrentApis.UpdateGroup(sourceNode.key, sourceNode.title, sourceNode.nodeType, parentId)
    } else {
      promiseres = CurrentApis.UpdatePage(sourceNode.key, sourceNode.title, parentId)
    }

    promiseres.then(() => {
      this.deleteNode(sourceNode)
      index = targetList.indexOf(targetNode)
      if (this.dropTopOrBottom == 'bottom') {
        targetList.splice(index + 1, 0, sourceNode)
      } else {
        targetList.splice(index, 0, sourceNode)
      }
      this.refreshListOrderIndex(parentId)
    })
  }
  private deleteNode(selectAct: treeNodeData) {
    if (!selectAct) {
      return
    }
    var parentNode = this.getNodeParent(selectAct, this.dataList)
    if (!parentNode) {
      let index = this.dataList.indexOf(selectAct as any)
      this.dataList.splice(index, 1)
    } else {
      let index = parentNode.children.indexOf(selectAct as any)
      parentNode.children.splice(index, 1)
    }
    //
    if (selectAct.nodeType == pagenNodeType.group) {
      this.notifiledClosePage(selectAct)
    } else {
      this.onClosePage(selectAct.key)
    }
  }

  private notifiledClosePage(groupNode: treeNodeData) {
    groupNode.children.filter((c) => {
      if (c.nodeType == pagenNodeType.group) {
        this.notifiledClosePage(c)
      } else {
        this.onClosePage(c.key)
      }
    })
  }
  /**获取父级节点 */
  private getNodeParent(node: treeNodeData, parents: treeNodeData[]): treeNodeData {
    for (var n in parents) {
      var parent = parents[n] as treeNodeData
      if (parent.children.indexOf(node) > -1) {
        return parent
      }

      var find = this.getNodeParent(node, parent.children)
      if (find) {
        return find
      }
    }
    return null
  }
  /**当节点名称改变后 */
  private onNodeNameChanged(nodeKey: string, newtitle: string) {
    let findnode = this.searchNodeByKey(nodeKey, this.dataList)
    if (!findnode) {
      return
    }
    findnode.title = newtitle
  }
  /**当确定节点的新名称 */
  private onSureNodeName(nodeKey: string, newtitle: string) {
    // window.console.log('确认名称')
    let findnode = this.searchNodeByKey(nodeKey, this.dataList)
    if (!findnode) {
      return
    }

    //
    let parentNodeId = null
    var parentNode = this.getNodeParent(findnode, this.dataList)
    if (parentNode) {
      parentNodeId = parentNode.key
    }
    // window.console.log('节点重命名')
    if (findnode.nodeType == pagenNodeType.group) {
      CurrentApis.UpdateGroup(findnode.key, newtitle, findnode.nodeType, parentNodeId).then((res) => {
        findnode.title = newtitle
      })
    } else {
      CurrentApis.UpdatePage(findnode.key, newtitle, parentNodeId).then((res) => {
        findnode.title = newtitle
        this.onNameChanged(findnode.key, newtitle)
      })
    }
  }
  /**添加一个新页面 */
  private async addNewPage(newId: string, type: pagenNodeType, name: string, parentId?: string) {
    try {
      var res = await CurrentApis.AddPage(newId, name, type, parentId)
      //添加页面之后同时添加一条页面查看权限记录
      let param = {
        data: [
          {
            code: 'id',
            value: CurrentApis.GetServerUUID()
          },
          {
            code: 'page_id',
            value: newId
          },
          //跟后端确认，不需要保存groupId 2020-03-05 modify
          // {
          //   code: 'group_id',
          //   value: parentId,
          // },
          {
            code: 'permission_id',
            value: '444'
          },
          {
            code: 'is_deleted',
            value: 0
          }
        ],
        modelCode: 'app_page_permission'
      }
      await CurrentApis.SimpleAdd(param)
      this.insertTreeNode(newId, type, name, parentId)
    } catch (error) {
      this.$message.error(error)
    }
  }

  private async refreshListOrderIndex(parentId?: string) {
    var refreshList: treeNodeData[] = []
    if (parentId) {
      var findNode = this.searchNodeByKey(parentId, this.dataList)
      refreshList = findNode.children
    } else {
      refreshList = this.dataList
    }
    var refreshData: PageOrderClass[] = []
    var index = 0
    refreshList.forEach((o) => {
      let data = new PageOrderClass()
      data.id = o.key
      data.orderIndex = ++index
      data.type = o.nodeType == pagenNodeType.group ? 1 : 0
      refreshData.push(data)
    })
    CurrentApis.RefreshPageIndex(refreshData)
  }

  // ***************页面另存为********************************************************************
  private renameWindowVisible: boolean = false
  private renameNewName: string = ''
  private async onRenameOk() {
    // window.console.log('ppap')
    if (!this.renameNewName || this.renameNewName == '') {
      message.warning('页面名称不能为空!')
      return
    } else {
      this.renameWindowVisible = false
      var newId = CurrentApis.GetServerUUID()
      var parentNode = this.getNodeParent(this.currentRightNode, this.dataList)

      if (parentNode) {
        await this.addNewPage(newId, this.currentRightNode.nodeType, this.renameNewName, parentNode.key)
      } else {
        await this.addNewPage(newId, this.currentRightNode.nodeType, this.renameNewName)
      }
      //window.console.log('页面另存为')
      /**获取旧页面数据 */
      let newpage = new PageBase()
      let pagecontent = await pageCache.getPageData(this.currentRightNode.key)
      let pagedataStr = common.serialize(pagecontent.content)
      /**替换原页面中的所有pageId */
      pagedataStr = pagedataStr.replace(new RegExp(this.currentRightNode.key, 'gm'), newId)
      // window.console.log('原页面Id', this.currentRightNode.key)
      // window.console.log('修改后的页面数据', pagedataStr)
      pagedataStr = common.strZip(pagedataStr)
      // window.console.log('压缩后的页面数据', pagedataStr)
      await CurrentApis.SavePageData(newId, pagedataStr, newpage.resourceObj)
    }
  }

  private updatePageOldData_whileCopy(page: PageBase, oldPageId: string) {
    /**处理行为列表种缓存的页面Id */
    var newbehaviors: behavior[] = []
    page.behaviors.forEach((behav) => {
      this.dealOldBehaviorBehavior(behav.actions, page.Id, oldPageId)
      newbehaviors.push(behav)
    })
    page.behaviors = newbehaviors
  }

  private dealOldBehaviorBehavior(acts: (action | actionDetail)[], newPageId: string, oldOageId: string) {
    acts.forEach((actd) => {
      if ((actd as actionDetail).isActionDetail) {
        let actiondet = actd as actionDetail
        actiondet.objs.forEach((obj) => {
          if (obj.pageId == oldOageId) {
            obj.pageId = newPageId
          }
          if ((obj as object_Method).inputParams) {
            ;(obj as object_Method).inputParams.forEach((inp) => {
              if (inp.obj.pageId == oldOageId) {
                inp.obj.pageId = newPageId
              }
            })
          }
        })
      } else {
        let action = actd as action
        if (action.judgingCondition) {
          action.judgingCondition.forEach((judg) => {
            if (judg.pageId == oldOageId) {
              judg.pageId = newPageId
            }
          })
        }
        this.dealOldBehaviorBehavior((actd as action).actionDetails, newPageId, oldOageId)
      }
    })
  }

  private onRenameCancel() {
    this.renameWindowVisible = false
  }
  private pageSaveAs(pageId: string) {
    this.renameWindowVisible = true
  }
  // ***************右键菜单操作********************************************************************
  private currentRightNode: treeNodeData
  public makeRightMenus(node: treeNodeData) {
    this.rightMenus = []

    if (!node) {
      this.rightMenus.push(rightMenus.addProPage)
      this.rightMenus.push(rightMenus.addGroup)
      return
    }
    if (node.nodeType == pagenNodeType.group && node.isSystem == false) {
      this.rightMenus.push(rightMenus.addProPage)
      this.rightMenus.push(rightMenus.addGroup)
      this.rightMenus.push(rightMenus.setMenuIcon)
      this.rightMenus.push(rightMenus.leadIn)
    }
    if (node.nodeType == pagenNodeType.pro) {
      this.rightMenus.push(rightMenus.edit)
      this.rightMenus.push(rightMenus.saveAs)
      this.rightMenus.push(rightMenus.leadOut)
      let pageId = node.key
    }
    if (node.isSystem == false) {
      this.rightMenus.push(rightMenus.delete)
    } else {
      this.rightMenus.push(rightMenus.revert)
    }
  }

  public makeCurrentAppRightMenus(node: treeNodeData) {
    this.rightMenus = []
    if (!node) {
      this.rightMenus.push(rightMenus.addMenu)
      return
    }
    if (node.nodeType == pagenNodeType.group && node.isSystem == false) {
      this.rightMenus.push(rightMenus.choosePage)
      this.rightMenus.push(rightMenus.addMenu)
      this.rightMenus.push(rightMenus.setMenuIcon)
      this.rightMenus.push(rightMenus.leadIn)
      let groupId = node.key
      CurrentApis.GetGroup(groupId).then((res: any) => {
        if (res.isShow !== true) {
          this.rightMenus.push(rightMenus.show)
        } else {
          this.rightMenus.push(rightMenus.hide)
        }
      })
    }
    if (node.nodeType == pagenNodeType.pro) {
      this.rightMenus.push(rightMenus.saveAs)
      this.rightMenus.push(rightMenus.leadOut)
      let pageId = node.key
      CurrentApis.GetPage(pageId).then((res: any) => {
        if (res.isShow !== true) {
          this.rightMenus.push(rightMenus.show)
        } else {
          this.rightMenus.push(rightMenus.hide)
        }
      })
    }
    if (node.isSystem == false) {
      this.rightMenus.push(rightMenus.delete)
    } else {
      this.rightMenus.push(rightMenus.revert)
    }
  }

  public onTreeNodeRightClick(e: any) {
    if (e.node) {
      ;(e.event as Event).stopPropagation()
      ;(e.event as Event).preventDefault()
    } else {
      ;(e as Event).stopPropagation()
      ;(e as Event).preventDefault()
    }
    // window.console.log('右击了')
    this.currentRightNode = null
    if (e.node) {
      this.currentRightNode = e.node.dataRef as treeNodeData
    }
    ;(this.$refs.ctxMenu as any).open()
    if (this.activeKey === '1') {
      this.makeCurrentAppRightMenus(this.currentRightNode)
    } else {
      this.makeRightMenus(this.currentRightNode)
    }
  }
  public async onRightMenuChoose(menuName: string) {
    // window.console.log(menuName)
    switch (menuName) {
      case rightMenus.addProPage:
        this.addTreeNode(pagenNodeType.pro, '新建专业页面', this.currentRightNode ? this.currentRightNode.key : null)
        break
      case rightMenus.addGroup:
        this.addTreeNode(pagenNodeType.group, '新建分组', this.currentRightNode ? this.currentRightNode.key : null)
        break
      case rightMenus.delete:
        this.$confirm({
          title: '谨慎操作',
          content: '删除后数据不能恢复,确定要删除吗?',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            let param = {
              filter: [
                {
                  code: 'id',
                  type: 'EQ',
                  value: this.currentRightNode.key
                }
              ],
              modelCode: 'app_page'
            }
            if (this.currentRightNode.nodeType == pagenNodeType.group) {
              param = {
                filter: [
                  {
                    code: 'id',
                    type: 'EQ',
                    value: this.currentRightNode.key
                  }
                ],
                modelCode: 'app_page_group'
              }
            }
            let pageId = this.currentRightNode.key
            CurrentApis.SimpleDelete(param).then(() => {
              //删除关联的菜单
              let tempparam = {
                filter: [
                  {
                    code: 'page_id',
                    type: 'EQ',
                    value: pageId
                  }
                ],
                modelCode: 'sys_app_user_menu'
              }
              CurrentApis.SimpleDelete(tempparam).then(() => {
                this.deleteNode(this.currentRightNode)
              })
            })
          },
          onCancel() {}
        })
        break
      case rightMenus.saveAs:
        this.pageSaveAs(this.currentRightNode.key)
        break
      case rightMenus.rename:
        {
          // this.currentRightNode.isEdit = true
        }
        break
      case rightMenus.revert:
        {
          let pageId = this.currentRightNode.key
          CurrentApis.RestorPage(pageId).then((res) => {
            this.RestorPage(pageId)
          })
        }
        break
      case rightMenus.hide: {
        let pageId = this.currentRightNode.key
        let isShow = false
        if (this.currentRightNode.nodeType == pagenNodeType.group) {
          CurrentApis.UpdateGroupShow(pageId, isShow).then((res) => {})
        } else {
          CurrentApis.UpdateIsShow(pageId, isShow).then((res) => {})
        }
        break
      }
      case rightMenus.show: {
        let pageId = this.currentRightNode.key
        let isShow = true
        if (this.currentRightNode.nodeType == pagenNodeType.group) {
          CurrentApis.UpdateGroupShow(pageId, isShow).then((res) => {})
        } else {
          CurrentApis.UpdateIsShow(pageId, isShow).then((res) => {})
        }
        break
      }
      case rightMenus.setMenuIcon: {
        //console.log('setMenuIcon: ')
        //设置菜单图标
        $('#uploadMenuIcon').click()
        break
      }
      case rightMenus.addMenu:
        this.addNewMenu('新建菜单', this.currentRightNode ? this.currentRightNode.key : null)
        break
      case rightMenus.choosePage:
        var loading = common.showLoading_Async()
        CurrentApis.GetAllTreeList()
          .then((res) => {
            this.pageSourceTree = this.pageNodeToTreeNode(res as any[])
            this.pageResourceWindowVisible = true
          })
          .catch((error) => {
            this.$message.error(error)
          })
          .finally(() => {
            common.closeLoading_Async(loading)
          })
        break
      case rightMenus.edit:
        var finddata = this.searchNodeByKey(this.currentRightNode.key, this.dataList)
        if (finddata.nodeType == pagenNodeType.group) {
          return
        }
        this.onOpenCommonPage(this.currentRightNode.key, finddata.title, finddata.nodeType)
        break
      case rightMenus.leadIn:
        await this.leadinPage()
        break
      case rightMenus.leadOut:
        await this.leadoutPage()
        break
      default:
        break
    }
  }

  private async leadoutPage() {
    let popupindex = common.showLoading_Async()
    let pageId = this.currentRightNode.key
    let pageb = new PageBase()
    try {
      let saveData = await pageb.Load(pageId, null, true, true)
      pageb.recordResources(saveData)

      let reqdata: any = {
        localStorageIds: pageb.resourceObj.localStorageIds,
        modelInfoIds: pageb.resourceObj.modelIds,
        modelMapperCodes: pageb.resourceObj.mapperCodes,
        pageId: pageId,
        sysCustomFunctionCodes: pageb.resourceObj.funcCodes,
        sysDictIds: pageb.resourceObj.dictIds,
        sysFileIds: pageb.resourceObj.fileTempIds,
        workflowIds: pageb.resourceObj.workFlowIds
      }
      let res = (await CurrentApis.LeadOutPage(reqdata)) as any
      let fileurl = BuildingFileUrlForShow(CurrentContext.FileServerAddress, res.relativePath)
      window.open(fileurl)
      window.console.log('leadoutPage:', pageb.resourceObj)
    } finally {
      pageb.$destroy()
      common.closeLoading_Async(popupindex)
    }
  }
  private async leadinPage() {
    let fileuploadcomp = this.$refs.fileuploadcomp as any
    $(fileuploadcomp).trigger('click')
  }

  private async onSelectFileChanged(e: any) {
    try {
      let groupId: string = null
      if (this.currentRightNode) {
        groupId = this.currentRightNode.key
      }
      // let data: any = { jsonFile: e.target.files[0] }
      var form = new FormData()
      form.append('jsonFile', e.target.files[0]) //第一
      form.append('parentMenuId', groupId)
      let res = (await CurrentApis.LeadInPage(form, groupId)) as any
      this.insertTreeNode(res.pageId, pagenNodeType.pro, res.pageName, groupId)
      ////////////////导入报告////
      let resultFileInfo = res.resultFileInfo
      //////////////
      let fileuploadcomp = this.$refs.fileuploadcomp as any
      $(fileuploadcomp).val('')
      this.$message.success('页面导入成功', 2)
    } catch (error) {
      this.$message.success('页面导入失败,请联系管理员!', 2)
    }
  }

  /*********************** start 设置菜单图标 start*****************/
  handleRemove(file) {
    const index = this.fileList.indexOf(file)
    const newFileList = this.fileList.slice()
    newFileList.splice(index, 1)
    this.fileList = newFileList
  }
  beforeUpload(file) {
    this.fileList = []
    this.fileList.push(file)
    this.fileUploadClass.startUpload(file, CurrentContext.GetUserToken())
    this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    this.fileUploadClass.onUploadError = this.onUploadError
  }
  onUploadError(error: any) {
    this.$message.error(error + `上传失败.`)
  }
  onUploadSuccess(relativePath: string, fileName: string) {
    let pageId = this.currentRightNode.key
    // 更新当前 pageId 的 icon_url
    CurrentApis.UpdateGroupIconUrl(pageId, relativePath).then((res) => {
      CurrentApis.GetAllTreeList()
        .then((res) => {
          this.dataList = this.pageNodeToTreeNode(res as any[])
        })
        .catch((error) => {
          this.$message.error(error)
        })
    })
  }
  /*********************** end 设置菜单图标 end*****************/

  // ***************外部调用********************************************************************
  public unselectNode(nodeKey: string) {
    var snode = this.searchNodeByKey(nodeKey, this.dataList)
    if (!snode) {
      return
    }

    if (snode.key == this.selectedKeys[0]) {
      this.selectedKeys = []
    }
  }

  @Emit('onOpenCommonPage')
  public onOpenCommonPage(pageId: string, pageName: string, pageType: pagenNodeType) {}
  @Emit('RestorPage')
  public RestorPage(pageId: string) {}
  @Emit('onClosePage')
  public onClosePage(pageId: string) {}
  @Emit('onNameChanged')
  public onNameChanged(pageId: string, newname: string) {}

  private changeActivekey(param: any) {
    //this.activeKey = param
    //window.console.log('----------切换tab页参数', param)
    if (param.target.value === '2') {
      var loading = common.showLoading_Async()
      CurrentApis.GetAllTreeList()
        .then((res) => {
          this.dataList = this.pageNodeToTreeNode(res as any[])
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          common.closeLoading_Async(loading)
        })
    } else {
      this.dataList = []
    }
  }

  private pageSourceTree: treeNodeData[] = []
  private addNewMenu(name: string, parentId?: string) {
    var newId = CurrentApis.GetServerUUID()
    let param = {
      data: [
        {
          code: 'id',
          value: newId
        },
        {
          code: 'app_id',
          value: newId
        },
        {
          code: 'order_index',
          value: 0
        },
        {
          code: 'is_show',
          value: 1
        },
        {
          code: 'user_id',
          value: 0
        },
        {
          code: 'is_deleted',
          value: 0
        }
      ],
      modelCode: 'sys_app_user_menu'
    }
    //this.insertTreeNode(newId, pagenNodeType.group, name, parentId)
    CurrentApis.SimpleAdd(param)
      .then((res) => {
        this.insertTreeNode(newId, pagenNodeType.group, name, parentId)
      })
      .catch((error) => {
        this.$message.error(error)
      })
  }

  private selectMenu: any
  private onSelectPageOk() {
    if (!this.selectedPage) {
      this.$message.info('请选择页面！')
      return
    }
    if (this.selectedPage.children && this.selectedPage.children.length > 0) {
      this.$message.info('只能选择页面！')
      return
    }
    this.pageResourceWindowVisible = false
    var newId = CurrentApis.GetServerUUID()
    this.insertTreeNode(newId, pagenNodeType.pro, this.selectedPage.title, this.currentRightNode.key)
  }

  private onSelectPageCancel() {
    this.pageResourceWindowVisible = false
  }

  private selectedPage: any
  private onSelectPage(selectedKeys: any, e: { selected: boolean; selectedNodes: any; node: any; event: any }) {
    this.selectedPage = deepClone(e.node.dataRef)
    //window.console.log('---------------------选择了页面', e.node.dataRef)
  }
}
</script>

<style scoped lang="less">
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
  background-color: @themeBackground;
}

.ant-tree-node-selected .pageListItem {
  background-color: @themeBackground!important;
}

.ant-tree-node-selected .pageFontHover {
  color: #ffffff !important;
}
</style>
