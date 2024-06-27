<template>
  <div style="height:100%;width:100%;position:relative">
    <el-row style="height:100%">
      <el-row style="height:60px">
        <el-button style="height:25px" @click="addColumnHandle" size="small" type="primary">新增字段</el-button>
      </el-row>
      <el-row style="height:calc(100% - 60px)"></el-row>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { GetColumns, AddTable } from '@common/apis/designDB'

@Options({
  components: {}
})
export default class tableDeatil extends PageBase {
  @Prop({ default: null })
  private currentTable: any

  @Watch('currentTable')
  private async oncurrentTableChanged(val) {
    if (!val) {
      return
    }
    console.log('oncurrentTableChanged:', val)
    this.refreshColumns()
  }

  mounted() {}

  private async refreshColumns() {
    let allColumns = await GetColumns(this.currentTable.databaseId, this.currentTable.tableId)
    debugger
  }

  private addColumnHandle() {}
}
</script>

<style>
</style>