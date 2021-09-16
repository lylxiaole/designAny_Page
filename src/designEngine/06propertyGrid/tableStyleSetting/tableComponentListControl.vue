<template>
  <a-collapse style="overflow-x:hidden;overflow-y:auto;background-color:transparent;border:none;background:rgba(9,87,106,1);"
    v-model="systemCompsActiveKey" @change="changeActivekey" accordion>

    <a-collapse-panel v-for="group in systemComponents" :key="group.groupId" :showArrow="false" class="card-list"
      style="padding:0px;background:rgba(9,87,106,1);;border-bottom:1px solid rgba(255,255,255,0.3)">
      <div class="flexHorilanLayout" slot="header" style="color:#ffffff;align-items:left; justify-content:left">
        <span class="titlePoint themeBackground"></span>
        <span>{{group.groupName}}</span>
      </div>

      <a-list class="container" style="background-color:transparent" :grid="{ gutter: 16, column: 4 }" :dataSource="group.components">
        <a-list-item slot="renderItem" style="background-color:transparent;" slot-scope="item, index" :span="4">
          <a-card :index="index" class="mydragItem" :dragType="dragType" :compGroupName="group.groupName" :compName="item.name" :compType="item.type"
            hoverable style="width:50px;height:55px;background-color:transparent;border:none;text-align:center" :compId="item.Id" :sourceId="item.Id">
            <div style="width:100%;height:35px;text-align:center" alt="example" slot="cover">
              <span v-if="item.Id?true:false" style="font-size:30px;color:#fff;" :class="'themeForecolor iconfont icon-kapian'"></span>
              <a-icon style="font-size:30px;margin-top:10px" :component="item.icon" />
            </div>
            <div style="font-size:12px;padding-top:3px;text-align:center;color:rgba(255,255,255,0.7);width:100%;height:20px" slot="cover">
              {{item.name}}
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </a-collapse-panel>

  </a-collapse>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import dragHelper from '../../02common/dragHelper'
import { CurrentApis } from '../../01designerContext'
import { LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import { AllComponents } from '../../04designerComponents'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import PageBase from '../../05designerLayouts/PageBase'

class ComponentGroupInfo {
  constructor(_groupName: string) {
    this.groupName = _groupName
  }
  groupName: string
  components: any[] = []
  groupId: string
  componentType: DragItemTypeEnum
}

@Component
export default class TableComponentListControl extends Vue {
  private systemCompsActiveKey: string[] = []
  private systemComponents: ComponentGroupInfo[] = []
  private dragHelpers: dragHelper[] = []
  private dragType: DragItemTypeEnum = DragItemTypeEnum.drop_system_component

  mounted() {
    this.CuteSystemComponents()
    this.renderStyle()
  }
  beforeDestroy() {
    this.clearDrags()
  }
  @Watch('systemCompsActiveKey')
  private watchSystemCompsActiveKeyChange(keys: string[]) {
    this.$nextTick(() => {
      //window.console.log('给组件列表添加拖拽事件了')
      this.refreshDrags()
    })
  }
  changeActivekey(key: any) {
    //变更选择的分组
    let tempGroups = this.systemComponents.find((item) => item.groupId === key)
    if (!tempGroups || !key) {
      this.renderStyle()
      return
    }
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
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      //window.console.log('查询分组', res)
      tempGroups.components = []
      res.forEach((element) => {
        let template = new PageBase()
        template.name = element.template_name
        template.Id = element.id
        //template.icon = 'icon-kapian'
        tempGroups.components.push(template)
      })
      this.$nextTick(() => {
        this.refreshDrags()
      })
    })
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
    $(this.$el)
      .find('.mydragItem')
      .each((index, element) => {
        // window.console.log('组件列表', element)
        let find = this.dragHelpers.filter((o) => o.currentContainer == element)[0]
        if (!find) {
          //注册拖拽插件
          let draghelper = new dragHelper(element)
          draghelper.makeDomContainer()
          draghelper.makeContainerCannotDrop()
          //让每个包装层里面的内容可拖拽
          let dragItem = $(element).children()[0]

          draghelper.makeDomCanDrag(dragItem)
          //获取dom节点上的信息，这些信息包含了组件的简要信息
          let dragdata = this.GetDragData(element)
          draghelper.makeDragItemInfo(dragItem, dragdata)
          this.dragHelpers.push(draghelper)
        }
      })
  }
  /**包含组件的分组名，和组件的名字。不包含组件的类型信息 */
  private GetDragData(el: Element): DragItemData<any> {
    //compId
    let compId = $(el).attr('compId')
    if (!compId) {
      let dragType = $(el).attr('dragType') as DragItemTypeEnum
      let type = $(el).attr('compType') as LayoutType
      let compName = $(el).attr('compName')
      let compGroupName = $(el).attr('compGroupName')
      let compInfo = new LayoutInfo(type, compGroupName, compName, null, '')
      let dragd = new DragItemData<any>()
      dragd.type = dragType
      dragd.dragData = compInfo
      return dragd
    } else {
      let compName = '组件模板'
      let compGroupName = '组件模板'
      let sourceId = $(el).attr('sourceId')
      let compInfo = new LayoutInfo(LayoutType.component_template, compGroupName, compName, $(el).attr('compId'), '', sourceId)
      let dragdata: DragItemData<any> = { type: DragItemTypeEnum.drop_component_template, dragData: compInfo }
      return dragdata
    }
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
      let findgroup = this.systemComponents.filter((o) => o.groupName == element.groupName)
      if (findgroup.length < 1) {
        let newgroup = new ComponentGroupInfo(element.groupName)
        this.systemComponents.push(newgroup)
      }
      let group = this.systemComponents.filter((o) => o.groupName == element.groupName)[0]
      group.components.push(element)
    })
    let param = { filter: [], modelCode: 'app_component_template_group' }
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      res.forEach((element) => {
        let newgroup = new ComponentGroupInfo(element.group_name)
        newgroup.groupName = element.group_name
        newgroup.groupId = element.id.toString()
        this.systemComponents.push(newgroup)
      })
    })
  }
}
</script>

<style  lang="less" scoped>
@import (less) '../../02common/iconfont1/iconfont.css';

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
  width: 4px;
  height: 4px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 1);
}
.card-list .ant-collapse-item .ant-collapse-no-arrow {
  background: rgba(9, 87, 106, 1) !important;
}
</style>