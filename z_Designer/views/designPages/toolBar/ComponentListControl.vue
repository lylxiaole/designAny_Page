<template>
  <el-row style="height:357px;">
    <el-col :span="7">
      <div style="height:357px;width:124px;overflow-x:hidden;overflow-y:auto;">
        <div v-for="group in systemComponents" :key="group.groupName" class="compGroup verticalAlignCenter flexHorilanLayout" @click="onClick(group)">
          {{group.groupName}}
        </div>
      </div>
    </el-col>
    <el-col :span="17">
      <div style="display:flex;flex-wrap: wrap">
        <div v-for="item in dataSource" :key="item.compCode" class="mydragItem" :dragType="dragType" :compName="item.name" :compCode="item.compCode"
          :compType="item.type" style="width:50px;height:55px;background-color:transparent;border:none;text-align:center">
          <div style="width:100%;height:35px;text-align:center">
            <el-image style="font-size:30px;" :src="item.icon" />
          </div>
          <div style="font-size:12px;padding-top:3px;text-align:center;color:rgba(0,0,0,0.5);width:100%;height:20px" slot="cover">
            {{item.name}}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone, serialize } from '@src/utils'
import dragHelper from '@src/designEngine/02common/dragHelper'
// 所有系统组件
import * as engin from '@src/designEngine'

class ComponentGroupInfo {
  constructor(_groupName: string) {
    this.groupName = _groupName
  }
  groupId: string
  groupName: string
  components: engin.LayoutInfo[] = []
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
      const element = deepClone(this.systemCompGroups[index]) as ComponentGroupInfo
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
  private dragType: engin.DragItemTypeEnum = engin.DragItemTypeEnum.drop_system_component
  private dataSource: engin.LayoutInfo[] = []
  private compGroupName: string = ''
  private defaultSelectedKeys: any[] = []

  mounted() {
    this.cuteSystemComponents()
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
    window.console.log('refreshDrags')
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
          window.console.log('dragItem:', dragItem)
          draghelper.makeDomCanDrag(dragItem)
          //获取dom节点上的信息，这些信息包含了组件的简要信息
          var dragdata = this.organizeDragData(element)
          draghelper.makeDragItemInfo(dragItem, dragdata)
          this.dragHelpers.push(draghelper)
        }
      })
  }
  /**包含组件的分组名，和组件的名字。不包含组件的类型信息 */
  private organizeDragData(el: Element): engin.DragItemData<any> {
    let dragType = $(el).attr('dragType') as engin.DragItemTypeEnum
    let type = $(el).attr('compType') as engin.LayoutType
    let compName = $(el).attr('compName')
    let compGroupName = $(el).attr('compGroupName')
    let compCode = $(el).attr('compCode')
    let compInfo = new engin.LayoutInfo(type, compGroupName, compName, null, '', compCode)
    //window.console.log('---------------------------------------------------compInfocompInfocompInfocompInfocompInfo', compInfo)
    let dragd = new engin.DragItemData<any>()
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
  private cuteSystemComponents() {
    // window.console.log('cuteSystemComponents:', engin.allComponents)
    engin.allComponents
      .filter((o) => o.type == engin.LayoutType.system_component)
      .filter((element) => {
        let findgroup = this.systemCompGroups.filter((o) => o.groupName == element.groupName)
        if (findgroup.length < 1) {
          let newgroup = new ComponentGroupInfo(element.groupName)
          this.systemCompGroups.push(newgroup)
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
  private onClick(item) {
    this.dataSource = []
    this.compGroupName = ''
    let findgroup = this.systemCompGroups.filter((o) => o.groupName == item.groupName)[0]
    this.compGroupName = findgroup.groupName
    findgroup.components.forEach((element) => {
      this.dataSource.push(element)
    })
  }
  // ***********************************************************************
}
</script>

<style  lang="less" scoped>
.titlePoint {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 8px;
}

.compGroup {
  width: 100%;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  background-color: rgba(240, 242, 245, 1);
  color: rgba(40, 40, 40, 1);
}

.mydragItem.container {
  padding: 20px 10px;
}
</style>