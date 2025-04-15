<template>
  <el-row style="width: 100%; height: 100%">
    <el-col :span="6">Page:</el-col>
    <el-col :span="18">
      <el-tree-select node-key="id" :check-on-click-node="false" v-model="actObj.resourceFilter.pageId" :data="allPageInfos"
        :render-after-expand="true" @node-click="onCurrentNodeChange" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.pagePopup, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class fixedValue extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  private currentSelectId: string = null
  private allPageInfos: any[] = []

  mounted() {
    let allPage = behaviorContext.getAllPageInfos()

    this.allPageInfos = this.getPopupPages(deepClone(allPage))
    this.currentSelectId = this.actObj.resourceFilter.pageId
  }

  private getPopupPages(allPage: any[]) {
    for (let index = 0; index < allPage.length; index++) {
      const element = allPage[index]
      if (element.type === 'group') {
        element.children = element.children.filter((o) => o.pageType === 1 || o.page === 'group')
      }
    }
    return allPage
  }

  private onCurrentNodeChange(nodedata, node, obj) {
    if (nodedata.type === 'group') {
      throw '分组不能被选中'
    }
    this.currentSelectId = nodedata.id
    this.actObj.resourceFilter.pageId = nodedata.id
  }
}
</script>

<style lang="less" scoped></style>
