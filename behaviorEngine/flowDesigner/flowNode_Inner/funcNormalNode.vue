<template>
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
import { EnginePage } from '@design-any/interface/dist'

@flowDesignNode(null, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class funcNormalNode extends Vue {
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