<template>
  <div>
    <el-row style="height: 50px; line-height: 50px;position:relative;width:100%">
      <el-button style="position:absolute;right:80px;margin-top:20px" link type="primary" @click="onAddNew">{{$t('opts.addNew')}} </el-button>
    </el-row>
    <el-row style="height: calc(100% - 50px)">
      <el-table :data="allData" style="width: 100%">
        <el-table-column prop="key" :label="$t('opts.key')" />
        <el-table-column prop="value" :label="$t('opts.value')" />
        <el-table-column prop="desc" :label="$t('opts.desc')" />
        <el-table-column fixed="right" :label="$t('opts.options')" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="onEdit(row)">{{$t('opts.edit')}}</el-button>
            <el-button link type="primary" size="small" @click="onDelete(row)">{{$t('opts.delete')}}</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
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
    try {
      await ElMessageBox.confirm('Sure Delete?', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
    } catch (error) {
      return
    }

    await DeleteDictionary(row)
    this.refreshList()
  }

  private onSure() {
    this.refreshList()
  }
}
</script>

<style lang="less"></style>
