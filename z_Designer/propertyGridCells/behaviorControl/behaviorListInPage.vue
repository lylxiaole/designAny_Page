<template>
  <el-row style="height: 100%; background: #fff">
    <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
      <div style="background: #18aeb7; width: 6px; height: 26px"></div>
      <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">{{$t('tip.AllBehaviorsInPage')}} </span>
    </div>
    <el-table ref="tableComp" :data="allBehaviors" style="width: 100%" height="calc(100% - 30px)">
      <el-table-column fixed type="index" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" :label="$t('tip.name')" />
      <el-table-column prop="description" :label="$t('tip.desc')" />
    </el-table>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import platform from '@design-any/interface/dist/enums/platform'

//事件行为绑定组件
@Options({})
export default class behaviorListInPage extends Vue {
  @Prop()
  currentPage: EnginePage

  private get allBehaviors(): behavior[] {
    if (!this.currentPage) {
      return []
    }

    return this.currentPage.topPage.behaviors.filter((o) => o.platform === this.currentPage.platform)
  }

  public getSelectedBehaviors() {
    let res = (this.$refs.tableComp as any).getSelectionRows()
    return res
  }
}
</script>

<style lang="less" scoped></style>
