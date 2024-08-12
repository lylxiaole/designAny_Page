<template>
  <div>
    <el-row style="height:50px">
      <el-button style="position:absolute;right:80px" link type="primary" size="small" @click="onAddNew">新增</el-button>
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-table :data="allData" style="width: 100%">
        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="key" label="键" />
        <el-table-column prop="value" label="值" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row  }">
            <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <addOrUpdateDialog ref="addOrUpdateDialog" @onSure="onSure" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import addOrUpdateDialog from './addOrUpdateDialog.vue'

import { DeleteDictionary, GetAll } from '@common/apis/designDictionary'

@Options({
  components: { addOrUpdateDialog }
})
export default class index extends PageBase {
  mounted() {
    this.refreshList()
  }
  private allData: any[] = []
  private async refreshList() {
    this.allData = await GetAll()
  }

  private onAddNew() {
    ;(this.$refs.addOrUpdateDialog as addOrUpdateDialog).show()
  }

  private onEdit(row) {
    ;(this.$refs.addOrUpdateDialog as addOrUpdateDialog).show(row)
  }

  private async onDelete(row) {
    await DeleteDictionary(row)
    this.refreshList()
  }

  private onSure() {
    this.refreshList()
  }
}
</script>

<style lang="less">
</style>