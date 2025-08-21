<template>
  <el-row style="width: 100%; height: 100%;" class="funcNodeUI">
    <el-select v-model="selectKey" placeholder="Select" size="small">
      <el-option v-for="dic in allDictionary" :key="dic.id" :label="dic.key" :value="dic.key" />
    </el-select>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { flowDesignNode } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@flowDesignNode(funcCode.dictionary, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dictionaryNode extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage

  mounted() {
    this.loadAllData()
  }

  private get selectKey(): string {
    if (this.actObj && this.actObj.resourceFilter) {
      return this.actObj.resourceFilter.dicKey
    } else {
      return null
    }
  }

  private set selectKey(val: string) {
    if (!this.actObj) {
      return
    }
    if (!this.actObj.resourceFilter) {
      this.actObj.resourceFilter = {}
    }
    this.actObj.resourceFilter.dicKey = val
  }

  private allDictionary: any[] = []

  private async loadAllData() {
    this.allDictionary = await behaviorContext.getAllDictionary()
  }
}
</script>

<style lang="less" scoped></style>
