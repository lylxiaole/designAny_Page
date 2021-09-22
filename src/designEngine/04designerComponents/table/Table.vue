/** 
table组件
李永乐 add 2019-09-24
*/
<template>
  <!-- <tablemix name="firstDemo" :dataSource="dataSource" :currentStyle="tablestyle" :style="{background:background,width:width,height:height}"
    @select="select" :showPagination="false"></tablemix> -->
  <div>
    <v-table ref="table" name="demo" :parentPage="parentPage" :data="dataSource" :childdata="childdataSource" :columns="column"
      :tableStyle="tableStyle" :showPagination="showPagination" :showSetColumnButton="isDesign"
      :tablePageConfig="{currentPage:currentPage,pageSize:pageSize,total:total}" :height="height+'px'" @select="manualSelect" @changePage="changePage"
      @refresh="refreshData" @sort="sort" @expand="expand" @treeExpand="treeExpand" :showSelection="showSelection" :showRadioColumn="showRadioColumn"
      :showColumnIndex="showColumnIndex" @rowClick="rowClick" :showHeader="showHeader" :rowId="rowIdName" @selectchild="childItemSelect"
      :showRefreshButton="showRefreshButton" :selectOptionArr="dictItemArr" @rowEditEnd="rowEditEnd" @dataChange="dataChange" :emptyTip="emptyTip"
      @childrowEditEnd="childrowEditEnd" :childrowId="childRowIdName" @celldbclick="celldbclick" @childcelldbclick="childcelldbclick"
      @childrowClick="childrowClick" @rowEditBegin="rowEditBeginTriggerEvent" @tableAdvanceSetting="tableAdvanceSetting"
      @saveTableSetting="saveTableSetting" :isDesign="IsDesigning" :personConfig="personConfig" :isUseParentLayout="isUseParentLayout"
      :dynamicheight="dynamicheight">
    </v-table>
    <advance-setting ref="setting" @ok="saveTableSetting"></advance-setting>
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
  Number_Property,
  TableExportSetting_Property
} from '../../03designerLayoutBase'
import APIS_Test from '../../01designerContext/APIs_Test'
import { ComponentBase } from '../../03designerLayoutBase'
import { columnInfo, tableStyle } from './tableCommonTypes'
import common from '../../02common/commonMethod'
import VTable from './VxeTable'
import modelAnalysis, {
  ModelInfo,
  PageBaseModel,
  ModelBindingProperty,
  ModelPropertyType,
  modelTypeEnum
} from '../../02common/impResourcesCache/modelAnalysis'
import { dictCache, functionCache, modelMapperCache } from '../../02common/impResourcesCache/'
import { CurrentApis } from '../../01designerContext'
import modelBingding, {
  bindingModelVal_InProperty,
  modelBingValue,
  bindTypeEnum,
  modelDataTypeEnum
} from '../../02common/commonClasses/modelBingding'
import { param, paramType } from '../../03designerLayoutBase'
import moment from 'moment'
import { timeStamp2time } from '../../02common/utils/util'
/**引入xlsx来实现excel导出 */
import XLSX from 'xlsx'
import TableGrid from '../../04designerComponents/table/TableGrid.vue'
import AdvanceSetting from '../../04designerComponents/table/advanceSetting.vue'

enum propertyNameEnum {
  datasource = '表格数据源',
  childdatasource = '子表格数据源'
}
enum propertyGroupEnum {
  columnSetting = '列设置',
  bodySetting = '表身设置',
  tableSetting = '表格设置',
  tableDisplaySetting = '表格样式设置'
}

enum operationTypeEnum {
  add = '新增',
  addChild = '新增子表',
  update = '编辑',
  updateChild = '编辑子表',
  delete = '删除',
  deleteChild = '删除子表'
}

@Component({
  components: {
    VTable: VTable,
    AdvanceSetting: AdvanceSetting
  }
})
export default class TableComponent extends ComponentBase {
  /**
   * data
   */
  showSelection: boolean = false
  showRadioColumn: boolean = false
  showColumnIndex: boolean = false
  tablePageConfig: any = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }
  rowIdName: string = 'id'
  childRowIdName: string = 'id'
  isDesign: boolean = false
  dataSource: any[] = []
  childdataSource: any[] = []
  column: any[] = [
    {
      title: '操作',
      field: 'action',
      dataIndex: 'action'
    }
  ]

  tableStyle: tableStyle = {
    child: null,
    canChoose: 1,
    showIndex: true,
    resizable: true,
    border: true,
    stripe: true,
    showheader: true,
    columnInfos: [],
    hasChildData: false,
    orderCode: null,
    orderType: false,
    isCanCheck: true,
    editMode: 'dblclick',
    hasChildTag: null,
    isTabInner: false
  }

  /**导出配置 */
  exportSetting: tableStyle

  inparam: param[]
  outparam: param
  dictItemArr: any[] = []
  /**从模型的主键编码 */
  slaveKeyCode: string[] = []
  childSlaveKeyCode: string[] = []

  /** 定义临时数据 */
  childAddedDataSource: any[] = []
  childUpdatedDataSource: any[] = []
  childDeletedDataSource: any[] = []

  oldAllChildDataSource: any[] = []
  oldAllChildDataSourceNoGroup: any[] = []
  /** 需要一个完整的子表格数据源，不然临时数据的保存会有问题 */
  allChildDataSource: any[] = []
  allChildDataSourceNoGroup: any[] = []

  childCheckRows: any[] = []

  /**
   * readonly data
   */
  get currentPage(): any {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码').value
    } else {
      return 1
    }
  }

  get pageSize(): any {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数').value
    } else {
      return 20
    }
  }

  get total(): any {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '总条数')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '总条数').value
    } else {
      return 0
    }
  }

  get showHeader(): boolean {
    if (this.findPropertyByName(propertyGroupEnum.tableDisplaySetting, '是否显示表头')) {
      return this.findPropertyByName(propertyGroupEnum.tableDisplaySetting, '是否显示表头').value
    } else {
      return true
    }
  }

  get isTree(): boolean {
    return false
  }

  get isCanEdit(): boolean {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可编辑')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可编辑').value
    } else {
      return false
    }
  }

  get showPagination(): boolean {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页').value
    }
    return true
  }

  //是否显示刷新
  get showRefreshButton(): boolean {
    if (this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示刷新')) {
      return this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示刷新').value
    } else {
      return true
    }
  }

  get emptyTip(): string {
    if (this.findPropertyByName(propertyGroupEnum.tableDisplaySetting, '表格为空时显示文本')) {
      return this.findPropertyByName(propertyGroupEnum.tableDisplaySetting, '表格为空时显示文本').value
    } else {
      return '暂无数据'
    }
  }

  get isUseParentLayout(): boolean {
    let prop = this.findPropertyByName('特有布局', '高度自适应')
    //window.console.log('--------------------------propproppropprop',prop)
    if (prop) {
      return prop.value
    } else {
      return false
    }
  }

  get dynamicheight(): string {
    let prop = this.findPropertyByName(PropertyGroupName.normal, '高度')
    if (prop) {
      this.$nextTick(() => {
        ;(this.$refs['table'] as any).setInitMax(prop.value)
      })
      return prop.value + 'px'
    } else {
      return '100%'
    }
  }

  personConfig: any
  /** 页面初始化方法 */
  mounted() {
    if (this.IsDesigning) {
      // window.console.log('表格组件加载了')
      this.width = 400
      this.height = 300
      this.registerProperty('表格数据源', PropertyGroupName.normal, null, [])
      this.registerProperty('子表格数据源', PropertyGroupName.normal, null, [])
      /**列*/
      // this.registerProperty('字体大小', propertyGroupEnum.columnSetting, new Boolean_Property(), true)
      // this.registerProperty('字体颜色', propertyGroupEnum.columnSetting, new Boolean_Property(), true)
      this.registerProperty('列样式', propertyGroupEnum.columnSetting, new TableStyleSetting_Property(), null)

      this.registerProperty('当前页码', propertyGroupEnum.tableSetting, new Number_Property(), 1, false)
      this.registerProperty('每页显示项数', propertyGroupEnum.tableSetting, new Number_Property(), 20, false)
      this.registerProperty('总条数', propertyGroupEnum.tableSetting, new Number_Property(), 0, false)
      this.registerProperty('是否显示分页', propertyGroupEnum.tableSetting, new Boolean_Property(), true, true)
      this.registerProperty('当前选中行', propertyGroupEnum.tableSetting, null, [])
      this.registerProperty('是否有选中行', propertyGroupEnum.tableSetting, new Boolean_Property(), false, false)
      this.registerProperty('是否有子表格', propertyGroupEnum.tableSetting, new Boolean_Property(), false, false)
      this.registerProperty('展开行', propertyGroupEnum.tableSetting, null, '')
      this.registerProperty('当前选中模型', propertyGroupEnum.tableSetting, null, [], false, false)
      this.registerProperty('当前点击行', propertyGroupEnum.tableSetting, null, {})
      this.registerProperty('是否树表格', propertyGroupEnum.tableSetting, new Boolean_Property(), false, true)
      this.registerProperty('是否可选', propertyGroupEnum.tableSetting, new Enum_Property(true, ['否', '多选', '单选']), '多选')
      this.registerProperty('新增数据源', propertyGroupEnum.tableSetting, null, [], false, false)
      this.registerProperty('编辑数据源', propertyGroupEnum.tableSetting, null, [], false, false)
      this.registerProperty('删除数据源', propertyGroupEnum.tableSetting, null, [], false, false)
      this.registerProperty('是否显示刷新', propertyGroupEnum.tableSetting, new Boolean_Property(), true)
      // this.registerProperty(
      //   '是否可编辑',
      //   propertyGroupEnum.tableSetting,
      //   new Enum_Property(true, ['否', '单击编辑', '双击编辑', '手动编辑']),
      //   '否',
      //   false,false
      // )
      this.registerProperty('子表格是否缓存数据', propertyGroupEnum.tableSetting, new Boolean_Property(), false)
      this.registerProperty('导出设置', propertyGroupEnum.tableSetting, new TableExportSetting_Property(), null)

      this.registerProperty('是否显示表头', propertyGroupEnum.tableDisplaySetting, new Boolean_Property(), true)
      this.registerProperty('表格为空时显示文本', propertyGroupEnum.tableDisplaySetting, new Text_Property(), '暂无数据')
    }
    this.registerEvents('列表刷新', '', this.inparam, this.outparam)
    this.registerEvents('表格展开', '', this.inparam, this.outparam)
    this.registerEvents('点击行', '', this.inparam, this.outparam)

    let currentCheckinparam: param[] = []
    currentCheckinparam.push({ name: '当前勾选', type: paramType.complexType, val: null })
    this.registerEvents('勾选行', '', currentCheckinparam, this.outparam)
    this.registerEvents('取消勾选行', '', this.inparam, this.outparam)
    let datasourceinparam: param[] = []
    datasourceinparam.push({ name: '当前数据', type: paramType.complexType, val: null })
    this.registerEvents('表格数据变更', '', datasourceinparam, this.outparam)
    let editRowinparam: param[] = []
    editRowinparam.push({ name: '编辑行数据', type: paramType.complexType, val: null })

    this.registerEvents('行编辑开始', '', editRowinparam, this.outparam)
    this.registerEvents('行编辑结束', '', editRowinparam, this.outparam)

    this.registerEvents('树表格展开行', '', this.inparam, this.outparam)

    this.registerMethods('删除选中数据', '', this.deleteRows, null, null)
    let rowinparam: param[] = []
    rowinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    this.registerMethods('删除行', '', this.deleteRow, rowinparam, null)

    let deletechildparam: param[] = []
    deletechildparam.push({ name: '主表关联id', type: paramType.string, val: null })
    deletechildparam.push({ name: '子表id', type: paramType.complexType, val: null })
    this.registerMethods('删除子表数据', '', this.deleteChildRow, deletechildparam, null)
    let updateparam: param[] = []
    updateparam.push({ name: '行数据', type: paramType.complexType, val: null })
    updateparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    this.registerMethods('更新行', '', this.updateRow, updateparam, null)
    let updatechildparam: param[] = []
    updatechildparam.push({ name: '主表关联id', type: paramType.string, val: null })
    updatechildparam.push({ name: '子表数据', type: paramType.complexType, val: null })
    updatechildparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    this.registerMethods('更新子表数据', '', this.updateChildRow, updatechildparam, null)
    let addrowinparam: param[] = []
    addrowinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    addrowinparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    this.registerMethods('添加行', '', this.addRows, addrowinparam, null)
    let addchildrowinparam: param[] = []
    addchildrowinparam.push({ name: '主表关联id', type: paramType.string, val: null })
    addchildrowinparam.push({ name: '子表数据', type: paramType.complexType, val: null })
    addchildrowinparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    this.registerMethods('添加子表数据', '', this.addChildRow, addchildrowinparam, null)
    this.registerMethods('清除临时数据', '', this.dataClear, this.inparam, null)
    //this.registerEvents('列表排序', '', this.inparam, this.outparam)
    let editinparam: param[] = []
    editinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    this.registerMethods('开始行内编辑', '', this.rowEditBegin, editinparam, null)
    this.registerMethods('取消行内编辑', '', this.rowEditCancel, editinparam, null)
    this.registerMethods('保存行内编辑', '', this.rowEditSave, editinparam, null)
    let selectallinparam: param[] = []
    selectallinparam.push({ name: '全选/反选', type: paramType.boolean, val: true })
    selectallinparam.push({ name: '是否触发勾选事件', type: paramType.boolean, val: true })
    this.registerMethods('勾选全部数据', '', this.selectAllData, selectallinparam, null)
    let selectinparam: param[] = []
    selectinparam.push({ name: '匹配数据源', type: paramType.complexType, val: null })
    selectinparam.push({ name: '匹配字段', type: paramType.string, val: null })
    selectinparam.push({ name: '勾选/反选', type: paramType.boolean, val: true })
    selectinparam.push({ name: '是否触发勾选事件', type: paramType.boolean, val: true })
    selectinparam.push({ name: '匹配表格字段', type: paramType.string, val: null })
    this.registerMethods('勾选指定行', '', this.selectDataArr, selectinparam, null)
    this.registerMethods('获取表格当前数据', '', this.getCurrentDataSource, this.inparam, null)
    this.registerMethods('获取最近一次编辑的数据', '', this.getPreviousEditInfo, this.inparam, null)
    /**表格临时数据源相关方法 */
    let getadddataparam: param[] = []
    getadddataparam.push({ name: '是否包含模型编码', type: paramType.boolean, val: false })
    this.registerMethods('获取表格新增数据', '', this.getAddedDataSource, getadddataparam, null)
    this.registerMethods('获取子表格新增数据', '', this.getAddedChildDataSource, this.inparam, null)
    //getadddataparam.push({ name: '是否包含模型编码', type: paramType.boolean, val: false })
    this.registerMethods('获取表格更新数据', '', this.getUpdatedDataSource, getadddataparam, null)
    this.registerMethods('获取子表格更新数据', '', this.getUpdatedChildDataSource, this.inparam, null)
    //getadddataparam.push({ name: '是否包含模型编码', type: paramType.boolean, val: false })
    this.registerMethods('获取表格删除数据', '', this.getDeletedDataSource, getadddataparam, null)
    this.registerMethods('获取子表格删除数据', '', this.getDeletedChildDataSource, this.inparam, null)

    let expandinparam: param[] = []
    expandinparam.push({ name: '行数据', type: paramType.string, val: null })
    this.registerMethods('展开指定行', '', this.setExpandRow, expandinparam, null)

    let tempinparam: param[] = []
    tempinparam.push({ name: '新增数据', type: paramType.complexType, val: null })
    tempinparam.push({ name: '编辑数据', type: paramType.complexType, val: null })
    tempinparam.push({ name: '删除数据', type: paramType.complexType, val: null })
    this.registerMethods('指定临时数据源', '', this.setTempDataSource, tempinparam, null)

    /** 列设置根据列编码来匹配 */
    let columninparam: param[] = []
    columninparam.push({ name: '指定列', type: paramType.string, val: null })
    columninparam.push({ name: '下拉数据源', type: paramType.complexType, val: null })
    this.registerMethods('设置列数据源', '用于行编辑中的下拉框的数据源赋值', this.setSelectDataSourceByColumnCode, columninparam, null)

    let rowselectinparam: param[] = []
    rowselectinparam.push({ name: '主键id', type: paramType.string, val: null })
    this.registerMethods('设置点击行', '', this.setClickRow, rowselectinparam, null)

    //let childCheckinparam: param[] = []
    this.registerMethods('获取子表格选中数据', '', this.getChildCheckRows, this.inparam, null)
    this.registerMethods('重置表格数据', '', this.resetDataSource, this.inparam, null)

    let batchDeleteChildinparam: param[] = []
    batchDeleteChildinparam.push({ name: '待删除数据', type: paramType.complexType, val: null })
    this.registerMethods('批量删除子表格数据', '', this.batchDeleteChild, batchDeleteChildinparam, null)

    let batchUpdateChildinparam: param[] = []
    batchUpdateChildinparam.push({ name: '待更新数据', type: paramType.complexType, val: null })
    this.registerMethods('批量更新子表格数据', '', this.batchUpdateChild, batchUpdateChildinparam, null)

    let setActionCoulumninparam: param[] = []
    setActionCoulumninparam.push({ name: '显示/隐藏', type: paramType.boolean, val: true })
    this.registerMethods('设置操作列状态', '', this.setActionCoulumn, setActionCoulumninparam, null)

    let setCoulumninparam: param[] = []
    setCoulumninparam.push({ name: '指定列', type: paramType.string, val: null })
    setCoulumninparam.push({ name: '显示/隐藏', type: paramType.boolean, val: true })
    this.registerMethods('设置列状态', '', this.setCoulumnStatus, setCoulumninparam, null)

    this.registerMethods('检测是否存在临时数据', '', this.checkIsExistTempData, this.inparam, null)
    this.registerMethods('获取子表格当前数据', '', this.getChildCurrentDataSource, this.inparam, null)
    let exportinparam: param[] = []
    exportinparam.push({ name: '文件名称', type: paramType.string, val: null })
    this.registerMethods('导出表格当前数据', '', this.exportTableToCsv, exportinparam, null)

    let customExportinparam: param[] = []
    customExportinparam.push({ name: '文件名称', type: paramType.string, val: null })
    this.registerMethods('导出表格数据', '根据导出配置来导出', this.customExportData, customExportinparam, null)

    this.registerMethods('表格禁用', '', this.setTableDisabled, this.inparam, null)
    this.registerMethods('表格启用', '', this.setTableEnabled, this.inparam, null)

    let setChildDatainparam: param[] = []
    setChildDatainparam.push({ name: '子表关联主表属性编码', type: paramType.string, val: null })
    setChildDatainparam.push({ name: '子表格全部数据', type: paramType.complexType, val: null })
    this.registerMethods('设置子表格全部数据', '', this.setAllChildDataSource, setChildDatainparam, null)

    let treeExpandinparam: param[] = []
    treeExpandinparam.push({ name: '子数据', type: paramType.complexType, val: null })
    this.registerMethods('设置树表格当前行子数据', '', this.setTreeExpandRowChildren, treeExpandinparam, null)

    let refreshTableinparam: param[] = []
    refreshTableinparam.push({ name: '表格数据', type: paramType.complexType, val: null })
    this.registerMethods('强制刷新表格数据', '树表格懒加载使用', this.forceRefreshDataSource, refreshTableinparam, null)

    let masterRowinparam: param[] = []
    masterRowinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    masterRowinparam.push({ name: '子表关联字段名', type: paramType.string, val: null })
    this.registerMethods('删除主表数据', '联动删除子表数据', this.deleteRowContainsChild, masterRowinparam, null)

    this.registerMethods('表格折叠全部', '', this.folderingAllRows, this.inparam, null)
    //this.registerMethods('表格展开全部', '', this.expandAllRows, this.inparam, null)

    let columnIdxinparam: param[] = []
    columnIdxinparam.push({ name: '列序号', type: paramType.number, val: null })
    this.registerMethods('根据序号显示列', '', this.setColumnVisibleByIdx, columnIdxinparam, null)
    this.registerMethods('根据数据显示列', '', this.setColumnVisibleByData, this.inparam, null)

    let rowIdinparam: param[] = []
    rowIdinparam.push({ name: '主键', type: paramType.string, val: null })
    this.registerMethods('根据主键获取表格行数据', '', this.getRowById, rowIdinparam, null)

    let childrowselectinparam: param[] = []
    childrowselectinparam.push({ name: '主表主键id', type: paramType.string, val: null })
    childrowselectinparam.push({ name: '子表主键id', type: paramType.string, val: null })
    this.registerMethods('设置子表点击行', '', this.setChildClickRow, childrowselectinparam, null)

    //this.$on('onPropertyChanged', this.onPropertyChangedInner)

    //表格初始化完成之后绑定分页模型实例，查询一下分页模型信息，然后初始化
    let pagenumber = 1
    let pageSize = 20
    let nameproperty = this.findPropertyByName(PropertyGroupName.normal, '名称')
    let name = ''
    if (nameproperty && nameproperty.value) {
      name = '-' + nameproperty.value
    }

    if (this.IsDesigning) {
      let idproperty = this.findPropertyByName(PropertyGroupName.normal, '唯一Id')

      let modelInfo = modelAnalysis.getModelInfoByCode('pageModel').modelIndo
      this.$nextTick(() => {
        var newmodelbind: modelBingding = new modelBingding()
        newmodelbind.modelDataType = modelDataTypeEnum.single
        newmodelbind.modelBindingType = 1
        newmodelbind.modelBindingName = modelInfo.modelName + '-' + idproperty.value
        newmodelbind.modelBindingInfo = { name: modelInfo.modelName, modelCode: modelInfo.modelCode, modelId: modelInfo.id }
        newmodelbind.modelDetailInfo = modelInfo
        if (!this.parentPage || !this.parentPage.modelBindings) {
          return
        }
        var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == newmodelbind.modelBindingName)

        if (!modelBind) {
          this.parentPage.addModelBinding(newmodelbind)
          let tempData = {
            id: 1,
            pageSize: this.findPropertyByName('表格设置', '每页显示项数').value,
            pageNumber: this.findPropertyByName('表格设置', '当前页码').value
          }
          this.parentPage.setModelBindVal(newmodelbind.modelBindingName, tempData)
          //把分页属性绑定到模型实例上面
          var newbindInfo = new bindingModelVal_InProperty()
          newbindInfo.bindType = bindTypeEnum.code
          newbindInfo.modelCodes = [{ code: 'pageSize', codeName: '页大小', modelId: null }]
          newbindInfo.modelName = newmodelbind.modelBindingName
          newbindInfo.propertyId = this.findPropertyByName('表格设置', '每页显示项数').id
          this.addPropertyModelBind(newbindInfo)
          //this.setModelBindInfo(newbindInfo.modelName,newmodelbind,newbindInfo.propertyId)

          var newbindInfo1 = new bindingModelVal_InProperty()
          newbindInfo1.bindType = bindTypeEnum.code
          newbindInfo1.modelCodes = [{ code: 'pageNumber', codeName: '页索引', modelId: null }]
          newbindInfo1.modelName = newmodelbind.modelBindingName
          newbindInfo1.propertyId = this.findPropertyByName('表格设置', '当前页码').id
          this.addPropertyModelBind(newbindInfo1)
        }
      })
    }

    //var modelBind111 = this.parentPage.modelBindings.find((o) => o.modelBindingName == '分页模型' + nameproperty.value)

    //分页模型实例统一更新默认值
    if (!this.parentPage || !this.parentPage.modelBindings) {
      return
    }
    this.parentPage.modelBindings.forEach((element) => {
      if (element.modelBindingName.indexOf('分页模型') > -1) {
        let tempData = {
          id: 1,
          pageSize: 20,
          pageNumber: 1
        }
        this.parentPage.setModelBindVal(element.modelBindingName, tempData)
      }
    })
    this.$on('onPropertyChanged', this.onPropertyChangedInner)

    this.isNeedRecalculate = true
  }

  /** 页面加载完成之后执行 */
  protected loadCompleted(childrenData: any[]) {
    //var id = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource).id
    //const aaa = this.getPropertyBindInfo(id).modelCodes
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    var modelInfo = null
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      }
    }
    var childprop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    var childmodelInfo = null
    if (childprop) {
      let propBind = this.getPropertyBindInfo(childprop.id)
      if (propBind) {
        childmodelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      }
    }

    //window.console.log('------------------------------打印出来当前表格modelInfo', modelInfo)
    let property = this.findPropertyByName(propertyGroupEnum.columnSetting, '列样式')
    if (property && property.value && property.value.columnInfos.length > 0) {
      let tempStyle = property.value as tableStyle
      let hasData = modelInfo && modelInfo.modelDetailInfo && modelInfo.modelDetailInfo.modelPropertyList
      let rowIndex = 0
      tempStyle.columnInfos.forEach((element) => {
        if (element.colTemplateData) {
          element.colTemplateData.modelCode = this.getModelCode()
        }
        if (hasData) {
          //let detailInfo = modelInfo.modelDetailInfo
          var modelPropertyDetail = modelInfo.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === element.field)
          if (modelPropertyDetail) {
            element.columnType = modelPropertyDetail.propertyType
            element.dictId = modelPropertyDetail.dictId
            element.propertyDetail = modelPropertyDetail
          }
        }
        rowIndex++
        element.index = rowIndex
      })
      if (tempStyle.child) {
        tempStyle.child.columnInfos.forEach((element) => {
          if (element.colTemplateData) {
            element.colTemplateData.modelCode = this.getModelCode(true)
          }
          if (childmodelInfo && childmodelInfo.modelDetailInfo && childmodelInfo.modelDetailInfo.modelPropertyList) {
            var modelPropertyDetail = childmodelInfo.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === element.field)
            if (modelPropertyDetail) {
              element.columnType = modelPropertyDetail.propertyType
              element.dictId = modelPropertyDetail.dictId
              element.propertyDetail = modelPropertyDetail
            }
          }
        })
      }
      this.tableStyle = tempStyle
    } else {
      this.tableStyle = this.getTableStyle()
    }
    //window.console.log('------------------------------打印出来当前表格样式this.tableStyle', this.tableStyle)

    let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    if (chooseType) {
      chooseType.value = this.tableStyle.canChoose === 0 ? '否' : this.tableStyle.canChoose === 1 ? '多选' : '单选'
    }
    //window.console.log('--------------初始化是否可选属性',chooseType)

    //this.rowIdName = detailInfo.modelRelationList[0].modelAlias+'__id'
    //var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      this.initDefaultData(prop, false)
    }

    if (childprop) {
      this.initDefaultData(childprop, true)
    }
    let model = this.getModel()
    model.modelOrders = []
    if (this.tableStyle.orderCode && this.tableStyle.orderCode != this.rowIdName) {
      model.modelOrders.push({ code: this.tableStyle.orderCode, val: !this.tableStyle.orderType })
    }
    //window.console.log('------------------------------model', model)
    //添加主键id的排序
    model.modelOrders.push({ code: this.rowIdName, val: true })

    window.console.log('初始化完成完成tableStyle', this.tableStyle)
    this.column = this.tableStyle.columnInfos
    //this.isDesign = !this.IsDesigning
    this.tempDataClear()
    //window.console.log('this.column', this.column)
    //保证变更只触发一次
    this.$off('onPropertyChanged')
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    //兼容之前的数据
    let propDataSource = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
    if (propDataSource && propDataSource.value === true) {
      propDataSource.value = []
    }
    // this.setPropertyVal(propDataSource.id,[])

    // this.initDataSource(cloneValue)
    // this.$once('onAfterResize', () => {

    // })
    //加载完成之后把给导出设置一个默认值
    let exportProperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '导出设置')
    if (exportProperty) {
      if (!exportProperty.value || !exportProperty.value.columnInfos || exportProperty.value.columnInfos.length == 0) {
        exportProperty.value = this.getExportSetting()
        //this.setPropertyVal(exportProperty.id, this.getExportSetting())
      }
    }
    if (this.IsDesigning == true) {
      this.updateComponentsChildren()
    } else {
      //let heightProperty = this.findPropertyByName(PropertyGroupName.normal, '高度')
      //;(this.$refs['table'] as any).setDynamicheight(heightProperty.value)
    }

    //不在设计期的情况下，获取用户配置的表格列数据
    if (!this.IsDesigning) {
      let personalSetting = this.topParentPage.getCompPersonalSetting(this.Id)
      //window.console.error('-------------------获取表格id',this.Id)
      //window.console.error('-----------------获取表格个性化配置',personalSetting)
      if (!personalSetting) {
        this.personConfig = []
        return
      }
      this.personalConfigId = personalSetting.id
      this.personConfig = personalSetting.com_configuration.config
    }
  }

  public onAfterResize() {
    ;(this.$refs.table as any).recalculateTable()
  }

  private initDefaultData(prop: any, ischild: boolean) {
    if (!this.parentPage) {
      return
    }
    let bindings = this.parentPage.modelBindings
    let propBind = this.getPropertyBindInfo(prop.id)
    if (propBind) {
      var modelInfo = bindings.find((item) => item.modelBindingName === propBind.modelName)
      const detailInfo = modelInfo.modelDetailInfo
      const modelRelationList = detailInfo.modelRelationList
      if (!ischild) {
        if (detailInfo.modelType === modelTypeEnum.VIEW) {
          modelRelationList.forEach((model) => {
            if (model.master === true) {
              this.rowIdName = model.modelAlias + '__id'
            } else {
              this.slaveKeyCode.push(model.modelAlias + '__id')
            }
          })
        }
      } else {
        if (detailInfo.modelType === modelTypeEnum.VIEW) {
          modelRelationList.forEach((model) => {
            if (model.master === true) {
              this.childRowIdName = model.modelAlias + '__id'
            } else {
              this.childSlaveKeyCode.push(model.modelAlias + '__id')
            }
          })
        }
      }
      let columns = this.tableStyle.columnInfos
      if (ischild) {
        if (this.tableStyle.child && this.tableStyle.child.columnInfos && this.tableStyle.child.columnInfos.length > 0) {
          columns = this.tableStyle.child.columnInfos
        } else {
          columns = []
        }
      }
      const modelPropertyList = detailInfo.modelPropertyList
      columns.forEach((temp) => {
        if (temp.columnType === ModelPropertyType.ENUM || temp.columnType === ModelPropertyType.ENUMARRAY) {
          const modelPropertyDetail = modelPropertyList.find((item) => item.propertyCode === temp.field)
          if (modelPropertyDetail) {
            let dictId = modelPropertyDetail.dictId
            let param = {
              filter: [
                {
                  code: 'sys_dict_view__id',
                  value: dictId,
                  type: 'EQ'
                }
              ],
              modelCode: 'DictView'
            }
            let tempItem = []
            if (dictId) {
              // let dict = CurrentApis.GetSysDictById(dictId) as any
              let dict = dictCache.getSystemDictById_Sync(dictId) as any
              if (dict) {
                let itemList = dict
                itemList.forEach((item) => {
                  if (!item.deleted) {
                    tempItem.push({
                      itemName: item.item_name,
                      itemValue: item.item_value + '',
                      itemCode: item.item_code
                    })
                  }
                })
              }
            }

            if (!this.dictItemArr.find((item) => item.propertyCode == modelPropertyDetail.propertyCode)) {
              this.dictItemArr.push({
                dictId: modelPropertyDetail.dictId,
                propertyCode: modelPropertyDetail.propertyCode,
                columnType: modelPropertyDetail.propertyType,
                item: tempItem
              })
            }
          }
        }
      })
    }
  }

  private initDataSource(cloneValue: any) {
    //window.console.error('------------表格初始化数据')
    let totalSize = this.findPropertyByName(propertyGroupEnum.tableSetting, '总条数')
    if (Object.keys(cloneValue).length == 0 || (cloneValue.content && cloneValue.content instanceof Array && cloneValue.content.length == 0)) {
      this.dataSource = []
      totalSize.value = 0
      let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
      var val = { modelCode: this.getModelCode(), data: {} }
      this.setPropertyVal(property.id, val)
      //window.console.log('------------属性变更-当前点击行',common.clone(property))
      //如果没查询到数据，页码重置会第一页，执行刷新方法
      // let currentPage = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
      // currentPage.value = 1
      // this.changePage(1, this.pageSize, false)
      return
    }
    totalSize.value = cloneValue.totalElements
    let tempValue = cloneValue.content
    if (!cloneValue.content) {
      if (!cloneValue.data) {
        tempValue = cloneValue
      } else {
        tempValue = cloneValue.data
      }
    }
    if (tempValue && tempValue.length > 0) {
      // tempValue.forEach(element => {
      //   this.enumValueConvert(element)
      // });
      this.dataSource = common.clone(tempValue)
    } else {
      this.dataSource = []
      let propertyclick = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
      var val = { modelCode: this.getModelCode(), data: {} }
      this.setPropertyVal(propertyclick.id, val)
      //如果没查询到数据，页码重置会第一页，执行刷新方法，只有查询的结构才会重置，不分页的不需要查询
      let isshowPage = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')
      if (cloneValue.content && isshowPage && isshowPage.value == true) {
        let currentPage = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
        currentPage.value = 1
        this.changePage(1, this.pageSize)
      }
    }
    var isRefresh = false
    if (this.dataSource.length > 0) {
      let _needReBindDatas = this.dataSource.filter((w) => w[this.rowIdName] == undefined)
      if (_needReBindDatas && _needReBindDatas.length > 0) {
        let ids = CurrentApis.GetUniqueIds(_needReBindDatas.length)
        let index = 0
        //判断数据，并修复数据
        _needReBindDatas.forEach((element) => {
          if (element[this.rowIdName] == undefined) {
            element[this.rowIdName] = ids[index]
            index++
            isRefresh = true
          }
        })
      }
    }
    if (isRefresh) {
      let dataproperty = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
      dataproperty.value.content = common.clone(this.dataSource)
      this.setPropertyVal(dataproperty.id, dataproperty.value)
    }
    let isSelectproperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    this.setPropertyVal(isSelectproperty.id, true)
  }

  /** 属性表更方法 */
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    var page = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var pageSize = this.findPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')
    //window.console.log('------------属性变更',property)
    switch (property.propertyName) {
      case '绑定模型':
        if (this.IsDesigning == true) {
          var property11 = this.findPropertyByName(propertyGroupEnum.columnSetting, '列样式')
          property11.value = this.getTableStyle()
          var exportPro = this.findPropertyByName(propertyGroupEnum.tableSetting, '导出设置')
          var exportSetting = this.getExportSetting()
          //exportSetting.columnInfos = exportSetting.columnInfos.filter(item=>item.field != 'action')
          exportPro.value = exportSetting
          //this.setPropertyVal(exportPro.id,exportSetting)
          //this.tableStyle = property11.value
          //window.console.log('----------------------------------列样式赋值', property11)
          //window.console.log('--------------this.bindInfos', this.bindInfos)
          //window.console.log('--------------绑定模型变更', property)
          //var aaa = this.findPropertyByName(propertyGroupEnum.tableSetting, '展开行')
          //window.console.log('--------------展开行属性', aaa)
        }
        //this.tableStyle = this.getTableStyle()
        break
      case '表格数据源':
        //数据源变更之后，新增编辑删除的数据源要清空
        this.tempDataClear()
        //点击行属性清空
        // let propertyClick = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
        // var propertyClickVal = { modelCode: this.getModelCode(), data: {} }
        // this.setPropertyVal(propertyClick.id, propertyClickVal)
        if (property.value) {
          let cloneValue = common.clone(property.value)
          this.initDataSource(cloneValue)
          // this.tablePageConfig = {
          //   currentPage: page.value,
          //   pageSize: pageSize.value,
          //   pageSizes: cloneValue.totalPages,
          //   total: cloneValue.totalElements,
          // }
        }
        if (this.$refs['table']) {
          ;(this.$refs['table'] as any).clearSelect()
          ;(this.$refs['table'] as any).clearRowExpand()
        }
        this.itemSelect([])
        //表格数据源变更的时候，清除子表格临时数据
        this.oldAllChildDataSource = []
        this.oldAllChildDataSourceNoGroup = []
        this.allChildDataSource = []
        this.allChildDataSourceNoGroup = []
        var childprop = this.findPropertyByName(PropertyGroupName.normal, '子表格数据源')
        this.setPropertyVal(childprop.id, [])
        break
      case '子表格数据源':
        //window.console.log('--------------子表格数据源变更', property.value)
        if (property.value) {
          var prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '展开行')
          if (prop) {
            let temp = this.oldAllChildDataSource.find((item) => item.key == prop.value)
            var tempprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
            if (tempprop.value == false) {
              let tempValue = property.value.content ? property.value.content : property.value
              if (tempValue && tempValue.length > 0) {
                this.childdataSource = common.clone(tempValue)
              } else {
                this.childdataSource = []
              }
            } else {
              if (!temp) {
                let tempValue = property.value.content ? property.value.content : property.value
                if (tempValue && tempValue.length > 0) {
                  this.childdataSource = common.clone(tempValue)
                } else {
                  this.childdataSource = []
                }
              } else {
                this.childdataSource = common.clone(temp.value)
                //window.console.log('--------------子表格数据源变更temp', temp)
              }
            }
            if (!temp && prop.value && prop.value !== true) {
              this.oldAllChildDataSource.push({ key: prop.value, value: this.childdataSource })
              this.allChildDataSource.push({ key: prop.value, value: this.childdataSource })
              if (this.childdataSource instanceof Array && this.childdataSource.length > 0) {
                this.oldAllChildDataSourceNoGroup = this.oldAllChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
                this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
              }
            } else {
              if (temp) {
                temp.value = this.childdataSource
                if (temp.value instanceof Array && temp.value.length > 0) {
                  this.oldAllChildDataSourceNoGroup = this.oldAllChildDataSourceNoGroup.concat(common.clone(temp.value))
                  this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(common.clone(temp.value))
                }
              }
            }
          }
        }
        break
      case '当前页码':
      case '每页显示项数':
      case '总条数':
        // this.triggeEvent('列表刷新', [
        //   { name: 'pageNumber', type: 'Number', val: page.value },
        //   { name: 'pageSize', type: 'Number', val: pageSize.value },
        // ])
        break
      case '是否显示分页':
        // var isshowPage = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')
        // this.showPagination = isshowPage.value
        break
      case '列样式':
        if (this.IsDesigning == true) {
          var tempStyle = property.value as tableStyle
          var index = 0
          tempStyle.columnInfos.forEach((element) => {
            if (element.colTemplateData) {
              element.colTemplateData.modelCode = this.getModelCode()
            }
            index++
            element.index = index
          })
          this.tableStyle = tempStyle
          this.updateComponentsChildren()
        }
        break
      case '是否可选':
        var property111 = this.findPropertyByName(propertyGroupEnum.columnSetting, '列样式')
        if (property111) {
          var temp = common.clone(property111.value)
          temp.canChoose = property.value === '否' ? 0 : property.value === '多选' ? 1 : 2
          this.tableStyle = temp
          property111.value = temp
          //this.setPropertyVal(property111.id,temp)
        }
        break
      case '是否树表格':
        var property111 = this.findPropertyByName(propertyGroupEnum.columnSetting, '列样式')
        if (property111) {
          var temp = common.clone(property111.value)
          //temp.canChoose = property.value === '否' ? 0 : property.value === '多选' ? 1 : 2
          if (property.value) {
            ;(temp as tableStyle).hasChildData = true
          } else {
            ;(temp as tableStyle).hasChildData = false
          }
          //this.tableStyle = temp
          this.setPropertyVal(property111.id, temp)
        }
        break
      case '高度':
        window.console.log('------------------------表格高度变更property', property)
        ;(this.$refs['table'] as any).setDynamicheight(property.value)
        break
      default:
        break
    }
  }

  /** 私有方法 */
  select(selection: any) {
    //window.console.log('selection', selection)
  }

  private getcolumn(): any[] {
    var columnInfos = []
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      if (this.getPropertyBindInfo(prop.id)) {
        var codeList = this.getPropertyBindInfo(prop.id).modelCodes
        if (codeList && codeList.length > 0) {
          codeList.forEach((element) => {
            var col = new columnInfo()
            col.field = element.code
            col.title = element.codeName
            columnInfos.push(col)
          })
        }
      }
    }
    var actionColumn = new columnInfo()
    actionColumn.title = '操作'
    actionColumn.field = 'action'
    actionColumn.dataIndex = 'action'
    columnInfos.push(actionColumn)
    return columnInfos
  }

  private getTableStyle(): tableStyle {
    var etableStyle = new tableStyle()
    etableStyle.canChoose = this.tableStyle ? this.tableStyle.canChoose : 1
    etableStyle.showIndex = this.tableStyle ? this.tableStyle.showIndex : true
    etableStyle.resizable = this.tableStyle ? this.tableStyle.resizable : true
    etableStyle.border = this.tableStyle ? this.tableStyle.border : true
    etableStyle.stripe = this.tableStyle ? this.tableStyle.stripe : true
    etableStyle.showheader = this.tableStyle ? this.tableStyle.showheader : true
    etableStyle.hasChildData = this.tableStyle ? this.tableStyle.hasChildData : false
    etableStyle.orderType = this.tableStyle ? this.tableStyle.orderType : false
    etableStyle.orderCode = this.tableStyle ? this.tableStyle.orderCode : null
    etableStyle.isCanCheck = this.tableStyle ? this.tableStyle.isCanCheck : true
    etableStyle.columnInfos = []
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      //window.console.log('----------------------------------------aaaaaaaaaaa', propBind)
      if (propBind) {
        var codeList = propBind.modelCodes
        if (codeList && codeList.length > 0) {
          var modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
          codeList.forEach((element) => {
            let tempColumn = this.tableStyle.columnInfos.find((item) => item.field === element.code)
            if (tempColumn) {
              etableStyle.columnInfos.push(tempColumn)
            } else {
              var col = new columnInfo()
              col.field = element.code
              col.title = element.codeName
              let detailInfo = modelInfo.modelDetailInfo
              var modelPropertyDetail = detailInfo.modelPropertyList.find((item) => item.propertyCode === element.code)
              if (modelPropertyDetail) {
                col.formatString = modelPropertyDetail.formatter
                col.columnType = modelPropertyDetail.propertyType
                col.dictId = modelPropertyDetail.dictId
                col.propertyDetail = modelPropertyDetail
              }
              col.index = etableStyle.columnInfos.length + 1
              etableStyle.columnInfos.push(col)
            }
          })
        }
      }
    }
    //添加子表格数据源模型实例
    prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        etableStyle.child = this.getChildTableStyle(propBind)
      }
    }
    etableStyle.columnInfos.sort(function(a, b) {
      return a.index - b.index
    })
    var actionColumn = this.tableStyle.columnInfos.find((item) => item.field === 'action')
    if (!actionColumn) {
      actionColumn = new columnInfo()
      actionColumn.title = '操作'
      actionColumn.field = 'action'
      actionColumn.index = 999
    }
    //检测下排序列是否存在与表格列中
    var temporder = etableStyle.columnInfos.find((item) => item.field === etableStyle.orderCode)
    if (!temporder) {
      etableStyle.orderCode = null
    }
    etableStyle.columnInfos.push(actionColumn)
    //window.console.log('-------------------------------表格列数据xxxxx', etableStyle)
    return etableStyle
  }

  /**获取导出配置 */
  private getExportSetting(): tableStyle {
    let oldSetting = new tableStyle()
    let exportProperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '导出设置')
    if (exportProperty && exportProperty.value) {
      oldSetting = exportProperty.value
    }
    var etableStyle = new tableStyle()
    etableStyle.columnInfos = []
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        var codeList = propBind.modelCodes
        if (codeList && codeList.length > 0) {
          var modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
          codeList.forEach((element) => {
            let tempColumn = oldSetting && oldSetting.columnInfos ? oldSetting.columnInfos.find((item) => item.field === element.code) : null
            if (tempColumn) {
              etableStyle.columnInfos.push(tempColumn)
            } else {
              var col = new columnInfo()
              col.field = element.code
              col.title = element.codeName
              let detailInfo = modelInfo.modelDetailInfo
              var modelPropertyDetail = detailInfo.modelPropertyList.find((item) => item.propertyCode === element.code)
              if (modelPropertyDetail) {
                col.formatString = modelPropertyDetail.formatter
                col.columnType = modelPropertyDetail.propertyType
                col.dictId = modelPropertyDetail.dictId
                col.propertyDetail = modelPropertyDetail
              }
              col.index = etableStyle.columnInfos.length + 1
              etableStyle.columnInfos.push(col)
            }
          })
        }
      }
    }
    return etableStyle
  }

  private getChildTableStyle(propBind: any): tableStyle {
    var childStyle = new tableStyle()
    childStyle.columnInfos = []
    var codeList = propBind.modelCodes
    if (codeList && codeList.length > 0) {
      var modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      codeList.forEach((element) => {
        let tempColumn = !this.tableStyle.child ? null : this.tableStyle.child.columnInfos.find((item) => item.field === element.code)
        if (tempColumn) {
          childStyle.columnInfos.push(tempColumn)
        } else {
          var col = new columnInfo()
          col.field = element.code
          col.title = element.codeName
          let detailInfo = modelInfo.modelDetailInfo
          var modelPropertyDetail = null
          //区分一下基础模型和聚合模型
          modelPropertyDetail = detailInfo.modelPropertyList.find((item) => item.propertyCode === element.code)
          if (modelPropertyDetail) {
            col.formatString = modelPropertyDetail.formatter
            col.columnType = modelPropertyDetail.propertyType
            col.propertyDetail = modelPropertyDetail
          }
          childStyle.columnInfos.push(col)
        }
      })
    }
    var childactionColumn = !this.tableStyle.child ? null : this.tableStyle.child.columnInfos.find((item) => item.field === 'action')
    if (!childactionColumn) {
      childactionColumn = new columnInfo()
      childactionColumn.title = '操作'
      childactionColumn.field = 'action'
    }
    childStyle.columnInfos.push(childactionColumn)
    return childStyle
  }

  private refreshCoulumnByStyle(): tableStyle {
    var proper = this.findPropertyByName(propertyGroupEnum.columnSetting, '列样式')
    if (proper) {
      if (proper.value) {
        return proper.value
      }
      return proper.value
    }
  }

  //手动触发，会执行勾选事件
  manualSelect(value: any[], currentRow: any, ischecked: boolean = true) {
    this.itemSelect(value)
    //window.console.log('------------------------------------勾选参数', currentRow)
    if (ischecked) {
      this.triggeEvent('勾选行', currentRow)
    } else {
      this.triggeEvent('取消勾选行', currentRow)
    }
  }

  /** 自动触发选择，不触发勾选事件 */
  itemSelect(value: any[]) {
    //window.console.log('------------------------------------当前选中行121212', value)
    let isSelectproperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    if (value.length === 0) {
      this.setPropertyVal(isSelectproperty.id, true)
      //return
    }
    let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    if (!chooseType) {
      return
    }
    let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
    let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
    if (chooseType.value === '单选' || chooseType.value === '否') {
      // if (value.length > 0) {

      // }
      let val = { modelCode: this.getModelCode(), data: common.clone(value.length > 0 ? value[0] : {}) }
      this.setPropertyVal(property.id, val)
      this.setPropertyVal(prop.id, common.clone(value.length > 0 ? value[0] : {}))
      //关联的模型实例的值也要改掉，根据属性关联更新模型实例有点问题，暂时先这么处理
      let propBind = this.getPropertyBindInfo(property.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        modelInfo.val = common.clone(val)
      }
    } else {
      let val = { modelCode: this.getModelCode(), data: common.clone(value) }
      this.setPropertyVal(property.id, val)
      this.setPropertyVal(prop.id, common.clone(value))
      let propBind = this.getPropertyBindInfo(property.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        modelInfo.val = common.clone(val)
      }
    }
    //window.console.log('当前选中行', property.value)
    this.setPropertyVal(isSelectproperty.id, value.length <= 0)
    //window.console.log('--------------------当前是否有选中行', property.value)
    //window.console.log('--------this.parentPage.modelBindingsmodelBindings', common.clone(this.parentPage.modelBindings))
  }

  dataClear() {
    // window.console.log('-------------表格临时数据清理')
    this.tempDataClear()
  }

  tempDataClear() {
    let addeddata = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    if (addeddata) {
      addeddata.value = []
    }
    let updateddate = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    if (updateddate) {
      updateddate.value = []
    }
    let deleteddate = this.findPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    if (deleteddate) {
      deleteddate.value = []
    }
    this.dataSource = []
  }

  rowClick(row: any) {
    let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
    var val = { modelCode: this.getModelCode(), data: common.clone(row) }
    this.setPropertyVal(property.id, val)
    let propBind = this.getPropertyBindInfo(property.id)
    if (propBind) {
      let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      modelInfo.val = common.clone(val)
    }
    //window.console.log('-----------------------触发点击行事件', row)
    this.triggeEvent('点击行', row)
  }

  //分页信息改变通知属性
  changePage(pageNumber: any, pageSize: any, istriggerEvent: boolean = true) {
    var page = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var size = this.findPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')
    let propBind = this.getPropertyBindInfo(page.id)
    if (propBind) {
      var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == propBind.modelName)
      if (modelBind) {
        var tempData = {
          pageSize: pageSize,
          pageNumber: pageNumber
        }
        this.parentPage.setModelBindVal(propBind.modelName, tempData)
      }
    }
    page.value = pageNumber
    size.value = pageSize
    //this.setPropertyVal(page.id,pageNumber)
    //window.console.log('propBind',propBind)
    //window.console.log('----------------------------------------------进入刷新方法')
    if (istriggerEvent) {
      this.triggeEvent('列表刷新', null)
    }
  }

  getModelCode(ischild: boolean = false) {
    let tempModelCode = ''
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (ischild) {
      prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    }
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        if (modelInfo) {
          tempModelCode = modelInfo.modelBindingInfo.modelCode
          //window.console.log('modelInfo', modelInfo)
        }
      }
    }
    return tempModelCode
  }

  getModel(ischild: boolean = false): modelBingding {
    let tempModel = new modelBingding()
    var prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (ischild) {
      prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    }
    if (prop) {
      //window.console.log('prop-xxx',prop)
      let propBind = this.getPropertyBindInfo(prop.id)
      //window.console.log('propBind-xxx',propBind)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        if (modelInfo) {
          tempModel = modelInfo
          //window.console.log('modelInfo111111', modelInfo)
        }
      }
    }
    return tempModel
  }

  refreshData(pagenumber: number) {
    //window.console.log('---------------------------------刷新当前页行为执行完成之后pagenumber111', pagenumber)
    var page = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var size = this.findPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')
    page.value = pagenumber
    //this.triggeEvent('列表刷新', null)
    //如果pagenumber大于1，就是要刷新当前页，如果等于1就是要刷新到首页
    this.changePage(page.value, size.value)
    //window.console.log('---------------------------------刷新当前页行为执行完成之后pagenumber', pagenumber)
    if (pagenumber > 1) {
      //刷新当前页的时候需要一个判断,当前页没数据的情况，往前再翻一页
      this.$nextTick(() => {
        if (!this.dataSource || this.dataSource.length === 0) {
          this.changePage(pagenumber - 1, size.value)
        }
      })
    }
    //this.changePage(page.value, size.value)
  }

  sort(orderInfo: any[]) {
    //调用服务端排序方法
    //window.console.log('orderInfo', orderInfo)
    let inparam = []
    inparam.push(orderInfo)
    //排序赋值
    this.getModel().modelOrders = []
    var tmodel = this.getModel().modelOrders
    let index = tmodel.findIndex((item) => item.code == this.rowIdName)
    if (index >= 0) {
      tmodel.splice(index, 1)
    }
    if (orderInfo.length > 0) {
      let idx = tmodel.findIndex((item) => item.code == orderInfo[0].code)
      if (idx < 0) {
        orderInfo[0].val = orderInfo[0].type === 'DESC' ? true : false
        tmodel.push(orderInfo[0])
      } else {
        tmodel[idx].val = orderInfo[0].type === 'DESC' ? true : false
      }
    }
    tmodel.push({ code: this.rowIdName, val: true })
    //this.triggeEvent('列表排序', inparam)
    this.triggeEvent('列表刷新', null)
  }

  //isExpand:boolean=false
  //表格展开事件
  expand(row: any) {
    //window.console.log('--------------------------------展开行属性xxxxxxxxx-----------------', row)
    var prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '展开行')
    if (prop) {
      //window.console.log('--------------------------------展开的行赋值-----------------', row)
      this.setPropertyVal(prop.id, row[this.rowIdName])
    }
    //window.console.log('--------------------------------展开行属性-----------------', prop)
    let _this = this
    this.$nextTick(() => {
      let temp = _this.oldAllChildDataSource.find((item) => item.key == row[_this.rowIdName])
      let tempprop = _this.findPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
      let tempnew = _this.allChildDataSource.find((item) => item.key == row[_this.rowIdName])
      if (tempnew && tempnew.value && tempnew.value.length > 0 && tempprop.value == true) {
        _this.childdataSource = []
        _this.$nextTick(() => {
          _this.childdataSource = tempnew.value
        })
      } else if (temp && temp.value && temp.value.length > 0 && tempprop.value == true) {
        //window.console.log('--------------------------------展开的行信息temp-----------------', temp)
        //window.console.log('--------------------------------展开dom进入-----------------', temp)
        //旧的是有数据，新的是空的，这时候应该是空的
        if (tempnew && tempnew.value.length == 0) {
          _this.$nextTick(() => {
            _this.childdataSource = []
          })
        } else {
          _this.childdataSource = []
          _this.$nextTick(() => {
            _this.childdataSource = temp.value
          })
        }
      } else {
        let childdataProp = _this.findPropertyByName(PropertyGroupName.normal, '子表格数据源')
        _this.setPropertyVal(childdataProp.id, null)

        _this.$nextTick(() => {
          _this.triggeEvent('表格展开', row)
        })
      }
    })
  }

  /** 变更子表格数据源 */
  changeChildData(property: any) {
    if (property.value) {
      var prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '展开行')
      if (prop) {
        let temp = this.oldAllChildDataSource.find((item) => item.key == prop.value)
        var tempprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
        if (tempprop.value == false) {
          let tempValue = property.value.content
          if (tempValue && tempValue.length > 0) {
            this.childdataSource = common.clone(tempValue)
          } else {
            this.childdataSource = []
          }
        } else {
          if (!temp) {
            let tempValue = property.value.content
            if (tempValue && tempValue.length > 0) {
              this.childdataSource = common.clone(tempValue)
            } else {
              this.childdataSource = []
            }
          } else {
            this.childdataSource = common.clone(temp.value)
            //window.console.log('--------------子表格数据源变更temp', temp)
          }
        }
        if (!temp && prop.value && prop.value !== true) {
          this.oldAllChildDataSource.push({ key: prop.value, value: this.childdataSource })
          this.allChildDataSource.push({ key: prop.value, value: this.childdataSource })
          if (this.childdataSource instanceof Array) {
            this.oldAllChildDataSourceNoGroup = this.oldAllChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
            this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
          }
          //window.console.log('--------------子表格数据源变更temp-allChildDataSourceNoGroup', common.clone(this.allChildDataSourceNoGroup))
        }
      }
    }
  }

  //行内临时数据的删除方法
  deleteRow(row: any) {
    if (row.length > 0) {
      //要区分下是单条还是多条
      let selectRows = []
      if (row[0].data) {
        if (row[0].data instanceof Array) {
          selectRows = selectRows.concat(row[0].data)
        } else {
          selectRows.push(row[0].data)
        }
      } else {
        if (row[0] instanceof Array) {
          selectRows = selectRows.concat(row[0])
        } else {
          selectRows.push(row[0])
        }
      }
      let newData = []
      this.dataSource.forEach((element) => {
        let row = selectRows.find((s) => s[this.rowIdName] === element[this.rowIdName])
        if (!row) {
          newData.push(element)
        }
      })
      this.dataSource = newData
      this.prepareData('删除')
      let propertyClick = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
      if (propertyClick && propertyClick.value) {
        //如果点击行被删除，需要更新一下属性
        let row = selectRows.find((s) =>
          s[this.rowIdName] == propertyClick.value.data ? propertyClick.value.data[this.rowIdName] : propertyClick.value[this.rowIdName]
        )
        if (row) {
          var val = { modelCode: this.getModelCode(), data: {} }
          this.setPropertyVal(propertyClick.id, val)
        }
      }
    }
  }

  /**
   * 删除主表，同时删除关联子表
   * xuww 2020-09-07 add
   */
  deleteRowContainsChild(param: any) {
    window.console.log('--------------------删除主表方法', param)
    if (param instanceof Array) {
      let row = param
      let childTableId = param.length > 1 ? param[1] : ''
      if (row.length > 0) {
        //要区分下是单条还是多条
        let selectRows = []
        if (row[0].data) {
          if (row[0].data instanceof Array) {
            selectRows = selectRows.concat(row[0].data)
          } else {
            selectRows.push(row[0].data)
          }
        } else {
          if (row[0] instanceof Array) {
            selectRows = selectRows.concat(row[0])
          } else {
            selectRows.push(row[0])
          }
        }
        let newData = []
        this.dataSource.forEach((element) => {
          let row = selectRows.find((s) => s[this.rowIdName] === element[this.rowIdName])
          if (!row) {
            newData.push(element)
          }
        })
        this.dataSource = newData

        selectRows.forEach((element) => {
          let idx = this.allChildDataSource.findIndex((item) => item.key == element[this.rowIdName])
          if (idx > -1) {
            this.allChildDataSource[idx].value = []
          }

          let tempChildDataSourceNoGroup = this.allChildDataSourceNoGroup.filter((item) => item[childTableId] != element[this.rowIdName])
          this.allChildDataSourceNoGroup = common.clone(tempChildDataSourceNoGroup)
        })
        //this.allChildDataSource.push({ key: prop.value, value: this.childdataSource })
        //this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
        //this.dataSource = newData
        this.prepareData('删除')
      }
    }
  }

  //临时数据的批量删除，根据当前选中行来处理
  deleteRows() {
    let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
    window.console.log('--------------------------------进入删除行-----------------', prop)
    if (prop.value) {
      let selectRows = []
      if (!(prop.value instanceof Array)) {
        selectRows.push(prop.value)
      } else {
        selectRows = prop.value
      }
      let newData = []
      this.dataSource.forEach((element) => {
        let row = selectRows.find((s) => s[this.rowIdName] === element[this.rowIdName])
        if (!row) {
          newData.push(element)
        }
      })
      this.dataSource = newData
      this.prepareData('删除')
      this.itemSelect([])
      let propertyClick = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
      if (propertyClick && propertyClick.value) {
        //如果点击行被删除，需要更新一下属性
        let row = selectRows.find((s) =>
          s[this.rowIdName] == propertyClick.value.data ? propertyClick.value.data[this.rowIdName] : propertyClick.value[this.rowIdName]
        )
        if (row) {
          var val = { modelCode: this.getModelCode(), data: {} }
          this.setPropertyVal(propertyClick.id, val)
        }
      }
    }
  }

  /** 添加临时行*/
  addRows(param: any) {
    //参数是个数组，会把所有信息都带过来，第一个参数是需要添加的行信息
    //第二个参数是判断重复的模型属性编码，使用@分隔

    if (param.length === 0) {
      return
    }
    let rows = param[0].data ? (param[0].data.content && param[0].data.content instanceof Array ? param[0].data.content : param[0].data) : param[0]
    //解析重复性验证的参数
    //param[1] = 'vendor_label_rule__label_rule_id@vendor_label_rule__vendor_id'
    let validateParamStr = param[1]
    let validateParam = []
    if (validateParamStr) {
      validateParam = validateParamStr.split('@')
    }
    //主键的验证不区分情况
    validateParam.push(this.rowIdName)

    let prop = this.findPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    let propBind = this.getPropertyBindInfo(prop.id)
    let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
    let detailInfo = modelInfo.modelDetailInfo
    //需要判断下是否有重复数据
    if (rows instanceof Array) {
      //重复的数据不添加，正常的数据还能添加进去
      let addRows = []
      //循环拿到需要获取分布式唯一id的数据
      let idsArr = rows.filter((k) => !k[this.rowIdName])
      let idsData = []
      if (idsArr && idsArr.length > 0) {
        idsData = CurrentApis.GetUniqueIds(idsArr.length)
      }
      let id_index = 0
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index]
        let iserror = false
        for (let index = 0; index < this.dataSource.length; index++) {
          if (iserror) {
            break
          }
          const item = this.dataSource[index]
          for (let index = 0; index < validateParam.length; index++) {
            const single = validateParam[index]
            if (item[single] === element[single]) {
              //有重复数据的时候，直接提示出来，不继续执行
              //;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
              //return
              iserror = true
              break
            }
          }
        }
        if (iserror) {
          continue
        }
        this.enumValueConvert(element)
        if (!element[this.rowIdName]) {
          //element[this.rowIdName] = CurrentApis.GetUniqueIds(1)[0]
          element[this.rowIdName] = idsData[id_index]
          id_index++
        }
        //从模型如果没有id的话也是要赋值的
        if (this.slaveKeyCode && this.slaveKeyCode.length > 0) {
          let ids = CurrentApis.GetUniqueIds(this.slaveKeyCode.length)
          let index = 0
          this.slaveKeyCode.forEach((code) => {
            if (element[code] == undefined || element[code] == null) {
              element[code] = ids[index]
              index++
            }
          })
        }
        this.tableStyle.columnInfos.forEach((item) => {
          if (!element[item.field] && item.columnType === ModelPropertyType.STRING && item.isCanEdit) {
            element[item.field] = null
          }
          if (!element[item.field] && item.columnType === ModelPropertyType.BOOL && item.isCanEdit) {
            //window.console.log('---------------element[item.field]',element[item.field])
            element[item.field] = 0
          }
          if (
            element[item.field] === undefined &&
            (item.columnType === ModelPropertyType.INT || item.columnType === ModelPropertyType.FLOAT) &&
            item.isCanEdit
          ) {
            if (item.propertyDetail && item.propertyDetail.defaultValue) {
              if (item.columnType === ModelPropertyType.INT) {
                element[item.field] = parseInt(item.propertyDetail.defaultValue)
              }
              if (item.columnType === ModelPropertyType.FLOAT) {
                element[item.field] = parseFloat(item.propertyDetail.defaultValue)
              }
            } else {
              element[item.field] = 0
            }
          }
        })

        addRows.push(element)
      }
      if (addRows.length !== rows.length) {
        //;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
        this.$message.info('不能添加重复数据！')
      }
      this.dataSource = this.dataSource.concat(addRows)
    } else {
      let element = rows
      for (let index = 0; index < this.dataSource.length; index++) {
        const item = this.dataSource[index]
        for (let index = 0; index < validateParam.length; index++) {
          const single = validateParam[index]
          if (item[single] === element[single]) {
            //有重复数据的时候，直接提示出来，不继续执行
            //;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
            this.$message.info('不能添加重复数据！')
            return
          }
        }
      }
      this.enumValueConvert(element)
      if (!element[this.rowIdName]) {
        element[this.rowIdName] = CurrentApis.GetUniqueIds(1)[0]
      }
      //从模型如果没有id的话也是要赋值的
      if (this.slaveKeyCode && this.slaveKeyCode.length > 0) {
        let ids = CurrentApis.GetUniqueIds(this.slaveKeyCode.length)
        let index = 0
        this.slaveKeyCode.forEach((code) => {
          if (element[code] == undefined || element[code] == null) {
            element[code] = ids[index]
            index++
          }
        })
      }
      this.tableStyle.columnInfos.forEach((item) => {
        if (!element[item.field] && item.columnType === ModelPropertyType.STRING && item.isCanEdit) {
          element[item.field] = null
        }
        if (!element[item.field] && item.columnType === ModelPropertyType.BOOL && item.isCanEdit) {
          //window.console.log('---------------element[item.field]',element[item.field])
          element[item.field] = 0
        }
        if (
          element[item.field] === undefined &&
          (item.columnType === ModelPropertyType.INT || item.columnType === ModelPropertyType.FLOAT) &&
          item.isCanEdit
        ) {
          if (item.propertyDetail && item.propertyDetail.defaultValue) {
            if (item.columnType === ModelPropertyType.INT) {
              element[item.field] = parseInt(item.propertyDetail.defaultValue)
            }
            if (item.columnType === ModelPropertyType.FLOAT) {
              element[item.field] = parseFloat(item.propertyDetail.defaultValue)
            }
          } else {
            element[item.field] = 0
          }
        }
      })
      this.dataSource.push(element)
    }
    //跟初始数据进行比对，如果初始数据没有当前数据源有，标记为新增数据源，先考虑单模型
    this.prepareData('新增')
  }

  /**
   * 更新临时行数据
   * 兼容多行数据
   */
  updateRow(row: any) {
    //window.console.log('--------------------------------进入更新行row-----------------', row)
    if (row.length > 0) {
      //window.console.log('--------------------------------进入更新行-----------------', row)
      // let temp = null
      // if (row[0].data) {
      //   temp = row[0].data
      // } else {
      //   temp = row[0]
      // }
      let temp = row[0].data ? (row[0].data.content ? row[0].data.content : row[0].data) : row[0]
      //重复性验证，需要判断下
      //param[1] = 'event_name'
      let validateParamStr = row[1]
      let validateParam = []
      if (validateParamStr) {
        validateParam = validateParamStr.split('@')
      }
      if (temp instanceof Array) {
        if (temp.length > 0) {
          temp.forEach((element) => {
            this.enumValueConvert(element)
            let index = this.dataSource.findIndex((item) => item[this.rowIdName] === element[this.rowIdName])
            this.$set(this.dataSource, index, element)
          })
        }
      } else {
        for (let index = 0; index < this.dataSource.length; index++) {
          const item = this.dataSource[index]
          if (item[this.rowIdName] === temp[this.rowIdName]) {
            continue
          }
          for (let index = 0; index < validateParam.length; index++) {
            const single = validateParam[index]
            if (item[single] === temp[single]) {
              //有重复数据的时候，直接提示出来，不继续执行
              //;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
              this.$message.info('不能添加重复数据！')
              return
            }
          }
        }
        this.enumValueConvert(temp)
        let index = this.dataSource.findIndex((item) => item[this.rowIdName] === temp[this.rowIdName])
        // this.$nextTick(()=>{

        // })
        this.$set(this.dataSource, index, temp)
        //;(this.$refs.table as any).editClosed({row:temp})
        ;(this.$refs.table as any).editRowCancelExtend(temp)
      }
      this.prepareData('编辑')
    }
  }

  //准备数据，根据类型来更新对应属性
  prepareData(operateType: string) {
    let prop = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
    let olddata = prop.value ? prop.value.content : []
    if (!olddata) {
      olddata = prop.value
    }
    if (!olddata || !(olddata instanceof Array)) {
      olddata = []
      //this.setPropertyVal(prop.id,[])
    }
    let resadddata = []
    let resupdatedata = []
    let resdeletedata = []
    //新增，旧数据没有，新数据有
    if (!olddata) {
      resadddata = common.clone(this.dataSource)
    } else {
      this.dataSource.forEach((element) => {
        const addDatas = olddata.find((item) => item[this.rowIdName] == element[this.rowIdName])
        if (!addDatas) {
          resadddata.push(element)
        }
      })
    }
    //编辑，旧数据有，新数据有
    if (olddata && this.dataSource) {
      this.dataSource.forEach((element) => {
        const updateDatas = olddata.find((item) => item[this.rowIdName] == element[this.rowIdName])
        if (updateDatas) {
          resupdatedata.push(element)
        }
      })
    }
    //删除，旧数据有，新数据没有
    if (!olddata) {
      resdeletedata = []
    } else {
      if (!this.dataSource) {
        resdeletedata = olddata
      } else {
        olddata.forEach((element) => {
          const deleteDatas = this.dataSource.find((item) => item[this.rowIdName] == element[this.rowIdName])
          if (!deleteDatas) {
            resdeletedata.push(element)
          }
        })
      }
    }
    //联动的操作需要把之前的临时数据同步处理
    let addprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    addprop.value = resadddata
    let updateprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    updateprop.value = resupdatedata
    let deleteprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    deleteprop.value = resdeletedata
    //记录变更
    //window.console.log('-------------------------------------------------------临时数据变更新增', addprop)
    //window.console.log('-------------------------------------------------------临时数据变更编辑', updateprop)
    //window.console.log('-------------------------------------------------------临时数据变更删除', deleteprop)
    //删除之后，检查选中行的数据
    if (operateType === '删除') {
      let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
      if (!chooseType) {
        return
      }
      if (this.dataSource.length === 0) {
        this.itemSelect([])
        return
      }
      let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
      if (chooseType.value === '单选' || chooseType.value === '否') {
        let ttt = (property.value as any).data
        if (ttt && !this.dataSource.find((item) => item[this.rowIdName] == ttt[this.rowIdName])) {
          this.itemSelect([])
        }
      } else {
        let ttt = (property.value as any).data
        //多选的逻辑是一个个来检测是否存在，存在的话就push到临时变量里
        let selectProp = []
        if (ttt && ttt instanceof Array && ttt.length > 0) {
          ttt.forEach((item) => {
            if (this.dataSource.find((single) => single[this.rowIdName] == item[this.rowIdName])) {
              selectProp.push(item)
            }
          })
        }
        this.itemSelect(common.clone(selectProp))
      }
    }
  }

  /** 行编辑结束，更新编辑数据源 */
  rowEditEnd(row: any) {
    let olddata = this.findPropertyByName(PropertyGroupName.normal, '表格数据源').value.content
    if (!olddata) {
      olddata = this.findPropertyByName(PropertyGroupName.normal, '表格数据源').value
    }
    let resadddata = []
    let resupdatedata = []
    let currentRow = common.clone(row)
    if (!olddata || !(olddata instanceof Array)) {
      let index = this.dataSource.findIndex((item) => item[this.rowIdName] === row[this.rowIdName])
      this.$set(this.dataSource, index, row)
      resadddata = common.clone(this.dataSource)
    } else {
      let index = this.dataSource.findIndex((item) => item[this.rowIdName] === row[this.rowIdName])
      this.$set(this.dataSource, index, row)
      this.dataSource.forEach((element) => {
        // if (element[this.rowIdName] === row[this.rowIdName]) {
        //   //element = row
        //   let index = this.dataSource.findIndex((item) => item[this.rowIdName] === row[this.rowIdName])
        //   this.$set(this.dataSource, index, row)
        // }
        const addDatas = olddata.find((item) => item[this.rowIdName] == element[this.rowIdName])
        if (!addDatas) {
          resadddata.push(element)
        }
      })
    }

    if (olddata && olddata instanceof Array && this.dataSource) {
      let index = this.dataSource.findIndex((item) => item[this.rowIdName] === row[this.rowIdName])
      this.$set(this.dataSource, index, row)
      this.dataSource.forEach((element) => {
        let sourceData = common.clone(element)
        if (element[this.rowIdName] === row[this.rowIdName]) {
          currentRow = sourceData
        }
        const updateDatas = olddata.find((item) => item[this.rowIdName] == sourceData[this.rowIdName])
        if (updateDatas) {
          resupdatedata.push(sourceData)
        }
      })
    }

    let addprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    addprop.value = resadddata
    let updateprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    updateprop.value = resupdatedata
    //联动更新选中行和点击行 20200828
    let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
    if (property && property.value && property.value.data) {
      if (property.value.data instanceof Array) {
        let index = property.value.data.findIndex((element) => element[this.rowIdName] == currentRow[this.rowIdName])
        if (index > -1) {
          property.value.data[index] = currentRow
        }
      } else {
        if (property.value.data instanceof Object && property.value.data[this.rowIdName] == currentRow[this.rowIdName]) {
          property.value.data == currentRow
        }
      }
    }
    let propertyClick = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
    if (propertyClick && propertyClick.value) {
      //propertyClick.value.data == currentRow
      var val = { modelCode: this.getModelCode(), data: currentRow }
      this.setPropertyVal(propertyClick.id, val)
    }
    //this.setPropertyVal(property.id, property.value)
    //window.console.log('-------------------------------------------------------当前选中行', property.value)
    if (!property.value.data || property.value.data.length == 0) {
      this.itemSelect([])
    } else {
      this.itemSelect(property.value.data)
    }
    //触发行编辑结束
    this.triggeEvent('行编辑结束', common.clone(currentRow))
    //window.console.log('-------------------------------------------------------行编辑结束记录', updateprop)
  }

  /**从表单过来的枚举类型转换 */
  enumValueConvert(element: any) {
    //window.console.log('-------------this.dictItemArr', this.dictItemArr)
    //window.console.log('-------------this.element', element)
    if (this.dictItemArr && this.dictItemArr.length > 0) {
      Object.keys(element).forEach((temp) => {
        let enumItem = this.dictItemArr.find((d) => d.propertyCode === temp)
        if (enumItem) {
          if (enumItem.columnType === ModelPropertyType.ENUMARRAY) {
            if (element[temp] && !(element[temp] instanceof Array) && enumItem.item instanceof Array) {
              var tempArr = []
              let enumStr = element[temp].split(',')
              if (enumStr.length > 0) {
                enumStr.forEach((ss) => {
                  let sss = enumItem.item.find((i) => i.itemValue == ss)
                  if (sss) {
                    tempArr.push({ itemName: sss.itemName, itemValue: ss })
                  }
                })
              }
              element[temp] = common.clone(tempArr)
              //window.console.log('----------------------------------------------------enumItem', enumItem)
              //window.console.log('----------------------------------------------------enumxxxxxxx', element[temp])
            }
          } else if (enumItem.columnType === ModelPropertyType.ENUM) {
            if (element[temp] !== undefined && element[temp] !== null && !(element[temp] instanceof Object) && enumItem.item instanceof Array) {
              //let enumStr = element[temp]
              let sss = enumItem.item.find((i) => i.itemValue == element[temp])
              if (sss) {
                let tempArr = { itemName: sss.itemName, itemValue: element[temp] }
                element[temp] = common.clone(tempArr)
              }
              //window.console.log('----------------------------------------------------enumItem', enumItem)
              //window.console.log('----------------------------------------------------enumxxxxxxx', element[temp])
            }
          }
        }
      })
    }
  }

  /**行内编辑相关方法定义 */
  /**行编辑 */
  rowEditBegin(param: any) {
    //window.console.log('----------------------行编辑开始param', param)
    let temp = param[0]
    if (param[0].data) {
      temp = param[0].data
    }
    ;(this.$refs.table as any).editRow(temp)
  }

  /**行编辑取消 */
  rowEditCancel(param: any) {
    //window.console.log('----------------------行编辑取消param', param)
    ;(this.$refs.table as any).editRowCancel(param[0].data)
  }

  /**行编辑保存 */
  rowEditSave(param: any) {
    //window.console.log('----------------------行编辑保存param', param)
    ;(this.$refs.table as any).editRowSave(param[0].data)
  }

  /** 全部勾选*/
  selectAllData(param: any) {
    //window.console.log('----------------------勾选全部param', param)
    //let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    // if (!chooseType || chooseType.value === '否' || chooseType.value === '单选') {
    //   return
    // }
    if (param instanceof Array && param.length > 0) {
      this.$nextTick(() => {
        //window.console.log('-------------------------------------选中所有', param[0])
        ;(this.$refs.table as any).setAllRowsSelected(param[0])
        //更新选中行数据源
        if (param[0]) {
          this.itemSelect(this.dataSource)
          if (param.length > 1) {
            if (param[1]) {
              this.triggeEvent('勾选行', null)
            }
          }
        } else {
          this.itemSelect([])
          if (param[0] === false) {
            this.triggeEvent('取消勾选行', null)
          }
        }
      })
      // let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
      // window.console.log('当前选中行', property.value)
    }
  }

  /**勾选指定行
   * 第一个参数是匹配数据源，第二个字段是用来匹配的字段名
   */
  selectDataArr(param: any) {
    if (param instanceof Array && param.length > 1) {
      //window.console.log('-------------------------------------选中指定行匹配数据源', param[0])
      //window.console.log('-------------------------------------选中指定行匹配字段名', param[1])
      if (param.length > 2) {
        //window.console.log('-------------------------------------选中指定行第三个参数（选择-反选）', param[2])
      }
      if (param.length > 4) {
        //window.console.log('-------------------------------------选中指定行第五个参数，表格字段', param[4])
      }
      //this.dataSource

      //let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
      // if (!chooseType || chooseType.value === '否' || chooseType.value === '单选') {
      //   return
      // }
      let tempArr = []
      let sourceData = param[0].data
        ? param[0].data.content && param[0].data.content instanceof Array
          ? param[0].data.content
          : param[0].data
        : param[0]

      let sourceArr = []

      if (sourceData && !(sourceData instanceof Array)) {
        sourceArr.push(sourceData)
        sourceData = common.clone(sourceArr)
      }

      if (sourceData && sourceData instanceof Array && sourceData.length > 0) {
        let matchParamStr = param[1]
        // sourceData.forEach(single=>{
        //   tempArr.push(single[matchParamStr])
        // })
        this.dataSource.forEach((item) => {
          let temp = sourceData.find((element) => element[matchParamStr] == item[this.rowIdName])
          if (!temp) {
            temp = sourceData.find((element) => element[matchParamStr] == item[matchParamStr])
          }
          if (param.length > 4 && param[4]) {
            temp = sourceData.find((element) => element[matchParamStr] == item[param[4]])
          }

          if (temp) {
            tempArr.push(item)
          }
        })

        let selectproperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
        if (param.length > 2 && param[2] === false) {
          ;(this.$refs.table as any).setRowsSelected(tempArr, false)
        } else {
          ;(this.$refs.table as any).setRowsSelected(tempArr, true)
        }
        let tempData = []
        if (
          selectproperty &&
          selectproperty.value &&
          selectproperty.value.data &&
          selectproperty.value.data instanceof Array &&
          selectproperty.value.data.length > 0
        ) {
          //选择的情况下，要在当前选中里面追加
          selectproperty.value.data.forEach((item) => {
            if (!tempArr.find((single) => single[this.rowIdName] == item[this.rowIdName])) {
              tempData.push(item)
            }
          })
        }
        if (param.length == 2 || param[2] !== false) {
          tempData = tempData.concat(tempArr)
        }
        this.itemSelect(tempData)
        if (param.length > 3) {
          if (param[3]) {
            if (param[2] !== false) {
              this.triggeEvent('勾选行', null)
            } else {
              this.triggeEvent('取消勾选行', null)
            }
          }
        }
      }
    }
  }

  childItemSelect(value: any, isChecked: boolean) {
    //window.console.log('------------------------------------当前选中行121212', value)
    let isSelectproperty = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    // let chooseType = this.findPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    // if (!chooseType) {
    //   return
    // }
    let isCanCheck = this.tableStyle.child.isCanCheck
    // let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
    // let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
    // if (!isCanCheck) {
    //   let val = { modelCode: this.getModelCode(true), data: common.clone(value) }
    //   this.setPropertyVal(property.id, val)
    //   this.setPropertyVal(prop.id, common.clone(value))
    // } else {
    //   let tempValue = common.clone(property.value.data)
    //   if (isChecked) {
    //     let temp = tempValue.find((item) => item[this.childRowIdName] === value[this.childRowIdName])
    //     if (!temp) {
    //       tempValue.push(value)
    //     }
    //   } else {
    //     let tempIndex = tempValue.findIndex((item) => item[this.childRowIdName] === value[this.childRowIdName])
    //     if (tempIndex > -1) {
    //       tempValue.splice(tempIndex, 1)
    //     }
    //   }
    //   let val = { modelCode: this.getModelCode(true), data: tempValue }
    //   this.setPropertyVal(property.id, val)
    // }
    // window.console.log('当前子表格选中行', property.value.data)
    // this.setPropertyVal(isSelectproperty.id, value.length <= 0)

    //更新子表格选中变量
    if (isChecked) {
      if (isCanCheck) {
        let temp = this.childCheckRows.find((item) => item[this.childRowIdName] === value[this.childRowIdName])
        if (!temp) {
          this.childCheckRows.push(value)
        }
        this.triggeEvent('勾选行', common.clone(value))
      } else {
        this.childCheckRows = []
        this.childCheckRows.push(value)
        this.triggeEvent('勾选行', common.clone(value))
      }
    } else {
      if (isCanCheck) {
        let tempIndex = this.childCheckRows.findIndex((item) => item[this.childRowIdName] === value[this.childRowIdName])
        if (tempIndex > -1) {
          this.childCheckRows.splice(tempIndex, 1)
        }
        this.triggeEvent('取消勾选行', common.clone(value))
      }
    }
  }

  /**判断数据源是否为空 */
  datasourceIsNull() {
    if (this.dataSource && this.dataSource.length > 0) {
      return false
    }
    return true
  }

  /** 获取当前数据 */
  getCurrentDataSource() {
    if (!this.dataSource || this.dataSource.length === 0) {
      return []
    }
    return common.clone(this.dataSource)
  }

  /** 表格数据变化触发变更事件 */
  dataChange() {
    this.triggeEvent('表格数据变更', common.clone(this.dataSource))
  }

  /** 公开六个方法 */
  //获取添加数据源
  getAddedDataSource(param: any) {
    let isaddModelCode = false
    if (param instanceof Array) {
      //window.console.log('------------------获取添加数据源参数', param)
      isaddModelCode = param[0]
    }
    let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: common.clone(prop.value) } : common.clone(prop.value)
    } else {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: [] } : []
    }
    //return this.getDataSourceByType(operationTypeEnum.add)
  }

  //获取子表格添加数据源
  getAddedChildDataSource() {
    //window.console.log('------------------获取子表新增数据')
    return this.getChildDataSourceByType(operationTypeEnum.addChild)
  }

  //获取编辑数据源
  getUpdatedDataSource(param: any) {
    let isaddModelCode = false
    if (param instanceof Array) {
      //window.console.log('------------------获取更新数据源参数', param)
      isaddModelCode = param[0]
    }
    let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: common.clone(prop.value) } : common.clone(prop.value)
    } else {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: [] } : []
    }
    //return this.getDataSourceByType(operationTypeEnum.update)
  }

  //获取子表格编辑数据源
  getUpdatedChildDataSource() {
    return this.getChildDataSourceByType(operationTypeEnum.updateChild)
  }

  //获取删除数据源
  getDeletedDataSource(param: any) {
    let isaddModelCode = false
    if (param instanceof Array) {
      //window.console.log('------------------获取删除数据源参数', param)
      isaddModelCode = param[0]
    }
    let prop = this.findPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: common.clone(prop.value) } : common.clone(prop.value)
    } else {
      return isaddModelCode == true ? { modelCode: this.getModelCode(), data: [] } : []
    }
    //return this.getDataSourceByType(operationTypeEnum.delete)
  }

  //获取子表格删除数据源
  getDeletedChildDataSource() {
    return this.getChildDataSourceByType(operationTypeEnum.deleteChild)
  }

  /** 根据类型获取临时数据，暂时把父子表格的数据源拆分
   * 六种类型：表格相关数据源-新增数据源，编辑数据源，删除数据源
   * 子表格相关数据源-新增数据源，编辑数据源，删除数据源
   * 数据源不注册属性了，定义成变量内部使用
   */
  getDataSourceByType(param: operationTypeEnum) {
    let prop = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
    let olddata = prop.value.content
    if (!olddata) {
      olddata = prop.value
    }
    if (!olddata || !(olddata instanceof Array)) {
      olddata = []
    }
    let resadddata = []
    let resupdatedata = []
    let resdeletedata = []
    switch (param) {
      case operationTypeEnum.add:
        //新增，旧数据没有，新数据有
        if (!olddata) {
          resadddata = common.clone(this.dataSource)
        } else {
          this.dataSource.forEach((element) => {
            const addDatas = olddata.find((item) => item[this.rowIdName] == element[this.rowIdName])
            if (!addDatas) {
              resadddata.push(element)
            }
          })
        }

        return resadddata
      case operationTypeEnum.update:
        //编辑，旧数据有，新数据有
        if (olddata && this.dataSource) {
          this.dataSource.forEach((element) => {
            const updateDatas = olddata.find((item) => item[this.rowIdName] == element[this.rowIdName])
            if (updateDatas) {
              resupdatedata.push(element)
            }
          })
        }

        return resupdatedata
      case operationTypeEnum.delete:
        //删除，旧数据有，新数据没有
        if (!olddata) {
          resdeletedata = []
        } else {
          if (!this.dataSource) {
            resdeletedata = olddata
          } else {
            olddata.forEach((element) => {
              const deleteDatas = this.dataSource.find((item) => item[this.rowIdName] == element[this.rowIdName])
              if (!deleteDatas) {
                resdeletedata.push(element)
              }
            })
          }
        }

        return resdeletedata
    }
  }

  getChildDataSourceByType(param: operationTypeEnum) {
    let olddata = this.oldAllChildDataSourceNoGroup
    if (!olddata || !(olddata instanceof Array)) {
      olddata = []
    }
    let newdata = this.allChildDataSourceNoGroup
    let resadddata = []
    let resupdatedata = []
    let resdeletedata = []
    switch (param) {
      case operationTypeEnum.addChild:
        //新增，旧数据没有，新数据有
        if (!olddata) {
          resadddata = common.clone(newdata)
        } else {
          newdata.forEach((element) => {
            const addDatas = olddata.find((item) => item[this.childRowIdName] == element[this.childRowIdName])
            if (!addDatas) {
              resadddata.push(element)
            }
          })
        }
        return resadddata
      case operationTypeEnum.updateChild:
        //编辑，旧数据有，新数据有
        if (olddata && newdata) {
          newdata.forEach((element) => {
            const updateDatas = olddata.find((item) => item[this.childRowIdName] == element[this.childRowIdName])
            if (updateDatas) {
              resupdatedata.push(element)
            }
          })
        }
        return resupdatedata
      case operationTypeEnum.deleteChild:
        //删除，旧数据有，新数据没有
        if (!olddata) {
          resdeletedata = []
        } else {
          if (!newdata) {
            resdeletedata = olddata
          } else {
            olddata.forEach((element) => {
              const deleteDatas = newdata.find((item) => item[this.childRowIdName] == element[this.childRowIdName])
              if (!deleteDatas) {
                resdeletedata.push(element)
              }
            })
          }
        }
        return resdeletedata
    }
  }

  /** 子表格添加行，这样直接添加数据可能会跟折叠展开有冲突
   *  需要两个参数，第一个参数指定要添加的位置，传主表跟从表的关联id，第二个参数指定添加数据，第三个参数是验证重复的字段
   */
  addChildRow(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------添加子表格数据参数', param)
      // this.$nextTick(()=>{

      // })
      let tempRowId = param[0]
      let tempchildData = param[1].data ? param[1].data : param[1]
      //window.console.log('------------------this.allChildDataSource', this.allChildDataSource)
      let childData = this.allChildDataSource.find((item) => item.key == tempRowId)
      if (!childData || !childData.value) {
        return
      }
      //重复性验证，需要判断下
      //param[1] = 'event_name'
      let validateParamStr = param[2]
      let validateParam = []
      if (validateParamStr) {
        validateParam = validateParamStr.split('@')
      }
      let child = common.clone(childData.value)
      //window.console.log('------------------添加子表格数据当前子表格数据childData', childData)
      let addRows = []
      if (tempchildData instanceof Array) {
        let ids = []
        if (tempchildData.length > 0) {
          ids = CurrentApis.GetUniqueIds((this.childSlaveKeyCode.length + 1) * tempchildData.length)
        }
        let index = 0
        tempchildData.forEach((item) => {
          if (index < tempchildData.length) {
            item[this.childRowIdName] = ids[index]
            index++
          } else {
            this.childSlaveKeyCode.forEach((code) => {
              item[code] = ids[index]
              index++
            })
          }
        })
        let iserror = false
        for (let index = 0; index < tempchildData.length; index++) {
          const element = tempchildData[index]
          for (let index = 0; index < child.length; index++) {
            if (iserror) {
              break
            }
            const item = child[index]
            for (let index = 0; index < validateParam.length; index++) {
              const single = validateParam[index]
              if (item[single] === element[single]) {
                iserror = true
                break
              }
            }
          }
          if (iserror) {
            iserror = false
            continue
          }
          this.enumValueConvert(element)
          this.tableStyle.columnInfos.forEach((item) => {
            if (item.columnType === ModelPropertyType.STRING && item.isCanEdit && !element[item.field]) {
              element[item.field] = null
            }
          })
          child.push(element)
          addRows.push(element)
        }
        if (addRows.length !== tempchildData.length) {
          this.$message.info('不能添加重复数据！')
        }
      } else {
        for (let index = 0; index < child.length; index++) {
          const item = child[index]
          if (item[this.childRowIdName] === tempchildData[this.childRowIdName]) {
            continue
          }
          for (let index = 0; index < validateParam.length; index++) {
            const single = validateParam[index]
            if (item[single] === tempchildData[single]) {
              //有重复数据的时候，直接提示出来，不继续执行
              //;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
              this.$message.info('不能添加重复数据！')
              return
            }
          }
        }
        this.enumValueConvert(tempchildData)
        if (!tempchildData[this.childRowIdName]) {
          tempchildData[this.childRowIdName] = CurrentApis.GetUniqueIds(1)[0]
        }
        //从模型如果没有id的话也是要赋值的
        if (this.childSlaveKeyCode && this.childSlaveKeyCode.length > 0) {
          let ids = CurrentApis.GetUniqueIds(this.childSlaveKeyCode.length)
          let index = 0
          this.childSlaveKeyCode.forEach((code) => {
            tempchildData[code] = ids[index]
            index++
          })
        }
        this.tableStyle.columnInfos.forEach((item) => {
          if (item.columnType === ModelPropertyType.STRING && item.isCanEdit && !tempchildData[item.field]) {
            tempchildData[item.field] = null
          }
        })
        child.push(tempchildData)
        addRows.push(tempchildData)
      }
      ;(this.$refs.table as any).refreshChildData(tempRowId, child)
      if (addRows.length === 0) {
        return
      }
      let idx = childData.value.findIndex(
        (item) => item[this.childRowIdName] === (addRows instanceof Array ? addRows[0][this.childRowIdName] : addRows[this.childRowIdName])
      )
      if (idx < 0) {
        if (addRows instanceof Array) {
          childData.value = childData.value.concat(addRows)
        } else {
          childData.value.push(tempchildData)
        }
        let tempIdx = this.allChildDataSource.findIndex((item) => item.key == tempRowId)
        if (tempIdx > -1) {
          this.allChildDataSource[tempIdx] = childData
        }
      }
      let ttt = this.allChildDataSourceNoGroup.findIndex(
        (item) => item[this.childRowIdName] == (addRows instanceof Array ? addRows[0][this.childRowIdName] : addRows[this.childRowIdName])
      )
      if (ttt < 0) {
        if (addRows instanceof Array) {
          this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(addRows)
        } else {
          this.allChildDataSourceNoGroup.push(tempchildData)
        }
      }
      //window.console.log('------------------添加子表格数据当前子表格数据allChildDataSourceNoGroup', this.allChildDataSourceNoGroup)
    }
  }

  /**
   * 子表格更新行
   * 要兼容数组更新
   * */
  updateChildRow(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------更新子表格数据参数', param)
      let tempRowId = param[0]
      let tempchildData = param[1].data ? param[1].data : param[1]
      let childData = this.allChildDataSource.find((item) => item.key == tempRowId)
      if (!childData || !childData.value) {
        return
      }
      let child = common.clone(childData.value)
      if (tempchildData instanceof Array) {
        if (tempchildData.length > 0) {
          tempchildData.forEach((element) => {
            let index = child.findIndex((item) => item[this.rowIdName] === element[this.rowIdName])
            //this.$set(this.dataSource, index, element)
            child[index] = element
          })
        }
      } else {
        this.enumValueConvert(tempchildData)
        let index = child.findIndex((item) => item[this.childRowIdName] == tempchildData[this.childRowIdName])
        if (index > -1) {
          child[index] = tempchildData
          childData.value[index] = tempchildData
          let tempIdx = this.allChildDataSource.findIndex((item) => item.key == tempRowId)
          if (tempIdx > -1) {
            this.allChildDataSource[tempIdx] = childData
          }
          let ttt = this.allChildDataSourceNoGroup.findIndex((item) => item[this.childRowIdName] == tempchildData[this.childRowIdName])
          if (ttt > -1) {
            this.allChildDataSourceNoGroup[ttt] = tempchildData
          }
        }
      }
      //window.console.log('------------------更新子表格数据-子表数据tempchildData', tempchildData)
      //window.console.log('------------------更新子表格数据-子表数据', child)
      //window.console.log('------------------更新子表格数据-tempRowId', tempRowId)
      //window.console.log('------------------更新子表格数据-this.allChildDataSourceNoGroup', this.allChildDataSourceNoGroup)
      ;(this.$refs.table as any).refreshChildData(tempRowId, child)
    }
  }

  /** 子表格删除行 */
  deleteChildRow(param: any) {
    if (param instanceof Array) {
      window.console.log('------------------删除子表格数据参数', param)
      let tempRowId = param[0]
      let tempchildRowId = param[1]
      let childData = this.allChildDataSource.find((item) => item.key == tempRowId)
      if (!childData || !childData.value) {
        return
      }
      let index = childData.value.findIndex((item) => item[this.childRowIdName] == tempchildRowId)
      if (index > -1) {
        childData.value.splice(index, 1)
        let tempIdx = this.allChildDataSource.findIndex((item) => item.key == tempRowId)
        if (tempIdx > -1) {
          this.allChildDataSource[tempIdx] = childData
        }
        let ttt = this.allChildDataSourceNoGroup.findIndex((item) => item[this.childRowIdName] == tempchildRowId)
        if (ttt > -1) {
          this.allChildDataSourceNoGroup.splice(ttt, 1)
        }
      }
      let child = common.clone(childData.value)
      ;(this.$refs.table as any).refreshChildData(tempRowId, child)
    }
  }

  /** 准备子表格 */
  prepareChildData() {}

  /** 为下拉框指定数据源，两个参数
   *  1.目标列
   *  2.数据源
   */
  setSelectDataSourceByColumnCode(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------指定数据源', param)
      let columnCode = param[0]
      let selectDataSource = param[1]
      let idx = this.dictItemArr.findIndex((item) => item.propertyCode == columnCode)
      if (idx < 0) {
        this.dictItemArr.push({
          //dictId: modelPropertyDetail.dictId,
          propertyCode: columnCode,
          columnType: ModelPropertyType.ENUM,
          item: selectDataSource
        })
      } else {
        this.dictItemArr[idx].item = selectDataSource
      }
    }
  }

  /** 获取上次编辑的数据，如果正在编辑，就是当前编辑的数据 */
  getPreviousEditInfo() {
    let temp = (this.$refs.table as any).getEditRow()
    //window.console.log('---------------------------------上次编辑的数据temp', temp)
    // if (temp && temp instanceof Object){
    //   return common.clone(temp)
    // }
    let row = common.clone(temp)
    this.tableStyle.columnInfos.forEach((item) => {
      if (item.isCanEdit && item.columnType === ModelPropertyType.DATE) {
        if (row[item.field]) {
          row[item.field] = moment(row[item.field]).valueOf()
        }
      }
    })
    //window.console.log('---------------------------------上次编辑的数据', row)
    return row
  }

  /** 展开指定行 */
  setExpandRow(param: any) {
    let tempRow = param[0].data ? param[0].data : param[0]
    if (!tempRow) {
      return
    }
    let tempRowId = tempRow[this.rowIdName]
    if (this.allChildDataSource.findIndex((item) => item.key == tempRowId) < 0) {
      this.allChildDataSource.push({ key: tempRowId, value: [] })
    }
    ;(this.$refs.table as any).setRowExpand(tempRowId)
  }

  /** 子表格行内结束 */
  childrowEditEnd(row: any, parentId: string) {
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录row', row)
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录id', parentId)
    let idx = this.allChildDataSourceNoGroup.findIndex((item) => item[this.childRowIdName] == row[this.childRowIdName])
    if (idx > -1) {
      let tempIdx = this.allChildDataSource.findIndex((item) => item.key == parentId)
      if (tempIdx > -1) {
        //this.allChildDataSource[tempIdx]
        let childIdx = this.allChildDataSource[tempIdx].value.findIndex((item) => item[this.childRowIdName] == row[this.childRowIdName])
        if (childIdx > -1) {
          this.allChildDataSource[tempIdx].value[childIdx] = row
        }
      }
      this.allChildDataSourceNoGroup[idx] = common.clone(row)
    }
    //行编辑结束
    //this.triggeEvent('行编辑结束', common.clone(currentRow))
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录allChildDataSource', this.allChildDataSource)
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录', this.allChildDataSourceNoGroup)
  }
  /** 设置临时数据源，暂时只处理主表，子表先不考虑 */
  setTempDataSource(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------设置临时数据', param)
      let tempAdd = param[0].data
        ? param[0].data.content && param[0].data.content instanceof Array
          ? param[0].data.content
          : param[0].data
        : param[0]
      let tempUpdate = param[1].data
        ? param[1].data.content && param[1].data.content instanceof Array
          ? param[1].data.content
          : param[1].data
        : param[1]
      let tempDelete = param[2].data
        ? param[2].data.content && param[2].data.content instanceof Array
          ? param[2].data.content
          : param[2].data
        : param[2]
      let prop = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
      if (prop) {
        prop.value = { content: common.clone(tempUpdate) }
      }
      let _this = this
      _this.$nextTick(() => {
        _this.dataSource = []
        _this.dataSource = _this.dataSource.concat(tempAdd)
        _this.dataSource = _this.dataSource.concat(tempUpdate)
        let addprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
        addprop.value = tempAdd
        let updateprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
        updateprop.value = tempUpdate
      })
      //let olddata = prop.value? prop.value.content:[]
      let deleteprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
      deleteprop.value = tempDelete
    }
  }

  /** 设置点击行
   * 参数是主键id
   * */
  setClickRow(param: any) {
    //window.console.log('----------设置点击行',param[0])
    ;(this.$refs.table as any).setRowSelect(param[0])
  }

  /**
   * 获取子表格选中数据
   * 没有参数
   * */
  getChildCheckRows() {
    let isCanCheck = this.tableStyle.child.isCanCheck
    if (isCanCheck !== false) {
      let val = { modelCode: this.getModelCode(true), data: common.clone(this.childCheckRows) }
      return val
    } else {
      //单选的情况下直接使用点击行
      let val = { modelCode: this.getModelCode(true), data: common.clone(this.currentClickRow) }
      return val
    }
  }

  /** 重置数据，还原到上次查询到的数据 */
  resetDataSource() {
    //window.console.log('----------------进入表格重置方法')
    let property = this.findPropertyByName(PropertyGroupName.normal, '表格数据源')
    if (property.value) {
      let cloneValue = common.clone(property.value)
      this.initDataSource(cloneValue)
    }
    ;(this.$refs['table'] as any).clearSelect()
    this.itemSelect([])
    //表格数据源变更的时候，清除子表格临时数据
    this.oldAllChildDataSource = []
    this.oldAllChildDataSourceNoGroup = []
    this.allChildDataSource = []
    this.allChildDataSourceNoGroup = []
    ;(this.$refs['table'] as any).clearRowExpand()
    let childprop = this.findPropertyByName(PropertyGroupName.normal, '子表格数据源')
    this.setPropertyVal(childprop.id, [])
  }

  /**
   * 批量删除子表数据
   * 一个参数，example：
   * [{key:1,value:[]},{key:2,value:[]}]
   */
  batchDeleteChild(param: any) {
    let data = param[0]
    // data = []
    // data.push({key:64186426130433,value:[{id: 64186426130434}]})
    // data.push({key:64728267292673,value:[{id: 64728267292674}]})
    // data.push({key:64737805139969,value:[{id: 64737805139970}]})
    if (data && data instanceof Array && data.length > 0) {
      data.forEach((item) => {
        let temp = this.allChildDataSource.find((single) => single.key == item.key)
        if (temp) {
          item.value.forEach((element) => {
            let idx = temp.value.find((single) => single[this.childRowIdName] == element[this.childRowIdName])
            temp.value.splice(idx, 1)
            let index = this.allChildDataSourceNoGroup.find((single) => single[this.childRowIdName] == element[this.childRowIdName])
            this.allChildDataSourceNoGroup.splice(index, 1)
          })
          let child = common.clone(temp.value)
          ;(this.$refs.table as any).refreshChildData(item.key, child)
        }
      })
    }
  }

  /**
   * 批量更新子表数据，直接覆盖原有数据，xuhh专用接口
   * 一个参数，example：
   * [{key:1,value:[]},{key:2,value:[]}]
   */
  batchUpdateChild(param: any) {
    //window.console.log('------------------进入批量更新方法', param)
    let data = param[0]
    // data = []
    // data.push({key:64186426130433,value:[]})
    // data.push({key:64728267292673,value:[]})
    // data.push({key:64737805139969,value:[]})
    if (data && data instanceof Array && data.length > 0) {
      this.allChildDataSourceNoGroup = []
      this.expandAllRows()
      if (this.allChildDataSource && this.allChildDataSource.length > 0) {
        this.allChildDataSource.forEach((item) => {
          let temp = data.find((single) => single.key == item.key)
          if (temp) {
            item.value = temp.value
            this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(item.value)
          } else {
            item.value = []
          }
          ;(this.$refs.table as any).refreshChildData(item.key, common.clone(item.value))
        })
      } else {
        window.setTimeout(() => {
          data.forEach((element) => {
            ;(this.$refs.table as any).refreshChildData(element.key, common.clone(element.value))
          })
        }, 200)
      }
      // this.$nextTick(()=>{

      // })
      // data.forEach((item) => {
      //   let temp = this.allChildDataSource.find((single) => single.key == item.key)
      //   if (temp) {
      //     item.value.forEach((element) => {
      //       let idx = temp.value.find((single) => single[this.childRowIdName] == element[this.childRowIdName])
      //       temp.value.splice(idx, 1)
      //       let index = this.allChildDataSourceNoGroup.find((single) => single[this.childRowIdName] == element[this.childRowIdName])
      //       this.allChildDataSourceNoGroup.splice(index, 1)
      //     })
      //     let child = common.clone(temp.value)
      //     ;(this.$refs.table as any).refreshChildData(item.key, child)
      //   }
      // })
    }
  }

  /** 设置操作列显示隐藏 */
  setActionCoulumn(param: any) {
    if (param instanceof Array && param.length > 0) {
      let isshow = param[0]
      ;(this.$refs.table as any).switchColumnStatus('action', isshow)
    }
  }

  /**
   * 是否存在临时数据
   * 存在的话返回true，不存在返回false
   */
  checkIsExistTempData(param: any) {
    let addprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    let updateprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    let deleteprop = this.findPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    if (
      (!addprop.value || addprop.value.length == 0) &&
      (!updateprop.value || updateprop.value.length == 0) &&
      (!deleteprop.value || deleteprop.value.length == 0)
    ) {
      return false
    } else {
      return true
    }
  }
  celldbclick(value: any[], currentRow: any, ischecked: boolean = true) {
    this.manualSelect(value, currentRow, ischecked)
    let property = this.findPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
    var val = { modelCode: this.getModelCode(), data: common.clone(currentRow) }
    this.setPropertyVal(property.id, val)
  }
  private currentClickRow: any
  childcelldbclick(value: any, isChecked: boolean) {
    this.childItemSelect(value, isChecked)
    this.currentClickRow = common.clone(value)
  }
  childrowClick(row: any) {
    this.currentClickRow = common.clone(row)
    //window.console.log('-----------------------触发子表格点击行事件', row)
    this.triggeEvent('点击行', row)
  }
  getChildCurrentDataSource(param: any) {
    return common.clone(this.allChildDataSourceNoGroup)
  }
  exportTableToCsv(param: any) {
    let filename = 'export'
    if (param instanceof Array && param.length > 0) {
      filename = param[0]
    }
    ;(this.$refs.table as any).exportData(filename)
  }
  private checkResult: boolean = true
  setTableDisabled(param: any) {
    //表格不可选
    //this.checkResult = false
    //行编辑禁用
    ;(this.$refs.table as any).switchDblEditStatus(false)
    //操作列隐藏
    //;(this.$refs.table as any).switchColumnStatus('action', false)
  }
  setTableEnabled(param: any) {
    //表格可选
    //this.checkResult = true

    //行编辑启用
    ;(this.$refs.table as any).switchDblEditStatus(true)
    //显示操作列
    //;(this.$refs.table as any).switchColumnStatus('action', true)
  }

  /**设置列状态
   * 两个参数，第一个是列编码，第二个是显示隐藏
   */
  setCoulumnStatus(param: any) {
    if (param instanceof Array && param.length > 0) {
      let columnCodeStr = param[0]
      let validateParam = []
      if (columnCodeStr) {
        validateParam = columnCodeStr.split('@')
      }
      if (validateParam.length == 0) {
        return
      }
      if (validateParam.length == 1) {
        let columnCode = validateParam[0]
        let isshow = param.length == 1 ? false : param[1]
        ;(this.$refs.table as any).switchColumnStatus(columnCode, isshow)
      } else {
        let isshow = param.length == 1 ? false : param[1]
        ;(this.$refs.table as any).switchColumnStatusByCodeArr(validateParam, isshow)
      }
    }
  }

  /**
   * 指定子表格所有数据，批量查询之后直接给缓存的子表数据赋值
   * 两个参数：1.跟主表格关联的属性编码信息；2.子表格全部数据
   */
  setAllChildDataSource(param: any) {
    if (param instanceof Array && param.length > 0) {
      let code = param[0]
      if (!code) {
        return
      }
      this.oldAllChildDataSource = []
      this.oldAllChildDataSourceNoGroup = []
      let childArray = param[1].data
        ? param[1].data.content && param[1].data.content instanceof Array
          ? param[1].data.content
          : param[1].data
        : param[1]
      //let childArray = param.length > 1?param[1]:[]
      childArray.forEach((element) => {
        let childData = this.allChildDataSource.find((item) => item.key == element[code])
        if (childData) {
          childData.value.push(element)
        } else {
          let tempArr = []
          tempArr.push(element)
          this.allChildDataSource.push({ key: element[code], value: tempArr })
        }
      })
      this.allChildDataSourceNoGroup = common.clone(childArray)
      this.oldAllChildDataSource = common.clone(this.allChildDataSource)
      this.oldAllChildDataSourceNoGroup = common.clone(this.allChildDataSourceNoGroup)
      //window.console.log('------------设置子表格全部数据',this.oldAllChildDataSource)
    }
  }

  /**
   * 树表格展开行
   */
  treeExpand(row: any) {
    this.triggeEvent('树表格展开行', row)
  }

  setTreeExpandRowChildren(param: any) {
    if (param instanceof Array && param.length > 0) {
      let data = param[0].data ? (param[0].data.content && param[0].data.content instanceof Array ? param[0].data.content : param[0].data) : param[0]
      let val = []
      if (data instanceof Array) {
        val = data
      } else {
        if (data instanceof Object) {
          val.push(data)
        }
      }
      ;(this.$refs.table as any).setExpandTreeChildren(val)
    }
  }

  /**
   * 强制刷新表格数据
   */
  forceRefreshDataSource(param: any) {
    if (param instanceof Array && param.length > 0) {
      let data = param[0].data ? (param[0].data.content && param[0].data.content instanceof Array ? param[0].data.content : param[0].data) : param[0]
      // let tempArr = {content:data}
      // this.initDataSource(tempArr)
      //window.console.log('--------------强制刷新data',data)
      this.$nextTick(() => {
        if (data.content instanceof Array) {
          data.content.forEach((element) => {
            this.enumValueConvert(element)
          })
          this.initDataSource(data.content)
          //;(this.$refs.table as any).resetDataSource(data.content)
        } else if (data instanceof Array) {
          data.forEach((element) => {
            this.enumValueConvert(element)
          })
          this.initDataSource(data)
          //;(this.$refs.table as any).resetDataSource(data)
        }
      })
    }
  }

  /**自定义导出表格
   * 根据配置项来导出表格内容
   */
  customExportData(param: any) {
    let filename = 'export'
    if (param instanceof Array && param.length > 0) {
      filename = param[0]
    }
    let columns = []
    let exportPro = this.findPropertyByName(propertyGroupEnum.tableSetting, '导出设置')
    if (exportPro && exportPro.value) {
      columns = exportPro.value.columnInfos
    }
    if (!columns || columns.length == 0) {
      ;(this.$refs.table as any).exportData(filename)
      return
    }
    //;(this.$refs.table as any).customExportData(filename,columns)
    //使用xlsx来实现
    var aoa = []
    //拼接数据，表头
    let header = []
    for (let index = 0; index < columns.length; index++) {
      const element = columns[index]
      if (element.isShow) {
        header.push(element.title)
      }
    }

    //拼接内容，还需要数据转换
    let content = []
    for (let index = 0; index < this.dataSource.length; index++) {
      const element = this.dataSource[index]
      let rowContent = []
      for (let index = 0; index < columns.length; index++) {
        const item = columns[index]
        if (item.isShow) {
          //header.push(element.title)
          let tt = element[item.field]
          if (tt === undefined || tt === null) {
            rowContent.push('')
            continue
          }
          //需要格式化一下数据，时间和枚举
          switch (item.columnType) {
            case ModelPropertyType.DATE:
              rowContent.push(timeStamp2time(tt, item.formatString))
              break
            case ModelPropertyType.BOOL:
              rowContent.push(tt == 1 ? '是' : '否')
              break
            case ModelPropertyType.ENUM:
              rowContent.push(tt.itemName ? tt.itemName : '')
              break
            case ModelPropertyType.ENUMARRAY:
              rowContent.push(tt)
              break
            //FLOAT
            case ModelPropertyType.INT:
              rowContent.push(tt)
              break
            case ModelPropertyType.FLOAT:
              rowContent.push(tt)
              break
            default:
              rowContent.push(tt)
              break
          }
          // if (tt instanceof Object &&  tt.itemName){
          //   rowContent.push(tt.itemName)
          // }
          // else{
          //   rowContent.push(tt)
          // }
        }
      }
      content.push(rowContent)
    }

    aoa.push(header)
    content.forEach((element) => {
      aoa.push(element)
    })
    //window.console.log('------------导出excel',common.clone(aoa))

    // aoa = [
    //   ['姓名', '性别', '年龄', '注册时间'],
    //   ['张三', '男', 18, new Date()],
    //   ['李四', '女', 22, new Date()]
    // ]
    // window.console.log('------------导出excel-2',common.clone(aoa))
    var sheet = XLSX.utils.aoa_to_sheet(aoa)
    var workbook = {
      SheetNames: ['sheet1'],
      Sheets: {}
    }
    workbook.Sheets['sheet1'] = sheet
    // 生成excel的配置项
    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    }
    XLSX.writeFile(workbook, filename + '.xlsx')
  }

  /**折叠全部 */
  folderingAllRows(param: any) {
    ;(this.$refs.table as any).clearRowExpand()
  }

  /**展开全部 */
  expandAllRows() {
    ;(this.$refs.table as any).expandAllRows()
  }

  /**根据序号来控制显示列数，入参为最后一列的顺序 */
  setColumnVisibleByIdx(param: any) {
    if (param instanceof Array && param.length > 0) {
      let idx = param[0]
      ;(this.$refs.table as any).switchColumnStatusByIdx(idx)
    }
  }

  /**根据数据控制表格是否显示 */
  setColumnVisibleByData(param: any) {
    ;(this.$refs.table as any).switchColumnStatusByData()
  }

  /** 行编辑开始事件 */
  rowEditBeginTriggerEvent(currentRow) {
    //window.console.log('-----行编辑开始')
    this.triggeEvent('行编辑开始', common.clone(currentRow))
  }

  /**更新table组件的子项，用于外部获取操作列中的组件 */
  updateComponentsChildren() {
    let tableg = new TableGrid()
    let action = this.tableStyle.columnInfos.find((item) => item.field === 'action')
    if (action && action.colTemplateData) {
      if (this.tableStyle.child) {
        let childAction = this.tableStyle.child.columnInfos.find((item) => item.field === 'action')
        if (childAction && childAction.colTemplateData) {
          let childtable = new TableGrid()
          childtable.LoadPageByData(childAction.colTemplateData.id, childAction.colTemplateData)
          ;(tableg as any).children = [childtable]
        }
      }
      tableg.LoadPageByData(action.colTemplateData.id, action.colTemplateData)
      this.children = [tableg]
      window.console.log('---------------------表格子数据', this.children)
    }
  }

  getRowById(param: any) {
    if (param instanceof Array && param.length > 0) {
      let id = param[0]
      let row = this.dataSource.find((item) => item[this.rowIdName] == id)
      return common.clone(row)
    }
  }

  /**
   * 高级设置
   * 弹出一个表格列的编辑窗口，需要支持多行编辑
   * 类似于表格列设置
   */
  tableAdvanceSetting(param) {
    //window.console.error('------------高级设置',param)
    //let setting = new AdvanceSetting()
    //setting.view(this.tableStyle)
    ;(this.$refs.setting as any).view(param)
  }

  personalConfigId: any = ''
  /**
   * 保存设置的信息
   * 调用接口
   */
  async saveTableSetting(param) {
    //定义保存的数据结构
    //window.console.error('-----------保存表格设置',param)
    //return

    let advanced = {}
    let personalConfig = param
    //调用保存接口
    if (!this.personalConfigId) {
      this.personalConfigId = await CurrentApis.GetUniqueIds(1)[0]
    }
    await CurrentApis.SaveComponentConfig(this.Id, this.topParentPage.Id, { config: personalConfig }, this.personalConfigId)
    //this.personConfig = personalConfig
    ;(this.$refs.table as any).initStyle(this.tableStyle, personalConfig)
    // this.$nextTick(()=>{
    //   ;(this.$refs.table as any).resetDataSource(this.dataSource)
    // })
  }

  /**设置子表的点击 */
  setChildClickRow(param) {
    if (param instanceof Array && param.length > 1) {
      let id = param[0]
      let childId = param[1]
      ;(this.$refs.table as any).setChildrenClickRow(id, childId)
    }
  }
}
</script>
<style lang="less">
/*table*/
.vxe-table {
  /*暂无数据*/
  .vxe-table--empty-placeholder,
  .vxe-table--empty-block {
    min-height: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
    overflow: hidden;
    width: 100%;
    pointer-events: none;
    margin-top: 20px;
  }
  .vxe-table--empty-block {
    display: none;
    visibility: hidden;
    &.is--empty {
      display: flex;
    }
  }
  .vxe-table--empty-placeholder {
    display: flex;
    position: absolute;
    top: 35px !important;
    z-index: 8;
  }
  .vxe-table--empty-content {
    display: block;
    width: 50%;
    pointer-events: auto;
  }
  &.has--height {
    .vxe-table--empty-placeholder {
      top: 35px !important;
      transform: translateY(-50%);
    }
  }
}

.vxe-table .vxe-table--fixed-left-wrapper.scrolling--middle {
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.vxe-table .vxe-table--fixed-right-wrapper.scrolling--middle {
  box-shadow: -1px 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.fixed--hidden {
  visibility: visible !important;
}

.vxe-default-input {
  height: 30px !important;
}

.vxe-table .vxe-header--column.col--ellipsis {
  height: 40px !important;
}

// .vxe-table .vxe-body--column.col--ellipsis:not(.col--actived) .vxe-cell, .vxe-table .vxe-body--column.col--ellipsis:not(.col--actived) .vxe-cell>.vxe-checkbox, .vxe-table .vxe-footer--column.col--ellipsis:not(.col--actived) .vxe-cell, .vxe-table .vxe-footer--column.col--ellipsis:not(.col--actived) .vxe-cell>.vxe-checkbox, .vxe-table .vxe-header--column.col--ellipsis:not(.col--actived) .vxe-cell, .vxe-table .vxe-header--column.col--ellipsis:not(.col--actived) .vxe-cell>.vxe-checkbox{
//   overflow-y: visible;
// }
</style>