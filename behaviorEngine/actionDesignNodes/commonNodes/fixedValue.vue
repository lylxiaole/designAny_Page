<template>
  <el-row style="width: 100%; height: 100%">
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">ValueType:</el-col>
      <el-col :span="18">
        <el-select v-model="actObj.resourceFilter.type" placeholder="Select" size="small">
          <el-option key="bool" label="bool" value="bool" />
          <el-option key="string" label="string" value="string" />
          <el-option key="number" label="number" value="number" />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="width: 100%; height: 50%">
      <el-col :span="6">Value:</el-col>
      <el-col :span="18">
        <el-input v-model="actObj.resourceFilter.value" placeholder="Please input" size="small" />
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode, flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
 import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.fixedVal, flowNodeType.funcNormalNode)
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

  mounted() {}
}
</script>

<style lang="less" scoped></style>
