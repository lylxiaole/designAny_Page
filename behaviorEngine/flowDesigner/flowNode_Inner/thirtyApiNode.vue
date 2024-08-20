<template>
  <el-row> {{actObj?actObj.description:''}}</el-row>
  <el-row>
    <el-col :span="6">选择接口:</el-col>
    <el-col :span="18">
      <el-select v-model="selectKey" placeholder="Select" size="small">
        <el-option v-for="dic in allDictionary" :key="dic.id" :label="dic.desc" :value="dic.key" />
      </el-select>
    </el-col>
  </el-row>
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

  mounted() {}
}
</script>


<style lang="less" scoped>
</style>