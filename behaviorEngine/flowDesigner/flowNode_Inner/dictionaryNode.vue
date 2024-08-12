<template>
  <div style="width:100;height:100%">
    <el-select style="width:100%" v-model="selectedKey">
      <el-option v-for="dic in allDictionarys" :key="dic.id" :label="dic.value" :value="dic.key" />
    </el-select>
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

@flowDesignNode(funcCode.dictionary, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dictionaryNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Emit('update:actObj')
  private updateActObjInnner(val) {}

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

    this.updateActObjInnner(this.actObj)
  }

  private allDictionarys = []
  private async loadData() {
    let allDics = await behaviorContext.getAllDictionary()
    this.allDictionarys = allDics
    this.selectedKey = this.actObj.resourceFilter.dicKey
  }
}
</script>


<style lang="less" scoped>
</style>