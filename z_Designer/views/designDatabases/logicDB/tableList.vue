<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height: 3rem" class="middleAlign">
      <el-button style="height: 25px" @click="addTableHandle" size="small" type="primary">添加表</el-button>
    </el-row>
    <el-row style="height: calc(100% - 3rem); overflow-y: auto; display: block">
      <div v-for="table in allTables" :key="table.tableId" :style="dbItemStyle(table)" class="applicationItem verticalAlignCenter"
        @click="selectTable(table)">
        <span style="float:left;width:calc(100% - 50px)">
          {{ table.tableName }}
        </span>
        <el-button size="small" style="float:right;width:50px" @click="(e) => deleteTable(e, table)">删除</el-button>
      </div>
    </el-row>
    <!-- ********************************************************** -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%" center>
      <el-form ref="currentFrom" :inline="true" :model="tableForm" class="demo-form-inline">
        <el-form-item label="表名">
          <el-input v-model="tableForm.name" placeholder="表名"></el-input>
        </el-form-item>
        <el-form-item label="表编码">
          <el-input v-model="tableForm.code" placeholder="表编码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancelHandle">取 消</el-button>
          <el-button type="primary" @click="onSureHandle">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Ref } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { GetTables, AddTable, DeleteTable } from '@common/apis/designDB'

@Options({})
export default class tableList extends ComponentBase {
  private currentDB: any = null
  private allTables: any = []
  private currentTable: any = null
  mounted() {}

  public async setDB(db) {
    this.currentDB = db
    await this.refreshList()
  }
  private async refreshList() {
    this.allTables = await GetTables(this.currentDB.id)
  }
  // ************添加应用***********************************************************
  private dialogVisible: boolean = false
  @Ref('tableForm')
  private tableForm: any = {
    name: '',
    code: ''
  }
  private async addTableHandle() {
    this.dialogVisible = true
  }
  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      let name = this.tableForm.name.trim()
      let code = this.tableForm.code.trim()

      let issuccess = await AddTable(this.currentDB.id, name, code)
      await this.refreshList()
    } catch (error) {
    } finally {
      this.dialogVisible = false
    }
  }
  private async onCancelHandle() {
    this.dialogVisible = false
  }
  // ***********************************************************************
  private dbItemStyle(table) {
    if (this.currentTable && this.currentTable.tableId === table.tableId) {
      return { 'background-color': '#83c346', color: 'white' }
    } else {
      return { 'background-color': 'transparent', color: 'black' }
    }
  }
  private async selectTable(table) {
    this.currentTable = table
    this.onCurrentTableChanged(table)
  }
  // ***********************************************************************
  private async deleteTable(e, table) {
    e.stopPropagation()
    await DeleteTable(table)
    this.currentTable = null
    this.onCurrentTableChanged(null)
    await this.refreshList()
  }
  // ***********************************************************************
  @Emit('onCurrentTableChanged')
  private onCurrentTableChanged(db: any) {}
}
</script>

<style scoped>
.applicationItem {
  box-sizing: border-box;
  padding: 4px 8px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
}

.applicationItem:hover {
  background-color: #83c346;
  color: white;
}
</style>
