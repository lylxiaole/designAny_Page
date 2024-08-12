<template>
  <div style="width:100;height:100%">
    <el-select style="width:100%" v-model="selectedKey">
      <el-option v-for="dic in allDictionarys" :key="dic.id" :label="dic.value" :value="dic.key" />
    </el-select>
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
import behaviorContext from '@behaviorEngine/01designerContext/context'

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  @Prop()
  private actObj: actionObj

  mounted() {
    this.loadData()
  }

  private selectedKey: string = null
  @Watch('selectedKey')
  private onselectedKeyChanged(val) {
    if (!val) {
      this.actObj.outParam = null
      this.actObj.resourceFilter = {}
    } else {
      this.actObj.outParam = {
        key: getUuid(),
        name: ''
      }
      this.actObj.resourceFilter = {
        dicKey: val
      }
    }
  }

  private allThirtyApis = []
  private async loadData() {
    let allApis = await behaviorContext.getAllThirtyApis()
    debugger
    this.allThirtyApis = allApis
    this.selectedKey = this.actObj.resourceFilter.dicKey
  }
}
</script>


<style lang="less" scoped>
</style>