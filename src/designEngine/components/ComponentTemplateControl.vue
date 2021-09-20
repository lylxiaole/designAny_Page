<template>
  <div style="height:357px;overflow-x:hidden;overflow-y:auto;">
    <a-col :span="7">
      <div style="height:357px;width:124px;overflow-x:hidden;overflow-y:auto;background-color:rgba(240,242,245,1)">
        <div style="height:306px;overflow-x:hidden;overflow-y:auto;margin-top:9px;">
          <a-menu v-model="systemCompsActiveKey" style="background-color:rgba(240,242,245,1);color:rgba(40,40,40,1);text-align:center">
            <a-menu-item v-for="group in ComponentGroups" :key="group.groupId" @click="changeActivekey">
              <div class="flexHorilanLayout"
                @contextmenu.prevent="onTreeNodeRightClick($event, {groupId:group.groupId,key:group.groupId,isGroup:true})">
                <btreeNode :title="group.groupName" :value="group.groupName"
                  style="z-index:1;width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" :nodeKey="group.groupId"
                  @onValueChanged="onNodeNameChanged" @onSureNodeName="(key,value)=>onSureNodeName(key,value,true)">
                </btreeNode>
              </div>
            </a-menu-item>
          </a-menu>
        </div>
        <div style="margin-left:10px">
          <a-button @click="addGroup" style="width:90px;height:30px;color:rgba(24,174,183,1);background-color:rgba(24,174,183,0.15)">添加分组</a-button>
        </div>
      </div>
    </a-col>
    <a-col :span="17">
      <a-row v-if="isSo">
        <a-col :span="12">
          <a-input style="margin-left:10px;margin-top:14px;width:188px;height:32px" placeholder="搜索" @pressEnter="onSearch">
            <a-icon :component="search" slot="suffix" />
          </a-input>
        </a-col>
        <a-col :span="12">
          <a-button style="width:104px;height:30px;margin-left:40px;margin-top:14px;color:rgba(255,255,255,1);background-color:rgba(24,174,183,1);"
            @click="OnClick">
            <a-icon style="font-size:17px" :component="addmodel" />新增模板
          </a-button>
        </a-col>
      </a-row>
      <a-row style="width:302px;height:1px;background-color:rgba(233,233,233,1);margin-top:14px;margin-left:10px;"></a-row>
      <!-- <a-row v-show="isSo">
        <a-button style='float:right;margin:10px;margin-bottom:10px' @click="OnClick" ghost>新增模板</a-button>
      </a-row> -->
      <div style="height:280px;overflow-x:hidden;overflow-y:auto;margin-top:14px;">
        <a-list class="container" style="background-color:transparent" :grid="{ gutter: 16, column: 4 }" :dataSource="dataSource">
          <a-list-item slot="renderItem" style="background-color:transparent;" slot-scope="item, index" :span="4">
            <a-card :index="index" class="mydragItem" compGroupName="组件模板" compName="组件模板" :sourceId="item.Id" hoverable
              style="width:50px;height:55px;background-color:transparent;border:none;text-align:center" :compId="item.Id"
              @contextmenu.prevent="onTreeNodeRightClick($event, {groupId:groupId,key:item.Id,isGroup:false,title:item.name})">
              <div style="width:100%;height:35px;text-align:center" alt="example" slot="cover">
                <a-icon style="font-size:30px;margin-top:10px" :component="icon" />
              </div>
              <div style="font-size:12px;padding-top:3px;text-align:center;color:rgba(0,0,0,0.5);width:100%;height:20px" slot="cover">
                <btreeNode :value="item.name" style="z-index:1;" :nodeKey="item.Id" @onValueChanged="onNodeNameChanged"
                  @onSureNodeName="(key,value)=>onSureNodeName(key,value,false)"></btreeNode>
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-col>
    <VueContextMenu id="context-menu" ref="ctxMenu" style="cursor:pointer">
      <li v-for="(menu,index) in rightMenus" :key="index" class="themeHover pageListItem" style="padding-left:5px" @click="onRightMenuChoose(menu)">
        <span v-if="menu=='编辑'" style="font-size:14px;color:rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe62b;</span>
        <span v-if="menu=='删除'" style="font-size:14px;color:rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe62b;</span>
        <span v-if="menu=='重命名'" style="font-size:14px;color:rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe628;</span>
        <span v-if="menu=='还原默认'" style="font-size:14px;color:rgba(0, 0, 0, 0.65)" class="icon iconfont">&#xe625;</span>
        <span style="maegin-left:3px">&nbsp;&nbsp;{{menu}}</span>
      </li>
    </VueContextMenu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../02common/commonMethod'
import dragHelper from '../02common/dragHelper'
var VueContextMenu = require('vue-context-menu')
import { CurrentApis, CurrentContext, pagenNodeType } from '../01designerContext'
import { LayoutInfo, LayoutType } from '../03designerLayoutBase/LayoutBase'
// 所有系统组件
import { AllComponents } from '../04designerComponents'
import { DragItemData, DragItemTypeEnum } from '../03designerLayoutBase/BaseEvents'
import PageBase from '../05designerLayouts/PageBase'
import btreeNode from '../06propertyGrid/behaviorControl/behaviorTree/bTreeNode.vue'
import { comTemplateIco, addModelIco, searchIco } from '../assets/icons.js'

class ComponentGroupInfo {
  // constructor(_groupName: string) {
  //   this.groupName = _groupName
  // }
  groupName: string
  groupId: string
  components: PageBase[] = []
}

enum rightMenusEnum {
  edit = '编辑',
  delete = '删除',
  rename = '重命名',
  revert = '还原默认',
}

class treeNodeData {
  groupId: string
  key: string
  title: string
  nodeType: pagenNodeType //group|pro|grid
  isNeedSave: boolean = false
  isSystem: boolean
  class: string = '' //样式class
  style: string = ''
}

@Component({
  components: {
    VueContextMenu: VueContextMenu,
    btreeNode: btreeNode,
  },
})
export default class ComponentTemplateControl extends Vue {
  private systemCompsActiveKey: string[] = []
  private ComponentGroups: ComponentGroupInfo[] = []
  private dragHelpers: dragHelper[] = []
  //private selectId:string
  private currentRightNode: treeNodeData
  private dragType: DragItemTypeEnum = DragItemTypeEnum.drop_component_template
  private dataSource: PageBase[] = []
  private groupId: string
  private isSo: boolean = false
  private group: ComponentGroupInfo[]
  private icon: any
  private addmodel: any
  private selectedId: string
  private search: any

  created() {
    this.search = searchIco
  }

  mounted() {
    this.CuteSystemComponents()
    this.renderStyle()
  }
  beforeDestroy() {
    this.clearDrags()
  }
  @Watch('systemCompsActiveKey')
  private watchSystemCompsActiveKeyChange(keys: string[]) {
    // this.$nextTick(() => {
    //   //window.console.log('给组件列表添加拖拽事件了')
    //   // setTimeout(() => {
    //   //   this.refreshDrags()
    //   // }, 100);
    // })
  }
  changeActivekey(item: any) {
    this.addmodel = addModelIco
    this.groupId = item.key
    this.isSo = true
    this.dataSource = []
    var key = item.key
    this.selectedId = key
    if (!key) {
      this.renderStyle()
      return
    }
    //变更选择的分组
    let tempGroups = this.ComponentGroups.find((item) => item.groupId === key)
    let param = {
      filter: [
        {
          code: 'parent_group_id',
          type: 'EQ',
          value: key,
        },
      ],
      modelCode: 'app_component_template',
    }
    //652538577883893800
    //组件模板1
    // tempGroups.components = []
    // let template = new PageBase()
    // template.name = '组件模板1'
    // template.Id = '652538577883893800'
    // tempGroups.components.push(template)
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      //window.console.log('查询分组', res)
      tempGroups.components = []
      res.forEach((element) => {
        let template = new PageBase()
        template.name = element.template_name
        template.Id = element.id
        tempGroups.components.push(template)
        this.dataSource.push(template)
      })
      this.$nextTick(() => {
        this.refreshDrags()
      })
    })
    this.renderStyle()
    //this.systemCompsActiveKey = key
  }

  private onSearch(value: any) {
    this.addmodel = addModelIco
    this.isSo = true
    let tempName = value.target.value
    this.dataSource = []
    let key = this.selectedId
    if (!key) {
      this.renderStyle()
      return
    }
    //变更选择的分组
    let tempGroups = this.ComponentGroups.find((item) => item.groupId === key)
    let param = {
      filter: [
        {
          code: 'parent_group_id',
          type: 'EQ',
          value: key,
        },
        {
          code: 'template_name',
          type: 'ALL_LIKE',
          value: tempName,
        },
      ],
      modelCode: 'app_component_template',
    }
    //652538577883893800
    //组件模板1
    // tempGroups.components = []
    // let template = new PageBase()
    // template.name = '组件模板1'
    // template.Id = '652538577883893800'
    // tempGroups.components.push(template)
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      //window.console.log('查询分组', res)
      tempGroups.components = []
      res.forEach((element) => {
        let template = new PageBase()
        template.name = element.template_name
        template.Id = element.id
        tempGroups.components.push(template)
        this.dataSource.push(template)
      })
      this.$nextTick(() => {
        this.refreshDrags()
      })
    })
    this.renderStyle()
    //this.systemCompsActiveKey = key
  }

  renderStyle() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-collapse-content')
        .css('background-color', '#03303B')
      $(this.$el)
        .find('.ant-collapse-content')
        .css('border', 'none')
    })
  }

  /**开发时:可拖拽下的子节点要满足这些条件
   * 1.class="mydragItem"
   * 2.属性compGroupName=""用来标识组件的分组名
   * 3.属性compName=""用来标识组件名称
   * 4.属性compType=""用来标识组件类型；类型分为system,compMoudle,fromModel
   */
  private refreshDrags() {
    $(this.$el)
      .find('.mydragItem')
      .each((index, element) => {
        // window.console.log('组件列表', element)
        var find = this.dragHelpers.filter((o) => o.currentContainer == element)[0]
        if (!find) {
          //注册拖拽插件
          var draghelper = new dragHelper(element)
          draghelper.makeDomContainer()
          draghelper.makeContainerCannotDrop()
          //让每个包装层里面的内容可拖拽
          var dragItem = $(element).children()[0]
          draghelper.makeDomCanDrag(dragItem)
          //获取dom节点上的信息，这些信息包含了组件的简要信息
          var compInfo = this.GetComponentInfo_Simple(element)
          var dragdata: DragItemData<any> = { type: this.dragType, dragData: compInfo }
          draghelper.makeDragItemInfo(dragItem, dragdata)
          this.dragHelpers.push(draghelper)
        }
      })
  }
  /**包含组件的分组名，和组件的名字。不包含组件的类型信息 */
  private GetComponentInfo_Simple(el: Element): LayoutInfo {
    var compName = $(el).attr('compName')
    var compGroupName = $(el).attr('compGroupName')
    var sourceId = $(el).attr('sourceId')
    var compInfo = new LayoutInfo(LayoutType.component_template, compGroupName, compName, $(el).attr('compId'), '', sourceId)
    //window.console.log('compInfo', compInfo)
    return compInfo
  }
  private clearDrags() {
    this.dragHelpers.filter((o) => {
      o.RemoveContainer()
      o.makeDomCannotDrag($(o.currentContainer).children()[0])
    })
  }
  /**计算系统自带组件的分组 */
  private CuteSystemComponents() {
    this.icon = comTemplateIco
    //调用通用查询接口来获取分组信息
    let param = { filter: [], modelCode: 'app_component_template_group' }
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      //window.console.log('查询分组', res)
      this.ComponentGroups = []
      res.forEach((element) => {
        let newgroup = new ComponentGroupInfo()
        newgroup.groupName = element.group_name
        newgroup.groupId = element.id.toString()

        // newgroup.components = []
        // let template = new PageBase()
        // template.name = '组件模板1'
        // template.Id = '652538577883893800'
        // newgroup.components.push(template)
        this.ComponentGroups.push(newgroup)
      })
      let selectId = this.ComponentGroups[0].groupId
      this.systemCompsActiveKey.push(selectId)
      let param = { key: selectId }
      this.changeActivekey(param)
    })
  }

  addGroup() {
    //添加一个分组信息，刷新列表数据
    let newgroup = new ComponentGroupInfo()
    newgroup.groupName = '新建分组'
    newgroup.groupId = CurrentApis.GetServerUUID()
    this.ComponentGroups.push(newgroup)
    let param = {
      data: [
        {
          code: 'id',
          value: newgroup.groupId,
        },
        {
          code: 'group_name',
          value: newgroup.groupName,
        },
      ],
      modelCode: 'app_component_template_group',
    }
    // window.console.log('新建参数', param)
    CurrentApis.SimpleAdd(param).then((res: any) => {
      // window.console.log('新建结束', res)
    })
  }

  deleteGroup(key: any) {
    let param = {
      // data: [
      //   {
      //     code: 'is_deleted',
      //     value: 1,
      //   },
      // ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: key,
        },
      ],
      modelCode: 'app_component_template_group',
    }
    CurrentApis.SimpleDelete(param).then(() => {
      let tempGroups = this.ComponentGroups.filter((item) => item.groupId !== key)
      this.ComponentGroups = []
      this.ComponentGroups = Object.assign([], tempGroups)
      //window.console.log('分组id', key)
    })
  }

  deleteComponentTemplate(groupId: any, templateId: any) {
    //window.console.log('模板id', templateId)
    let param = {
      // data: [
      //   {
      //     code: 'is_deleted',
      //     value: 1,
      //   },
      // ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: templateId,
        },
      ],
      modelCode: 'app_component_template',
    }
    CurrentApis.SimpleDelete(param).then(() => {
      let tempGroups = this.ComponentGroups.find((item) => item.groupId === groupId)
      //window.console.log('tempGroups.components',Object.assign([],tempGroups.components))
      let componentArr = tempGroups.components.filter((item) => item.Id !== templateId)
      let datacomponent = this.dataSource.filter((item) => item.Id !== templateId)
      //window.console.log('模板id111', templateId)
      //window.console.log('componentArr',Object.assign([],componentArr))
      tempGroups.components = []
      tempGroups.components = Object.assign([], componentArr)
      this.dataSource = Object.assign([], datacomponent)
    })
  }

  OnClick() {
    //弹窗选择布局类型
    let template = new PageBase()
    template.name = '新建组件模板'
    template.Id = CurrentApis.GetServerUUID()
    this.dataSource.push(template)
    // window.console.log('分组id', group.groupId)
    let templateContentId = CurrentApis.GetServerUUID()
    let param = {
      data: [
        {
          code: 'id',
          value: templateContentId,
        },
        {
          code: 'design_content',
          value: '',
        },
      ],
      modelCode: 'app_component_template_content',
    }
    //添加组件模板内容记录，然后添加组件模板
    CurrentApis.SimpleAdd(param).then((res: any) => {
      //window.console.log('新建结束',res)
      let param111 = {
        data: [
          {
            code: 'id',
            value: template.Id,
          },
          {
            code: 'template_content_id',
            value: templateContentId,
          },
          {
            code: 'template_name',
            value: template.name,
          },
          {
            code: 'parent_group_id',
            value: this.groupId,
          },
        ],
        modelCode: 'app_component_template',
      }
      // window.console.log('新建参数', param111)
      //添加组件模板内容记录，然后添加组件模板
      CurrentApis.SimpleAdd(param111).then((res111: any) => {
        // window.console.log('新建结束', res)
      })
    })
  }

  private rightMenus: string[] = []
  public makeRightMenus(node: any) {
    this.rightMenus = []
    this.rightMenus.push(rightMenusEnum.delete)
    this.rightMenus.push(rightMenusEnum.rename)
    // if (!node) {
    //   this.rightMenus.push(rightMenusEnum.addGridPage)
    //   this.rightMenus.push(rightMenusEnum.addProPage)
    //   this.rightMenus.push(rightMenusEnum.addGroup)
    //   return
    // }
    // if (node.isSystem == false) {

    // } else {
    //   this.rightMenus.push(rightMenusEnum.revert)
    // }
    // if (node.nodeType == pagenNodeType.group && node.isSystem == false) {
    //   this.rightMenus.push(rightMenus.addGridPage)
    //   this.rightMenus.push(rightMenus.addProPage)
    //   this.rightMenus.push(rightMenus.addGroup)
    // }
    // if (node.nodeType == pagenNodeType.pro || node.nodeType == pagenNodeType.grid) {
    //   this.rightMenus.push(rightMenus.saveAs)
    // }
  }
  public onTreeNodeRightClick(e: any, arg: any) {
    if (e.node) {
      ;(e.event as Event).stopPropagation()
      ;(e.event as Event).preventDefault()
    } else {
      ;(e as Event).stopPropagation()
      ;(e as Event).preventDefault()
    }
    // window.console.log('右击了', e)
    // window.console.log('右击参数', arg)
    this.currentRightNode = new treeNodeData()
    if (arg.groupId) {
      //window.console.log('arg.groupId', arg.groupId)
      this.currentRightNode.groupId = arg.groupId
    }
    this.currentRightNode.key = arg.key
    this.currentRightNode.title = arg.title
    this.currentRightNode.nodeType = arg.isGroup ? pagenNodeType.group : pagenNodeType.pro
    // this.currentRightNode = null
    // if (e.node) {
    //   this.currentRightNode = e.node.dataRef as any
    // }
    ;(this.$refs.ctxMenu as any).open()
    this.rightMenus = []
    if (arg.isGroup) {
      this.rightMenus.push(rightMenusEnum.delete)
    } else {
      this.rightMenus.push(rightMenusEnum.edit)
      this.rightMenus.push(rightMenusEnum.delete)
    }
    //this.makeRightMenus(this.currentRightNode)
  }

  private onNodeNameChanged(nodeKey: string, newtitle: string) {
    // let findnode = this.searchNodeByKey(nodeKey, this.dataList)
    // if (!findnode) {
    //   return
    // }
    // findnode.title = newtitle
  }
  private onSureNodeName(nodeKey: string, newtitle: string, isGroup: true) {
    // let findnode = this.searchNodeByKey(nodeKey, this.dataList)
    // if (!findnode) {
    //   return
    // }
    // let parentNodeId = null
    // var parentNode = this.getNodeParent(findnode, this.dataList)
    // if (parentNode) {
    //   parentNodeId = parentNode.key
    // }
    // // window.console.log('节点重命名')
    // if (findnode.nodeType == pagenNodeType.group) {
    //   CurrentApis.UpdateGroup(findnode.key, newtitle, parentNodeId).then((res) => {
    //     findnode.title = newtitle
    //   })
    // } else {
    //   CurrentApis.UpdatePage(findnode.key, newtitle, parentNodeId).then((res) => {
    //     findnode.title = newtitle
    //   })
    // }
    if (isGroup) {
      let param = {
        data: [
          {
            code: 'group_name',
            value: newtitle,
          },
        ],
        filter: [
          {
            code: 'id',
            type: 'EQ',
            value: nodeKey,
          },
        ],
        modelCode: 'app_component_template_group',
      }
      CurrentApis.SimpleUpdate(param).then(() => {
        //window.console.log('更新成功')
      })
    } else {
      let param = {
        data: [
          {
            code: 'template_name',
            value: newtitle,
          },
        ],
        filter: [
          {
            code: 'id',
            type: 'EQ',
            value: nodeKey,
          },
        ],
        modelCode: 'app_component_template',
      }
      CurrentApis.SimpleUpdate(param).then(() => {
        //window.console.log('更新成功')
      })
    }
    //window.console.log('节点重命名')
  }

  public async onRightMenuChoose(menuName: string) {
    //this.deleteGroup(this.currentRightNode.key)
    //window.console.log('menuName', menuName)
    switch (menuName) {
      case rightMenusEnum.delete:
        if (this.currentRightNode.nodeType == pagenNodeType.group) {
          // CurrentApis.DeleteGroup(this.currentRightNode.key).then((res) => {
          //   this.deleteNode(this.currentRightNode)
          // })
          this.deleteGroup(this.currentRightNode.key)
        } else {
          // CurrentApis.DeletePage(this.currentRightNode.key).then((res) => {

          // })
          this.deleteComponentTemplate(this.currentRightNode.groupId, this.currentRightNode.key)
        }
        break
      case rightMenusEnum.edit:
        this.onOpenPage(this.currentRightNode.key, this.currentRightNode.title, pagenNodeType.pro)
        break
      default:
        break
    }
  }

  @Emit('onOpenPage')
  public onOpenPage(pageId: string, pageName: string, pageType: pagenNodeType) {}
  @Emit('RestorPage')
  public RestorPage(pageId: string) {}
  @Emit('onClosePage')
  public onClosePage(pageId: string) {}
}
</script>

<style  lang="less" scoped>
 
.ant-card-body {
  padding: 3px;
}
.ant-btn {
  padding: 0 0px;
}
.ant-collapse-content-box {
  background-color: transparent;
}
.ant-collapse-content {
  background-color: transparent;
}
.ant-collapse-header {
  padding: 0px;
  background: #000000;
}
.titlePoint {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 8px;
}
</style>