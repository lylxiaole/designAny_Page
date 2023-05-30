/* eslint-disable vue/no-parsing-error */
<template>
  <div class="gad-plc">
    <a-row style="height: 50px; width: 100%; position: absolute;border-bottom: 1px solid rgb(223, 223, 223);">
      <a-row style="margin: 3px 15px">
        <a-input-search size="small" style="margin-bottom: 8px; height: 30px" placeholder="搜索" v-model="seachVal" />
      </a-row>
    </a-row>
    <a-row style="overflow: hidden; width: 100%; position: absolute; top: 70px; bottom: 0px">
      <div style="overflow: auto; width: 100%; height: 100%; padding-bottom: 90px" @contextmenu.prevent="onTreeNodeRightClick">
        <a-tree size="small" style="height: 100%; width: 100%; margin-left: 18px" :treeData="dataListForShow" @select="onSelect"
          :selectedKeys.sync="selectedKeys" draggable defaultExpandAll :multiple="false" @rightClick="onTreeNodeRightClick" @drop="onNodeDrop"
          @expand="onTreeExpand">
          <div slot="group" slot-scope="{ key, title, iconMenuUrl,tag }" style="position: relative; justify-content: left"
            class="flexHorilanLayout pageFontHover">
            <span class="pageListItem" style="height: 26px; position: absolute; left: -300px; right: -200px"></span>
            <span v-if="tag.iconUrl == null" style="z-index: 1" class="icon iconfont">&#xe626;</span>
            <!--            <img v-if="iconMenuUrl != null" style="height: 18px; width: 18px" v-lazy="iconMenuUrl" referrer="no-referrer|origin|unsafe-url" />-->
            <v-icon v-if="tag.iconUrl != null" viewBox="0 0 100 100" :name="tag.iconUrl" />
            <btreeNode :value="title" style="margin-left: 3px; z-index: 1; min-width: 80px; min-height: 20px" :nodeKey="key"
              @onValueChanged="onNodeNameChanged" @onSureNodeName="onSureNodeName"></btreeNode>
          </div>
          <div slot="pro" slot-scope="{ key, title, tag }" style="position: relative; justify-content: left" class="flexHorilanLayout pageFontHover">
            <span class="pageListItem" style="height: 26px; position: absolute; left: -300px; right: -200px"></span>
            <a-tooltip v-if="tag.pageStatus == 1" placement="topLeft" arrow-point-at-center :title="'已经被[' + tag.checkoutUserName + ']签出'">
              <a-icon :component="lockIcon" style="z-index: 1" />
            </a-tooltip>
            <a-tooltip v-if="tag.pageStatus == 2" placement="topLeft" title="正在签出编辑" arrow-point-at-center>
              <a-icon :component="unLockIcon" style="z-index: 1" />
            </a-tooltip>
            <btreeNode :value="title" style="margin-left: 3px; z-index: 1; min-width: 80px; min-height: 20px" :nodeKey="key"
              @onValueChanged="onNodeNameChanged" @onSureNodeName="onSureNodeName"></btreeNode>
          </div>
        </a-tree>

<v-contextmenu ref="ctxMenu"> 
   <v-contextmenu-item v-for="(menu, index) in rightMenus" :key="index" class="themeHover pageListItem" style="padding-left: 5px"
            @click="onRightMenuChoose(menu)">
            <span class="icon iconfont gad-plc-menu-icon" v-html="getMenuIconByRightMenus(menu)"></span>
            <span style="margin-left: 3px">&nbsp;&nbsp;{{ menu }}</span>
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
        <a-input-search size="small" style="margin-bottom: 8px; height: 30px" placeholder="搜索" v-model="seachPage" />
        <a-tree size="small" style="height: 100%; width: 98%; margin-left: 18px; max-height: 500px" :treeData="pageSourceTreeShow" :multiple="false"
          :checkable="true" @check="checkData"></a-tree>
      </a-row>
    </geno-modal>
    <div style="display:none">
      <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" accept=".jpg, .jpeg, .png">
        <a-button id="uploadMenuIcon">
          <a-icon type="upload" />
          上传图标
        </a-button>
      </a-upload>
    </div>

    <mg-modal ref="mgModal" :visible.sync="menuGroupVisible" @onOk="handleMenuGroupOk" :isEditable="menuGroupEditable" :topMenuId="menuGroupTopMenuId"
      :appId="menuGroupAppId">
    </mg-modal>

    <a-drawer :title="title" placement="right" :width="520" :closable="false" :visible="editvisible" :after-visible-change="afterVisibleChange"
      @close="onClose">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input maxlength="100" placeholder="请输入" v-decorator="formRules.name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="菜单分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-search placeholder="请选择分组" @search="openGroupModal" v-decorator="formRules.groupName" :read-only="true">
                <a-button slot="enterButton">
                  <a-icon type="plus" />
                </a-button>
              </a-input-search>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="display: none">
          <a-col>
            <a-form-item label="菜单分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="formRules.groupId" :read-only="true" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="跳转方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="formRules.jumpMode" placeholder="请选择">
                <a-select-option value="1">系统页面</a-select-option>
                <a-select-option value="2">外部链接</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="跳转路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input maxlength="200" placeholder="请输入" v-decorator="formRules.jumpPath" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="是否路由缓存" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-decorator="['keepAlive']" name="radioGroup" :default-value="true">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-item label="大图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="16">
              <v-icon viewBox="0 0 100 100" v-if="this.mdl.bigIconUrl!=null" :name="this.mdl.bigIconUrl" />
            </a-col>
            <a-col :offset="4" :span="4">
              <a-button shape="circle" icon="plus" @click="()=>{iconSelectorVisible=true;iconType=0;}" />
            </a-col>
          </a-form-item>
        </a-row>

      </a-form>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
        <a-button type="primary" @click="onConfirm">确定</a-button>
      </div>
    </a-drawer>

    <a-drawer title="设置图标" placement="right" :width="520" :closable="false" :visible="firstMenuIconModalvisible"
      :after-visible-change="afterVisibleChange" @close="onClose">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col>
            <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input maxlength="100" placeholder="请输入" v-decorator="formRules.name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-item label="菜单图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="16">
              <v-icon viewBox="0 0 100 100" v-if="this.mdl.iconUrl!=null" :name="this.mdl.iconUrl" />
            </a-col>
            <a-col :offset="4" :span="4">
              <a-button shape="circle" icon="plus" @click="()=>{iconSelectorVisible=true;iconType=1;}" />
            </a-col>
          </a-form-item>
        </a-row>
        <a-row :gutter="16">
          <a-form-item label="大图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="16">
              <v-icon viewBox="0 0 100 100" v-if="this.mdl.bigIconUrl!=null" :name="this.mdl.bigIconUrl" />
            </a-col>
            <a-col :offset="4" :span="4">
              <a-button shape="circle" icon="plus" @click="()=>{iconSelectorVisible=true;iconType=0;}" />
            </a-col>
          </a-form-item>
        </a-row>
      </a-form>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
        <a-button type="primary" @click="onConfirmFirstMenu">确定</a-button>
      </div>
    </a-drawer>

    <a-modal title="图标" :maskClosable="false" :destroyOnClose="true" v-model="iconSelectorVisible" :width="900" :height="500" @ok="handleIconOk"
      @cancel="handleIconCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: { icon: 'check' } }"
      :cancelButtonProps="{ props: { icon: 'close' } }">
      <icon-manage :isMulti="false" :isSelector="true" @onSelected="onIconSelected"></icon-manage>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { CurrentApis, CurrentContext, pagenNodeType, PageOrderClass } from '../01designerContext'
import { getUuid, deepClone, serialize } from '@common/utils'

import fileUpload from '../02common/uploadFile/fileUpload'
import iconManage from '@views/npicon/iconManage.vue'
 
import btreeNode from '../06propertyGrid/behaviorControl/behaviorTree/bTreeNode.vue'
import { behavior, action, actionDetail, object_Method } from '../02common/behavior'
 import PageBase from '../05designerLayouts/PageBase'
import pick from 'lodash.pick'
import { getFlowList, workFlowBegin } from '@/api/workflow'
import { batchDelete } from '@/api/crud'
import { addTopAppUserMenu } from '@/api/userManage'
import { pageCache } from '../02common/impResourcesCache'
import { lock, unLock } from '../02common/icons.js'
import MenuGroupModal from './MenuGroupModal.vue'

enum rightMenus {
  addProPage = '新建页面',
  addGroup = '新建分组',
  addMenu = '新建菜单',
  choosePage = '选择页面',
  saveAs = '另存为',
  rename = '重命名',
  revert = '还原默认',
  hide = '隐藏',
  show = '显示',
  edit = '编辑',
  setMenuIcon = '设置图标',
  delete = '删除',
  menuGroupSettings = '管理分组'
  // chooseMenuGroup = '选择分组',
}

class treeNodeData {
  key: string
  title: string
  nodeType: pagenNodeType //group|pro|grid
  children: treeNodeData[] = []
  isNeedSave: boolean = false
  isSystem: boolean
  iconMenuUrl: string
  tag?: any

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
    btreeNode: btreeNode,
    MgModal: MenuGroupModal,
    iconManage: iconManage 
  }
})
export default class PageListControl extends Vue {
  private lockIcon: any = lock
  private unLockIcon: any = unLock

  private pageResourceWindowVisible: boolean = false

  private menuGroupVisible: boolean = false
  private activeKey: string = '1'

  private dataList: treeNodeData[] = []
  private seachVal: string = ''

  private fileList: any[] = []
  private fileUploadClass: fileUpload = null

  private currentMenuGroup: any = {}

  get dataListForShow(): treeNodeData[] {
    if (this.seachVal == '' || !this.seachVal) {
      return this.dataList
    }
    var x = this.search(this.seachVal, deepClone(this.dataList))
    // console.info('---------树菜单图标-----------', x)
    return x
  }

  private iconSelectorVisible: boolean = false

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

  private param: any = {
    filter: {
      appId: CurrentContext.AppID
    },
    orders: [
      {
        direction: 'ASC',
        fieldName: 'orderIndex'
      },
      {
        direction: 'ASC',
        fieldName: 'modifyTime'
      }
    ]
  }

  mounted() {
    this.oldrender = this.$options.render
    this.$options.render = this.newrender
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    if (this.activeKey === '1') {
      var loading = common.showLoading_Async()
      CurrentApis.GetAppMenuTree(this.param)
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
  }

  private selectedIcon: string

  private onIconSelected(selectedIcons) {
    if (selectedIcons && selectedIcons.length > 0) {
      this.selectedIcon = selectedIcons[0].icon_code
    }
  }

  private handleIconOk() {
    if (this.selectedIcon != null) {
      if (this.iconType == 0) {
        this.mdl.bigIconUrl = this.selectedIcon
      } else {
        this.mdl.iconUrl = this.selectedIcon
      }
      this.selectedIcon = null
    }
    this.iconSelectorVisible = false
  }

  private handleIconCancel(e) {
    this.selectedIcon = null
    this.iconSelectorVisible = false
  }

  private getMenuIconByRightMenus(rm: rightMenus): string {
    let iconString
    switch (rm) {
      case rightMenus.choosePage:
      case rightMenus.addProPage:
      case rightMenus.revert:
      case rightMenus.hide:
      case rightMenus.show:
      case rightMenus.edit:
      case rightMenus.setMenuIcon: {
        iconString = '&#xe625;'
        break
      }
      case rightMenus.addMenu:
      case rightMenus.menuGroupSettings:
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

  private onMenuGroupOk() {
    this.menuGroupVisible = false
  }

  private onMenuGroupCancel() {
    this.menuGroupVisible = false
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

  private searchPageNode(pageId: string, tree: treeNodeData[]): treeNodeData {
    for (let index = 0; index < tree.length; index++) {
      const treenode = tree[index]
      if (treenode.tag && treenode.tag.pageId == pageId) {
        return treenode
      }
      let find = this.searchPageNode(pageId, treenode.children)
      if (find) {
        return find
      }
    }
    return null
  }

  /**把后端数据转换成tree的数据源数据 */
  private pageNodeToTreeNode(nodes: any[]): treeNodeData[] {
    let treeNodes: treeNodeData[] = []
    nodes.filter((n) => {
      let treenode = new treeNodeData()
      treenode.key = n.key
      treenode.title = n.title
      treenode.nodeType = !n.leaf ? pagenNodeType.group : pagenNodeType.pro
      treenode.isNeedSave = false
      treenode.isSystem = false
      treenode.iconMenuUrl = n.tag.iconUrl == null ? null : CurrentContext.FileServerAddress + n.tag.iconUrl
      treenode.tag = n.tag
      treenode.children = []
      if (n.children) {
        treenode.children = this.pageNodeToTreeNode(n.children)
      }
      treeNodes.push(treenode)
    })
    return treeNodes
  }

  private insertTreeNode(nodeKey: string, type: pagenNodeType, name: string, parentId?: string, tag?: any) {
    let newnode = new treeNodeData()
    newnode.key = nodeKey
    newnode.title = name
    newnode.nodeType = type
    newnode.isNeedSave = false
    newnode.isSystem = false
    newnode.tag = tag
    if (parentId) {
      let findNode = this.searchNodeByKey(parentId, this.dataList)
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
    let finddata = this.searchNodeByKey(keys[0], this.dataList)

    if (finddata.nodeType == pagenNodeType.group) {
      return
    }
    if (finddata.tag.jumpMode == 2) {
      return
    }

    this.onOpenPage(finddata.tag.pageId, finddata.title, finddata.nodeType)
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
    let targetNode = this.searchNodeByKey(node.dataRef.key, this.dataList)
    let sourceNode = this.searchNodeByKey(dragNode.dataRef.key, this.dataList)
    //拖拽的节点是分组，目标节点不是分组
    if (targetNode.nodeType != pagenNodeType.group && this.dropTopOrBottom == null) {
      this.$message.warning('该节点下不能添加节点', 3)
      return
    }
    this.dropChildrenNode(sourceNode, targetNode)
  }

  private dropChildrenNode(sourceNode: treeNodeData, targetNode: treeNodeData) {
    let targetList = []
    let findParent = null
    let index = 0
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

    let parentId = findParent == null ? 0 : findParent.key
    let promiseres: Promise<any> = null
    let param = {
      data: [
        {
          code: 'menu_name',
          value: sourceNode.title
        },
        {
          code: 'parent_id',
          value: parentId
        }
      ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: sourceNode.key
        }
      ],
      modelCode: 'sys_app_user_menu'
    }
    promiseres = CurrentApis.SimpleUpdate(param)

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
    let parentNode = this.getNodeParent(selectAct, this.dataList)
    if (!parentNode) {
      let index = this.dataList.indexOf(selectAct as any)
      this.dataList.splice(index, 1)
    } else {
      let index = parentNode.children.indexOf(selectAct as any)
      parentNode.children.splice(index, 1)
    }
    if (selectAct.nodeType == pagenNodeType.group) {
      this.notifiledClosePage(selectAct)
    } else {
      this.onClosePage(selectAct.tag.pageId)
    }
  }

  private notifiledClosePage(groupNode: treeNodeData) {
    groupNode.children.filter((c) => {
      if (c.nodeType == pagenNodeType.group) {
        this.notifiledClosePage(c)
      } else {
        this.onClosePage(c.tag.pageId)
      }
    })
  }

  /**获取父级节点 */
  private getNodeParent(node: treeNodeData, parents: treeNodeData[]): treeNodeData {
    for (let n in parents) {
      let parent = parents[n] as treeNodeData
      if (parent.children.indexOf(node) > -1) {
        return parent
      }

      let find = this.getNodeParent(node, parent.children)
      if (find) {
        return find
      }
    }
    return null
  }

  private getNodeById(key: string, parents: treeNodeData[]): treeNodeData {
    for (let n in parents) {
      let node = parents[n] as treeNodeData
      if (node.key == key) {
        return node
      }
      if (!node.children || node.children.length == 0) {
        continue
      }
      let child = node.children
      let find = this.getNodeById(key, child)
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
    let findnode = this.searchNodeByKey(nodeKey, this.dataList)
    if (!findnode) {
      return
    }
    let parentNodeId = null
    let parentNode = this.getNodeParent(findnode, this.dataList)
    if (parentNode) {
      parentNodeId = parentNode.key
    }
    let param = {
      data: [
        {
          code: 'menu_name',
          value: newtitle
        }
      ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: nodeKey
        }
      ],
      modelCode: 'sys_app_user_menu'
    }
    CurrentApis.SimpleUpdate(param).then((res) => {
      findnode.title = newtitle
      if (findnode.nodeType == pagenNodeType.pro) {
        this.onNameChanged(findnode.key, newtitle)
      }
    })
  }

  /**添加一个新页面 */
  private async addNewPage(newId: string, type: pagenNodeType, name: string, parentId?: string) {
    try {
      let res = await CurrentApis.AddPage(newId, name, type, parentId)
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
    let refreshList: treeNodeData[] = []
    if (parentId) {
      let findNode = this.searchNodeByKey(parentId, this.dataList)
      refreshList = findNode.children
    } else {
      refreshList = this.dataList
    }
    let refreshData: PageOrderClass[] = []
    let index = 0
    let updateArr: any[] = []
    refreshList.forEach((o) => {
      let data = new PageOrderClass()
      data.id = o.key
      data.orderIndex = ++index
      data.type = o.nodeType == pagenNodeType.group ? 1 : 0
      refreshData.push(data)
      updateArr.push({ modelCode: 'sys_app_user_menu', data: { id: o.key, order_index: data.orderIndex } })
    })
    let workflowQueryParam = { filter: {}, pageNumber: 1, pageSize: 1 }
    workflowQueryParam.filter = { wfNo: 'multyModels_Update' }
    getFlowList(workflowQueryParam).then((res1) => {
      let saveParam = {
        modelsAdd: [],
        modelsUpdate: updateArr,
        modelsDelete: []
      }
      let workflowParam = { workflowId: res1.data.content[0].id, data: saveParam }
      workFlowBegin(workflowParam).then((res2) => {})
    })
    //CurrentApis.RefreshPageIndex(refreshData)
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
      let newId = CurrentApis.GetServerUUID()
      let parentNode = this.getNodeParent(this.currentRightNode, this.dataList)
      /**获取旧页面数据 */
      let newpage = new PageBase()
      let pageContent = await pageCache.getPageData(this.currentRightNode.tag.pageId)
      let pagedataStr = common.serialize(pageContent.content)
      /**替换原页面中的所有pageId */
      pagedataStr = pagedataStr.replace(new RegExp(this.currentRightNode.key, 'gm'), newId)
      pagedataStr = common.strZip(pagedataStr)
      if (parentNode) {
        let values = {
          menuName: this.renameNewName,
          jumpMode: 1,
          routeUrl: '',
          id: newId,
          pid: parentNode.key,
          pagedataStr: pagedataStr
        }
        await this.addNewCopyPage(values)
      }
    }
  }

  private updatePageOldData_whileCopy(page: PageBase, oldPageId: string) {
    /**处理行为列表种缓存的页面Id */
    let newbehaviors: behavior[] = []
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

  public makeCurrentAppRightMenus(node: treeNodeData) {
    this.rightMenus = []
    if (!node) {
      this.rightMenus.push(rightMenus.addMenu)
      return
    }
    if (node.nodeType == pagenNodeType.group && node.isSystem == false) {
      this.rightMenus.push(rightMenus.addProPage)
      this.rightMenus.push(rightMenus.choosePage)
      this.rightMenus.push(rightMenus.addMenu)
      this.rightMenus.push(rightMenus.setMenuIcon)
      // 分组设置
      this.rightMenus.push(rightMenus.menuGroupSettings)
      if (node.tag && node.tag.show !== true) {
        this.rightMenus.push(rightMenus.show)
      } else {
        this.rightMenus.push(rightMenus.hide)
      }
    }

    if (node.nodeType == pagenNodeType.pro) {
      this.rightMenus.push(rightMenus.edit)
      this.rightMenus.push(rightMenus.saveAs)
      // this.rightMenus.push(rightMenus.chooseMenuGroup)
      if (node.tag && node.tag.show !== true) {
        this.rightMenus.push(rightMenus.show)
      } else {
        this.rightMenus.push(rightMenus.hide)
      }
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
    window.console.log('右击菜单树')
    if (this.activeKey === '1') {
      this.makeCurrentAppRightMenus(this.currentRightNode)
    } else {
      this.makeRightMenus(this.currentRightNode)
    }
  }

  public async onRightMenuChoose(menuName: string) {
    switch (menuName) {
      case rightMenus.addProPage:
        this.showRightModal(menuName)
        break
      case rightMenus.addGroup:
        this.addTreeNode(pagenNodeType.group, '新建分组', this.currentRightNode ? this.currentRightNode.key : null)
        break
      case rightMenus.delete:
        await this.deleteMenu_FromRightMenu()
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
        this.setShowOrHide(this.currentRightNode.key, false)
        break
      }
      case rightMenus.show: {
        this.setShowOrHide(this.currentRightNode.key, true)
        break
      }
      case rightMenus.setMenuIcon: {
        //设置菜单图标
        //$('#uploadMenuIcon').click()
        //TODO :设置弹窗
        this.showFirstMenuIcons()
        break
      }
      case rightMenus.addMenu:
        this.addNewMenu('新建菜单', this.currentRightNode ? this.currentRightNode.key : null)
        break
      case rightMenus.choosePage:
        let loading = common.showLoading_Async()
        CurrentApis.GetAllTreeList()
          .then((res) => {
            this.pageSourceTree = this.pageResourceNodeToTreeNode(res as any[])
            this.selectedPages = []
            this.seachPage = ''
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
        this.showRightModal(menuName)
        break
      case rightMenus.menuGroupSettings: {
        let mg = this.$refs.mgModal as MenuGroupModal
        this.menuGroupVisible = true
        this.menuGroupEditable = true
        this.menuGroupTopMenuId = this.currentRightNode ? this.currentRightNode.key : 0
        this.menuGroupAppId = CurrentContext.AppID
        break
      }
      // case rightMenus.chooseMenuGroup: {
      //   let parentNode = this.getNodeParent(this.currentRightNode, this.dataList)
      //   this.menuGroupVisible = true
      //   this.menuGroupEditable = false
      //   this.menuGroupTopMenuId = parentNode ? parentNode.key : 0
      //   this.menuGroupAppId = CurrentContext.AppID
      //   break
      // }

      default:
        break
    }
  }

  private openGroupModal() {
    window.console.log('openGroupModal')
    let parentNode
    if (this.currentRightNode.tag.parentId === 0 && this.currentRightNode.tag.pageId === 0) {
      parentNode = this.currentRightNode
    } else {
      parentNode = this.getNodeParent(this.currentRightNode, this.dataList)
    }

    this.menuGroupVisible = true
    this.menuGroupEditable = false
    this.menuGroupTopMenuId = parentNode ? parentNode.key : 0
    this.menuGroupAppId = CurrentContext.AppID
  }

  private setShowOrHide(pageId: any, isshow: boolean) {
    let param = {
      data: [
        {
          code: 'is_show',
          value: isshow ? 1 : 0
        }
      ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: pageId
        }
      ],
      modelCode: 'sys_app_user_menu'
    }
    CurrentApis.SimpleUpdate(param).then(() => {
      let node = this.getNodeById(pageId, this.dataList)
      node.tag.show = isshow
    })
  }

  private async deleteMenu_FromRightMenu() {
    this.$confirm({
      title: '谨慎操作',
      content: '删除后数据不能恢复,确定要删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        //区分一下删除的是页面还是菜单，如果是菜单的话，把下面一级页面也删掉，不然冗余数据太多了
        let param = {
          filter: [
            {
              code: 'id',
              type: 'EQ',
              value: this.currentRightNode.key
            }
          ],
          modelCode: 'sys_app_user_menu'
        }
        CurrentApis.SimpleDelete(param).then(() => {
          this.deleteNode(this.currentRightNode)
        })
        if (!this.currentRightNode.isLeaf) {
          if (this.currentRightNode.children && this.currentRightNode.children.length > 0) {
            let ids = []
            this.currentRightNode.children.forEach((item) => {
              ids.push(item.tag.id)
            })
            let params = { ids: ids, modelCode: 'sys_app_user_menu' }
            batchDelete(params).then(() => {
              //this.deleteNode(this.currentRightNode)
            })
          }
        }
      },
      onCancel() {}
    })
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
    let param = {
      data: [
        {
          code: 'icon_url',
          value: relativePath
        }
      ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: pageId
        }
      ],
      modelCode: 'sys_app_user_menu'
    }
    CurrentApis.SimpleUpdate(param).then(() => {
      let loading = common.showLoading_Async()
      CurrentApis.GetAppMenuTree(this.param)
        .then((res) => {
          this.dataList = this.pageNodeToTreeNode(res as any[])
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          common.closeLoading_Async(loading)
        })
    })
  }

  /*********************** end 设置菜单图标 end*****************/

  // ***************外部调用********************************************************************
  public unselectNode(nodeKey: string) {
    let snode = this.searchNodeByKey(nodeKey, this.dataList)
    if (!snode) {
      return
    }

    if (snode.key == this.selectedKeys[0]) {
      this.selectedKeys = []
    }
  }

  @Emit('onOpenPage')
  public onOpenPage(pageId: string, pageName: string, pageType: pagenNodeType) {}

  @Emit('RestorPage')
  public RestorPage(pageId: string) {}

  @Emit('onClosePage')
  public onClosePage(pageId: string) {}

  @Emit('onNameChanged')
  public onNameChanged(pageId: string, newname: string) {}

  private changeActivekey(param: any) {
    if (param.target.value === '2') {
      let loading = common.showLoading_Async()
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
    let newId = CurrentApis.GetServerUUID()
    let addPost
    if (parentId != null) {
      let param = {
        data: [
          {
            code: 'id',
            value: newId
          },
          {
            code: 'app_id',
            value: CurrentContext.AppID
          },
          {
            code: 'page_id',
            value: 0
          },
          {
            code: 'parent_id',
            value: !parentId ? 0 : parentId
          },
          {
            code: 'menu_name',
            value: name
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
      addPost = CurrentApis.SimpleAdd(param)
    } else {
      let topMenu = {
        id: newId,
        appId: CurrentContext.AppID,
        pageId: 0,
        parentId: !parentId ? 0 : parentId,
        menuName: name,
        show: true,
        userId: 0,
        deleted: false,
        orderIndex: 0,
        keepAlive: true
      }
      addPost = addTopAppUserMenu(topMenu)
    }
    addPost
      .then((res) => {
        if (res.code == '0') {
          this.insertTreeNode(newId, pagenNodeType.group, name, parentId)
        } else {
          this.$notification['warn']({
            message: '提示',
            description: res ? res.msg : '操作失败',
            duration: 8
          })
        }
      })
      .catch((error) => {
        this.$message.error(error)
      })
  }

  private selectMenu: any

  private onSelectPageOk() {
    if (!this.selectedPages || this.selectedPages.length === 0) {
      this.$message.info('请选择页面！')
      return
    }
    this.pageResourceWindowVisible = false
    let addArr = []
    let ids = CurrentApis.GetUniqueIds(this.selectedPages.length)
    let index = 0
    let findNode = this.searchNodeByKey(this.currentRightNode.key, this.dataList)
    this.selectedPages.forEach((o) => {
      addArr.push({
        id: ids[index],
        app_id: CurrentContext.AppID,
        page_id: o.key,
        parent_id: this.currentRightNode.key,
        menu_name: o.title,
        order_index: findNode.children.length + 1,
        is_show: 1,
        user_id: 0
      })

      let newnode = new treeNodeData()
      newnode.key = o.key
      newnode.title = o.title
      newnode.nodeType = 2
      newnode.isNeedSave = false
      newnode.isSystem = false
      newnode.tag = { id: ids[index], pageId: o.key, menuName: o.title, jumpMode: 1 }
      findNode.children.push(newnode)
      index++
    })
    let workflowQueryParam = { filter: {}, pageNumber: 1, pageSize: 1 }
    workflowQueryParam.filter = { wfNo: 'baseModel_Bacth' }
    getFlowList(workflowQueryParam).then((res1) => {
      let saveParam = {
        addData: { modelCode: 'sys_app_user_menu', data: addArr },
        updateData: { modelCode: 'sys_app_user_menu', data: [] },
        deleteData: { modelCode: 'sys_app_user_menu', data: [] }
      }
      let workflowParam = { workflowId: res1.data.content[0].id, data: saveParam }
      workFlowBegin(workflowParam).then((res2) => {
        this.refreshListOrderIndex(this.currentRightNode.key)
      })
    })
  }

  private onSelectPageCancel() {
    this.pageResourceWindowVisible = false
  }

  private selectedPage: any
  private selectedPages: any[] = []

  private onSelectPage(selectedKeys: any, e: { selected: boolean; selectedNodes: any; node: any; event: any }) {
    this.selectedPage = deepClone(e.node.dataRef)
  }

  /**把后端数据转换成tree的数据源数据 */
  private pageResourceNodeToTreeNode(nodes: any[]): treeNodeData[] {
    let treeNodes: treeNodeData[] = []
    nodes.filter((n) => {
      let treenode = new treeNodeData()
      treenode.key = n.id
      treenode.title = n.text
      treenode.nodeType = !n.obj.pageType ? pagenNodeType.group : n.obj.pageType
      treenode.isNeedSave = false
      treenode.isSystem = n.obj.isSystem
      treenode.iconMenuUrl = n.obj.iconUrl == null ? null : CurrentContext.FileServerAddress + n.obj.iconUrl
      treenode.children = []
      if (n.children) {
        treenode.children = this.pageResourceNodeToTreeNode(n.children)
      }
      treeNodes.push(treenode)
    })
    return treeNodes
  }

  seachPage: string = ''

  get pageSourceTreeShow(): treeNodeData[] {
    if (this.seachPage == '' || !this.seachPage) {
      return this.pageSourceTree
    }
    let x = this.searchNodes(this.seachPage, this.pageSourceTree)
    return x
  }

  form: any
  formFirst: any
  mdl: any = {}
  title: string = '编辑'
  labelCol: any = {
    xs: { span: 5 },
    sm: { span: 5 }
  }
  wrapperCol: any = {
    xs: { span: 16 },
    sm: { span: 16 }
  }
  //0-大图标，1-小图标
  iconType: Number = 0

  beforeCreate() {
    this.form = this.$form.createForm(this)
  }

  showRightModal(menuName: string) {
    this.editvisible = true
    if (menuName === rightMenus.addProPage) {
      if (!this.currentRightNode.tag) this.currentRightNode.tag = {}
      this.currentRightNode.tag.jumpMode = this.currentRightNode.tag.jumpMode ? this.currentRightNode.tag.jumpMode + '' : undefined
      this.title = '新增'
      this.mdl = {
        menuName: '',
        groupId: null,
        groupName: null,
        jumpMode: undefined,
        routeUrl: '',
        keepAlive: true,
        bidIconUrl: null
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'menuName', 'groupId', 'groupName', 'jumpMode', 'routeUrl'))
      })
    } else {
      this.title = '编辑'
      this.mdl = deepClone(this.currentRightNode.tag)
      console.info('----选中了----', this.mdl)
      if (!this.mdl.jumpMode) {
        this.mdl.jumpMode = '1'
      } else {
        this.mdl.jumpMode = this.mdl.jumpMode.toString()
      }
      if (this.mdl.groupId) {
        let param = {
          filter: [
            {
              code: 'id',
              type: 'EQ',
              value: this.mdl.groupId
            }
          ],
          modelCode: 'sys_app_menu_group'
        }
        CurrentApis.SimpleListQuery(param).then((res: any) => {
          res.forEach((element) => {
            this.mdl.groupName = element.group_name
            this.$nextTick(() => {
              this.form.setFieldsValue(pick({ groupName: element.group_name }, 'groupName'))
            })
          })
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'menuName', 'groupId', 'groupName', 'jumpMode', 'routeUrl', 'keepAlive'))
      })
    }
  }

  showFirstMenuIcons() {
    this.firstMenuIconModalvisible = true
    this.mdl = deepClone(this.currentRightNode.tag)
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.mdl, 'menuName'))
    })
  }

  formRules: any = {
    name: ['menuName', { rules: [{ whitespace: true, required: true, message: '请输入菜单名称' }] }],
    groupId: ['groupId'],
    groupName: ['groupName', { rules: [{ required: true, message: '请选择分组' }] }],
    jumpMode: ['jumpMode', { initialValue: '1', rules: [{ required: true, message: '请选择跳转方式' }] }],
    jumpPath: ['routeUrl'],
    keepAlive: ['keepAlive', { initialValue: true }]
  }

  formFirstRules: any = {
    name: ['menuName', { rules: [{ whitespace: true, required: true, message: '请输入菜单名称' }] }]
  }

  editvisible: boolean = false

  firstMenuIconModalvisible: boolean = false

  afterVisibleChange() {}

  onClose() {
    this.mdl = {}
    this.editvisible = false
    this.firstMenuIconModalvisible = false
  }

  onConfirm() {
    this.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.mdl.menuName = values.menuName
      if (this.title === '新增') {
        this.addNewMenuPage(values)
      } else {
        //window.console.log('values', values)
        //编辑的情况下直接调用更新接口
        let param = {
          data: [
            {
              code: 'menu_name',
              value: this.mdl.menuName
            },
            {
              code: 'jump_mode',
              value: values.jumpMode
            },
            {
              code: 'route_url',
              value: values.routeUrl
            },
            {
              code: 'group_id',
              value: values.groupId
            },
            {
              code: 'is_keep_alive',
              value: values.keepAlive ? 1 : 0
            },
            {
              code: 'big_icon_url',
              value: this.mdl.bigIconUrl
            }
          ],
          filter: [
            {
              code: 'id',
              type: 'EQ',
              value: this.mdl.id
            }
          ],
          modelCode: 'sys_app_user_menu'
        }
        CurrentApis.SimpleUpdate(param).then(() => {
          let loading = common.showLoading_Async()
          CurrentApis.GetAppMenuTree(this.param)
            .then((res) => {
              this.dataList = this.pageNodeToTreeNode(res as any[])
            })
            .catch((error) => {
              this.$message.error(error)
            })
            .finally(() => {
              common.closeLoading_Async(loading)
            })
        })
      }
      this.onClose()
    })
  }

  onConfirmFirstMenu() {
    this.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.mdl.menuName = values.menuName
      let param = {
        data: [
          {
            code: 'menu_name',
            value: this.mdl.menuName
          },
          {
            code: 'big_icon_url',
            value: this.mdl.bigIconUrl
          },
          {
            code: 'icon_url',
            value: this.mdl.iconUrl
          }
        ],
        filter: [
          {
            code: 'id',
            type: 'EQ',
            value: this.mdl.id
          }
        ],
        modelCode: 'sys_app_user_menu'
      }
      CurrentApis.SimpleUpdate(param).then(() => {
        let loading = common.showLoading_Async()
        CurrentApis.GetAppMenuTree(this.param)
          .then((res) => {
            this.dataList = this.pageNodeToTreeNode(res as any[])
          })
          .catch((error) => {
            this.$message.error(error)
          })
          .finally(() => {
            common.closeLoading_Async(loading)
          })
      })
      this.onClose()
    })
  }

  addNewMenuPage(values: any, parentId: string = '') {
    //新增的时候，需要先在page表里添加然后在菜单表添加关联
    //let pid = parentId?parentId:this.currentRightNode.key
    let newId = CurrentApis.GetServerUUID()
    //添加页面访问权限
    try {
      let param = {
        data: [
          {
            code: 'id',
            value: newId
          },
          {
            code: 'app_id',
            value: CurrentContext.AppID
          },
          {
            code: 'parent_group_id',
            value: 0
          },
          {
            code: 'page_name',
            value: values.menuName
          },
          {
            code: 'jump_mode',
            value: values.jumpMode
          },
          {
            code: 'route_url',
            value: values.routeUrl
          },
          {
            code: 'page_type',
            value: 2
          }
        ],
        modelCode: 'app_page'
      }
      CurrentApis.SimpleAdd(param).then(() => {
        param = {
          data: [
            {
              code: 'id',
              value: CurrentApis.GetServerUUID()
            },
            {
              code: 'page_id',
              value: newId
            },
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
        CurrentApis.SimpleAdd(param)
        //添加菜单关联
        param = {
          data: [
            {
              code: 'id',
              value: CurrentApis.GetServerUUID()
            },
            {
              code: 'app_id',
              value: CurrentContext.AppID
            },
            {
              code: 'page_id',
              value: newId
            },
            {
              code: 'parent_id',
              value: this.currentRightNode.key
            },
            {
              code: 'menu_name',
              value: values.menuName
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
            },
            {
              code: 'jump_mode',
              value: values.jumpMode
            },
            {
              code: 'route_url',
              value: values.routeUrl
            },
            {
              code: 'group_id',
              value: values.groupId
            }
          ],
          modelCode: 'sys_app_user_menu'
        }
        //this.insertTreeNode(newId, pagenNodeType.group, name, parentId)
        CurrentApis.SimpleAdd(param).then((res) => {
          let tag = { pageId: newId, jumpMode: values.jumpMode, show: true }
          this.insertTreeNode(newId, pagenNodeType.pro, values.menuName, this.currentRightNode.key, tag)
        })
      })
    } catch (error) {
      this.$message.error(error)
    }
  }

  addNewCopyPage(values: any) {
    let newcontentId = CurrentApis.GetServerUUID()
    //添加页面访问权限
    try {
      let param = {
        data: [
          {
            code: 'id',
            value: values.id
          },
          {
            code: 'app_id',
            value: CurrentContext.AppID
          },
          {
            code: 'page_content_id',
            value: newcontentId
          },
          {
            code: 'parent_group_id',
            value: 0
          },
          {
            code: 'page_name',
            value: values.menuName
          },
          {
            code: 'jump_mode',
            value: values.jumpMode
          },
          {
            code: 'route_url',
            value: values.routeUrl
          },
          {
            code: 'page_type',
            value: 2
          }
        ],
        modelCode: 'app_page'
      }
      CurrentApis.SimpleAdd(param).then(() => {
        param = {
          data: [
            {
              code: 'id',
              value: newcontentId
            },
            {
              code: 'design_content',
              value: values.pagedataStr
            }
          ],
          modelCode: 'app_page_content'
        }
        CurrentApis.SimpleAdd(param)
        param = {
          data: [
            {
              code: 'id',
              value: CurrentApis.GetServerUUID()
            },
            {
              code: 'page_id',
              value: values.id
            },
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
        CurrentApis.SimpleAdd(param)
        //添加菜单关联
        param = {
          data: [
            {
              code: 'id',
              value: CurrentApis.GetServerUUID()
            },
            {
              code: 'app_id',
              value: CurrentContext.AppID
            },
            {
              code: 'page_id',
              value: values.id
            },
            {
              code: 'parent_id',
              value: values.pid
            },
            {
              code: 'menu_name',
              value: values.menuName
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
            },
            {
              code: 'jump_mode',
              value: values.jumpMode
            },
            {
              code: 'route_url',
              value: values.routeUrl
            },
            {
              code: 'group_id',
              value: values.groupId
            }
          ],
          modelCode: 'sys_app_user_menu'
        }
        //this.insertTreeNode(newId, pagenNodeType.group, name, parentId)
        CurrentApis.SimpleAdd(param).then((res) => {
          let tag = { pageId: values.id, jumpMode: values.jumpMode, show: true }
          this.insertTreeNode(values.id, pagenNodeType.pro, values.menuName, values.pid, tag)
        })
      })
    } catch (error) {
      this.$message.error(error)
    }
  }

  checkData(checkedKeys: any, e: { checked: boolean; checkedNodes: any; node: any; event: any }) {
    this.selectedPages = []
    if (e.checkedNodes && e.checkedNodes instanceof Array && e.checkedNodes.length > 0) {
      e.checkedNodes.forEach((element) => {
        if (element.data.props.dataRef && element.data.props.dataRef.nodeType == pagenNodeType.pro) {
          this.selectedPages.push(element.data.props.dataRef)
        }
      })
    }
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
  }

  private onSearChildren(title: any, tree: any) {
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

  public updatePageCheckStatus(pageId: string, status: any, checkoutUserName: string) {
    let findNode = this.searchPageNode(pageId, this.dataListForShow)
    if (findNode) {
      findNode.tag.pageStatus = status
      findNode.tag.checkoutUserName = checkoutUserName
    }
  }

  private menuGroupEditable: boolean = false
  private menuGroupTopMenuId: any = '0'
  private menuGroupAppId: any = '0'

  private handleMenuGroupOk(data: any) {
    if (!this.menuGroupEditable) {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({ groupId: data.id, groupName: data.group_name }, 'groupId', 'groupName'))
      })
    }
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
