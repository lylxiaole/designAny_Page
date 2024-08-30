<template>
  <el-row style="width:100%;height:100%">
    <el-row>
      <el-col :span="6">选择页面:</el-col>
      <el-col :span="18">
        <el-tree-select node-key="id" :check-on-click-node="false" v-model="actObj.resourceFilter.pageId" :data="allPageInfos"
          :render-after-expand="true" @node-click="onCurrentNodeChange" />
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
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
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  private currentSelectId: string = null
  private allPageInfos: any[] = []

  mounted() {
    this.allPageInfos = behaviorContext.getAllPageInfos()
    this.currentSelectId = this.actObj.resourceFilter.pageId
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


<style lang="less" scoped>
</style>