<template>
  <div>
    <a-button type="primary" @click="showColumnMoudleSettingModal" size="small"
      style="width:104px;height:30px;background:rgba(245,166,35,1);border-radius:4px;font-weight:400;font-size:14px;color:rgba(255,255,255,1);line-height:22px;">
      <a-icon style="font-size:14px" :component="editIco" />开始设置
    </a-button>
    <geno-modal :maskClosable="false" title="设置列模板" v-model="columnMoudleSettingVisible" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true"
      :width='1400' cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
      <a-layout style="height:600px;overflow:hidden;width:100%">
        <a-layout-sider :style="{'overflow-x': 'hidden','overflow-y': 'hidden'}" width="250">
          <geno-tableComponentListControl style="height:100%;width:100%" />
        </a-layout-sider>
        <a-layout :style="{'overflow-x': 'hidden','overflow-y': 'hidden','background':'#ffffff'}">
          <a-layout-content>
            <grid @onMounted="onPageMounted" style="height:600px;width:100%;overflow:hidden;background-color:gray" />
          </a-layout-content>
        </a-layout>
        <a-layout-sider :width="280+'px'" :style="{'overflow-x': 'hidden','overflow-y': 'hidden','background-color':'#fafafa','border':'#d9d9d9'}">
          <geno-propertyGrid :currentPage="currentPageSimple" :currentLayouts="pageSelectedComps" style="height:100%;width:100%" />
        </a-layout-sider>
      </a-layout>
    </geno-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  BindingModels_Property,
  PropertyGroupName,
  Boolean_Property,
  TableStyleSetting_Property,
  Number_Property
} from '../../03designerLayoutBase'
import { tableStyle } from '../../04designerComponents/table/tableCommonTypes'
import layout_Professional from '../../05designerLayouts/layout_Professional/Layout_Professional.vue'
import PageBase from '../../03designerLayoutBase/PageBase'
import TableGrid from '../../04designerComponents/table/TableGrid.vue'
import common from '../../02common/commonMethod'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { startEditIco } from '../../assets/icons.js'

@Component({
  components: {
    grid: TableGrid
  }
})
export default class columnTemplateSetting extends Vue {
  @Prop() private layoutData: any
  @Emit('update:layoutData')
  UpdateLayoutData_Inner(data: any) {}

  @Prop() private rowHeight: number | string
  @Emit('update:rowHeight')
  UpdateRowHeight_Inner(data: any) {}

  private get tempRowHeight(): number | string {
    return this.rowHeight
  }

  private set tempRowHeight(val: number | string) {
    this.UpdateRowHeight_Inner(val)
  }

  @Prop() parentPage: PageBase

  private columnMoudleSettingVisible: boolean = false
  private currentPageSimple: TableGrid = null
  private editIco: any

  private currentPage: layout_Professional
  get pageSelectedComps(): LayoutBase[] {
    if (this.currentPageSimple) {
      let findchilds = this.currentPageSimple.FindSelectedLayoutsRecursion()
      if (findchilds.length > 0) {
        return findchilds
      } else {
        return [this.currentPageSimple]
      }
    } else {
      return []
    }
  }

  created() {
    this.editIco = startEditIco
  }

  mounted() {}

  private handleOk() {
    let data = this.currentPageSimple.GetSaveData()
    //window.console.log('-------------------------------加载操作列数据保存layout-data',data)
    this.UpdateLayoutData_Inner(common.clone(data))
    this.columnMoudleSettingVisible = false
  }
  private handleCancel() {
    this.columnMoudleSettingVisible = false
  }
  private showColumnMoudleSettingModal() {
    this.columnMoudleSettingVisible = true
  }

  private async onPageMounted(layout: any) {
    this.currentPageSimple = layout
    this.currentPageSimple.parentPage = this.parentPage
    //window.console.log('-------------------------------加载操作列数据layout',layout)
    //window.console.log('-------------------------------加载操作列数据this.layoutData',this.layoutData)
    if (this.layoutData) {
      this.currentPageSimple.LoadData(common.clone(this.layoutData))
    } else {
      this.currentPageSimple.Id = common.getUuid()
    }
    if (!this.parentPage) {
      return
    }
    let data = common.clone(this.parentPage.GetSaveData())
    /**为了适应旧数据 */
    if (this.currentPageSimple.Id == data.id) {
      this.currentPageSimple.Id = common.getUuid()
    }
    let property = this.currentPageSimple.findProperties(PropertyGroupName.normal, '页面入参')[0]
    property.value = data.properties.find((item) => item.propertyName === '页面入参').value
  }
}
</script>

<style scoped>
.ant-btn-primary {
  border-color: rgba(245, 166, 35, 1);
}
</style>