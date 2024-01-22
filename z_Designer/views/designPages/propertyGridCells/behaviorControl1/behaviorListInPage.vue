<template>
  <el-row style="height:100%;background:#FFF">
    <div style="width:100%;height:30px;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
      <div style="background:#18aeb7;width:6px;height:26px;"></div>
      <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">当前页面所有行为</span>
    </div>
    <el-table :data="allBehaviors" style="width:100%" height="calc(100% - 30px)">
      <el-table-column fixed type="index" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="行为名称" />
      <el-table-column prop="workRange" label="作用范围" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" prop="action" width="420px">
        <template #default="record">
          <el-button @click="()=>{editBehavior(record )}" type="link"> 编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { layoutEvent, layoutEventBehaviors, EnginePage } from '@designEngine/index'
import { behavior } from '@behaviorEngine/index'
import { deepClone, getUuid } from '@common/utils'
import { behaviorBindingInParam, behaviorPageType, behaviorListData, behaviorDetailData } from './model'

//事件行为绑定组件
@Options({})
export default class behaviorListInPage extends Vue {
  @Prop() currentPage: EnginePage

  private get allBehaviors(): behavior[] {
    return this.currentPage.behaviors
  }

  //编辑，跳转到行为细节详情
  private editBehavior(record: behavior) {
    // this.$emit('onDetail', backData)
    this.onDetail(record)
  }

  @Emit('onDetail')
  protected onDetail(obj: behavior) {}
}
</script>

<style lang="less" scoped>
</style>