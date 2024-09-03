<template>
  <el-row style="width:100%;height:100%">
    <el-col>选择字典:</el-col>

    <el-col>
      <el-select v-model="actObj.resourceFilter.dicKey" placeholder="Select" size="small">
        <el-option v-for="dic in allDictionary" :key="dic.id" :label="dic.desc" :value="dic.key" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { flowDesignNode } from '../flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

import { funcCode } from '@design-any/interface/bahaviorEngine/actFunc'
import { actionObj } from '@design-any/interface/bahaviorEngine/actObject'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/LayoutInterface'

@flowDesignNode(funcCode.dictionary, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dictionaryNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {
    this.loadAllData()
  }

  private selectKey: string = null
  private allDictionary: any[] = []

  private loadAllData() {
    this.allDictionary = behaviorContext.allDictionary
  }
}
</script>


<style lang="less" scoped>
</style>