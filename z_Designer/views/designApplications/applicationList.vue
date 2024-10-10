<template>
  <div style="height:100%;width：100%;padding:8px;overflow:hidden;border-right:1px solid #808080;box-sizing:border-box">
    <el-row style="height: 3rem" class="middleAlign">
      <el-button style="height: 25px" @click="addAppHandle" size="small" type="primary">添加应用</el-button>
    </el-row>
    <el-row style="height: calc(100% - 3rem); overflow-y: auto; display: block">
      <div v-for="app in allApps" :key="app.id" :style="applicationItemStyle(app)" class="applicationItem" @click="selectAppliction(app)">
        {{ app.name }}
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

@Options({ components: { appEditDialog } })
export default class applicationList extends ComponentBase {
  private allApps: ApplicationDC[] = []
  private currentApplication: ApplicationDC = null
  mounted() {
    this.refreshAppList()
  }

  public async refreshAppList() {
    this.allApps = await GetApplicationList()
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
