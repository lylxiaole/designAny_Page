<template>
  <a-row style="height:100%">
    <a-col style="height:100%;overflow-y:aoto" :span="12">
      <a-row>
        <a-col :span="2">
          <div style="width:10px;height:24px;background:rgba(245,166,35,1);"></div>
        </a-col>
        <a-col :span="9">
          <div style="font-size:18px;font-weight:600;color:rgba(0,0,0,0.85);line-height:18px;margin-top:3px">控件名称</div>
        </a-col>
      </a-row>

      <a-tree class="draggable-tree" style="height:100%;overflow:auto" :treeData="controlTreeData" @select="onSelectControl"
        :selectedKeys.sync="currentSelectedControlKey">
      </a-tree>
    </a-col>

    <a-col style="height:100%;overflow-y:hidden" :span="12">
      <a-row>
        <a-col :span="2">
          <div style="width:10px;height:24px;background:rgba(245,166,35,1);"></div>
        </a-col>
        <a-col :span="9">
          <div style="font-size:18px;font-weight:600;color:rgba(0,0,0,0.85);line-height:18px;margin-top:3px">控件属性</div>
        </a-col>
      </a-row>

      <a-row style="height:100%;overflow:auto">
        <a-tree class="draggable-tree" style="margin-bottom:50px" :treeData="controlPropertyTreeData" @select="selectProperty"
          :selectedKeys.sync="currentSelectedPropertyKey">
          <div slot="node" slot-scope="{key,title,bindingCount}" style="position:relative;justify-content:left"
            class="flexHorilanLayout pageFontHover">
            <a-tag v-if="bindingCount>0" color="#f50">
              绑
            </a-tag>
            <span>{{title}}</span>
          </div>
        </a-tree>
      </a-row>

    </a-col>
  </a-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'
import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'
import addModelWindow from './addModelWindow.vue'
import modelBingding from '../../02common/commonClasses/modelBingding'
import {
  Property,
  PropertyType,
  Text_Property,
  Behavior_Property,
  Number_Property,
  PropertyGroupName,
  Color_Property,
  UploadFile_Property,
  Boolean_Property
} from '../../03designerLayoutBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

class TreeInfo {
  public key: string
  public title: string
  public bindingCount: number = 0
  public scopedSlots: any = { title: 'node' }
  public children: TreeInfo[] = []
}

@Component
export default class currentPageControls extends Vue {
  @Prop() currentComponents: ComponentBase[]
  @Prop() allBindingInfos: bindingModelVal_InProperty[]

  /**当前选中的控件Id */
  private currentSelectedControlKey: string[] = []
  /**当前控件树列表 */
  private get controlTreeData(): TreeInfo[] {
    if (!this.currentComponents) {
      return []
    }
    var res = this.cuteTreeData(this.currentComponents)
    this.currentSelectedControlKey.push(res[0].key)
    //window.console.info('res----------', res)
    if (!res) {
      return []
    }
    return res
  }
  /**当前选中的属性Id */
  private currentSelectedPropertyKey: string[] = []
  /**当前选中的控件的属性列表 */
  private get controlPropertyTreeData(): TreeInfo[] {
    var treenodes: TreeInfo[] = []
    var currentSelectedControl = this.getCurrentSelectControl(this.currentSelectedControlKey[0], this.currentComponents)
    if (!currentSelectedControl) {
      return treenodes
    }

    currentSelectedControl.LayoutProperties.filter((o) => {
      if (o.canBindModel) {
        var treen = new TreeInfo()
        treen.key = o.id
        treen.title = o.propertyName
        treen.scopedSlots = { title: 'node' }
        treen.bindingCount = this.allBindingInfos.filter((p) => p.propertyId == o.id && p.modelName).length

        treenodes.push(treen)
      }
    })
    return treenodes
  }

  /*********************************************************** */

  /** 选择控件,触发事件 */
  private onSelectControl(controlIds: string[]) {
    this.$forceUpdate()
  }
  /** 选择控件属性,触发事件 */
  private selectProperty(selectPropertyIds: string[]) {
    let propertyId = selectPropertyIds[0]
    var currentSelectedControl = this.getCurrentSelectControl(this.currentSelectedControlKey[0], this.currentComponents)
    let property = currentSelectedControl.LayoutProperties.find((o) => o.id == propertyId)
    this.onSelectProperty(currentSelectedControl, property)
  }
  /*********************************************************** */
  private cuteTreeData(comps: ComponentBase[]): TreeInfo[] {
    var treeNodes: TreeInfo[] = []
    comps.filter((comp) => {
      var treeNode = new TreeInfo()
      treeNode.key = comp.Id
      treeNode.title = !comp.name ? '未命名' : comp.name
      treeNodes.push(treeNode)
    })
    return treeNodes
  }

  private getCurrentSelectControl(controlId: string, components: ComponentBase[]): ComponentBase {
    if (!controlId) {
      return null
    }
    var currentControl = components.filter((o) => o.Id == controlId)[0]
    if (currentControl) {
      return currentControl
    }
    for (let index = 0; index < components.length; index++) {
      const comp = components[index]
      let findInChildren = this.getCurrentSelectControl(controlId, comp.selectedChildren as ComponentBase[])
      if (findInChildren) {
        return findInChildren
      }
    }
    return null
  }
  /*********************************************************** */
  @Emit('onSelectProperty')
  private onSelectProperty(comp: ComponentBase, property: Property) {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>