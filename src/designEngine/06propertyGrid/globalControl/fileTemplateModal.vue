<template>
  <div>
    <a-button type="primary" @click="chooseFileTemplate" size="small">选择文件模板</a-button>
    <geno-modal :maskClosable="false" title="选择文件模板" :destroyOnClose="true" v-model="isVisible" :width="1024" @ok="onOk" @cancel="onCancel"
      cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
      <div>
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="fileName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style=" { float: 'right', overflow: 'hidden' }   ">
                <a-button @click="search">搜索</a-button>
                <a-button style="margin-left: 8px" @click="clearParam">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>

        <vxe-table style="margin-top:10px" id="np_table_ppap" :loading="isloading" :show-header="true" ref="table" :data="models" height="500px"
          :canChoose="true" @radio-change="radioChangeEvent" @cell-click="onCellClick" highlight-current-row highlight-hover-row>
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column type="index" width="60"></vxe-table-column>
          <vxe-table-column field="file_name" title="名称"></vxe-table-column>
          <vxe-table-column field="file_url" title="路径"></vxe-table-column>
          <vxe-table-column field="description" title="描述"></vxe-table-column>
        </vxe-table>
        <vxe-pager border size="medium" :current-page.sync="pageIndex" :page-size.sync="pageSize" :total.sync="totalElements"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="handlePageChange">
        </vxe-pager>
      </div>
    </geno-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../05designerLayouts/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'
import common from '../../02common/commonMethod'
import npTable from '../../07commonComponents/table/npTable.vue'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.fileTemplateModal)
@Component({
  components: {
    npTable,
  },
})
export default class fileTemplateModal extends propertyCellBase {
  protected get currentComponents(): ComponentBase[] {
    if (!this.currentLayouts) {
      return null
    }
    var newlayouts_extra: ComponentBase[] = []
    if (this.currentLayouts instanceof ComponentBase) {
      newlayouts_extra = [this.currentLayouts as ComponentBase]
    } else if (this.currentLayouts instanceof PageBase) {
      window.console.log('传入的布局类不能是页面')
      return []
    } else {
      newlayouts_extra = this.currentLayouts as ComponentBase[]
    }
    return newlayouts_extra
  }
  private isVisible: boolean = false
  private models: any[] = []
  private pageIndex: number = 0
  private pageSize: number = 10
  private totalElements: number = 1
  private fileName: string = ''
  private isloading: boolean = false
  private selectedModelData: any = null

  mounted() {
    //window.console.log('添加模型实例')
    this.pageIndex = 1
    this.handlePageChange({ currentPage: this.pageIndex, pageSize: this.pageSize })
  }

  private async handlePageChange({ currentPage, pageSize }) {
    this.pageIndex = currentPage
    this.pageSize = pageSize
    this.search()
  }
  private async search() {
    this.isloading = true
    let filter = []
    if (this.fileName != '') {
      filter.push({
        code: 'file_name',
        value: this.fileName,
        type: 'ALL_LIKE',
      })
      this.pageIndex = 0
      this.pageSize = 10
    }

    let param = {
      filter: filter,
      modelCode: 'sys_file',
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    }
    let res = await CurrentApis.SimplePageQuery_Sync(param)
    this.totalElements = (res as any).totalElements
    this.models = (res as any).content
    this.isloading = false
  }

  private clearParam() {
    this.fileName = ''
  }

  private radioChangeEvent(e: any) {
    this.selectedModelData = this.models[e.rowIndex]
  }

  private onCellClick(e: any) {
    ;(this.$refs.table as any).setRadioRow(this.models[e.rowIndex], true)
    this.selectedModelData = this.models[e.rowIndex]
  }

  private onOk() {
    if (this.selectedModelData) {
      this.onChooseModel(this.selectedModelData)
    }
    var fileDatas = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '选择文件模板')[0]
    fileDatas.value = this.selectedModelData.file_url
    console.log('this.selectedModelData: ', this.selectedModelData)
    this.isVisible = false
  }
  private onCancel() {
    this.isVisible = false
  }
  private chooseFileTemplate() {
    this.search()
    this.isVisible = true
  }

  @Emit('onChooseModel')
  private onChooseModel(model: any) {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>