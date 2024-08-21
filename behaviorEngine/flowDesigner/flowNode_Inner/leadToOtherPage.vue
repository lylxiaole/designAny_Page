<template>
  <el-row style="width:100%;height:100%">
    <el-row> {{actObj?actObj.description:''}}</el-row>
    <el-row>
      <el-col :span="6">选择页面:</el-col>
      <el-col :span="18">
        <el-tree-select node-key="id" :check-on-click-node="false" v-model="actObj.resourceFilter.pageId" :data="allPageInfos"
          :render-after-expand="false" @current-change="onCurrentNodeChange" />
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
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@designEngine/index'

@flowDesignNode(funcCode.leadToOtherPage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class fixedValue extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  private allPageInfos: any[] = []

  mounted() {
    this.allPageInfos = behaviorContext.getAllPageInfos()
  }

  private onCurrentNodeChange(nodedata, node, e: Event) {
    if (nodedata.type === 'group') {
      e.stopPropagation()
      return
    }
  }
}
</script>


<style lang="less" scoped>
</style>