<template>
  <el-dialog v-model="dialogFormVisible" title="字典管理" style="width:95%;height:90%;margin: 0px;" append-to-body :destroyOnClose="true"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- ************************************************* -->
    <div style="height: calc(100% - 60px);width:100%;position:relative">
      <el-row style="height: 50px; line-height: 50px;position:relative;width:100%">
        <el-button style="position:absolute;right:80px;margin-top:20px" link type="primary" @click="onAddNew">{{$t('opts.addNew')}} </el-button>
      </el-row>
      <el-row style="height: calc(100% - 50px)">
        <el-table :data="allData" style="width: 100%">
          <el-table-column prop="key" :label="$t('tip.key')" />
          <el-table-column prop="value" :label="$t('tip.value')" />
          <el-table-column prop="desc" :label="$t('tip.desc')" />
          <el-table-column fixed="right" :label="$t('tip.options')" width="120">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="onEdit(row)">{{$t('opts.edit')}}</el-button>
              <el-button link type="primary" size="small" @click="onDelete(row)">{{$t('opts.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <addOrUpdateDialog ref="addOrUpdateDialog" @onSure="onSure" />
    </div>
    <!-- ************************************************* -->
    <template #footer>
      <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
        <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
      </div>
    </template>
  </el-dialog>
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
  private dialogFormVisible: boolean = false
  public show() {
    this.dialogFormVisible = true
    this.refreshList()
  }

  // ********************************************
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
