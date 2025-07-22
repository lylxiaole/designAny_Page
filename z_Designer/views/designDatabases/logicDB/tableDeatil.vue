<template>
  <div style="height:100%;width:100%;position:relative">
    <el-row style="height:100%;display:block">
      <el-row style="height:60px;position:relative;display:block">
        <el-button style="height:25px;left:15px;position:absolute;top:15px" @click="addColumnHandle" size="small" type="primary">新增字段</el-button>
      </el-row>
      <el-row style="height:calc(100% - 60px)">
        <el-table size="small" :data="allColumns" :pagination="false" style="height:100%;" width="100%">
          <el-table-column prop="columnName" label="字段名" width="150">
          </el-table-column>
          <el-table-column prop="columnCode" label="字段编码" width="150">
          </el-table-column>
          <el-table-column prop="type" label="字段类型" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.columnDataType" size="small" disabled style="width:120px">
                <el-option key="1" label="String" :value="1" />
                <el-option key="2" label="Boolean" :value="2" />
                <el-option key="3" label="Number" :value="3" />
                <el-option key="4" label="Json" :value="4" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="isRequired" label="必填字段" width="150">
            <template #default="scope">
              <el-switch v-model="scope.row.isRequired" disabled />
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button size="small" @click="() => editColumnHandle(scope.row)">编辑</el-button>
              <el-button size="small" @click="() => rowdelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
    <columnEditDialog ref="columnEditDialog" @onSureEdit="onSureEdit" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { GetColumns, DeleteColumn } from '@common/apis/designDB'
import columnEditDialog from './columnEditDialog.vue'
import { ElMessageBox } from 'element-plus'

@Options({
  components: { columnEditDialog }
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

  private allColumns: any[] = []
  mounted() {}

  private async refreshColumns() {
    this.allColumns = await GetColumns(this.currentTable.databaseId, this.currentTable.tableId)
  }

  private addColumnHandle() {
    ;(this.$refs.columnEditDialog as columnEditDialog).addColumnDialog(this.currentTable.databaseId, this.currentTable.tableId)
  }

  private editColumnHandle(col) {
    ;(this.$refs.columnEditDialog as columnEditDialog).editColumnDialog(col)
  }

  private async onSureEdit() {
    await this.refreshColumns()
  }
  private async rowdelete(col) {
    try {
      await ElMessageBox.confirm('删除后不能恢复，是否要继续?', 'Warning', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
      await DeleteColumn(col)
      this.refreshColumns()
    } catch (err: any) {}
  }
}
</script>

<style>
</style>