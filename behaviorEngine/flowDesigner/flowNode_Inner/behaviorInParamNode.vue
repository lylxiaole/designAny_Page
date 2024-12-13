<template>
  <el-row style="width: 100%; height: 100%">
    <el-col :span="6">Behavior:</el-col>
    <el-col :span="18">
      <el-select v-model="currentBehaviorId" placeholder="Select" size="small">
        <el-option v-for="behavior in allBehaviors" :key="behavior.id" :label="behavior.name" :value="behavior.id" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.behaviorInparam, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class behaviorInPageNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  // *************方法*****************************
  private currentBehaviorId: string = null

  mounted() {
    this.currentBehaviorId = this.actObj.resourceFilter.behaviorId
  }
}
</script>

<style lang="less" scoped></style>
