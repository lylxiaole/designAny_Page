<template>
  <el-row style="height:100%;background:#FFF">
    <div style="width:100%;height:30px;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
      <div style="background:#18aeb7;width:6px;height:26px;"></div>
      <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">当前页面所有行为</span>

      <el-button class="behavior-list-header-button" style="width:104px;height:30px;background:rgba(245,166,35,1);color:rgba(255,255,255,1);"
        @click="addBehavior">
        添加行为
      </el-button>
    </div>
    <el-table :data="allBehaviors" style="width:100%" height="calc(100% - 30px)">
      <el-table-column fixed type="index" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="行为名称" />
      <el-table-column prop="workRange" label="作用范围" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" prop="action" width="420px">
        <template #default="record">
          <el-button @click="()=>{editBehavior(record.row)}" type="link">编辑</el-button>
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

  private addBehavior() {
    let newbeh = new behavior()
    newbeh.id = getUuid()
    newbeh.name = '新建行为'
    newbeh.workRange = 'page'
    newbeh.actions = []
    newbeh.variables = []
    newbeh.inparam = {}
    this.currentPage.behaviors.unshift(newbeh)
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