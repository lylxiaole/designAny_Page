<template>
  <div style="width:100;height:100%">
    <el-row> {{actObj?actObj.description:''}}</el-row>
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

@flowDesignNode(funcCode.oneParamJude, flowNodeType.oneParamJudeNode)
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