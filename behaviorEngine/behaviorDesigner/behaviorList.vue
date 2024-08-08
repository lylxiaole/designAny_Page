<template style="height:100%">
  <el-row v-if="currentPage" style="height:100%;background:#FFF;">
    <div style="width:100%;height:30px;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
      <div style="background:#18aeb7;width:6px;height:26px;"></div>
      <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">行为列表</span>
      <el-button class="behavior-list-header-button" style="width:104px;height:30px;background:rgba(245,166,35,1);color:rgba(255,255,255,1);"
        @click="addBehavior">
        添加行为
      </el-button>
    </div>
    <el-table :data="allBehaviors" style="width:100%" height="calc(100% - 30px)">
      <el-table-column fixed type="index" width="50" />
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="name" label="名称">
        <template #default="record">
          <editableText v-model:value="record.row.name" />
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="action" width="420px">
        <template #default="record">
          <el-button @click="()=>{editBehavior(record.row)}" type="link">编辑</el-button>
          <el-button @click="()=>{deleteBehavior(record.row)}" type="link">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <behaviorDetail ref="behaviorDetail" />
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior } from '@behaviorEngine/index'
import { EnginePage } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'
import behaviorDetail from './behaviorDetail.vue'
import editableText from '@common/components/Text/editableText.vue'
import { toRaw } from 'vue'
@Options({
  components: { behaviorDetail: behaviorDetail, editableText }
})
export default class behaviorList extends Vue {
  @Prop() currentPage: EnginePage

  private get allBehaviors(): behavior[] {
    if (!this.currentPage) {
      return []
    }
    let x = this.currentPage.behaviors
    debugger
    return x
  }

  private addBehavior() {
    let newbeh = new behavior()
    newbeh.id = getUuid()
    newbeh.name = '新建行为'
    newbeh.workRange = 'page'
    newbeh.variables = []
    newbeh.inparam = {}
    this.currentPage.behaviors.unshift(newbeh)
  }

  //编辑，跳转到行为细节详情
  private editBehavior(record: behavior) {
    ;(this.$refs.behaviorDetail as any).show(record, this.currentPage)
  }

  private deleteBehavior(record: behavior) {
    let index = this.currentPage.behaviors.findIndex((o) => o.id === record.id)
    this.currentPage.behaviors.splice(index, 1)
  }
}
</script>

<style scoped>
</style>