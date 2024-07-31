<template>
  <el-row style="border:1px solid #cdcdcd;width：100%;height:100%;box-sizing:border-box;background:#fff" class="verticalAlignCenter flexHorilanLayout">
    <el-row> {{actObj?actObj.description:''}}</el-row>
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

@flowDesignNode(null, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class methodInPageNode extends Vue {
  // private getNode: Function = inject('getNode')

  @Prop()
  private actObj: actionObj

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>