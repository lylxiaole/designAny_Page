<template>
  <el-row> {{actObj?actObj.description:''}}</el-row>
  <el-row>
    <el-col :span="6">选择接口:</el-col>
    <el-col :span="18">
      <el-tree-select node-key="id" :check-on-click-node="false" v-model="actObj.resourceFilter.pageId" :data="allPageInfos"
        :render-after-expand="false" />
    </el-col>
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

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  @Prop()
  private actObj: actionObj

  mounted() {
    this.loadAllApis()
  }

  private allApisTree: any[] = []
  private loadAllApis() {
    let allApis = behaviorContext.allThirtyApis
    this.allApisTree = this.orgnizeTree(allApis)
  }

  private orgnizeTree(allApis: any[]): any[] {}
}
</script>


<style lang="less" scoped>
</style>