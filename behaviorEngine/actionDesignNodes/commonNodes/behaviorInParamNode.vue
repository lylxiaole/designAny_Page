<template>
  <el-row style="width: 100%; height: 100%">
    <el-col :span="6">{{i18n('tip.paramName')}}:</el-col>
    <el-col :span="18">
      <el-input v-model="actObj.resourceFilter.behaviorName" placeholder="Please Input Behavior Name" size="small" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '@behaviorEngine/flowDesigner/flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@flowDesignNode(funcCode.behaviorInparam, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class behaviorInPageNode extends Vue {
  @Prop()
  private i18n: any

  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {}
}
</script>

<style lang="less" scoped></style>
