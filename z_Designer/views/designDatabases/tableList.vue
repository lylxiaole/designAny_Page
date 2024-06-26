<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height:3rem;" class="middleAlign">
      <el-button style="height:25px" @click="addDBHandle" size="small" type="primary">添加数据库</el-button>
    </el-row>
    <el-row style="height:calc(100% - 3rem);overflow-y:auto;display:block">
      <div v-for="db in allDBS" :key="db.id" :style="dbItemStyle(db)" class="applicationItem" @click="selectDB(db)">
        {{db.name}}
      </div>
    </el-row>
    <!-- ********************************************************** -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%" center>
      <el-form ref="currentFrom" :inline="true" :model="dbForm" class="demo-form-inline">
        <el-form-item label="数据库名称">
          <el-input v-model="dbForm.name" placeholder="数据库名称"></el-input>
        </el-form-item>
        <el-form-item label="数据库编码">
          <el-input v-model="dbForm.name" placeholder="数据库编码"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="dbForm.type" placeholder="请选择数据库类型">
            <el-option label="逻辑数据库" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelHandle">取 消</el-button>
        <el-button type="primary" @click="onSureHandle">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts"  >
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Ref } from 'vue-property-decorator'

import ComponentBase from '@common/views/ComponentBase'
import { GetUserDataBases, AddDataBase } from '@common/apis/designDB'

@Options({})
export default class tableList extends ComponentBase {
  private allDBS: any = []
  private currentDB: any = null
  mounted() {
    this.getAppList()
  }

  private async getAppList() {
    this.allDBS = await GetUserDataBases()
  }
  // ************添加应用***********************************************************
  private dialogVisible: boolean = false
  @Ref('dbForm')
  private dbForm: any = {
    name: '',
    code: '',
    type: 0
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
      let name = this.dbForm.name.trim()
      let code = this.dbForm.code.trim()
      let type = this.dbForm.type
      let issuccess = await AddDataBase(name, code)
      await this.getAppList()
    } catch (error) {
    } finally {
      this.dialogVisible = false
    }
  }
  private async onCancelHandle() {
    this.dialogVisible = false
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