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
            <el-button link type="primary" size="small" @click="onDelete(row)">{{$t('opts.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- ***************************** -->
    <addApiDialog ref="addApiDialog" @onSure="onSureAddAPI" />
    <behaviorDesigner ref="behaviorDesigner" />
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
import platform from '@design-any/interface/dist/enums/platform'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: { addApiDialog: addApiDialog, behaviorDesigner }
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
    await DeleteAPI(row.id)
    this.refreshData()
  }
  private async onDesign(row: DesignedAPIDC) {
    let data = await GetApiContent(row.id)

    let behav: behavior = null
    if (data && data.content) {
      behav = JSON.parse(data.content)
    } else {
      behav = new behavior()
    }

    ;(this.$refs.behaviorDesigner as any).show(behav, null, platform.server)
  }
}
</script>

<style lang="less" scoped>
</style>
