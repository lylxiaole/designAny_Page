<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height: 3rem" class="middleAlign verticalAlignCenter">
      <el-button style="height: 25px" @click="addAppHandle" size="small" type="primary">{{ $t('menu.addAppOpt') }}</el-button>
    </el-row>
    <el-row style="height: calc(100% - 3rem); overflow-y: auto; display: block">
      <div v-for="app in allApps" :key="app.id" :style="applicationItemStyle(app)" class="applicationItem verticalAlignCenter flexHorilanLayout"
        @click="selectAppliction(app)">
        <div style="width: calc(100% - 96px); float: left">
          {{ app.name }}
        </div>
        <el-button style="margin-left: 8px; width: 40px; float: left" link type="primary" @click="editAppInfo">{{$t('opts.edit')}}</el-button>
        <el-button style="margin-left: 8px; width: 40px; float: left" link type="primary" @click="deleteAppInfo">{{$t('opts.delete')}}</el-button>
      </div>
    </el-row>
    <!-- ********************************************************** -->
    <appEditDialog ref="appEditDialog" @onSure="refreshAppList" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Ref } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { GetApplicationList, AddApplication, DeleteApplication, UpdateApplication, ApplicationDC } from '@common/apis/designApplication'
import appEditDialog from './appEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

@Options({ components: { appEditDialog } })
export default class applicationList extends ComponentBase {
  private allApps: ApplicationDC[] = []
  private currentApplication: ApplicationDC = null
  mounted() {
    this.refreshAppList()
  }

  public async refreshAppList() {
    this.allApps = await GetApplicationList()
    await this.refreshChoose()
  }
  public async refreshChoose() {
    if (!this.currentApplication) {
      return
    }

    let find = this.allApps.find((o) => o.id === this.currentApplication.id)
    this.selectAppliction(find)
  }
  private addAppHandle() {
    ;(this.$refs.appEditDialog as appEditDialog).addAppHandle()
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
  private editAppInfo() {
    ;(this.$refs.appEditDialog as appEditDialog).editAppHandle(this.currentApplication)
  }
  private async deleteAppInfo() {
    try {
      await ElMessageBox.confirm('Sure Delete?', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })

      await DeleteApplication(this.currentApplication)
      await this.refreshAppList()
    } catch (error: any) {
      ElMessage({
        type: 'info',
        message: error || error.message
      })
    }
  }

  // ************************************************
  @Emit('onCurrentApplicationChanged')
  private onCurrentApplicationChanged(app: any) {}
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
