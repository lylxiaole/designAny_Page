<template>
  <div style="width: 100%; height: 100%;background-size:cover;" :style="{ background: backgroundCute  }">
    <el-input v-if="isShowFilter" style="height:30px" v-model="filterText" placeholder="" />
    <div :style="{height:treeHeight}" style="overflow-y:auto">
      <el-tree ref="treeRef" class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode"
        :expand-on-click-node="false" @current-change="onCurrentChange" node-key="id" :current-node-key="currentNodeKey" highlight-current />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import {
  DPropAttr,
  Number_Setting,
  PropertyGroupName,
  TableColumn_Setting,
  JsonContent_Setting,
  Boolean_Setting,
  Color_Setting
} from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DMethodAttr } from '@design-any/interface/dist/LayoutAttr/MethodInfo'

import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'
import { Watch } from 'vue-property-decorator'
import { toRaw } from 'vue'

@DCompnentAttr(platform.page, getLocale().t('tip.basic'), getLocale().t('tip.classicTree'), 'Tree_001', require('../compIcons/简单树.png'))
@Options({
  components: {}
})
export default class Index extends EngineComponent {
  private get backgroundCute(): string {
    if (!this.background_img || this.background_img.length < 1) {
      return this.background
    }
    return 'url("' + this.applicationContext.getFileApiAddr(this.background_img[0].uid) + '") no-repeat center center'
  }
  // **********搜索功能************************
  private filterText: string = ''
  @Watch('filterText')
  private onFilterTextChanged(val) {
    ;(this.$refs.treeRef as any).filter(val)
  }
  private filterNode(value: string, data: any) {
    if (!value) return true
    return data.label.includes(value)
  }
  // ***********属性**************************
  private defaultProps: any = {
    children: 'children',
    label: 'label'
  }

  @DPropAttr(new JsonContent_Setting(getLocale().t('tip.treeData'), PropertyGroupName.data, true, null))
  private treeData: any[] = []

  @DPropAttr(new Boolean_Setting(getLocale().t('tip.showFilter'), PropertyGroupName.data, true, null))
  private isShowFilter: boolean = true

  @DPropAttr(new JsonContent_Setting(getLocale().t('tip.currentSelectedNodes'), PropertyGroupName.data, false, null))
  private get currentSelectedNodes() {
    let x = (this.$refs.treeRef as any).getCurrentNode()
    return [x]
  }

  // ****************************
  private get treeHeight() {
    if (this.isShowFilter) {
      return 'calc(100% - 30px)'
    } else {
      return '100%'
    }
  }

  private currentNodeKey: string = null

  private onCurrentChange(nodeData, node) {
    this.currentNodeKey = nodeData.id
    this.onNodeSelected(toRaw(nodeData))
  }
  // ****************************************************
  @DEventAttr({
    eventName: getLocale().t('tip.onNodeSelected'),
    inParams: [{ key: 'nodeData', name: 'nodeData' }],
    hasOutParam: false
  })
  private onNodeSelected(nodeData) {}
}
</script>

<style lang="less" scoped></style>
