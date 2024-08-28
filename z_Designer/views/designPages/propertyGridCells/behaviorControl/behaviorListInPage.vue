<template>
  <el-row style="height:100%;background:#FFF">
    <div style="width:100%;height:30px;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
      <div style="background:#18aeb7;width:6px;height:26px;"></div>
      <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">当前页面所有行为</span>
    </div>
    <el-table ref="tableComp" :data="allBehaviors" style="width:100%" height="calc(100% - 30px)">
      <el-table-column fixed type="index" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="行为名称" />
      <el-table-column prop="description" label="描述" />
    </el-table>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage } from '@design-any/interface/dist'
import { behavior } from '@behaviorEngine/index'
import { deepClone, getUuid } from '@common/utils'

//事件行为绑定组件
@Options({})
export default class behaviorListInPage extends Vue {
  @Prop() currentPage: EnginePage

  private get allBehaviors(): behavior[] {
    return this.currentPage.behaviors
  }

  public getSelectedBehaviors() {
    let res = (this.$refs.tableComp as any).getSelectionRows()
    return res
  }
}
</script>

<style lang="less" scoped>
</style>