<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="Shipping address" style="width:600px;height:400px" append-to-body :destroyOnClose="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table ref="table" :data="allCustomPages" style="width: 100%;height:300px">
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" :label="$t('tip.name')" />
        <el-table-column property="code" :label="$t('tip.code')" />
      </el-table>
      <template #footer>
        <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
          <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
          <el-button type="primary" @click="onSure">
            {{$t('opts.sure')}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { ExtandFile, addExtandFile, getAllExtandFiles, deleteExtandFile } from '@common/apis/designForeExtands'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findAllCustomPages } from '@design-any/interface/dist/LayoutAttr/CustomPage'

@Options({ components: {} })
export default class pluginPageChooser extends Vue {
  private dialogFormVisible: boolean = false
  private allCustomPages: any[] = []
  // *********************************************************
  mounted() {}
  public show() {
    this.dialogFormVisible = true
    this.allCustomPages = findAllCustomPages()
  }
  // *********************************************************
  private onSure() {
    let selectedRows = (this.$refs.table as any).getSelectionRows()
    this.onSelectCustomPages(selectedRows)
    this.dialogFormVisible = false
  }

  @Emit('onSelectCustomPages')
  private onSelectCustomPages(data: any[]) {}
}
</script>

<style lang="less" scoped>
</style>
