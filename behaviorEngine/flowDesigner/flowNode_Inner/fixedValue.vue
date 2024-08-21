<template>
  <el-row style="width:100%;height:100%">
    <el-row>
      <el-col :span="6">值类型:</el-col>
      <el-col :span="18">
        <el-select v-model="actObj.resourceFilter.type" placeholder="Select" size="small">
          <el-option key="bool" label="bool" value="bool" />
          <el-option key="string" label="string" value="string" />
          <el-option key="number" label="number" value="number" />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">值:</el-col>
      <el-col :span="18">
        <el-input v-model="actObj.resourceFilter.value" placeholder="Please input" />
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
import { EnginePage } from '@designEngine/index'

@flowDesignNode(funcCode.fixedVal, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class fixedValue extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage
  public makeParamKey(key) {
    return this.actObj.id + '&' + key
  }

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>