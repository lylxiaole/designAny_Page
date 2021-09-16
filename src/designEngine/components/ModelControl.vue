<template>
  <div style="height:357px;overflow-x:hidden;overflow-y:auto;">
    <a-col :span="7">
      <div style="height:357px;width:124px;overflow-x:hidden;overflow-y:auto;background-color:rgba(240,242,245,1)">
        <div style="height:306px;width:124px;overflow-x:hidden;overflow-y:auto;margin-top:9px;">
          <a-menu v-model="systemCompsActiveKey" style="background-color:rgba(240,242,245,1);color:rgba(40,40,40,1);text-align:center">
            <a-menu-item v-for="group in systemComponents" :key="group.groupId" @click="onClick">
              {{group.groupName}}
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
            @click="addModel">
            <a-icon style="font-size:17px" :component="addmodel" />添加模型
          </a-button>
        </a-col>
      </a-row>
      <a-row style="width:302px;height:1px;background-color:rgba(233,233,233,1);margin-top:14px;margin-left:10px;"></a-row>
      <div style="height:280px;overflow-x:hidden;overflow-y:auto;margin-top:14px;" @scroll="onScroll">
        <a-list class="container" style="background-color:rgba(255,255,255,1)" :grid="{ gutter: 16, column: 4 }" :dataSource="dataSource">
          <a-list-item slot="renderItem" style="background-color:rgba(255,255,255,1);" slot-scope="item, index" :span="4">
            <a-card :index="index" class="mydragItem" :dragType="dragType" :groupId="groupId" :compName="item.modelName" :compType="item.type"
              hoverable :modelId="item.id" style="width:50px;height:55px;background-color:rgba(255,255,255,1);border:none;text-align:center"
              @dblclick="onDblClick(item)">
              <div style="width:100%;height:35px;text-align:center" alt="example" slot="cover">
                <a-tooltip>
                  <template slot="title" placement="bottom">
                    {{item.modelName}}
                  </template>
                  <a-icon style="font-size:32px;margin-top:10px" :component="icon" />
                </a-tooltip>
              </div>
              <div
                style="font-size:12px;padding-top:3px;text-align:center;color:rgba(0,0,0,0.5);width:100%;height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                slot="cover">
                {{item.modelName}}
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </a-col>
    <addBasemodel ref="createModal" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../02common/commonMethod'
import dragHelper from '../02common/dragHelper'

import { CurrentApis, CurrentContext } from '../01designerContext'
import { LayoutInfo, LayoutType } from '../03designerLayoutBase/LayoutBase'
import { modelControlIco, addModelIco, searchIco } from '../assets/icons.js'

// 所有系统组件
import { AllComponents, ComponentBase } from '../04designerComponents'

import { DragItemData, DragItemTypeEnum } from '../03designerLayoutBase/BaseEvents'
import { ModelInfo } from '../02common/impResourcesCache/modelAnalysis'
import { modelAnalysis } from '../02common/impResourcesCache'
import AddBasemodel from '../../../views/model/modules/AddBasemodel.vue'

class ComponentGroupInfo {
  // constructor(_groupName: string) {
  //   this.groupName = _groupName
  // }
  groupName: string
  groupId: string
  components: ModelInfo[] = []
}

@Component({
  components: {
    addBasemodel: AddBasemodel,
  },
})
export default class ModelControl extends Vue {
  private systemCompsActiveKey: string[] = []
  private systemComponents: ComponentGroupInfo[] = []
  private dragHelpers: dragHelper[] = []
  private currentPageNumber: number = 1
  private modelTotalNumber: number = 1
  private dragType: DragItemTypeEnum = DragItemTypeEnum.drop_model_component
  private modelName: string = ''
  private modelCode: string = ''
  private groupId: number = 0
  private dataSource: ModelInfo[] = []
  private isSo: boolean = false
  private icon: any
  private addmodel: any
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
    this.$nextTick(() => {
      this.refreshDrags()
    })
  }
  onClick(item) {
    this.addmodel = addModelIco
    this.isSo = true
    this.dataSource = []
    var key = item.key
    if (!key) {
      return
    }
    let pagenumber = 1
    let pageSize = 20
    this.modelName = ''
    this.groupId = key
    CurrentApis.GetModelPageDetail(pagenumber, pageSize, this.groupId, this.modelName, this.modelCode).then((res: any) => {
      this.modelTotalNumber = res.totalPages
      this.currentPageNumber = 1
      res.content.forEach((element) => {
        let findgroup = this.systemComponents.filter((o) => o.groupId == element.groupId)[0]
        if (findgroup) {
          var findchild = findgroup.components.find((o) => o.id == element.id)
          var key = 'groupName'
          element[key] = findgroup.groupName
          if (!findchild) {
            //过滤一下显示属性
          }
          let tempPropertyArr = []
          element.modelPropertyList.forEach((item) => {
            if (item.show && item.propertyCode != 'id') {
              tempPropertyArr.push(item)
            }
          })
          element.modelPropertyList = tempPropertyArr
          findgroup.components.push(element)
          this.dataSource.push(element)
        }
      })

      this.$nextTick(() => {
        this.refreshDrags()
      })
    })
  }

  renderStyle() {
    this.$nextTick(() => {
      $(this.$el).find('.ant-collapse-content').css('background-color', '#03303B')
      $(this.$el).find('.ant-collapse-content').css('border', 'none')
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
    var compGroupName = $(el).attr('groupName')
    var groupId = $(el).attr('groupId')
    var modelId = $(el).attr('modelId')
    let group = this.systemComponents.find((o) => o.groupId == groupId)
    var model = null
    if (group) {
      model = group.components.find((item) => item.id == modelId)
    }
    var compInfo = new LayoutInfo(LayoutType.model_component, compGroupName, compName, null, '', '', model)
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
    this.icon = modelControlIco
    let param = { filter: [], modelCode: 'model_group' }
    CurrentApis.SimpleListQuery(param).then((res: any) => {
      //this.systemComponents = []
      res.forEach((element) => {
        let newgroup = new ComponentGroupInfo()
        newgroup.groupName = element.group_name
        newgroup.groupId = element.id.toString()
        this.systemComponents.push(newgroup)
        //this.groupModel(newgroup)
      })
      let selectId = this.systemComponents[0].groupId
      this.systemCompsActiveKey.push(selectId)
      let param = { key: selectId }
      this.onClick(param)
    })
  }
  private onSearch(e) {
    let pagenumber = 1
    let pageSize = 20
    this.modelName = e.target.value
    CurrentApis.GetModelPageDetail(pagenumber, pageSize, this.groupId, this.modelName, this.modelCode).then((res: any) => {
      this.modelTotalNumber = res.totalPages
      this.currentPageNumber = 1
      var findgroup = this.systemComponents.find((o) => o.groupId == this.groupId.toString())
      findgroup.components = []
      this.dataSource = []
      res.content.forEach((element) => {
        //过滤一下显示属性
        let tempPropertyArr = []
        element.modelPropertyList.forEach((item) => {
          if (item.show && item.propertyCode != 'id') {
            tempPropertyArr.push(item)
          }
        })
        element.modelPropertyList = tempPropertyArr
        findgroup.components.push(element)
        this.dataSource.push(element)
      })
      this.dragHelpers = []
      this.$nextTick(() => {
        this.refreshDrags()
      })
    })
  }
  private onScroll(element: any) {
    let top = element.target.scrollTop
    let clientheight = element.target.clientHeight
    let scrollheight = element.target.scrollHeight
    if (top + clientheight + 1 >= scrollheight) {
      if (this.currentPageNumber > this.modelTotalNumber) {
        return
      }
      this.currentPageNumber++
      // let parameter = this.currentPageNumber
      let pagenumber = this.currentPageNumber
      let pageSize = 10
      CurrentApis.GetModelPageDetail(pagenumber, pageSize, this.groupId, this.modelName, this.modelCode).then((res: any) => {
        this.modelTotalNumber = res.totalPages
        res.content.forEach((element) => {
          var findgroup = this.systemComponents.find((o) => o.groupId == element.groupId)
          if (findgroup) {
            var findchild = findgroup.components.find((o) => o.id == element.id)
            if (!findchild) {
              findgroup.components.push(element)
              this.dataSource.push(element)
            }
          }
        })
        this.$nextTick(() => {
          this.refreshDrags()
        })
      })
    }
  }
  private addGroup() {
    let newgroup = new ComponentGroupInfo()
    newgroup.groupName = '新建分组'
    newgroup.groupId = CurrentApis.GetServerUUID()
    this.systemComponents.push(newgroup)
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
      modelCode: 'model_group',
    }
    CurrentApis.SimpleAdd(param).then((res: any) => {})
  }
  @Emit('onAddModel')
  private addModel() {}

  private get createModal(): any {
    return this.$refs.createModal as any
  }
  private onDblClick(item) {
    this.createModal.$on('onClose', () => {
      modelAnalysis.clearCache()
    })
    this.createModal.edit(item)
  }
}
</script>

<style  lang="less" scoped>
@import (less) '../02common/iconfont1/iconfont.css';

.ant-card-body {
  padding: 3px;
}
.ant-btn {
  padding: 0 0px;
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