<template>
  <el-row style="width:100%;height:100%">
    <el-col :span="6">键:</el-col>
    <el-col :span="18">
      <el-input v-model="actObj.resourceFilter.key" placeholder="Please input" size="small" />
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
import { funcCode } from '@design-any/interface/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.windowLocalStorage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class windowLocalStorageNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>