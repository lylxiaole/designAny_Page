<template>
  <el-row style="width:100%;height:100%">
    <el-row>
      <el-col :span="6">键:</el-col>
      <el-col :span="18">
        <el-input v-model="actObj.resourceFilter.key" placeholder="Please input" />
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
import { funcCode } from '@design-any/interface/dist'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/dist/index'

@flowDesignNode(funcCode.windowLocalStorage, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class windowLocalStorageNode extends Vue {
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