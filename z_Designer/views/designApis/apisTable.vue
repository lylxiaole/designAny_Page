<template>
  <div style="height: 100%; width: 100%" @click="onClickBlankArea">
    <el-row style="height: 50px; width: 100%; border-bottom: 1px solid rgb(223, 223, 223);padding:0px 20px" class="verticalAlignCenter">
      <el-col :span="16">
        <el-select v-model="apiType" placeholder="Select" size="small" style="width:150px">
          <el-option :key="-1" label="全部" :value="-1" />
          <el-option :key="0" label="Restful接口" :value="0" />
          <el-option :key="1" label="定时服务" :value="1" />
        </el-select>
      </el-col>
      <!-- ****************************** -->
      <el-col :span="4">
        <el-button type="primary" size="small" @click="onSearch" style="margin-left: 10px">
          查询
        </el-button>
      </el-col>
      <!-- ****************************** -->
      <el-col :span="4">
        <el-button type="primary" size="small" @click="onAddAPI" style="margin-left: 10px">
          新增
        </el-button>
      </el-col>
      <!-- ****************************** -->
    </el-row>
    <!-- ****************************** -->
    <el-row style="overflow: hidden; width: 100%; bottom: 0px; height: calc(100% - 50px)">
      <el-table :data="allData" style="width: 100%">
        <el-table-column prop="apiName" label="名称" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <span v-if="row.type===0">Restful接口</span>
            <span v-else>定时服务</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" :label="$t('tip.desc')" />

        <el-table-column prop="enable" label="是否启用">
          <template #default="{ row }">
            <el-switch v-model="row.enable" size="small"></el-switch>
            <span v-if="row.enable">已启用</span>
            <span v-else>未启用</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" :label="$t('tip.options')" width="200px">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="onEdit(row)">{{$t('opts.edit')}}</el-button>
            <el-button link type="primary" size="small" @click="onDesign(row)">设计</el-button>
            <el-button link type="primary" size="small" @click="onDebugger(row)">调试</el-button>
            <el-button link type="primary" size="small" @click="onDelete(row)">{{$t('opts.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- ***************************** -->
    <addApiDialog ref="addApiDialog" @onSure="onSureAddAPI" />
    <behaviorDesigner ref="behaviorDesigner" @onSureBehavior="onSureBehavior" />

    <el-drawer v-model="drawerShow" :title="$t('tip.BehaviorDebugger')" destroy-on-close custom-class="lyldrawer" size="90%"
      style="height:100%;top:0px" :with-header="true">
      <behaviorDebugger ref="behaviorDebugger" @onEditBehavior="onEditBehavior" />
    </el-drawer>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ApiContentDC, DesignedAPIDC } from '@common/apis/designApi'
import { GetAllApis, AddAPI, DeleteAPI, UpdateAPI, UpdateSertAPIContent, GetApiContent, GetApiSimpleInfo } from '@common/apis/designApi'
import addApiDialog from './addApiDialog.vue'
import behaviorDesigner from '@behaviorEngine/behaviorDesigner/behaviorDesigner.vue'
import behaviorDebugger from '@behaviorEngine/behaviorDebugger/behaviorDebugger.vue'

import platform from '@design-any/interface/dist/enums/platform'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepClone } from '@common/utils'

@Options({
  components: { addApiDialog: addApiDialog, behaviorDesigner, behaviorDebugger }
})
export default class apisTable extends ComponentBase {
  private apiType: number = -1
  private allData: any[] = []
  mounted() {
    this.refreshData()
  }

  public async refreshData() {
    if (this.apiType === -1) {
      this.allData = await GetAllApis()
    } else {
      this.allData = await GetAllApis(this.apiType)
    }
  }
  // ******************************************************************
  private onSearch() {
    this.refreshData()
  }
  private onAddAPI() {
    ;(this.$refs.addApiDialog as any).show()
  }
  private async onSureAddAPI(data: any) {
    await AddAPI(data)
    this.refreshData()
  }
  // ******************************************************************
  private async onEdit(row: DesignedAPIDC) {
    let data = await GetApiSimpleInfo(row.id)
    ;(this.$refs.addApiDialog as any).show(data)
  }
  private async onDelete(row: DesignedAPIDC) {
    try {
      await ElMessageBox.confirm('删除后不能恢复，是否要继续?', 'Warning', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })

      await DeleteAPI(row.id)
      this.refreshData()
    } catch (error) {}
  }

  private currentDesigningApi: DesignedAPIDC = null
  private currentApiContentDC: ApiContentDC = null
  private async onDesign(row: DesignedAPIDC) {
    this.currentDesigningApi = row
    let data = await GetApiContent(row.id)
    this.currentApiContentDC = data

    let behav: behavior = null
    if (data && data.content) {
      behav = JSON.parse(data.content)
    } else {
      behav = new behavior()
      behav.id = row.id
    }
    behav.platform = platform.server
    ;(this.$refs.behaviorDesigner as behaviorDesigner).show(deepClone(behav), null)
  }

  private drawerShow: boolean = false
  private async onDebugger(row: DesignedAPIDC) {
    this.currentDesigningApi = row
    let data = await GetApiContent(row.id)
    this.currentApiContentDC = data

    let behav: behavior = null
    if (data && data.content) {
      behav = JSON.parse(data.content)
    } else {
      behav = new behavior()
      behav.id = row.id
      ElMessage.error('该API没有行为定义,请先设计行为')
      return
    }
    //
    this.drawerShow = true
    await this.$nextTick()
    behav.platform = platform.server
    ;(this.$refs.behaviorDebugger as behaviorDebugger).setFlowData(deepClone(behav), null)
  }
  // *************行为编辑功能************************
  private async onSureBehavior(behav: behavior) {
    if (this.currentApiContentDC) {
      this.currentApiContentDC.content = JSON.stringify(behav)
    } else {
      this.currentApiContentDC = new ApiContentDC()
      this.currentApiContentDC.apiId = this.currentDesigningApi.id
      this.currentApiContentDC.content = JSON.stringify(behav)
    }
    //
    try {
      await UpdateSertAPIContent(this.currentApiContentDC)
    } catch (error: any) {
      ElMessage.error('更新API内容失败: ' + error.message)
      return
    }
  }
}
</script>

<style lang="less" scoped>
</style>
