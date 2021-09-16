<template>
  <div style="height:357px;">
    <a-col :span="7">
      <div style="height:357px;width:124px;overflow-x:hidden;overflow-y:auto;">
        <a-menu v-model="systemCompsActiveKey" style="width:124px;background-color:rgba(240,242,245,1);color:rgba(40,40,40,1);text-align:center">
          <a-menu-item v-for="group in systemComponents" :key="group.groupName" @click="onClick">
            {{group.groupName}}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-col :span="17">
      <div style="margin-left:10px;">
        <a-list class="container" style="background-color:transparent;" :grid="{ gutter: 16, column: 4 }" :dataSource="dataSource">
          <a-list-item slot="renderItem" style="background-color:transparent;" slot-scope="item, index" :span="4">
            <a-card :index="index" class="mydragItem" :compGroupName="compGroupName" :dragType="dragType" :compName="item.name" :compType="item.type"
              hoverable style="width:50px;height:55px;background-color:transparent;border:none;text-align:center">
              <div style="width:100%;height:35px;text-align:center" alt="example" slot="cover">
                <a-icon style="font-size:30px;margin-top:10px" :component="item.icon" />
              </div>
              <div style="font-size:12px;padding-top:3px;text-align:center;color:rgba(0,0,0,0.5);width:100%;height:20px" slot="cover">
                {{item.name}}
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../02common/commonMethod'
import dragHelper from '../02common/dragHelper'

import { CurrentApis, CurrentContext } from '../01designerContext'
// 所有系统组件
import { LayoutInfo, LayoutType } from '../03designerLayoutBase/LayoutBase'
import { AllComponents, ComponentBase } from '../04designerComponents'
import { DragItemData, DragItemTypeEnum } from '../03designerLayoutBase/BaseEvents'

class ComponentGroupInfo {
  constructor(_groupName: string) {
    this.groupName = _groupName
  }
  groupId: string
  groupName: string
  components: LayoutInfo[] = []
}

@Component
export default class ComponentListControl extends Vue {
  private systemCompsActiveKey: string[] = []
  private get systemComponents(): ComponentGroupInfo[] {
    var res: ComponentGroupInfo[] = []
    if (!this.systemCompGroups || !this.sys_limitGroupNames) {
      return res
    }

    for (let index = 0; index < this.systemCompGroups.length; index++) {
      const element = common.clone(this.systemCompGroups[index]) as ComponentGroupInfo
      if (this.sys_limitGroupNames.indexOf(element.groupName) < 0) {
        element.components = element.components.filter((comp) => this.sys_limitCompCodes.indexOf(comp.compCode) < 0)
        res.push(element)
      }
    }
    return res
  }

  private systemCompGroups: ComponentGroupInfo[] = []
  @Prop()
  private sys_limitGroupNames: string[]
  @Prop()
  private sys_limitCompCodes: string[]
  ///////////////////////
  private dragHelpers: dragHelper[] = []
  private dragType: DragItemTypeEnum = DragItemTypeEnum.drop_system_component
  private dataSource: LayoutInfo[] = []
  private compGroupName: string = ''
  private defaultSelectedKeys: any[] = []

  mounted() {
    this.CuteSystemComponents()
    this.renderStyle()
  }
  beforeDestroy() {
    this.clearDrags()
  }
  @Watch('systemCompsActiveKey')
  private watchSystemCompsActiveKeyChange(keys: string[]) {
    //window.console.info('systemCompsActiveKey', this.systemCompsActiveKey)
    this.$nextTick(() => {
      //window.console.log('给组件列表添加拖拽事件了')
      this.refreshDrags()
    })
  }
  changeActivekey(key: any) {
    this.renderStyle()
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
    this.dragHelpers = []
    $(this.$el)
      .find('.mydragItem')
      .each((index, element) => {
        //window.console.log('---------------------组件列表', element)
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
          var dragdata = this.GetDragData(element)
          draghelper.makeDragItemInfo(dragItem, dragdata)
          this.dragHelpers.push(draghelper)
        }
      })
    // window.console.log('---------------------11111111111111', this.dragHelpers)
  }
  /**包含组件的分组名，和组件的名字。不包含组件的类型信息 */
  private GetDragData(el: Element): DragItemData<any> {
    var dragType = $(el).attr('dragType') as DragItemTypeEnum
    var type = $(el).attr('compType') as LayoutType
    var compName = $(el).attr('compName')
    var compGroupName = $(el).attr('compGroupName')
    //window.console.info('compGroupName', compGroupName)
    var compInfo = new LayoutInfo(type, compGroupName, compName, null, '')
    //window.console.log('---------------------------------------------------compInfocompInfocompInfocompInfocompInfo', compInfo)
    var dragd = new DragItemData<any>()
    dragd.type = dragType
    dragd.dragData = compInfo
    return dragd
  }
  private clearDrags() {
    this.dragHelpers.filter((o) => {
      o.RemoveContainer()
      o.makeDomCannotDrag($(o.currentContainer).children()[0])
    })
  }
  /**计算系统自带组件的分组 */
  private CuteSystemComponents() {
    AllComponents.filter((o) => o.type == LayoutType.system_component).filter((element) => {
      let findgroup = this.systemCompGroups.filter((o) => o.groupName == element.groupName)
      if (findgroup.length < 1) {
        let newgroup = new ComponentGroupInfo(element.groupName)
        this.systemCompGroups.push(newgroup)
        // this.systemCompsActiveKey.push(newgroup.groupName)
      }
      let group = this.systemCompGroups.filter((o) => o.groupName == element.groupName)[0]
      group.components.push(element)
    })
    //window.console.info('this.systemComponents', this.systemComponents)
    let defaultSelectedKey = this.systemCompGroups[0].groupName
    this.systemCompsActiveKey.push(defaultSelectedKey)
    let findgroup = this.systemCompGroups.filter((o) => o.groupName == defaultSelectedKey)[0]
    this.compGroupName = findgroup.groupName
    findgroup.components.forEach((element) => {
      this.dataSource.push(element)
    })
  }
  private onClick(item, key, keyPath) {
    //window.console.info('item', item)
    //this.clearDrags()
    this.dataSource = []
    this.compGroupName = ''
    let findgroup = this.systemCompGroups.filter((o) => o.groupName == item.key)[0]
    //window.console.info('findgroup', Object.assign([], findgroup))
    this.compGroupName = findgroup.groupName
    //window.console.info('this.compGroupName', this.compGroupName)
    findgroup.components.forEach((element) => {
      this.dataSource.push(element)
    })
    //window.console.info('this.dataSource', Object.assign([], this.dataSource))
  }
  // ***********************************************************************
}
</script>

<style  lang="less" scoped>
@import (less) '../02common/iconfont1/iconfont.css';

.ant-card-body {
  padding: 3px;
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