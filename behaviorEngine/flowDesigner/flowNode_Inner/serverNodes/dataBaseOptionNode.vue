<template>
  <el-row style="width: 100%; height: 100%">
    你好，我是数据库
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.dataBaseOptions, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dataBaseOptionNode extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  mounted() {}
}
</script>

<style lang="less" scoped></style>
