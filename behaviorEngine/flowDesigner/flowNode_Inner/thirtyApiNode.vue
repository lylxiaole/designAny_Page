<template>
  <div style="width:calc(100% - 80px)">
    <el-row>外部Api</el-row>
  </div>
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

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  @Prop()
  private actObj: actionObj

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>