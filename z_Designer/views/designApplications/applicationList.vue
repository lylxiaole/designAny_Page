<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height:3rem;" class="middleAlign">
      <el-button style="height:25px" @click="addAppHandle" size="mini" type="primary">添加应用</el-button>
    </el-row>
    <el-row style="height:calc(100% - 3rem);overflow-y:auto">
      <div v-for="app in allApps" :key="app.id" :style="applicationItemStyle(app)" class="applicationItem" style="height:36px;line-height:36px"
        @click="selectAppliction(app)">
        {{app.name}}
      </div>
    </el-row>
    <!-- ********************************************************** -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <el-form ref="applicationForm" :inline="true" :model="applicationForm" class="demo-form-inline">
        <el-form-item label="应用名称">
          <el-input v-model="applicationForm.name" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item label="应用类型">
          <el-select v-model="applicationForm.type" placeholder="请选择应用类型">
            <el-option label="看板" :value="0"></el-option>
            <el-option label="报表" :value="2"></el-option>
            <el-option label="业务系统" :value="4"></el-option>
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

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { GetApplicationList, AddApplication, DeleteApplication, UpdateApplication } from '@src/apis/designApplication'

@Component
export default class applicationList extends ComponentBase {
  private allApps: any = []
  private currentApplication: any = null
  mounted() {
    this.getAppList()
  }

  private async getAppList() {
    this.allApps = await GetApplicationList()
  }
  // ************添加应用***********************************************************
  private dialogVisible: boolean = false
  private applicationForm: any = {
    name: '',
    type: 0
  }
  private async addAppHandle() {
    this.dialogVisible = true
  }
  private async onSureHandle() {
    let valid = await (this.$refs.applicationForm as any).validate()
    if (!valid) {
      return false
    }
    try {
      let requdata: any = { name: this.applicationForm.name.trim() }
      let issuccess = await AddApplication(requdata)
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
  private applicationItemStyle(app) {
    if (this.currentApplication && this.currentApplication.id === app.id) {
      return { 'background-color': '#83c346', color: 'white' }
    } else {
      return { 'background-color': 'transparent', color: 'black' }
    }
  }
  private async selectAppliction(app) {
    this.currentApplication = app
    this.onCurrentApplicationChanged(app)
  }
  @Emit('onCurrentApplicationChanged')
  private onCurrentApplicationChanged(app: any) {}
}
</script>

<style scoped>
.applicationItem {
  box-sizing: border-box;
  padding: 4px 8px;
  cursor: pointer;
}

.applicationItem:hover {
  background-color: #83c346;
  color: white;
}
</style>