<template>
  <a-modal :maskClosable="false" title="添加模型实例" :destroyOnClose="true" v-model="isVisible" :width="1024" @ok="onOk" @cancel="onCancel" cancelText="取消"
    okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
    <div>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模型编码">
              <a-input v-model="modelCode" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模型名称">
              <a-input v-model="modelName" placeholder="请输入" />
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
        <vxe-table-column field="modelName" title="名称"></vxe-table-column>
        <vxe-table-column field="modelCode" title="编码"></vxe-table-column>

        <vxe-table-column field="groupName" width="100" title="分组"></vxe-table-column>
        <vxe-table-column field="modelType" width="100" title="类型"></vxe-table-column>
      </vxe-table>
      <vxe-pager border size="medium" :current-page.sync="pageIndex" :page-size.sync="pageSize" :total.sync="totalElements"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="handlePageChange">
      </vxe-pager>
    </div>

  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'
import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'
import addModelWindow from './addModelWindow.vue'
import modelBingding from '../../02common/commonClasses/modelBingding'
import {
  Property,
  PropertyType,
  Text_Property,
  Behavior_Property,
  Number_Property,
  PropertyGroupName,
  Color_Property,
  UploadFile_Property,
  Boolean_Property
} from '../../03designerLayoutBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import npTable from '../../07commonComponents/table/npTable.vue'

@Component({
  components: {
    npTable
  }
})
export default class modelChooseWindow extends Vue {
  @Prop() isVisible: boolean
  @Emit('update:isVisible')
  private changeIsVisible(val: boolean) {}

  private models: any[] = []
  private pageIndex: number = 0
  private pageSize: number = 50
  private totalElements: number = 1
  private modelCode: string = null
  private modelName: string = ''
  private isloading: boolean = false
  private selectedModelData: any = null

  mounted() {
    window.console.log('添加模型实例')
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
    this.pageIndex = 1
    var res = await CurrentApis.GetBaseModelList(this.pageIndex, this.pageSize, this.modelName, this.modelCode)
    this.totalElements = (res as any).totalElements
    this.models = (res as any).content
    this.isloading = false
  }

  private clearParam() {
    this.modelCode = ''
    this.modelName = ''
  }

  private radioChangeEvent(e: any) {
    this.selectedModelData = this.models[e.rowIndex]
  }

  private onCellClick(e: any) {
    // window.console.log('点击了单元格', e);
    ;(this.$refs.table as any).setRadioRow(this.models[e.rowIndex], true)
    this.selectedModelData = this.models[e.rowIndex]
  }

  private onOk() {
    if (this.selectedModelData) {
      this.onChooseModel(this.selectedModelData)
    }
    this.changeIsVisible(false)
  }
  private onCancel() {
    this.changeIsVisible(false)
  }

  @Emit('onChooseModel')
  private onChooseModel(model: any) {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>