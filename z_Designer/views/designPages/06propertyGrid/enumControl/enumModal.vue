<template>
  <div>
    <a-button type="primary" @click="chooseEnum" size="small">选择枚举</a-button>
    <s-modal title="枚举字典选择" :visible="isVisible" @ok="onOk" @cancel="onCancel" width="1000px">
      <enum-component ref="enumComponent" type='radio' :isMulti="false"></enum-component>
    </s-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'
import modelAnalysis, { modelDetailInfo } from '../../02common/impResourcesCache/modelAnalysis'
import { getUuid, deepClone } from '@src/utils'
import buttonAttributeInfo from '../../02common/commonClasses/buttonAttributeInfo'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import npTable from '../../07commonComponents/table/npTable.vue'
import { STable, AreaTitle, GButton, SModal } from '@/components'
import enumComponent from '@/views/enum/EnumTypes.vue'

@propertyCellTypeAttr(PropertyTypeEnum.enumModal)
@Component({
  components: {
    npTable,
    SModal,
    enumComponent
  }
})
export default class enumModal extends propertyCellBase {
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
  private enumCode: string = ''
  private enumName: string = ''
  private isloading: boolean = false
  private selectedModelData: any = null
  private systemList: any[] = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  mounted() {
    //window.console.log('添加模型实例')
    this.pageIndex = 1
    this.handlePageChange({ currentPage: this.pageIndex, pageSize: this.pageSize })
  }
  private chooseEnum() {
    this.search()
    this.isVisible = true
  }
  private async handlePageChange({ currentPage, pageSize }) {
    this.pageIndex = currentPage
    //console.log('this.pageIndex: ', this.pageIndex)
    this.pageSize = pageSize
    //console.log('this.pageSize: ', this.pageSize)
    this.search()
  }
  private async search() {
    this.isloading = true
    let filter = { dict_name: '', dict_code: '' }
    if (this.enumName != '') {
      ;(filter.dict_name = this.enumName), (this.pageIndex = 0)
      this.pageSize = 10
    }
    if (this.enumCode != '') {
      ;(filter.dict_code = this.enumCode), (this.pageIndex = 0)
      this.pageSize = 10
    }
    let param = {
      filter: filter,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    }
    let res = await CurrentApis.GetDictPage2Cache_Sync(param)

    this.totalElements = (res as any).totalElements
    this.models = (res as any).content
    this.isloading = false
  }

  private clearParam() {
    this.enumName = ''
    this.enumCode = ''
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
    // if (this.selectedModelData) {
    //   this.onChooseModel(this.selectedModelData)
    // }
    let chooseItem = (this.$refs.enumComponent as any).selectedRows
    //console.log('chooseItem: ', chooseItem)
    if (chooseItem.length <= 0) {
      this.$message.info('请选择枚举字典！')
      return
    } else if (chooseItem.length > 1) {
      this.$message.info('最多选择一个枚举字典！')
      return
    }
    var enumDatas = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '选择枚举')[0]
    this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '是否支持布尔')[0].value = false
    if (enumDatas) {
      let array: any = []
      if (chooseItem && chooseItem.length > 0) {
        if (chooseItem[0].sysDictItemList && chooseItem[0].sysDictItemList.length > 0) {
          chooseItem[0].sysDictItemList.forEach((element) => {
            array.push({
              item_name: element.item_name,
              item_value: element.item_value
            })
          })
        }
      }
      enumDatas.value = array
      //console.log('enumDatas: ', enumDatas)
      this.isVisible = false
    }
  }
  private onCancel() {
    this.isVisible = false
  }
  private formatterSystem({ cellValue }) {
    let item = this.systemList.find((item) => item.value === cellValue)
    //console.log('item: ', item)
    return item ? item.label : ''
  }
  @Emit('onChooseModel')
  private onChooseModel(model: any) {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>