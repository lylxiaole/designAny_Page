<template>
  <div style="width:100%;">
    <AddModelWindow @onSure="onAddNewModelBinding" :currentPage="currentPage" />
    <EditModelBindWindow ref="editModelWindow" @onSure="onEditModelBinding"></EditModelBindWindow>

    <a-tree class="draggable-tree" :treeData="modelTreeData" :selectedKeys="modalTreeSelectedKeys" style="height:100%;width:100%;overflow:hidden"
      @select="onTreeSelect">
      <div slot="modelitem" slot-scope="{key,title}" style="position:relative;width:100%;">
        <a-row>
          <a-col :span="2">
            <a-icon style="margin-left:8px;cursor:pointer" type="edit" @click="(e)=>{e.stopPropagation();editModal(key,title);}" />
          </a-col>
          <a-col :span="18">
            <a-tooltip>
              <template slot="title">
                {{title}}
              </template>
              <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                {{title}}
              </div>
            </a-tooltip>
          </a-col>
          <a-col :span="4">
            <a-icon style="margin-left:8px;cursor:pointer" type="close" @click="()=>{deleteModal(key,title)}" />
          </a-col>
        </a-row>
      </div>
    </a-tree>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'
import modelBingding from '../../02common/commonClasses/modelBingding'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
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

import addModelWindow from './addModelWindow.vue'
import editModelBindWindow from './editModelBindWindow.vue'

class TreeInfo {
  public key: string
  public title: string
  public children: TreeInfo[] = []
  get scopedSlots(): any {
    return { title: 'modelitem' }
  }
}

///模型实例列表
@Component({
  components: {
    AddModelWindow: addModelWindow,
    EditModelBindWindow: editModelBindWindow
  }
})
export default class modelCase extends Vue {
  @Prop() controlPropertyBindModelInfo: bindingModelVal_InProperty
  @Prop() currentPage: PageBase
  //当前页面中所有的模型实例树
  private modelTreeData: TreeInfo[] = []

  private get modalTreeSelectedKeys(): string[] {
    if (!this.controlPropertyBindModelInfo) {
      return []
    }
    return [this.controlPropertyBindModelInfo.modelName]
  }

  mounted() {
    this.cuteModelTree()
  }

  private cuteModelTree() {
    if (!this.controlPropertyBindModelInfo || !this.currentPage) {
      this.modelTreeData = []
    }
    var treenodes: TreeInfo[] = []
    this.currentPage.modelBindings.filter((mb) => {
      var node = new TreeInfo()
      node.key = mb.modelBindingName
      node.title = mb.modelBindingName
      treenodes.push(node)
    })
    this.modelTreeData = treenodes
  }

  //添加一个模型实例
  public onAddNewModelBinding(modelBinding: modelBingding) {
    this.currentPage.addModelBinding(modelBinding)
    this.cuteModelTree()
  }

  //选择一个模型实例
  private onTreeSelect(modelNames: string[]) {
    // window.console.log('选择模型实例')
    if (modelNames.length < 1) {
      this.controlPropertyBindModelInfo.modelName = ''
      this.controlPropertyBindModelInfo.modelCodes = []
      this.onSelectModel()
      return
    }
    var modelName = modelNames[0]
    if (this.controlPropertyBindModelInfo) {
      this.controlPropertyBindModelInfo.modelName = modelName
      this.controlPropertyBindModelInfo.modelCodes = []
      this.onSelectModel()
    } else {
      window.console.error('选择模型实例时出错了')
    }
  }

  private deleteModal(modelKey: string, modelName: string) {
    this.currentPage.removeModelBinding(modelKey)

    if (this.controlPropertyBindModelInfo && this.controlPropertyBindModelInfo.modelName == modelName) {
      this.controlPropertyBindModelInfo.modelName = null
      this.controlPropertyBindModelInfo.modelCodes = []
    }
    this.cuteModelTree()
  }

  private editModal(modelKey: string, modelName: string) {
    var mb = this.currentPage.modelBindings.find((o) => o.modelBindingName == modelKey)
    ;(this.$refs.editModelWindow as any).startEdit(mb)
  }

  public onEditModelBinding(modelBinding: modelBingding) {
    // window.console.log('编辑模型实例成功', modelBinding)
    this.currentPage.updateModelBind(modelBinding)
    // this.currentPage.modelBindings = this.currentPage.modelBindings
    // this.$forceUpdate()
  }

  @Emit('onSelectModel')
  private onSelectModel() {}
}
</script>



<style lang="less"scoped>
/deep/ .ant-tree-node-content-wrapper {
  width: 100%;
}
</style>