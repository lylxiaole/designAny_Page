<template>
  <div style="width:100;height:100%">
    <el-row> {{actObj?actObj.description:''}}</el-row>
    <el-row>
      <el-col :span="6">判断条件:</el-col>
      <el-col :span="18">
        <el-select v-model="actObj.resourceFilter.judeParam" placeholder="Select" size="small">
          <el-option key="等于" label="等于" value="===" />
          <el-option key="大于" label="大于" value=">" />
          <el-option key="小于" label="小于" value="<" />
          <el-option key="大于等于" label="大于等于" value=">=" />
          <el-option key="小于等于" label="小于等于" value="<=" />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">判断值:</el-col>
      <el-col :span="18">
        <el-input v-model="actObj.resourceFilter.judeVal" placeholder="Please input" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@flowDesignNode(funcCode.oneParamJude, flowNodeType.onParamJudeNode)
@Options({
  components: {}
})
export default class oneParamJudeNode extends Vue {
  @Prop()
  private actObj: actionObj

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>