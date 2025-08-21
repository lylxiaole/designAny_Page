<template>
  <el-row style="width: 100%; height: 100%;" class="funcNodeUI">
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
import { flowDesignNode } from '@behaviorEngine/flowDesigner/flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.leadToOtherPage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class fixedValue extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  private currentSelectId: string = null
  private allPageInfos: any[] = []

  mounted() {
    let allPage = behaviorContext.getAllPageInfos()
    this.allPageInfos = this.filterPopupPages(deepClone(allPage))
    this.currentSelectId = this.actObj.resourceFilter.pageId
    this.cuteInparams(this.currentSelectId)
  }

  private filterPopupPages(allPage: any[]) {
    for (let index = 0; index < allPage.length; index++) {
      const element = allPage[index]
      if (element.type === 'group') {
        element.children = element.children.filter((o) => o.pageType === 0 || o.page === 'group')
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
    this.cuteInparams(this.currentSelectId)
  }

  private cuteInparams(val) {
    this.actObj.resourceFilter.pageId = val
    if (!val) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
      return
    }
    // *******************************************
    let inparams = []
    inparams.push({
      key: makeParamKey(this.actObj.id, 'pageInParam'),
      name: 'pageInParam'
    } as any)

    this.actObj.inputParams = inparams
    // *******************************************
    this.actObj.outParam = null
  }
}
</script>

<style lang="less" scoped></style>
