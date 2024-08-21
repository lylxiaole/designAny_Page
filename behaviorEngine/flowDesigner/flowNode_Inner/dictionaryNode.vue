<template>
  <div style="width:100;height:100%">
    <el-row> {{actObj?actObj.description:''}}</el-row>
    <el-row>
      <el-col :span="6">选择字典:</el-col>
      <el-col :span="18">
        <el-select v-model="actObj.resourceFilter.dicKey" placeholder="Select" size="small">
          <el-option v-for="dic in allDictionary" :key="dic.id" :label="dic.desc" :value="dic.key" />
        </el-select>
      </el-col>
    </el-row>
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
import { object_group, getFuncObjByType, getFuncObjsTree } from '@behaviorEngine/actResource'
import { EnginePage } from '@designEngine/index'

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

    // for (let index = 0; index < datas.length; index++) {
    //   const element = datas[index]
    //   let actObj = getFuncObjByType(funcCode.dictionary) as actionObj
    //   actObj.name = '字典:' + element.key
    //   actObj.description = '字典:' + element.key
    //   actObj.resourceFilter = {
    //     dicKey: element.key
    //   }
    //   actObj.outParam = { key: getUuid(), name: '输出' }
    //   targetGroup.childrenObjs = []
    //   targetGroup.childrenObjs.push(actObj)
    // }
  }
}
</script>


<style lang="less" scoped>
</style>