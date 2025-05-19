<template>
  <div style="height: 100%; width: 100%" @click="onClickBlankArea">
    <el-row style="height: 50px; width: 100%; border-bottom: 1px solid rgb(223, 223, 223)">
      <el-select v-model="apiType" placeholder="Select" size="small">
        <el-option :key="-1" label="全部" :value="-1" />
        <el-option :key="0" label="Restful接口" :value="0" />
        <el-option :key="1" label="定时服务" :value="1" />
      </el-select>
    </el-row>
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

        <el-table-column fixed="right" :label="$t('tip.options')" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="onEdit(row)">{{$t('opts.edit')}}</el-button>
            <el-button link type="primary" size="small" @click="onDelete(row)">{{$t('opts.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ApiContentDC, DesignedAPIDC } from '@common/apis/designApi'
import { GetAllApis, AddAPI, DeleteAPI, UpdateAPI, UpdateSertAPIContent, GetApiSimpleInfo } from '@common/apis/designApi'

@Options({
  components: {}
})
export default class apisTable extends ComponentBase {
  private apiType: number = -1

  public async refreshData() {
    if (this.apiType === -1) {
      let data = await GetAllApis()
    } else {
      let data = await GetAllApis(this.apiType)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
