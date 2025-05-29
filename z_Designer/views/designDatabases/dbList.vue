<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height: 3rem" class="middleAlign">
      <el-button style="height: 25px" @click="addDBHandle" size="small" type="primary">添加数据库</el-button>
    </el-row>
    <el-row style="height: calc(100% - 3rem); overflow-y: auto; display: block">
      <div v-for="db in allDBS" :key="db.id" :style="dbItemStyle(db)" class="applicationItem verticalAlignCenter" @click="selectDB(db)">
        <span style="float:left;width:calc(100% - 50px)">
          {{ db.databaseName }}
        </span>
        <el-button size="small" style="float:right;width:50px" @click="(e) => deleteDatabase(e, db)">删除</el-button>
      </div>
    </el-row>
    <!-- ********************************************************** -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%" center>
      <el-form ref="currentFrom" :inline="true" :model="dbForm" class="demo-form-inline">
        <el-form-item label="数据库名称">
          <el-input v-model="dbForm.databaseName" placeholder="数据库名称"></el-input>
        </el-form-item>
        <el-form-item label="数据库编码">
          <el-input v-model="dbForm.databaseCode" placeholder="数据库编码"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="dbForm.databaseType" placeholder="请选择数据库类型" style="width:150px">
            <el-option label="内置数据库" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- ********************************************************** -->
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
import { GetDataBases, AddDataBase, DeleteDatabase } from '@common/apis/designDB'
import { toRaw } from 'vue'
import { ElMessageBox } from 'element-plus'

@Options({})
export default class dbList extends ComponentBase {
  private allDBS: any = []
  private currentDB: any = null
  mounted() {
    this.getAppList()
  }
  private async getAppList() {
    this.allDBS = await GetDataBases()
  }
  // ************添加应用***********************************************************
  private dialogVisible: boolean = false
  @Ref('dbForm')
  private dbForm: any = {
    databaseName: '',
    databaseCode: '',
    databaseType: 0
  }
  private async addDBHandle() {
    this.dialogVisible = true
  }
  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      await AddDataBase(toRaw(this.dbForm))
      await this.getAppList()
    } catch (error) {
    } finally {
      this.dialogVisible = false
    }
  }
  private async onCancelHandle() {
    this.dialogVisible = false
  }

  private async deleteDatabase(e, db) {
    try {
      await ElMessageBox.confirm('删除后不能恢复，是否要继续?', 'Warning', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
      e.stopPropagation()
      await DeleteDatabase(db)
      this.currentDB = null
      this.onCurrentDBChanged(null)
      await this.getAppList()
    } catch (error) {}
  }

  // ***********************************************************************
  private dbItemStyle(db) {
    if (this.currentDB && this.currentDB.id === db.id) {
      return { 'background-color': '#83c346', color: 'white' }
    } else {
      return { 'background-color': 'transparent', color: 'black' }
    }
  }
  private async selectDB(db) {
    this.currentDB = db
    this.onCurrentDBChanged(db)
  }
  @Emit('onCurrentDBChanged')
  private onCurrentDBChanged(db: any) {}
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
