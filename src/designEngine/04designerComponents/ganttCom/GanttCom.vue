<template>
  <div class="ganttPdf" ref="ganttAll" :style="{background:backgroundColor}">
    <div class="pane pane-left" :style="{width:tableWidth+'px',height:height+'px'}" style="float:left">
      <!-- <div class="tableCotainer" :style="{width:tableWidth+'px',height:height+'px',background:backgroundColor}"> -->
      <div class="tableBlank" :style="{height:dateHeaderHeight+'px',width:tableWidth+'px',background:dateBackgroundColor}">
      </div>
      <div class="tableCotainer" :style="{width:tableWidth+'px',top:dateHeaderHeight-1+'px'}" style="height:100%">
        <v-table :v-if="isReload" ref="table" name="demo" :allBackgroundColor="backgroundColor" :parentPage="parentPage" :data="dataSource"
          :childdata="childdataSource" :columns="column" :tableStyle="tableStyle" :showPagination="showPagination" :showSetColumnButton="isDesign"
          :headerCellStyle="headerCellStyle" :showOverflow="showOverflow" :tablePageConfig="{currentPage:currentPage,pageSize:pageSize,total:total}"
          :height="height-dateHeaderHeight+'px'" @select="manualSelect" @changePage="changePage" @refresh="refreshData" @sort="sort" @expand="expand"
          :showSelection="showSelection" :showRadioColumn="showRadioColumn" :showColumnIndex="showColumnIndex" @rowClick="rowClick"
          :showHeader="showHeader" :isTree="isTree" :rowId="rowIdName" @toggleTreeExpand="toggleTreeExpand"
          :oddRowBackgroundColor="oddTaskBackgroundColor" :evenRowBackgroundColor="evenTaskBackgroundColor"
          :projectBackgroundColor="projectBackgroundColor" :middleBackgroundColor="middleBackgroundColor" :rowClickColor="taskClickColor"
          :rowHoverColor="taskHoverColor" :rowHeight="rowHeight" :fontColor="tableRowFontColor" @rowHover="rowHover" @rowLeave="rowLeave"
          @dbClick="dbClick" @handleScroll="handleScroll" :getIcon="getIcon" :isCanEdit="isCanEdit" @selectchild="childItemSelect"
          :showRefreshButton="showRefreshButton" :selectOptionArr="dictItemArr" @rowEditEnd="rowEditEnd" @dataChange="dataChange"
          :tableCellFontSize="tableCellFontSize" :iconWandH="iconWandH" :emptyTip="emptyTip" @childrowEditEnd="childrowEditEnd" :showAble="showAble"
          :showResourceColor="showResourceColor" :childrowId="childRowIdName" @celldbclick="celldbclick" @childcelldbclick="childcelldbclick"
          @childrowClick="childrowClick">
        </v-table>
      </div>
    </div>
    <div class="shadeScroll pane-trigger-con" v-if="isShowSpace" @mousedown="handleMousedown" :style="{left:tableWidth+'px',width:spaceWidth+'px',height:height-1+'px',background:spaceBackgroundColor,
    'border-left':spaceBorderColor,'border-right':spaceBorderColor}" />
    <!-- <GanttComponent ref="ganttPicture" class="ganttPicture"></GanttComponent> -->
    <div class="ganttPicture pane pane-right" :style="{left:isShowSpace?(tableWidth+spaceWidth+'px'):(tableWidth+'px')}">
      <div :style="{left:'0px',width:'10px',top:'0px',position:'absolute',background:'#fff',height:height+'px'}"></div>
      <GanttComponent :v-if="isReload" ref="gantt" :style="{top:'0px',left:'10px',position:'absolute'}" :task="task"
        :backgroundColor="backgroundColor" :chartDateWidth="chartDateWidth" :chartDateHeight="height+1" :dateHeaderHeight="dateHeaderHeight"
        :dateHeaderFontSize="dateHeaderFontSize" :dateHeaderFontWeight="dateHeaderFontWeight" :dateHeaderColor="dateHeaderColor"
        :dateBorderColor="dateBorderColor" :dateBackgroundColor="dateBackgroundColor" :locationWidth="locationWidth"
        :locationBorderColor="locationBorderColor" :locationBGColor="locationBGColor" :loactionFontSize="loactionFontSize"
        :locationFontWeight="locationFontWeight" :splitLineColor="splitLineColor" :verticalSplitLineColor="verticalSplitLineColor"
        :oddTaskBackgroundColor="oddTaskBackgroundColor" :evenTaskBackgroundColor="evenTaskBackgroundColor"
        :projectBackgroundColor="projectBackgroundColor" :middleBackgroundColor="middleBackgroundColor" :taskClickColor="taskClickColor"
        :taskHoverColor="taskHoverColor" :isUseDefaultPopup="isUseDefaultPopup" :weekdayBGColor="weekdayBGColor" :showNonWeekday="showNonWeekday"
        :workBGColor="workBGColor" :restBGColor="restBGColor" :holidayBGColor="holidayColor" :timeDivDate="timeDivDate"
        :activeShowValue="activeShowValue" :disable="disable" :rowHeight="rowHeight" :colorList="colorList" :dependencyColor="taskDependencyColor"
        :popForm="popForm" :drapDepen="drapDepen" @dblclickRowWrapper="dblclickRowWrapper" @mouseover="mouseover" :rowHeightModel="rowHeightModel"
        :setFirstTop="setFirstTop" :setRowInHeightT="setRowInHeightT" :setRowInHeightS="setRowInHeightS" :setLineTwoTop="setLineTwoTop"
        @clickRowWrapper="clickRowWrapper" @rightClickRowWrapper="rightClickRowWrapper" @leftTableClickRow="leftTableClickRow"
        @leftTableHoverRow="leftTableHoverRow" @leftTableLeaveRow="leftTableLeaveRow" @handleTableScroll="handleTableScroll"
        :ganttCalendar="ganttCalendar" :calendarLevel="calendarLevel" :summaryAble="summaryAble" :isDepend="isDepend" :ganttMove="ganttMove"
        :speWorkColor="speWorkColor" :speRestColor="speRestColor" :filter="filter" :workTimeType="workTimeType" :dependencyWidth="dependencyWidth"
        @handleColorDueToExpand="handleMouseOut" :listenLKeyDown="listenLKeyDown">
      </GanttComponent>
      <div :style="{left:chartDateWidth+10+'px',width:'10px',top:'0px',position:'absolute',background:'#fff',height:height+'px'}"></div>
    </div>
    <exportModal ref="export"  @printData="print" :svgSize="svgSize" :fontSize="exportFontSize" :cancelSettingInfo="cancelSettingInfo"
      :okSettingInfo="okSettingInfo"></exportModal>

  </div>
</template>

<script lang="ts">
import GanttComponent from '../ganttComponents/components/gantt.vue'
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
  Color_Property,
  TimePickerFile_Property,
  UploadFile_Property,
} from '../../02common/commonClasses/LayoutProperty'
import APIS_Test from '../../01designerContext/APIs_Test'
import { CurrentContext } from '../../01designerContext'
import ComponentBase from '../ComponentBase'
// import tablemix from './table_mix'
import { columnInfo, tableStyle } from './tableCommonTypes'
import common from '../../02common/commonMethod'
import VTable from './VxeTable'
import modelAnalysis, {
  ModelInfo,
  PageBaseModel,
  ModelBindingProperty,
  ModelPropertyType,
  modelTypeEnum,
} from '../../02common/impResourcesCache/modelAnalysis'
import { CurrentApis } from '../../01designerContext'
import modelBingding, {
  bindingModelVal_InProperty,
  modelBingValue,
  bindTypeEnum,
  modelDataTypeEnum,
} from '../../02common/commonClasses/modelBingding'

import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import Sortable from 'sortablejs'
import XEUtils from 'xe-utils'
import moment from 'moment'
import xlsx from 'xlsx'
import exportModal from './component/exportModal.vue'
import html2Canvas from 'html2canvas'
import $ from 'jquery'

enum propertyNameEnum {
  datasource = '表格数据源',
  childdatasource = '子表格数据源',
}
enum propertyGroupEnum {
  columnSetting = '列设置',
  bodySetting = '表身设置',
  tableSetting = '表格设置',
  dateSetting = '日期头设置',
  specialTimeSetting = '特殊时间显示设置',
  taskColorSetting = '任务相关颜色设置',
  taskHeightSetting = '任务相关高度设置',
  imageSetting = '图片设置',
  exportButtonSetting = '导出弹窗设置',
  tableDisplaySetting = '表格样式设置',
}

enum operationTypeEnum {
  add = '新增',
  addChild = '新增子表',
  update = '编辑',
  updateChild = '编辑子表',
  delete = '删除',
  deleteChild = '删除子表',
}

@Component({
  components: {
    GanttComponent: GanttComponent,
    // tablemix: tablemix,
    VTable: VTable,
    Sortable: Sortable,
    exportModal: exportModal,
  },
})
export default class GanttCom extends ComponentBase {
  /**
   * data
   */
  // showSelection: boolean = false
  showRadioColumn: boolean = false
  showColumnIndex: boolean = false

  rowHoverId: any = ''
  sortable2: any

  tablePageConfig: any = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
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
      dataIndex: 'action',
    },
  ]

  tableStyle: tableStyle = {
    child: null,
    canChoose: 0,
    showIndex: false,
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
  }

  tableScrollFlag: boolean = true
  ganttScrollFlad: boolean = true
  timer: any = ''

  task: any = [
    {
      taskName: '1',
      ower: '',
      type: 'project',
      percentage: 0,
      planBeginTime: '',
      planEndTime: '',
      id: 1568028397666,
      isShow: true,
      children: [
        {
          taskName: '4',
          ower: '',
          type: 'middle',
          percentage: 0,
          planBeginTime: '',
          planEndTime: '',
          id: 1568028467666,
          parentId: 1568028397666,
          isShow: true,
          children: [
            {
              taskName: '1',
              ower: '',
              type: 'task',
              stoneTime: '',
              percentage: 0,
              isShow: true,
              planBeginTime: 1568505600000,
              // planBeginTime: 1514736000000,
              planEndTime: 1568592000000,
              actualBeginTime: 1567958400000,
              actualEndTime: 1568217600000,
              id: 1568028403474,
              parentId: 1568028467666,
            },
          ],
        },
      ],
    },
    {
      taskName: '5',
      ower: '',
      type: 'project',
      percentage: 0,
      planBeginTime: '',
      planEndTime: '',
      isShow: true,
      id: 1568133397666,
      children: [
        {
          taskName: '6',
          ower: '',
          type: 'middle',
          percentage: 0,
          planBeginTime: '',
          planEndTime: '',
          isShow: true,
          id: 1568544467666,
          parentId: 1568133397666,
        },
      ],
    },
  ]
  isReload: boolean = true

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

  checkDropResult: any = true
  copyColumn: any = []
  canMove: boolean = false
  initOffset: number = 0

  tableMinWidth: number = 0
  showAble: boolean = false

  listenLKeyDown: boolean = false

  created() {
    this.treeDrop()
  }

  beforeDestroy() {
    if (this.sortable2) {
      this.sortable2.destroy()
    }
  }
  mounted() {
    this.height = 500
    this.width = 1002

  /*******************************************************************************************/
    this.RegisterProperty('日期头高度', propertyGroupEnum.dateSetting, new Number_Property(), 32)
    this.RegisterProperty('日期头字体大小', propertyGroupEnum.dateSetting, new Number_Property(), 17)
    this.RegisterProperty('日期头字体粗细值', propertyGroupEnum.dateSetting, new Number_Property(), 600)
    this.RegisterProperty('日期头部字体颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#404040')
    this.RegisterProperty('日期边框颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#d7d7d7')
    this.RegisterProperty('日期头背景颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#ffffff')

    this.RegisterProperty('快速定位的字体大小', propertyGroupEnum.dateSetting, new Number_Property(), 17)
    this.RegisterProperty('快速定位的字体粗细值', propertyGroupEnum.dateSetting, new Number_Property(), 600)
    this.RegisterProperty('快速定位的宽度', propertyGroupEnum.dateSetting, new Number_Property(), 40)
    this.RegisterProperty('快速定位的边框颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#d7d7d7')
    this.RegisterProperty('快速定位的选中颜色', propertyGroupEnum.dateSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('是否快速定位', propertyGroupEnum.dateSetting, new Boolean_Property(), false)

    this.RegisterProperty('周末高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.RegisterProperty('周末颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#82828233')
    this.RegisterProperty('节假日高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.RegisterProperty('节假日高亮颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#82828233')
    this.RegisterProperty('设置特殊日历高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.RegisterProperty('特殊日历-加班时间颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#EDAC1D33')
    this.RegisterProperty('特殊日历-休息时间颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#DB4D3E33')
    this.RegisterProperty('上班时间高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.RegisterProperty('上班时间颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#4BBA8133')
    this.RegisterProperty('休息时间高亮', propertyGroupEnum.specialTimeSetting, new Boolean_Property(), true)
    this.RegisterProperty('休息时间颜色', propertyGroupEnum.specialTimeSetting, new Color_Property(), '#4BBA8133')
    // this.RegisterProperty('上班开始时间', propertyGroupEnum.specialTimeSetting, new TimePickerFile_Property('time'), null)
    // this.RegisterProperty('上班结束时间', propertyGroupEnum.specialTimeSetting, new TimePickerFile_Property('time'), null)
    this.RegisterProperty('工厂日历级别', propertyGroupEnum.specialTimeSetting, new Enum_Property(true, ['project', 'middle']), 'project')

    this.RegisterProperty('工厂日历', PropertyGroupName.normal, null, [])
    // this.RegisterProperty('休息时间', PropertyGroupName.normal, null, [])
    this.RegisterProperty('筛选条件', PropertyGroupName.normal, null, [])
    this.RegisterProperty('节假日', PropertyGroupName.normal, null, []) //暂无法获取数据，所以未写默认值,格式为yyyy-mm-dd
    this.RegisterProperty('特殊时间', PropertyGroupName.normal, null, []) //暂无法获取数据，所以未写默认值,格式为yyyy-mm-dd hh:mm
    this.RegisterProperty('气泡卡片内容', PropertyGroupName.normal, null, [])

    this.RegisterProperty('展示实际任务条', propertyGroupEnum.taskColorSetting, new Boolean_Property(), true) //应该作为方法抛出，待修改
    this.RegisterProperty('实际任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#133E28')
    this.RegisterProperty('project层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#CBEADA')
    this.RegisterProperty('project层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#4BBA81')
    this.RegisterProperty('middle层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#CBEADA')
    this.RegisterProperty('middle层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#4BBA81')
    this.RegisterProperty('task层任务条颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#CBEADA')
    this.RegisterProperty('task层任务条完成颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#4BBA81')
    this.RegisterProperty('奇数任务行颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('偶数任务行颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('project任务行背景颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('middle任务行背景颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#F6F5F7')
    this.RegisterProperty('任务依赖线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#FE0000')
    this.RegisterProperty('任务行分割线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#E3E3E3')
    this.RegisterProperty('任务行纵向分割线颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#E3E3E3')
    this.RegisterProperty('任务行鼠标选中颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#f2f2f2')
    this.RegisterProperty('任务行鼠标悬停颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#f2f2f2')
    this.RegisterProperty('可移动至资源颜色', propertyGroupEnum.taskColorSetting, new Color_Property(), '#ff0000')

    this.RegisterProperty('每行高度', propertyGroupEnum.taskHeightSetting, new Number_Property(23), 29)
    this.RegisterProperty('自动设置任务条高度', propertyGroupEnum.taskHeightSetting, new Boolean_Property(), false)
    this.RegisterProperty('预计任务条和顶部的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 5)
    this.RegisterProperty('展示实际任务条时预计任务条的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 9)
    this.RegisterProperty('不展示实际任务条时预计任务条的高度', propertyGroupEnum.taskHeightSetting, new Number_Property(), 24)
    this.RegisterProperty('实际任务条和顶部的距离', propertyGroupEnum.taskHeightSetting, new Number_Property(), 16)

    // this.RegisterProperty('气泡卡片内容', PropertyGroupName.special, null, null, false, true) //暂无法获取数据，所以未写默认值
    this.RegisterProperty('表格与甘特图是否有间隔', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('表格与甘特图间隔宽度', PropertyGroupName.special, new Number_Property(), 10)
    this.RegisterProperty('表格与甘特图间隔背景色', PropertyGroupName.special, new Color_Property(), '#E9ECF0')
    this.RegisterProperty('表格与甘特图间隙边框颜色', PropertyGroupName.special, new Color_Property(), '#E9ECF0')

    this.RegisterProperty('是否使用默认弹窗（鼠标悬停任务条时）', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('甘特图可编辑', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('是否展示汇总', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('拖拽联动', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('生产日历数据格式', PropertyGroupName.special, new Enum_Property(true, ['周循环', '详细时间']), '周循环')
    this.RegisterProperty('移动条件属性', PropertyGroupName.special, new Text_Property(), null)
    this.RegisterProperty('表格宽度', PropertyGroupName.special, new Number_Property(), 300)
    // this.RegisterProperty('甘特图宽度', PropertyGroupName.special, new Number_Property(), 700)
    this.RegisterProperty('是否展示依赖线', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('依赖线宽度', PropertyGroupName.special, new Number_Property(1, 20), 2)

    this.RegisterProperty('project图标', propertyGroupEnum.imageSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('middle图标', propertyGroupEnum.imageSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('task图标', propertyGroupEnum.imageSetting, new UploadFile_Property(1, 'image'))
    // this.RegisterProperty('锁定产线图标', propertyGroupEnum.imageSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('任务图标大小', propertyGroupEnum.imageSetting, new Number_Property(1), 14)

    this.RegisterProperty('图标大小', propertyGroupEnum.exportButtonSetting, new Number_Property(), 16)
    this.RegisterProperty('字体大小', propertyGroupEnum.exportButtonSetting, new Number_Property(), 14)
    this.RegisterProperty('取消按钮图标', propertyGroupEnum.exportButtonSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('取消按钮选中图标', propertyGroupEnum.exportButtonSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('导出按钮图标', propertyGroupEnum.exportButtonSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('导出按钮选中图标', propertyGroupEnum.exportButtonSetting, new UploadFile_Property(1, 'image'))
    this.RegisterProperty('取消按钮正常颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#53BC8626')
    this.RegisterProperty('取消按钮悬浮颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#6CC5980D')
    this.RegisterProperty('取消按钮点击颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#469F72')
    this.RegisterProperty('取消按钮边框颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#469F72')
    this.RegisterProperty('取消字体正常颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#53BC86FF')
    this.RegisterProperty('取消字体选中颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('导出按钮正常颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#53BC86')
    this.RegisterProperty('导出按钮悬浮颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#6CC598')
    this.RegisterProperty('导出按钮点击颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#469F72')
    this.RegisterProperty('导出按钮边框颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#469F72')
    this.RegisterProperty('导出字体正常颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#ffffff')
    this.RegisterProperty('导出字体选中颜色', propertyGroupEnum.exportButtonSetting, new Color_Property(), '#53BC86FF')

    this.RegisterEvents('任务条双击事件', '', this.inparam, this.outparam)
    this.RegisterEvents('任务条选中事件', '', this.inparam, this.outparam)
    this.RegisterEvents('任务条右击事件', '', this.inparam, this.outparam)
    this.RegisterEvents('任务条悬浮事件', '', this.inparam, this.outparam)
    this.RegisterEvents('树节点展开收起', '', this.inparam, this.outparam)
    this.RegisterEvents('拖动校验事件', '', this.inparam, this.outparam)
    this.RegisterEvents('选中拖拽行事件', '', this.inparam, this.outparam)

    let addparam: param[] = []
    addparam.push({ name: '新增数据', type: paramType.complexType, val: null })
    addparam.push({ name: '依赖关系', type: paramType.complexType, val: null })
    this.RegisterMethods('新增任务', '', this.addNewTask, addparam, null)
    let deleteparam: param[] = []
    deleteparam.push({ name: '删除数据id', type: paramType.number, val: null })
    this.RegisterMethods('删除任务', '', this.deleteTask, deleteparam, null)
    let changeparam: param[] = []
    changeparam.push({ name: '修改任务数据', type: paramType.complexType, val: null })
    this.RegisterMethods('修改任务', '', this.changeTask, changeparam, null)
    // this.RegisterMethods('任务位置互换', '', this.exchangeTask, this.inparam, null)
    // this.RegisterMethods('任务条移动', '', this.moveToTask, this.inparam, null)
    // this.RegisterMethods('撤销', '', this.undo, null, null)
    // this.RegisterMethods('重做', '', this.redo, null, null)
    // this.RegisterMethods('获取撤销列表', '', this.getUndoList, null, this.outparam)
    // this.RegisterMethods('获取重做列表', '', this.getRedoList, null, this.outparam)
    // this.RegisterMethods('加载数据方法', '', this.refreshganttData, this.inparam, null)
    let lockinparam: param[] = []
    lockinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    this.RegisterMethods('锁定产线', '', this.lockNode, lockinparam, null)
    let checkinparam: param[] = []
    checkinparam.push({ name: '数据', type: paramType.complexType, val: null })
    this.RegisterMethods('检查时间是否合法', '', this.checkTask, checkinparam, this.outparam)
    let depenparam: param[] = []
    depenparam.push({ name: '行数据', type: paramType.complexType, val: null })
    this.RegisterMethods('获取所有依赖和时间', '', this.getDepen, depenparam, null)
    let getparam: param[] = []
    getparam.push({ name: '行数据', type: paramType.complexType, val: null })
    this.RegisterMethods('获取当前行数据', '', this.getTask, getparam, null)

    this.RegisterMethods('获取是否有选中行', '', this.isHasClickedRow, null, null)

    this.RegisterMethods('获取数据源', '', this.getSaveTask, null, null)
    let levelLabel: param[] = []
    levelLabel.push({ name: '日期显示级别（hour/day/week/month/year）', type: paramType.string, val: null })
    this.RegisterMethods('快速定位日期等级方法', '', this.changeLevel, levelLabel, this.outparam)
    // let levelNumber: param[] = []
    // levelNumber.push({ name: '日期显示级别1-13（hour1-3/day4-8/week9/month10-11/year12-13）', type: paramType.number, val: null })
    // this.RegisterMethods('滑块快速缩放日期', '', this.zoomDate, levelNumber, this.outparam)
    let dateString: param[] = []
    dateString.push({ name: '日期范围("2019-09-15","2019-09-16")', type: paramType.complexType, val: null })
    this.RegisterMethods('日期快速定位', '', this.locateDate, dateString, this.outparam)
    this.RegisterMethods('缩放至合适', '', this.zoomToFit, this.inparam, this.outparam)
    // this.RegisterMethods('折叠展开', '', this.handlerExpand, this.inparam, null)
    this.RegisterMethods('导出Excel', '', this.exportExcel, null, null)
    this.RegisterMethods('打印数据', '', this.printData, null, null)
    this.RegisterMethods('筛选', '', this.filters, null, null)

    let dropCheckResult: param[] = []
    dropCheckResult.push({ name: '拖动校验结果', type: paramType.boolean, val: null })
    this.RegisterMethods('获取拖动校验结果', '', this.getCheckDropResult, dropCheckResult, this.outparam)

  /*******************************************************************************************/
    this.RegisterProperty('表格数据源', PropertyGroupName.normal, null, [])
    this.RegisterProperty('列样式', propertyGroupEnum.columnSetting, new TableStyleSetting_Property(), null)

    this.RegisterProperty('当前页码', propertyGroupEnum.tableSetting, new Number_Property(), 1, false)
    this.RegisterProperty('每页显示项数', propertyGroupEnum.tableSetting, new Number_Property(), 10, false)
    this.RegisterProperty('总条数', propertyGroupEnum.tableSetting, new Number_Property(), 0, false)
    this.RegisterProperty('当前选中行', propertyGroupEnum.tableSetting, null, [])
    this.RegisterProperty('是否有选中行', propertyGroupEnum.tableSetting, new Boolean_Property(), false, false)
    this.RegisterProperty('是否有子表格', propertyGroupEnum.tableSetting, new Boolean_Property(), false, false)
    this.RegisterProperty('展开行', propertyGroupEnum.tableSetting, null, '')
    this.RegisterProperty('当前选中模型', propertyGroupEnum.tableSetting, null, [], false)
    this.RegisterProperty('当前点击行', propertyGroupEnum.tableSetting, null, {})
    this.RegisterProperty('表格行字体颜色', propertyGroupEnum.tableSetting, new Color_Property(), '#000000')
    this.RegisterProperty('表格行字体大小', propertyGroupEnum.tableSetting, new Number_Property(), 14)
    this.RegisterProperty('表格标题字体大小', propertyGroupEnum.tableSetting, new Number_Property(), 17)

    this.RegisterProperty('表格为空时显示文本', propertyGroupEnum.tableDisplaySetting, new Text_Property(), '暂无数据')

    // this.RegisterProperty('子表格数据源', PropertyGroupName.normal, null, [])
    /**列*/
    // this.RegisterProperty('字体大小', propertyGroupEnum.columnSetting, new Boolean_Property(), true)
    // this.RegisterProperty('字体颜色', propertyGroupEnum.columnSetting, new Boolean_Property(), true)

    // this.RegisterProperty('是否显示分页', propertyGroupEnum.tableSetting, new Boolean_Property(), false, true)
    // this.RegisterProperty('是否显示表头', propertyGroupEnum.tableSetting, new Boolean_Property(), true, true)
    // this.RegisterProperty('是否树表格', propertyGroupEnum.tableSetting, new Boolean_Property(), true, true)
    // this.RegisterProperty('是否可选', propertyGroupEnum.tableSetting, new Enum_Property(true, ['否', '多选', '单选']), '否')
    // this.RegisterProperty('新增数据源', propertyGroupEnum.tableSetting, null, [], false, false)
    // this.RegisterProperty('编辑数据源', propertyGroupEnum.tableSetting, null, [], false, false)
    // this.RegisterProperty('删除数据源', propertyGroupEnum.tableSetting, null, [], false, false)
    // this.RegisterProperty('是否显示刷新', propertyGroupEnum.tableSetting, new Boolean_Property(), true)
    // this.RegisterProperty('是否可编辑', propertyGroupEnum.tableSetting, new Enum_Property(true, ['否', '单击编辑', '双击编辑','手动编辑']), '否',false,false)

    this.RegisterEvents('列表刷新', '', this.inparam, this.outparam)
    this.RegisterEvents('表格展开', '', this.inparam, this.outparam)
    this.RegisterEvents('点击行', '', this.inparam, this.outparam)
    let currentCheckinparam: param[] = []
    currentCheckinparam.push({ name: '当前勾选', type: paramType.complexType, val: null })
    this.RegisterEvents('勾选行', '', currentCheckinparam, this.outparam)
    this.RegisterEvents('取消勾选行', '', this.inparam, this.outparam)
    let datasourceinparam: param[] = []
    datasourceinparam.push({ name: '当前数据', type: paramType.complexType, val: null })
    this.RegisterEvents('表格数据变更', '', datasourceinparam, this.outparam)
    let editRowinparam: param[] = []
    editRowinparam.push({ name: '编辑行数据', type: paramType.complexType, val: null })
    this.RegisterEvents('行编辑结束', '', editRowinparam, this.outparam)
    this.RegisterEvents('表格行悬浮', '', this.inparam, this.outparam)
    this.RegisterEvents('表格行双击', '', this.inparam, this.outparam)

    let selectallinparam: param[] = []
    selectallinparam.push({ name: '全选/反选', type: paramType.boolean, val: true })
    selectallinparam.push({ name: '是否触发勾选事件', type: paramType.boolean, val: true })
    this.RegisterMethods('勾选全部数据', '', this.selectAllData, selectallinparam, null)
    let selectinparam: param[] = []
    selectinparam.push({ name: '匹配数据源', type: paramType.complexType, val: null })
    selectinparam.push({ name: '匹配字段', type: paramType.string, val: null })
    selectinparam.push({ name: '勾选/反选', type: paramType.boolean, val: true })
    selectinparam.push({ name: '是否触发勾选事件', type: paramType.boolean, val: true })
    selectinparam.push({ name: '匹配表格字段', type: paramType.string, val: null })
    this.RegisterMethods('勾选指定行', '', this.selectDataArr, selectinparam, null)
    this.RegisterMethods('获取最近一次编辑的数据', '', this.getPreviousEditInfo, this.inparam, null)
    /**表格临时数据源相关方法 */
    this.RegisterMethods('获取表格新增数据', '', this.getAddedDataSource, this.inparam, null)
    this.RegisterMethods('获取表格更新数据', '', this.getUpdatedDataSource, this.inparam, null)
    this.RegisterMethods('获取表格删除数据', '', this.getDeletedDataSource, this.inparam, null)
    let expandinparam: param[] = []
    expandinparam.push({ name: '行数据', type: paramType.string, val: null })
    this.RegisterMethods('展开指定行', '', this.setExpandRow, expandinparam, null)

    let tempinparam: param[] = []
    tempinparam.push({ name: '新增数据', type: paramType.complexType, val: null })
    tempinparam.push({ name: '编辑数据', type: paramType.complexType, val: null })
    tempinparam.push({ name: '删除数据', type: paramType.complexType, val: null })
    this.RegisterMethods('指定临时数据源', '', this.setTempDataSource, tempinparam, null)

    /** 列设置根据列编码来匹配 */
    let columninparam: param[] = []
    columninparam.push({ name: '指定列', type: paramType.string, val: null })
    columninparam.push({ name: '下拉数据源', type: paramType.complexType, val: null })
    this.RegisterMethods('设置列数据源', '用于行编辑中的下拉框的数据源赋值', this.setSelectDataSourceByColumnCode, columninparam, null)

    let rowselectinparam: param[] = []
    rowselectinparam.push({ name: '主键id', type: paramType.string, val: null })
    this.RegisterMethods('设置点击行', '', this.setClickRow, rowselectinparam, null)

    //let childCheckinparam: param[] = []
    this.RegisterMethods('获取子表格选中数据', '', this.getChildCheckRows, this.inparam, null)
    this.RegisterMethods('重置表格数据', '', this.resetDataSource, this.inparam, null)

    let batchDeleteChildinparam: param[] = []
    batchDeleteChildinparam.push({ name: '待删除数据', type: paramType.complexType, val: null })
    this.RegisterMethods('批量删除子表格数据', '', this.batchDeleteChild, batchDeleteChildinparam, null)

    let batchUpdateChildinparam: param[] = []
    batchUpdateChildinparam.push({ name: '待更新数据', type: paramType.complexType, val: null })
    this.RegisterMethods('批量更新子表格数据', '', this.batchUpdateChild, batchUpdateChildinparam, null)

    let setActionCoulumninparam: param[] = []
    setActionCoulumninparam.push({ name: '显示/隐藏', type: paramType.boolean, val: true })
    this.RegisterMethods('设置操作列状态', '', this.setActionCoulumn, setActionCoulumninparam, null)
    this.RegisterMethods('检测是否存在临时数据', '', this.checkIsExistTempData, this.inparam, null)
    this.RegisterMethods('获取子表格当前数据', '', this.getChildCurrentDataSource, this.inparam, null)
    this.RegisterMethods('导出表格当前数据', '', this.exportTableToCsv, this.inparam, null)
    //this.RegisterEvents('列表排序', '', this.inparam, this.outparam)

    // this.RegisterMethods('删除选中数据', '', this.deleteRows, null, null)
    // let rowinparam: param[] = []
    // rowinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    // this.RegisterMethods('删除行', '', this.deleteRow, rowinparam, null)
    // let deletechildparam: param[] = []
    // deletechildparam.push({ name: '主表关联id', type: paramType.string, val: null })
    // deletechildparam.push({ name: '子表id', type: paramType.complexType, val: null })
    // this.RegisterMethods('删除子表数据', '', this.deleteChildRow, deletechildparam, null)
    // let updateparam: param[] = []
    // updateparam.push({ name: '行数据', type: paramType.complexType, val: null })
    // updateparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    // this.RegisterMethods('更新行', '', this.updateRow, updateparam, null)
    // let updatechildparam: param[] = []
    // updatechildparam.push({ name: '主表关联id', type: paramType.string, val: null })
    // updatechildparam.push({ name: '子表数据', type: paramType.complexType, val: null })
    // updatechildparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    // this.RegisterMethods('更新子表数据', '', this.updateChildRow, updatechildparam, null)
    // let addrowinparam: param[] = []
    // addrowinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    // addrowinparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    // this.RegisterMethods('添加行', '', this.addRows, addrowinparam, null)

    // let addchildrowinparam: param[] = []
    // addchildrowinparam.push({ name: '主表关联id', type: paramType.string, val: null })
    // addchildrowinparam.push({ name: '子表行数据', type: paramType.complexType, val: null })
    // addchildrowinparam.push({ name: '验证重复字段', type: paramType.string, val: null })
    // this.RegisterMethods('添加子表数据', '', this.addChildRow, addchildrowinparam, null)

    // this.RegisterMethods('清除临时数据', '', this.dataClear, this.inparam, null)

    // let editinparam: param[] = []
    // editinparam.push({ name: '行数据', type: paramType.complexType, val: null })
    // this.RegisterMethods('开始行内编辑', '', this.rowEditBegin, editinparam, null)
    // this.RegisterMethods('取消行内编辑', '', this.rowEditCancel, editinparam, null)
    // this.RegisterMethods('保存行内编辑', '', this.rowEditSave, editinparam, null)

    // this.RegisterMethods('获取表格当前数据', '', this.getCurrentDataSource, this.inparam, null)
    // this.RegisterMethods('获取子表格新增数据', '', this.getAddedChildDataSource, this.inparam, null)
    // this.RegisterMethods('获取子表格更新数据', '', this.getUpdatedChildDataSource, this.inparam, null)
    // this.RegisterMethods('获取子表格删除数据', '', this.getDeletedChildDataSource, this.inparam, null)

    // this.$on('onPropertyChanged', this.onPropertyChangedInner)

    //表格初始化完成之后绑定分页模型实例，查询一下分页模型信息，然后初始化
    let pagenumber = 1
    let pageSize = 10
    let nameproperty = this.FindPropertyByName(PropertyGroupName.normal, '名称')
    let name = ''
    if (nameproperty && nameproperty.value) {
      name = '-' + nameproperty.value
    }
    let idproperty = this.FindPropertyByName(PropertyGroupName.normal, '唯一Id')
    CurrentApis.GetModelInfoByCode('pageModel').then((res: any) => {
      let modelInfo = res
      //window.console.log('element', modelInfo)
      var newmodelbind: modelBingding = new modelBingding()
      newmodelbind.modelDataType = modelDataTypeEnum.single
      newmodelbind.modelBindingType = 1
      newmodelbind.modelBindingName = modelInfo.modelName + '-' + idproperty.value
      newmodelbind.modelBindingInfo = { name: modelInfo.modelName, modelCode: modelInfo.modelCode, modelId: modelInfo.id }
      newmodelbind.modelDetailInfo = modelInfo
      //window.console.log('newmodelbind121212',newmodelbind)
      // if (!this.parentPage.getModelBindInfo(newmodelbind)) {

      // }
      if (!this.parentPage || !this.parentPage.modelBindings) {
        return
      }
      var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == newmodelbind.modelBindingName)
      //this.FindPropertyByName('表格设置', '当前页码')
      if (!modelBind) {
        this.parentPage.addModelBinding(newmodelbind)
        let tempData = {
          id: 1,
          pageSize: this.FindPropertyByName('表格设置', '每页显示项数').value,
          pageNumber: this.FindPropertyByName('表格设置', '当前页码').value,
        }
        this.parentPage.setModelBindVal(newmodelbind.modelBindingName, tempData)
        //把分页属性绑定到模型实例上面
        var newbindInfo = new bindingModelVal_InProperty()
        newbindInfo.bindType = bindTypeEnum.code
        newbindInfo.modelCodes = [{ code: 'pageSize', codeName: '页大小', modelId: null }]
        newbindInfo.modelName = newmodelbind.modelBindingName
        newbindInfo.propertyId = this.FindPropertyByName('表格设置', '每页显示项数').id
        this.addPropertyModelBind(newbindInfo)
        //this.setModelBindInfo(newbindInfo.modelName,newmodelbind,newbindInfo.propertyId)

        var newbindInfo1 = new bindingModelVal_InProperty()
        newbindInfo1.bindType = bindTypeEnum.code
        newbindInfo1.modelCodes = [{ code: 'pageNumber', codeName: '页索引', modelId: null }]
        newbindInfo1.modelName = newmodelbind.modelBindingName
        newbindInfo1.propertyId = this.FindPropertyByName('表格设置', '当前页码').id
        this.addPropertyModelBind(newbindInfo1)
      }

      //this.parentPage.createModelBindingByModel(element as ModelInfo)
    })
    // var modelBind111 = this.parentPage.modelBindings.find((o) => o.modelBindingName == '分页模型' + nameproperty.value)

    //分页模型实例统一更新默认值
    if (!this.parentPage || !this.parentPage.modelBindings) {
      return
    }
    this.parentPage.modelBindings.forEach((element) => {
      if (element.modelBindingName.indexOf('分页模型') > -1) {
        let tempData = {
          id: 1,
          pageSize: 10,
          pageNumber: this.FindPropertyByName('表格设置', '当前页码').value,
        }
        this.$on('onPropertyChanged', this.onPropertyChangedInner)
        this.parentPage.setModelBindVal(element.modelBindingName, tempData)
      }
    })
    // window.console.log('this.parentPage.modelBindings111111', common.clone(this.parentPage.modelBindings))

    //表格设置 是否显示分页

    var _this = this
    $(document).keydown(function() {
      //window.console.log($(document))
      let key = (window.event as any).keyCode

      //console.log('_this.isZoomInOrOut:', _this.isZoomInOrOut)
      if (key == 38 && (event as any).altKey) {
        //ctrl+上箭头
        if (_this.isZoomInOrOut) {
          window.event.preventDefault()
          let gantt = _this.$refs.gantt as any
          gantt.zoomInOrOut(true)
        }
      }
      if (key == 40 && (event as any).altKey) {
        //ctrl+下箭头
        if (_this.isZoomInOrOut) {
          window.event.preventDefault()
          let gantt = _this.$refs.gantt as any
          gantt.zoomInOrOut(false)
        }
      }
      if (key == 72 && (event as any).altKey) {
        //ctrl+H
        if (_this.isZoomInOrOut) {
          window.event.preventDefault()
          _this.isDepend = !_this.isDepend
        }
      }
    })
  }

/*******************表格相关数据与方法***************************/
  get showSelection(): boolean {
    return false
  }
  get isTree(): boolean {
    return false
  }
  get showOverflow(): boolean {
    return true
  }
  select(selection: any) {
    //window.console.log('selection', selection)
  }
  headerCellStyle({ column, columnIndex }): any {
    // var height = this.dateHeaderHeight * 2 - 1 //减一是为了左右行对齐（因为有1px误差）
    var height = this.dateHeaderHeight - 3 //减一是为了左右行对齐（因为有1px误差）
    if (this.showOverflow) {
      height += 1
    } else {
      height -= 23
    }
    return {
      height: height + 'px',
      'line-height': height + 'px',
      'font-size': this.tableHeaderFontSize + 'px !important',
      'background-color': this.dateBackgroundColor,
      'border-top': '1px solid ' + this.dateBorderColor,
      'border-bottom': '2px solid ' + this.dateBorderColor,
      'border-left': '0px solid #0000',
      'border-right': '0px solid #0000',
    }
  }
  handleScroll({ scrollTop }) {
    //左侧滑块滑动--带动---右侧甘特图的滑块滑动
    if (this.tableScrollFlag) {
      this.ganttScrollFlad = false
      let gantt = this.$refs.gantt as any
      let chartBody = gantt.$refs.chartBody as any
      chartBody.scrollTop = scrollTop

      //为了解决左侧滑块滑动时，右侧鼠标离开事件执行延迟导致悬浮任务条离开时颜色未改变的问题
      this.handleMouseOut()

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.ganttScrollFlad = true
      }, 500)
    }
  }
  handleTableScroll(scrollTop) {
    //右侧甘特图的滑块滑动--带动---左侧滑块滑动
    if (this.ganttScrollFlad) {
      this.tableScrollFlag = false
      let table = this.$refs.table as any
      table.$refs.xTable3.scrollTo(table.$refs.xTable3.scrollLeft, scrollTop)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.tableScrollFlag = true
      }, 500)
    }
  }
  //分页信息改变通知属性
  changePage(pageNumber: any, pageSize: any, istriggerEvent: boolean = true) {
    var page = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var size = this.FindPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')
    let propBind = this.getPropertyBindInfo(page.id)
    if (propBind) {
      var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == propBind.modelName)
      if (modelBind) {
        var tempData = {
          pageSize: pageSize,
          pageNumber: pageNumber,
        }
        this.parentPage.setModelBindVal(propBind.modelName, tempData)
      }
    }
    page.value = pageNumber
    size.value = pageSize
    //this.SetPropertyVal(page.id,pageNumber)
    //window.console.log('propBind',propBind)
    //window.console.log('----------------------------------------------进入刷新方法')
    if (istriggerEvent) {
      this.TriggeEvent('列表刷新', null)
    }
  }
  refreshData(pagenumber: number) {
    //window.console.log('---------------------------------刷新当前页行为执行完成之后pagenumber111', pagenumber)
    var page = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var size = this.FindPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')
    page.value = pagenumber
    //this.TriggeEvent('列表刷新', null)
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
    var tmodel = this.getModel().modelOrders
    if (tmodel.length > 0) {
      tmodel.splice(0, 1)
    }
    if (orderInfo.length > 0) {
      orderInfo[0].val = orderInfo[0].type === 'DESC' ? true : false
      //window.console.log('orderInfo[0].val',orderInfo[0])
      tmodel.push(orderInfo[0])
    }
    //this.TriggeEvent('列表排序', inparam)
    this.TriggeEvent('列表刷新', null)
  }
  //表格展开事件
  expand(row: any) {
    //window.console.log('--------------------------------展开行属性xxxxxxxxx-----------------', row)
    var prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '展开行')
    if (prop) {
      //window.console.log('--------------------------------展开的行赋值-----------------', row)
      this.SetPropertyVal(prop.id, row[this.rowIdName])
    }
    //window.console.log('--------------------------------展开行属性-----------------', prop)
    let temp = this.oldAllChildDataSource.find((item) => item.key == row[this.rowIdName])
    let tempprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
    let tempnew = this.allChildDataSource.find((item) => item.key == row[this.rowIdName])
    if (temp && temp.value && temp.value.length > 0 && tempprop.value == true) {
      //window.console.log('--------------------------------展开的行信息temp-----------------', temp)
      this.$nextTick(() => {
        //window.console.log('--------------------------------展开dom进入-----------------', temp)
        this.childdataSource = []
        this.$nextTick(() => {
          this.childdataSource = temp.value
        })
      })
    } else if (tempnew && tempnew.value && tempnew.value.length > 0 && tempprop.value == true) {
      this.$nextTick(() => {
        this.childdataSource = []
        this.$nextTick(() => {
          this.childdataSource = tempnew.value
        })
      })
    } else {
      this.$nextTick(() => {
        let childdataProp = this.FindPropertyByName(PropertyGroupName.normal, '子表格数据源')
        this.SetPropertyVal(childdataProp.id, [])
        //this.childdataSource = []
        // if (childdataProp.value && childdataProp.value.content && childdataProp.value.content.length > 0) {
        //   //暂时先注释掉
        //   this.changeChildData(childdataProp)
        // }
        //this.isExpand = true

        this.$nextTick(() => {
          this.TriggeEvent('表格展开', row)
        })
      })
    }
  }
  childItemSelect(value: any, isChecked: boolean) {
    //window.console.log('------------------------------------当前选中行121212', value)
    let isSelectproperty = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    // let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    // if (!chooseType || chooseType.value === '否') {
    //   return
    // }
    let isCanCheck = this.tableStyle.child.isCanCheck
    // let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
    // let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
    // if (!isCanCheck) {
    //   let val = { modelCode: this.getModelCode(true), data: common.clone(value) }
    //   this.SetPropertyVal(property.id, val)
    //   this.SetPropertyVal(prop.id, common.clone(value))
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
    //   this.SetPropertyVal(property.id, val)
    // }
    // window.console.log('当前子表格选中行', property.value.data)
    // this.SetPropertyVal(isSelectproperty.id, value.length <= 0)

    //更新子表格选中变量
    if (isChecked) {
      if (isCanCheck) {
        let temp = this.childCheckRows.find((item) => item[this.childRowIdName] === value[this.childRowIdName])
        if (!temp) {
          this.childCheckRows.push(value)
        }
        this.TriggeEvent('勾选行', common.clone(value))
      } else {
        this.childCheckRows = []
        this.childCheckRows.push(value)
        this.TriggeEvent('勾选行', common.clone(value))
      }
    } else {
      if (isCanCheck) {
        let tempIndex = this.childCheckRows.findIndex((item) => item[this.childRowIdName] === value[this.childRowIdName])
        if (tempIndex > -1) {
          this.childCheckRows.splice(tempIndex, 1)
        }
        this.TriggeEvent('取消勾选行', common.clone(value))
      }
    }
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
    //this.TriggeEvent('行编辑结束', common.clone(currentRow))
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录allChildDataSource', this.allChildDataSource)
    //window.console.log('-------------------------------------------------------子表格行编辑结束记录', this.allChildDataSourceNoGroup)
  }

/*******************表格与甘特图之前的间隔的相关数据与方法***************************/
  handleMousedown(event) {
    document.body.style.cursor = 'move'
    event.stopPropagation()
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
    this.tableMinWidth = 34
    this.column.forEach((child) => {
      if (child.isShow) {
        if (child.width) {
          this.tableMinWidth += parseInt(child.width)
        } else {
          this.tableMinWidth += 40
        }
      }
    })
    this.initOffset = event.pageX - event.srcElement.getBoundingClientRect().left
    this.canMove = true
    event.preventDefault()
  }
  handleMousemove(event) {
    if (!this.canMove) return
    let ganttAll = this.$refs.ganttAll as any
    const outerRect = ganttAll.getBoundingClientRect()
    let leftWidth = event.pageX - this.initOffset - outerRect.left
    this.tableWidth = leftWidth >= this.tableMinWidth ? leftWidth : this.tableMinWidth
  }
  handleMouseup() {
    this.canMove = false
    document.body.style.cursor = ''
  }
/*******************甘特图相关数据与方法***************************/
  get chartDateWidth(): number {
    let width = this.isShowSpace ? this.width - this.tableWidth - this.spaceWidth - 20 : this.width - this.tableWidth - 20
    return width >= 0 ? width : 0
  }
  set chartDateWidth(val) {
    // var property = this.FindPropertyByName(PropertyGroupName.special, '甘特图宽度')
    // this.SetPropertyVal(property.id, val)
  }
  get ganttMove(): boolean {
    return false
  }

/*******************导出弹窗相关数据与方法***************************/
  clearClickRow() {
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any

    gridLine.reColorDueToDateChange()
    this.handleMouseOut()

    let table = this.$refs.table as any
    table.currentSelectedRowID = ''
  }
  print(result: any) {
    var resultArr = result.arr
    //清空选中的数据
    this.clearClickRow()

    var printM = this.$refs.export as any
    var dataType = result.type
    //dataType===0  //全部数据 dataType===1 //当前数据

    let index = 0
    if ($(`.ganttPdf`)[0].className.indexOf('container') >= 0) {
      index = 1
    }
    var oldwidth = this.width
    var gantt = this.$refs.gantt as any
    var table = this.$refs.table as any
    var xTable = table.$refs.xTable3 as any
    if (dataType === 0) {
      gantt.handlerExportExpand('export-before')
      var copyFilter = []
      copyFilter = [...this.filter]
      this.filter = []
      this.dataSource = gantt.taskList
      this.handlerColumn(resultArr, 'before')
      this.$nextTick(() => {
        xTable.setAllTreeExpansion(true)
        gantt.handlerExportExpand('export-before')
        var wrapper = gantt.$refs.wrapper as any
        var newheight = (wrapper.computedList.length + 1) * this.rowHeight + this.dateHeaderHeight
        var oldheight = this.height
        this.height = newheight
        var newtablewidth = $('.vxe-body--row')[0].offsetWidth
        var newganttwidth = $('.gridForm')[0].offsetWidth
        this.width = newtablewidth + newganttwidth + (this.isShowSpace ? this.spaceWidth : 0)
        var oldtablewidth = this.tableWidth
        this.tableWidth = newtablewidth
        var oldganttwidth = this.chartDateWidth
        this.chartDateWidth = newganttwidth
        this.$nextTick(() => {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.getPdf('ganttPdf', 'ganttPdf', index)
            this.filter = copyFilter
            this.filters()
            this.width = oldwidth
            this.height = oldheight
            this.tableWidth = oldtablewidth
            this.chartDateWidth = oldganttwidth
            gantt.handlerExportExpand('export-after')
            table.handlerExportExpand(gantt.showList)
            this.handlerColumn(this.copyColumn, 'after')
          }, 500)
        })
      })
    } else {
      this.handlerColumn(resultArr, 'before')
      xTable.setAllTreeExpansion(true)
      gantt.handlerExportExpand('export-before')
      var wrapper = gantt.$refs.wrapper as any
      var count = 0
      wrapper.computedList.forEach((child) => {
        if (child.isShow === true) count++
      })
      var newheight = (count + 1) * this.rowHeight + this.dateHeaderHeight
      var oldheight = this.height
      this.height = newheight
      var newtablewidth = $('.vxe-body--row')[0].offsetWidth
      var newganttwidth = $('.gridForm')[0].offsetWidth
      this.width = newtablewidth + newganttwidth + (this.isShowSpace ? this.spaceWidth : 0)
      var oldtablewidth = this.tableWidth
      this.tableWidth = newtablewidth
      var oldganttwidth = this.chartDateWidth
      this.chartDateWidth = newganttwidth
      this.$nextTick(() => {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.getPdf('ganttPdf', 'ganttPdf', index)
          this.width = oldwidth
          this.height = oldheight
          this.tableWidth = oldtablewidth
          this.chartDateWidth = oldganttwidth
          gantt.handlerExportExpand('export-after')
          table.handlerExportExpand(gantt.showList)
          this.handlerColumn(this.copyColumn, 'after')
        }, 500)
      })
    }
  }
  handlerColumn(columnInfo, type) {
    if (!columnInfo || columnInfo.length == 0) return
    if (type === 'before') {
      this.copyColumn = []
      this.column.forEach((child) => {
        this.copyColumn.push({ isShow: child.isShow })
      })
    }
    this.column.forEach((child, index) => {
      child.isShow = columnInfo[index].isShow
      this.$set(child, 'isShow', columnInfo[index].isShow)
    })
  }
  getPdf(id, title, index) {
    var _this = this
    var printWindow = window.open()
    var gantt = this.$refs.ganttAll as any
    html2Canvas(gantt, {
      // allowTaint: true
      useCORS: true, //看情况选用上面还是下面的，
    }).then(function(canvas) {
      var compress = document.createElement('canvas')
      compress.width = canvas.width
      compress.height = canvas.height
      var imageStr = canvas.toDataURL('image/png')
      var image = new Image()
      image.src = imageStr
      image.onload = function() {
        compress.getContext('2d').drawImage(image, 0, 0, compress.width, compress.height, 0, 0, compress.width, compress.height)
        var width = (canvas.width * 1080) / canvas.height
        var height = (canvas.height * 765) / canvas.width
        var imgString = compress.toDataURL('image/png')
        printWindow.document.open()
        if (canvas.height > canvas.width) {
          printWindow.document.write("<br><img src='" + imgString + "' style='width:" + width + "px;height:1080px' />")
        } else {
          printWindow.document.write("<br><img src='" + imgString + "' style='width:765px;height:" + height + "px' />")
        }
        printWindow.document.close()
        printWindow.onload = function() {
          printWindow.print()
        }
        printWindow.focus()
      }
    })
  }

  private getTableStyle(): tableStyle {
    var etableStyle = new tableStyle()
    etableStyle.canChoose = this.tableStyle ? this.tableStyle.canChoose : 0
    etableStyle.showIndex = this.tableStyle ? this.tableStyle.showIndex : false
    etableStyle.resizable = this.tableStyle ? this.tableStyle.resizable : true
    etableStyle.border = this.tableStyle ? this.tableStyle.border : true
    etableStyle.stripe = this.tableStyle ? this.tableStyle.stripe : true
    etableStyle.showheader = this.tableStyle ? this.tableStyle.showheader : true
    etableStyle.hasChildData = this.tableStyle ? this.tableStyle.hasChildData : false
    etableStyle.orderType = this.tableStyle ? this.tableStyle.orderType : false
    etableStyle.orderCode = this.tableStyle ? this.tableStyle.orderCode : null
    etableStyle.isCanCheck = this.tableStyle ? this.tableStyle.isCanCheck : true
    etableStyle.columnInfos = []
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
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
              etableStyle.columnInfos.push(col)
            }
          })
        }
      }
    }

    //添加子表格数据源模型实例
    prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        etableStyle.child = this.getChildTableStyle(propBind)
      }
    }
    var actionColumn = this.tableStyle.columnInfos.find((item) => item.field === 'action')
    if (!actionColumn) {
      actionColumn = new columnInfo()
      actionColumn.title = '操作'
      actionColumn.field = 'action'
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
    var proper = this.FindPropertyByName(propertyGroupEnum.columnSetting, '列样式')
    if (proper) {
      if (proper.value) {
        return proper.value
      }
      return proper.value
    }
  }

/*************************************内部调用的方法***************************************************/
  /** 页面加载完成之后执行 */
  protected   loadCompleted(childrenData: any[]) {
    //var id = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource).id
    //const aaa = this.getPropertyBindInfo(id).modelCodes
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    var modelInfo = null
    if (prop) {
      let propBind = this.getPropertyBindInfo(prop.id)
      if (propBind) {
        modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      }
    }
    var childprop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
    var childmodelInfo = null
    if (childprop) {
      let propBind = this.getPropertyBindInfo(childprop.id)
      if (propBind) {
        childmodelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
      }
    }

    //window.console.log('------------------------------打印出来当前表格modelInfo', modelInfo)
    let property = this.FindPropertyByName(propertyGroupEnum.columnSetting, '列样式')
    if (property.value && property.value.columnInfos.length > 0) {
      let tempStyle = property.value as tableStyle
      tempStyle.columnInfos.forEach((element) => {
        if (element.colTemplateData) {
          element.colTemplateData.modelCode = this.getModelCode()
        }
        if (modelInfo && modelInfo.modelDetailInfo && modelInfo.modelDetailInfo.modelPropertyList) {
          //let detailInfo = modelInfo.modelDetailInfo
          var modelPropertyDetail = modelInfo.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === element.field)
          if (modelPropertyDetail) {
            element.columnType = modelPropertyDetail.propertyType
            element.dictId = modelPropertyDetail.dictId
            element.propertyDetail = modelPropertyDetail
          }
        }
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
    let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    // if (!chooseType || chooseType.value === '多选') {
    // if (chooseType || chooseType.value === '多选') {
    //   chooseType.value = this.tableStyle.canChoose === 0 ? '否' : this.tableStyle.canChoose === 1 ? '多选' : '单选'
    // }

    let model = this.getModel()
    model.modelOrders = []
    if (this.tableStyle.orderCode) {
      // var tmodel = this.getModel().modelOrders
      // if (tmodel.length > 0) {
      //   tmodel = []
      // }
      model.modelOrders.push({ code: this.tableStyle.orderCode, val: !this.tableStyle.orderType })
    }
    //window.console.log('------------------------------model', model)

    //this.rowIdName = detailInfo.modelRelationList[0].modelAlias+'__id'
    // var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      this.initDefaultData(prop, false)
    }

    if (childprop) {
      this.initDefaultData(childprop, true)
    }

    //window.console.log('初始化完成完成tableStyle', this.tableStyle)
    this.column = this.tableStyle.columnInfos
    // this.isDesign = !this.IsDesigning
    this.tempDataClear()
    //window.console.log('this.column', this.column)
    //保证变更只触发一次
    this.$off('onPropertyChanged')
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    //兼容之前的数据
    let propDataSource = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源')
    if (propDataSource.value === true) {
      propDataSource.value = []
    }
    // this.SetPropertyVal(propDataSource.id,[])
    // let cloneValue = common.clone(propDataSource.value)
    // this.initDataSource(cloneValue)

  }
  private initDefaultData(prop: any, ischild: boolean) {
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
                  type: 'EQ',
                },
              ],
              modelCode: 'DictView',
            }
            let tempItem = []
            if (dictId) {
              let ttt = CurrentApis.simpleQueryView_Sync(param) as any
              //window.console.log('--------------------------------ttt', ttt)

              ttt.forEach((single) => {
                tempItem.push({
                  itemName: single.sys_dict_view_item__item_name,
                  itemValue: single.sys_dict_view_item__item_value + '',
                  itemCode: single.sys_dict_view_item__item_code,
                })
              })
            }
            if (!this.dictItemArr.find((item) => item.propertyCode == modelPropertyDetail.propertyCode)) {
              this.dictItemArr.push({
                dictId: modelPropertyDetail.dictId,
                propertyCode: modelPropertyDetail.propertyCode,
                columnType: modelPropertyDetail.propertyType,
                item: tempItem,
              })
            }
          }
        }
      })
    }
  }
  private initDataSource(cloneValue: any) {
    let totalSize = this.FindPropertyByName(propertyGroupEnum.tableSetting, '总条数')
    if (Object.keys(cloneValue).length == 0) {
      this.dataSource = []
      totalSize.value = 0
      let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
      var val = { modelCode: this.getModelCode(), data: {} }
      this.SetPropertyVal(property.id, val)
      //如果没查询到数据，页码重置会第一页，执行刷新方法
      // let currentPage = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
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
      this.dataSource = common.clone(tempValue)
    } else {
      this.dataSource = []
      //如果没查询到数据，页码重置会第一页，执行刷新方法，只有查询的结构才会重置，不分页的不需要查询
      let isshowPage = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')
      if (cloneValue.content && isshowPage && isshowPage.value == true) {
        let currentPage = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
        currentPage.value = 1
        this.changePage(1, this.pageSize)
      }
    }
    var isRefresh = false
    if (this.dataSource.length > 0) {
      let ids = CurrentApis.GetUniqueIds(this.dataSource.length)
      let index = 0
      //判断数据，并修复数据
      this.dataSource.forEach((element) => {
        if (element[this.rowIdName] == undefined) {
          element[this.rowIdName] = ids[index]
          index++
          isRefresh = true
        }
      })
    }
    if (isRefresh) {
      let dataproperty = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源')
      dataproperty.value.content = common.clone(this.dataSource)
      this.SetPropertyVal(dataproperty.id, dataproperty.value)
    }
    let isSelectproperty = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    this.SetPropertyVal(isSelectproperty.id, true)
  }
  /** 属性表更方法 */
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    //window.console.log('onPropertyChangedInner')
    //window.console.log(property)
    var page = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')
    var pageSize = this.FindPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')

    switch (property.propertyName) {
      case '绑定模型':
        if (this.IsDesigning == true) {
          var property11 = this.FindPropertyByName(propertyGroupEnum.columnSetting, '列样式')
          property11.value = this.getTableStyle()
          //this.tableStyle = property11.value
          //window.console.log('----------------------------------列样式赋值', property11)
          //window.console.log('--------------this.bindInfos', this.bindInfos)
          //window.console.log('--------------绑定模型变更', property)
          var aaa = this.FindPropertyByName(propertyGroupEnum.tableSetting, '展开行')
          //window.console.log('--------------展开行属性', aaa)
        }
        //this.tableStyle = this.getTableStyle()
        break
      case '表格数据源':

        //数据源变更之后，新增编辑删除的数据源要清空
        this.tempDataClear()
        if (property.value) {
          var taskItem = []
          if (property.value.content) {
            taskItem = JSON.parse(JSON.stringify(property.value.content))
          } else if (property.value) {
            taskItem = JSON.parse(JSON.stringify(property.value))
          }
          this.task = this.handlerTask(taskItem)
          // this.reload()
          // window.console.log("fxlshujuyuan")
          // window.console.log(this.task)
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
        // ;(this.$refs['table'] as any).clearRowExpand()
        // var childprop = this.FindPropertyByName(PropertyGroupName.normal, '子表格数据源')
        // this.SetPropertyVal(childprop.id, [])
        break
      case '子表格数据源':
        //window.console.log('--------------子表格数据源变更', property.value)
        if (property.value) {
          var prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '展开行')
          if (prop) {
            let temp = this.oldAllChildDataSource.find((item) => item.key == prop.value)
            var tempprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
            if (tempprop && tempprop.value == false) {
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
              if (this.childdataSource instanceof Array && this.childdataSource.length > 0) {
                this.oldAllChildDataSourceNoGroup = this.oldAllChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
                this.allChildDataSourceNoGroup = this.allChildDataSourceNoGroup.concat(common.clone(this.childdataSource))
              }
              //window.console.log('--------------子表格数据源变更temp-allChildDataSource', common.clone(this.allChildDataSource))
              //window.console.log('--------------子表格数据源变更temp-allChildDataSourceNoGroup', common.clone(this.allChildDataSourceNoGroup))
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
        // this.TriggeEvent('列表刷新', [
        //   { name: 'pageNumber', type: 'Number', val: page.value },
        //   { name: 'pageSize', type: 'Number', val: pageSize.value },
        // ])
        break
      case '是否显示分页':
        // var isshowPage = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')
        // this.showPagination = isshowPage.value
        break
      case '列样式':
        if (this.IsDesigning == true) {
          var tempStyle = property.value as tableStyle
          tempStyle.columnInfos.forEach((element) => {
            if (element.colTemplateData) {
              element.colTemplateData.modelCode = this.getModelCode()
            }
          })
          this.tableStyle = tempStyle
        }
        break
      case '是否可选':
        var property111 = this.FindPropertyByName(propertyGroupEnum.columnSetting, '列样式')
        if (property111) {
          var temp = common.clone(property111.value)
          temp.canChoose = property.value === '否' ? 0 : property.value === '多选' ? 1 : 2
          this.tableStyle = temp
          property111.value = temp
          //this.SetPropertyVal(property111.id,temp)
        }
        break
      case '是否树表格':
        var property1111 = this.FindPropertyByName(propertyGroupEnum.columnSetting, '列样式')
        if (property1111) {
          var temp1 = common.clone(property1111.value)
          //temp1.canChoose = property.value === '否' ? 0 : property.value === '多选' ? 1 : 2
          if (property.value) {
            ;(temp1 as tableStyle).hasChildData = true
          } else {
            ;(temp1 as tableStyle).hasChildData = false
          }
          //this.tableStyle = temp1
          this.SetPropertyVal(property1111.id, temp1)
        }
        break
      default:
        break
    }
  }
  async reload() {
    this.isReload = false
    //window.console.log('this.isReload', this.isReload)
    await this.$nextTick()
    this.isReload = true
    //window.console.log('this.isReload', this.isReload)
  }
  /** 自动触发选择，不触发勾选事件 */
  itemSelect(value: any[]) {
    //window.console.log('------------------------------------当前选中行121212', value)
    let isSelectproperty = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否有选中行')
    if (value.length === 0) {
      this.SetPropertyVal(isSelectproperty.id, true)
      // return
    }
    let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
    if (!chooseType) {
      return
    }
    let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
    let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
    if (chooseType.value === '单选' || chooseType.value === '否') {
      // if (value.length > 0) {

      // }
      let val = { modelCode: this.getModelCode(), data: common.clone(value.length > 0 ? value[0] : {}) }
      this.SetPropertyVal(property.id, val)
      this.SetPropertyVal(prop.id, common.clone(value.length > 0 ? value[0] : {}))
      //关联的模型实例的值也要改掉，根据属性关联更新模型实例有点问题，暂时先这么处理
      let propBind = this.getPropertyBindInfo(property.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        modelInfo.val = common.clone(val)
      }
    } else {
      let val = { modelCode: this.getModelCode(), data: common.clone(value) }
      this.SetPropertyVal(property.id, val)
      this.SetPropertyVal(prop.id, common.clone(value))
      let propBind = this.getPropertyBindInfo(property.id)
      if (propBind) {
        let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
        modelInfo.val = val
      }
    }
    //window.console.log('当前选中行', property.value)
    this.SetPropertyVal(isSelectproperty.id, value.length <= 0)
    //window.console.log('--------------------当前是否有选中行', property.value)
    //window.console.log('--------this.parentPage.modelBindingsmodelBindings', common.clone(this.parentPage.modelBindings))
  }
  tempDataClear() {
    let addeddata = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    if (addeddata) {
      addeddata.value = []
    }
    let updateddate = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    if (updateddate) {
      updateddate.value = []
    }
    let deleteddate = this.FindPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    if (deleteddate) {
      deleteddate.value = []
    }
    this.dataSource = []
  }

  getModelCode(ischild: boolean = false) {
    let tempModelCode = ''
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (ischild) {
      prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
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
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (ischild) {
      prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.childdatasource)
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

  /** 变更子表格数据源 */
  changeChildData(property: any) {
    if (property.value) {
      var prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '展开行')
      if (prop) {
        let temp = this.oldAllChildDataSource.find((item) => item.key == prop.value)
        var tempprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '子表格是否缓存数据')
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
  private handlerTask(item: Array<any>) {
    item.forEach((child) => {
      child.isShow = true
      if (child.children && child.children.length > 0) {
        child.isexpand = true
        this.handlerTask(child.children)
      }
    })
    return item
  }

  //拖拽方法
  treeDrop() {
    this.$nextTick(() => {
      let table = this.$refs.table as any
      if (table === undefined) return
      let xTable = table.$refs.xTable3 as any
      if (xTable === undefined) return
      this.sortable2 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
        handle: '.drag-btn',
        filter: '.filterDrag',
        disabled: !this.disable,
        onChoose: ({ item }) => {
          // evt.oldIndex;  // element index within parent
          let chooseRow = xTable.getRowNode(item).item
          this.TriggeEvent('选中拖拽行事件', common.clone(chooseRow))
          this.showAble = true
        },
        onUnchoose: ({ item }) => {
          // same properties as onEnd
          this.showAble = false
        },
        onStart: ({ item, oldIndex }) => {
          let gantt = this.$refs.gantt as any
          let gridLine = gantt.$refs.gridLine as any
          gridLine.reColorDueToDateChange()
          this.handleMouseOut()
          table.currentSelectedRowID = ''
          table.currentHoveredRowID = ''
        },
        onEnd: ({ item, oldIndex, newIndex }) => {
          this.showAble = false
          this.handleMouseOut()
          // options:子节点所在对象
          let options = { children: 'children' }
          // item:选中的html行元素
          // oldIndex:在整个表格中的行数(从0开始)
          let targetTrElem = item
          let wrapperElem = targetTrElem.parentNode
          // previousElementSibling：属性返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）
          let prevTrElem = targetTrElem.previousElementSibling
          let tableTreeData = this.dataSource
          let selfRow = xTable.getRowNode(targetTrElem).item
          // let gantt = this.$refs.gantt as any
          // let getOldIndex = gantt.getComputedListIndexShow(selfRow)
          // selfRow:选中的元素
          // selfNode包含{item:当前节点,items:包含自己在内的所有兄弟节点,nodes:从根节点到当前节点所经过的所有节点,parent:父节点,path:到达当前节点所经过的路径}
          let selfNode = XEUtils.findTree(tableTreeData, (row) => row === selfRow, options)
          if (prevTrElem) {
            //window.console.log('移动到节点')
            // 移动到节点
            let prevRow = xTable.getRowNode(prevTrElem).item
            let prevNode = XEUtils.findTree(tableTreeData, (row) => row === prevRow, options)
            if (XEUtils.findTree(selfRow[options.children], (row) => prevRow === row, options)) {
              // 错误的移动
              let oldTrElem = wrapperElem.children[oldIndex]
              wrapperElem.insertBefore(targetTrElem, oldTrElem)
              //window.console.log('错误的移动')
              return
              // return this.$XModal.message({ message: '不允许自己给自己拖动！', status: 'error' })
            }
            let currRow = selfNode.items.splice(selfNode.index, 1)[0]

            let gantt = this.$refs.gantt as any
            let wrapper = gantt.$refs.wrapper as any
            //window.console.log('prevRow:', prevRow)
            let dropFlag = xTable.isTreeExpandByRow(prevRow)
            let dropfl = false
            if (dropFlag === false) {
              if (prevRow.type != 'task' && prevRow.children && prevRow.children.length === 0) {
                dropFlag = true
                dropfl = true
              }
            }
            // if (xTable.isTreeExpandByRow(prevRow)) {
            if (dropFlag) {
              // 移动到当前的子节点
              // window.console.log('移动到子节点')
              // this.delete(selfRow, null)

              // let result = gantt.checkDrop(selfRow, prevRow, currRow, 'in', this.dropProperty)
              let moveRow = this.getMoveTaskPre(selfRow, prevRow, 'in', wrapper)
              //window.console.log('移动前this.checkDropResult:', this.checkDropResult)
              this.TriggeEvent('拖动校验事件', moveRow)
              //window.console.log('移动后this.checkDropResult:', this.checkDropResult)
              if (this.checkDropResult) {
                prevRow[options.children].splice(0, 0, currRow)
                gantt.drop(selfRow, prevRow, currRow, 'in', null, null, 'add')
                if (dropfl) {
                  //window.console.log('prevRow.id:', prevRow.id)
                  gantt.handlerExpand(prevRow.id, false)
                }
              } else {
                selfNode.items.splice(selfNode.index, 0, currRow)
                let backIndex = oldIndex
                if (oldIndex > newIndex) {
                  backIndex++
                }
                let oldTrElem = wrapperElem.children[backIndex]
                wrapperElem.insertBefore(targetTrElem, oldTrElem)
                // xTable.refreshData()
                this.handleMouseOut() //解决右侧鼠标离开不及时的问题
              }
            } else {
              // 移动到相邻节点
              // window.console.log('移动到相邻节点')

              // this.delete(selfRow, null)
              // let result = gantt.checkDrop(selfRow, prevRow, currRow, 'side', this.dropProperty)
              let moveRow = this.getMoveTaskPre(selfRow, prevRow, 'side', wrapper)
              //window.console.log('移动前this.checkDropResult:', this.checkDropResult)
              this.TriggeEvent('拖动校验事件', moveRow)
              //window.console.log('移动后this.checkDropResult:', this.checkDropResult)
              if (this.checkDropResult) {
                let index = prevNode.index + (selfNode.index < prevNode.index ? 0 : 1)
                prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, currRow)
                gantt.drop(selfRow, prevRow, currRow, 'side', index, null, 'add')
              } else {
                selfNode.items.splice(selfNode.index, 0, currRow)
                let backIndex = oldIndex
                if (oldIndex > newIndex) {
                  backIndex++
                }
                let oldTrElem = wrapperElem.children[backIndex]
                wrapperElem.insertBefore(targetTrElem, oldTrElem)
                // xTable.refreshData()
                this.handleMouseOut() //解决右侧鼠标离开不及时的问题
              }
            }
          } else {
            // 移动到第一行
            // xTable.refreshData()
            let backIndex = oldIndex
            if (oldIndex > newIndex) {
              backIndex++
            }
            let oldTrElem = wrapperElem.children[backIndex]
            wrapperElem.insertBefore(targetTrElem, oldTrElem)
            return
          }
          // 如果变动了树层级，需要刷新数据
          //window.console.log('变动了树层级')
          // xTable.refreshData()
        },
      })
    })
  }
  getMoveTaskPre(selfRow: any, prevRow: any, type: any, wrapperComp: any) {
    //获取拖动的行，以及拖动后的前置任务
    let selfResult = wrapperComp.getTask(selfRow.id)
    let prevResult
    if (type === 'in') {
      prevResult = wrapperComp.getTask(prevRow.id)
    } else if (type === 'side') {
      prevResult = wrapperComp.getTask(prevRow.parentId)
    }
    let result: any = {}
    result.row = selfResult
    result.prevRow = prevResult
    result.checkResult = true
    return result
  }
  handleMouseOut() {
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any
    let obj = { id: '' }
    obj.id = gridLine.hoverRowID
    gridLine.handleMouseout(obj)
    gridLine.hoverRowID = ''
    gridLine.hoverRowBGColor = ''
  }
  //准备数据，根据类型来更新对应属性
  prepareData(operateType: string) {
    let prop = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源')
    let olddata = prop.value.content
    if (!olddata) {
      olddata = prop.value
    }
    if (!olddata || !(olddata instanceof Array)) {
      olddata = []
      //this.SetPropertyVal(prop.id,[])
    }
    let resadddata = []
    let resupdatedata = []
    let resdeletedata = []
    //新增，旧数据没有，新数据有
    if (!olddata) {
      resadddata = common.clone(this.dataSource)
    } else {
      this.dataSource.forEach((element) => {
        const addDatas = olddata.filter((item) => item[this.rowIdName] == element[this.rowIdName])
        if (!addDatas || addDatas.length === 0) {
          resadddata.push(element)
        }
      })
    }
    //编辑，旧数据有，新数据有
    if (olddata && this.dataSource) {
      this.dataSource.forEach((element) => {
        const updateDatas = olddata.filter((item) => item[this.rowIdName] == element[this.rowIdName])
        if (updateDatas && updateDatas.length > 0) {
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
          const deleteDatas = this.dataSource.filter((item) => item[this.rowIdName] == element[this.rowIdName])
          if (!deleteDatas || deleteDatas.length === 0) {
            resdeletedata.push(element)
          }
        })
      }
    }
    //联动的操作需要把之前的临时数据同步处理
    let addprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    addprop.value = resadddata
    let updateprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    updateprop.value = resupdatedata
    let deleteprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    deleteprop.value = resdeletedata

    //记录变更
    //window.console.log('-------------------------------------------------------临时数据变更新增', addprop)
    //window.console.log('-------------------------------------------------------临时数据变更编辑', updateprop)
    //window.console.log('-------------------------------------------------------临时数据变更删除', deleteprop)
    //删除之后，检查选中行的数据
    if (operateType === '删除') {
      let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
      if (!chooseType) {
        return
      }
      if (this.dataSource.length === 0) {
        this.itemSelect([])
        return
      }
      let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
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
  //定位任务条
  localTask(item: any){
    let gantt = this.$refs.gantt as any
    if(item.type === 'task'){
      gantt.localTask(item.id)
    }
  }

/**************************左侧表格相关公开的参数 */
  get currentPage(): any {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前页码').value
    } else {
      return 1
    }
  }
  get pageSize(): any {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '每页显示项数').value
    } else {
      return 10
    }
  }
  get total(): any {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '总条数')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '总条数').value
    } else {
      return 0
    }
  }
  get tableRowFontColor(): string {
    if (this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体颜色')[0].value as string
      }
    }
    return '#000000'
  }
  get tableCellFontSize(): string {
    if (this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体大小')[0].value) {
        return this.FindProperties(propertyGroupEnum.tableSetting, '表格行字体大小')[0].value + 'px'
      }
    }
    return '14px'
  }
  get tableHeaderFontSize(): number {
    if (this.FindProperties(propertyGroupEnum.tableSetting, '表格标题字体大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.tableSetting, '表格标题字体大小')[0].value) {
        return this.FindProperties(propertyGroupEnum.tableSetting, '表格标题字体大小')[0].value
      }
    }
    return 17
  }
  get emptyTip(): string {
    if (this.FindPropertyByName(propertyGroupEnum.tableDisplaySetting, '表格为空时显示文本')) {
      return this.FindPropertyByName(propertyGroupEnum.tableDisplaySetting, '表格为空时显示文本').value
    } else {
      return '暂无数据'
    }
  }
  get showPagination(): boolean {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示分页').value
    }
    return false
  }
  get showHeader(): boolean {
    if (this.FindPropertyByName(propertyGroupEnum.tableDisplaySetting, '是否显示表头')) {
      return this.FindPropertyByName(propertyGroupEnum.tableDisplaySetting, '是否显示表头').value
    } else {
      return true
    }
  }
  //是否显示刷新
  get showRefreshButton(): boolean {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示刷新')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否显示刷新').value
    } else {
      return false
    }
  }
  get isCanEdit(): boolean {
    if (this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可编辑')) {
      return this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可编辑').value
    } else {
      return false
    }
  }

/**************************右侧甘特图相关公开的参数 */
  //dateSetting----日期头设置
  get dateHeaderHeight(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头高度')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头高度')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期头高度')[0].value
    }
    return 32
  }
  get dateHeaderFontSize(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体大小')[0].value
    }
    return 17
  }
  get dateHeaderFontWeight(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期头字体粗细值')[0].value
    }
    return 600
  }
  get dateHeaderColor(): string {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期头部字体颜色')[0].value as string
      }
    }
    return '#404040'
  }
  get dateBorderColor(): string {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期边框颜色')[0].value as string
      }
    }
    return '#d7d7d7'
  }
  get dateBackgroundColor(): string {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '日期头背景颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get loactionFontSize(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体大小')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体大小')[0].value
    }
    return 14
  }
  get locationWidth(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的宽度')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的宽度')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的宽度')[0].value
    }
    return 40
  }
  get locationFontWeight(): number {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体粗细值')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体粗细值')[0].value)
        return this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的字体粗细值')[0].value
    }
    return 550
  }
  get locationBorderColor(): string {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的边框颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的边框颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的边框颜色')[0].value as string
      }
    }
    return '#D7D7D7'
  }
  get locationBGColor(): string {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的选中颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的选中颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '快速定位的选中颜色')[0].value as string
      }
    }
    return '#53BC86'
  }
  get isZoomInOrOut(): boolean {
    if (this.FindProperties(propertyGroupEnum.dateSetting, '是否快速定位')[0]) {
      if (this.FindProperties(propertyGroupEnum.dateSetting, '是否快速定位')[0].value) {
        return this.FindProperties(propertyGroupEnum.dateSetting, '是否快速定位')[0].value
      }
    }
    return false
  }
  //specialTimeSetting----特殊时间显示设置
  get showNonWeekday(): boolean {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末高亮')[0].value
      }
    }
    return false
  }
  get weekdayBGColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '周末颜色')[0].value as string
      }
    }
    return '#82828233'
  }
  get holidayShow(): boolean {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮')[0].value
      }
    }
    return false
  }
  get holidayColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '节假日高亮颜色')[0].value as string
      }
    }
    return '#82828233'
  }
  get userSetShow(): boolean {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '设置特殊日历高亮')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '设置特殊日历高亮')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '设置特殊日历高亮')[0].value
      }
    }
    return false
  }
  get speWorkColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-加班时间颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-加班时间颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-加班时间颜色')[0].value as string
      }
    }
    return '#EDAC1D33'
  }
  get speRestColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-休息时间颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-休息时间颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '特殊日历-休息时间颜色')[0].value as string
      }
    }
    return '#DB4D3E33'
  }
  get dayShow(): boolean {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间高亮')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间高亮')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间高亮')[0].value
      }
    }
    return false
  }
  get workBGColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班时间颜色')[0].value as string
      }
    }
    return '#4BBA8133'
  }
  get restShow(): boolean {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间高亮')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间高亮')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间高亮')[0].value
      }
    }
    return false
  }
  get restBGColor(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '休息时间颜色')[0].value as string
      }
    }
    return '#4BBA8133'
  }
  get calendarLevel(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '工厂日历级别')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '工厂日历级别')[0].value)
        return this.FindProperties(propertyGroupEnum.specialTimeSetting, '工厂日历级别')[0].value
    }
    return 'project'
  }
  get ganttCalendar(): any {
    if (this.FindProperties(PropertyGroupName.normal, '工厂日历')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '工厂日历')[0].value)
        return this.FindProperties(PropertyGroupName.normal, '工厂日历')[0].value
    }
    return []
  }
  // get ganttRest(): any {
  //   if (this.FindProperties(PropertyGroupName.normal, '休息时间')[0]) {
  //     if (this.FindProperties(PropertyGroupName.normal, '休息时间')[0].value)
  //       return this.FindProperties(PropertyGroupName.normal, '休息时间')[0].value
  //   }
  //   return []
  // }
  get filter(): any {
    if (this.FindProperties(PropertyGroupName.normal, '筛选条件')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '筛选条件')[0].value)
        return this.FindProperties(PropertyGroupName.normal, '筛选条件')[0].value
    }
    return []
  }
  set filter(val) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '筛选条件')
    this.SetPropertyVal(property.id, val)
  }
  get holidayList(): string[] {
    if (this.FindProperties(PropertyGroupName.normal, '节假日')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '节假日')[0].value) {
        return this.FindProperties(PropertyGroupName.normal, '节假日')[0].value
      }
    }
    // let item = ['2019-9-23', '2019-9-30', '2020-5-1']
    return []
  }
  get userSetList(): any[] {
    if (this.FindProperties(PropertyGroupName.normal, '特殊时间')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '特殊时间')[0].value) {
        return this.FindProperties(PropertyGroupName.normal, '特殊时间')[0].value
      }
    }
    return []
    // return [
    //   { start: '2019-9-16 10:00', end: '2019-9-16 11:00', color: '#eeeeee' },
    //   { start: '2019-9-10 10:00', end: '2019-9-10 11:00', color: '#eeeeee' },
    // ]
  }
  get popForm(): any {
    if (this.FindProperties(PropertyGroupName.normal, '气泡卡片内容')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '气泡卡片内容')[0].value) {
        return this.FindProperties(PropertyGroupName.normal, '气泡卡片内容')[0].value
      }
    }
    return []
  }
  get dayStartTime(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0].value) {
        let time = this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班开始时间')[0].value
        let timeString = '6:00'
        try {
          timeString = time.getHours() + ':' + time.getMinutes()
        } catch (error) {
          if (error.toString().indexOf('time.getHours is not a function') >= 0) {
            let dateList = time.split('T')
            let timeList = dateList[1].split(':')
            timeString = timeList[0] + ':' + timeList[1]
          }
        }
        return timeString
      } else {
        return '6:00'
      }
    } else {
      return '6:00'
    }
  }
  get dayEndTime(): string {
    if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0]) {
      if (this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0].value) {
        let time = this.FindProperties(propertyGroupEnum.specialTimeSetting, '上班结束时间')[0].value
        let timeString = '20:00'
        try {
          timeString = time.getHours() + ':' + time.getMinutes()
        } catch (error) {
          if (error.toString().indexOf('time.getHours is not a function') >= 0) {
            let dateList = time.split('T')
            let timeList = dateList[1].split(':')
            timeString = timeList[0] + ':' + timeList[1]
          }
        }
        return timeString
      } else {
        return '20:00'
      }
    } else {
      return '20:00'
    }
  }
  get timeDivDate(): any {
    //window.console.log('GanttCom-timeDivDate')
    //window.console.log({ isShow: this.dayShow, restShow: this.restShow, startTime: this.dayStartTime, endTime: this.dayEndTime })
    return {
      day: { isShow: this.dayShow, restShow: this.restShow, startTime: this.dayStartTime, endTime: this.dayEndTime },
      holiday: { isShow: this.holidayShow, color: this.holidayColor, list: this.holidayList },
      userSet: { isShow: this.userSetShow, list: this.userSetList },
    }
  }
  //taskColorSetting----任务相关颜色设置
  get activeShowValue(): boolean {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '展示实际任务条')[0].value
      }
    }
    return false
  }
  get taskActuelTimeColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '实际任务条颜色')[0].value as string
      }
    }
    return '#133E28'
  }
  get projectTypeColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条颜色')[0].value as string
      }
    }
    return '#CBEADA'
  }
  get projectTypePerColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'project层任务条完成颜色')[0].value as string
      }
    }
    return '#4BBA81'
  }
  get middleTypeColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条颜色')[0].value as string
      }
    }
    return '#CBEADA'
  }
  get middleTypePerColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle层任务条完成颜色')[0].value as string
      }
    }
    return '#4BBA81'
  }
  get taskTypeColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条颜色')[0].value as string
      }
    }
    return '#CBEADA'
  }
  get taskTypePerColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'task层任务条完成颜色')[0].value as string
      }
    }
    return '#4BBA81'
  }
  get oddTaskBackgroundColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '奇数任务行颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get evenTaskBackgroundColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '偶数任务行颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get projectBackgroundColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'project任务行背景颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get middleBackgroundColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, 'middle任务行背景颜色')[0].value as string
      }
    }
    return '#F6F5F7'
  }
  get taskDependencyColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '任务依赖线颜色')[0].value as string
      }
    }
    return '#FE0000'
  }
  get splitLineColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行分割线颜色')[0].value as string
      }
    }
    return '#E3E3E3'
  }
  get verticalSplitLineColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行纵向分割线颜色')[0].value as string
      }
    }
    return '#E3E3E3'
  }
  get taskClickColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标选中颜色')[0].value as string
      }
    }
    return '#f2f2f2'
  }
  get taskHoverColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '任务行鼠标悬停颜色')[0].value as string
      }
    }
    return '#f2f2f2'
  }
  get showResourceColor(): string {
    if (this.FindProperties(propertyGroupEnum.taskColorSetting, '可移动至资源颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskColorSetting, '可移动至资源颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskColorSetting, '可移动至资源颜色')[0].value as string
      }
    }
    return '#ff0000'
  }
  get colorList(): any {
    return {
      lineTwoColor: this.taskActuelTimeColor, //实际
      projectColor: this.projectTypeColor, //project类型的任务条颜色
      projectPerColor: this.projectTypePerColor, //project类型的任务条完成百分比颜色
      middleColor: this.middleTypeColor, //middle类型的任务条颜色
      middlePerColor: this.middleTypePerColor, //middle类型的任务条完成百分比颜色
      taskColor: this.taskTypeColor, //task类型的任务条颜色
      taskPerColor: this.taskTypePerColor, //task类型的任务条完成百分比颜色
    }
  }
  //taskHeightSetting----任务相关高度设置
  get rowHeight(): number {
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '每行高度')[0].value
      }
    }
    return 29
  }
  get rowHeightModel(): boolean {
    // window.console.log('rowHeightModel')
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0]) {
      if (
        this.FindProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value == true ||
        this.FindProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value == false
      ) {
        // window.console.log(this.FindProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value)
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '自动设置任务条高度')[0].value
      }
    }
    return true
  }
  get setFirstTop(): number {
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value
      } else if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '预计任务条和顶部的高度')[0].value == 0) {
        return 0
      }
    }
    return 5
  }
  get setRowInHeightT(): number {
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value
      } else if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '展示实际任务条时预计任务条的高度')[0].value == 0) {
        return 0
      }
    }
    return 9
  }
  get setRowInHeightS(): number {
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value
      } else if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '不展示实际任务条时预计任务条的高度')[0].value) {
        return 0
      }
    }
    return 24
  }
  get setLineTwoTop(): number {
    if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0]) {
      if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value) {
        return this.FindProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value
      } else if (this.FindProperties(propertyGroupEnum.taskHeightSetting, '实际任务条和顶部的距离')[0].value == 0) {
        return 0
      }
    }
    return 16
  }
  //special----特有属性
  get isShowSpace(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '表格与甘特图是否有间隔')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格与甘特图是否有间隔')[0].value) {
        if (this.FindProperties(PropertyGroupName.special, '表格与甘特图是否有间隔')[0].value == true) {
          return true
        }
      } else {
        return false
      }
    }
    return false
  }
  get spaceWidth(): number {
    if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔宽度')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔宽度')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔宽度')[0].value
      }
    }
    return 10
  }
  get spaceBackgroundColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔背景色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔背景色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格与甘特图间隔背景色')[0].value as string
      }
    }
    return '#E9ECF0'
  }
  get spaceBorderColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隙边框颜色')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格与甘特图间隙边框颜色')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '表格与甘特图间隙边框颜色')[0].value as string
      }
    }
    return '#E9ECF0'
  }
  get isUseDefaultPopup(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0].value) {
        if (this.FindProperties(PropertyGroupName.special, '是否使用默认弹窗（鼠标悬停任务条时）')[0].value == true) {
          return true
        }
      } else {
        return false
      }
    }
    return false
  }
  get disable(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '甘特图可编辑')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '甘特图可编辑')[0].value) {
        if (this.FindProperties(PropertyGroupName.special, '甘特图可编辑')[0].value == true) {
          return this.FindProperties(PropertyGroupName.special, '甘特图可编辑')[0].value
        }
      } else {
        return false
      }
    }
    return false
  }
  get summaryAble(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否展示汇总')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '是否展示汇总')[0].value) {
        if (this.FindProperties(PropertyGroupName.special, '是否展示汇总')[0].value == true) {
          return this.FindProperties(PropertyGroupName.special, '是否展示汇总')[0].value
        }
      } else {
        return false
      }
    }
    return false
  }
  get drapDepen(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '拖拽联动')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '拖拽联动')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '拖拽联动')[0].value
      }
    }
    return false
  }
  get workTimeType(): string {
    //window.console.log('workTimeType')
    if (this.FindProperties(PropertyGroupName.special, '生产日历数据格式')[0]) {
      //window.console.log('1')
      if (this.FindProperties(PropertyGroupName.special, '生产日历数据格式')[0].value)
        //window.console.log(this.FindProperties(PropertyGroupName.special, '生产日历数据格式')[0].value)
      return this.FindProperties(PropertyGroupName.special, '生产日历数据格式')[0].value
    }
    return '周循环'
  }
  get dropProperty(): string {
    if (this.FindProperties(PropertyGroupName.special, '移动条件属性')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '移动条件属性')[0].value) {
        return this.FindProperties(PropertyGroupName.special, '移动条件属性')[0].value
      }
    }
    return '[]'
    // return '["section"]'
  }
  get tableWidth(): number {
    if (this.FindProperties(PropertyGroupName.special, '表格宽度')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '表格宽度')[0].value)
        return this.FindProperties(PropertyGroupName.special, '表格宽度')[0].value
    }
    return 300
  }
  set tableWidth(val) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '表格宽度')
    this.SetPropertyVal(property.id, val)
  }
  get isDepend(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否展示依赖线')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '是否展示依赖线')[0].value == false)
        return this.FindProperties(PropertyGroupName.special, '是否展示依赖线')[0].value
    }
    return true
  }
  set isDepend(val) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '是否展示依赖线')
    this.SetPropertyVal(property.id, val)
  }
  get dependencyWidth(): number {
    if (this.FindProperties(PropertyGroupName.special, '依赖线宽度')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '依赖线宽度')[0].value)
        return this.FindProperties(PropertyGroupName.special, '依赖线宽度')[0].value
    }
    return 2
  }
  //imageSrtting----图片设置
  get projectIcon(): any {
    if (this.FindProperties(propertyGroupEnum.imageSetting, 'project图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.imageSetting, 'project图标')[0].value)
        return this.FindProperties(propertyGroupEnum.imageSetting, 'project图标')[0].value
    }
    return null
  }
  get middleIcon(): any {
    if (this.FindProperties(propertyGroupEnum.imageSetting, 'middle图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.imageSetting, 'middle图标')[0].value)
        return this.FindProperties(propertyGroupEnum.imageSetting, 'middle图标')[0].value
    }
    return null
  }
  get taskIcon(): any {
    if (this.FindProperties(propertyGroupEnum.imageSetting, 'task图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.imageSetting, 'task图标')[0].value)
        return this.FindProperties(propertyGroupEnum.imageSetting, 'task图标')[0].value
    }
    return null
  }
  // get lockIcon(): any {
  //   if (this.FindProperties(propertyGroupEnum.imageSetting, '锁定产线图标')[0]) {
  //     if (this.FindProperties(propertyGroupEnum.imageSetting, '锁定产线图标')[0].value)
  //       return this.FindProperties(propertyGroupEnum.imageSetting, '锁定产线图标')[0].value
  //   }
  //   return null
  // }
  get iconWandH(): number {
    if (this.FindProperties(propertyGroupEnum.imageSetting, '任务图标大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.imageSetting, '任务图标大小')[0].value)
        return this.FindProperties(propertyGroupEnum.imageSetting, '任务图标大小')[0].value
    }
    return 14
  }
  get getIcon(): any {
    //window.console.log('getIcon')
    //window.console.log({ projectIcon: this.projectIcon, middleIcon: this.middleIcon, taskIcon: this.taskIcon })
    return { projectIcon: this.projectIcon, middleIcon: this.middleIcon, taskIcon: this.taskIcon }
  }
  //导出弹窗设置
  get svgSize(): number {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '图标大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '图标大小')[0].value)
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '图标大小')[0].value
    }
    return 16
  }
  get exportFontSize(): number {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '字体大小')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '字体大小')[0].value)
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '字体大小')[0].value
    }
    return 14
  }
  get cancelIcon(): any {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮图标')[0].value)
        var val = this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮图标')[0].value
      if (val) {
        let icon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, val[0].url.split('?')[0])
        return icon
      }
      return ''
    }
    return ''
  }
  get cancelClickIcon(): any {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮选中图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮选中图标')[0].value)
        var val = this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮选中图标')[0].value
      if (val) {
        let icon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, val[0].url.split('?')[0])
        return icon
      }
      return ''
    }
    return ''
  }
  get okIcon(): any {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮图标')[0].value)
        var val = this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮图标')[0].value
      if (val) {
        let icon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, val[0].url.split('?')[0])
        return icon
      }
      return ''
    }
    return ''
  }
  get okClickIcon(): any {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮选中图标')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮选中图标')[0].value)
        var val = this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮选中图标')[0].value
      if (val) {
        let icon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, val[0].url.split('?')[0])
        return icon
      }
      return ''
    }
    return ''
  }
  get cancelBGNormal(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮正常颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮正常颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮正常颜色')[0].value as string
      }
    }
    return '#53BC8626'
  }
  get cancelBGOver(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮悬浮颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮悬浮颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮悬浮颜色')[0].value as string
      }
    }
    return '#6CC5980D'
  }
  get cancelBGClick(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮点击颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮点击颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮点击颜色')[0].value as string
      }
    }
    return '#469F72'
  }
  get cancelBorderColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮边框颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮边框颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消按钮边框颜色')[0].value as string
      }
    }
    return '#469F72'
  }
  get cancelFontColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体正常颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体正常颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体正常颜色')[0].value as string
      }
    }
    return '#53BC86FF'
  }
  get cancelFontClickColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体选中颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体选中颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '取消字体选中颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get okBGNormal(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮正常颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮正常颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮正常颜色')[0].value as string
      }
    }
    return '#53BC86'
  }
  get okBGOver(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮悬浮颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮悬浮颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮悬浮颜色')[0].value as string
      }
    }
    return '#6CC598'
  }
  get okBGClick(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮点击颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮点击颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮点击颜色')[0].value as string
      }
    }
    return '#469F72'
  }
  get okBorderColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮边框颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮边框颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出按钮边框颜色')[0].value as string
      }
    }
    return '#469F72'
  }
  get okFontColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体正常颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体正常颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体正常颜色')[0].value as string
      }
    }
    return '#ffffff'
  }
  get okFontClickColor(): string {
    if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体选中颜色')[0]) {
      if (this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体选中颜色')[0].value) {
        return this.FindProperties(propertyGroupEnum.exportButtonSetting, '导出字体选中颜色')[0].value as string
      }
    }
    return '#53BC86FF'
  }
  get okSettingInfo(): any {
    return {
      okImagerUrl: this.okIcon,
      okClickImagerUrl: this.okClickIcon,
      okBGNormal: this.okBGNormal,
      okBGOver: this.okBGOver,
      okBGClick: this.okBGClick,
      okBorderColor: this.okBorderColor,
      okFontColor: this.okFontColor,
      okFontClickColor: this.okFontClickColor,
    }
  }
  get cancelSettingInfo(): any {
    return {
      cancelImageUrl: this.cancelIcon,
      cancelClickImageUrl: this.cancelClickIcon,
      cancelBGNormal: this.cancelBGNormal,
      cancelBGOver: this.cancelBGOver,
      cancelBGClick: this.cancelBGClick,
      cancelBorderColor: this.cancelBorderColor,
      cancelFontColor: this.cancelFontColor,
      cancelFontClickColor: this.cancelFontClickColor,
    }
  }
  //基本设置
  get backgroundColor(): string {
    if (this.FindProperties(PropertyGroupName.normal, '背景色')[0]) {
      if (this.FindProperties(PropertyGroupName.normal, '背景色')[0].value) {
        return this.FindProperties(PropertyGroupName.normal, '背景色')[0].value as string
      }
    }
    return '#808080'
  }

/**************右侧甘特图公开的事件 ****************************/
  //事件
  dblclickRowWrapper(item: any) {
    this.TriggeEvent('任务条双击事件', item)
  }
  clickRowWrapper(item: any) {
    this.TriggeEvent('任务条选中事件', item)
  }
  rightClickRowWrapper(item: any) {
    this.TriggeEvent('任务条右击事件', item)
  }
  mouseover(item: any) {
    this.TriggeEvent('任务条悬浮事件', item)
  }
  toggleTreeExpand(item: any) {
    // window.console.log('_______&&&&&&&&&&&&&树节点展开收起')
    this.handlerExpand(item, item.expanded)
    this.TriggeEvent('树节点展开收起', item)
  }
  leftTableClickRow(task: any) {
    //左侧表格同步选中---
    let table = this.$refs.table as any
    table.changeStyle(task, task.id, true, false)
    this.TriggeEvent('点击行', task)
  }
  leftTableHoverRow(task: any) {
    //左侧表格同步悬停---
    let table = this.$refs.table as any
    table.changeStyle(task, task.id, false, false)
  }
  leftTableLeaveRow(task: any) {
    //左侧表格同步离开---
    let table = this.$refs.table as any
    table.changeStyle(task, task.id, false, true)
  }
/**************左侧表格公开的事件 **************************/
  rowClick(row: any) {
    // let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
    // var val = { modelCode: this.getModelCode(), data: common.clone(row) }
    // this.SetPropertyVal(property.id, val)
    // let propBind = this.getPropertyBindInfo(property.id)
    // if (propBind) {
    //   let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
    //   modelInfo.val = val
    // }
    //window.console.log('-----------------------触发点击行事件', row)
    /**点击左侧行同时改变右侧对应行的颜色*/
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any
    gridLine.handleClick(row)

    this.TriggeEvent('点击行', row)
  }
  //手动触发，会执行勾选事件
  manualSelect(value: any[], currentRow: any, ischecked: boolean = true) {
    this.itemSelect(value)
    //window.console.log('------------------------------------勾选参数', currentRow)
    if (ischecked) {
      this.TriggeEvent('勾选行', currentRow)
    } else {
      this.TriggeEvent('取消勾选行', currentRow)
    }
  }
  /** 表格数据变化触发变更事件 */
  dataChange() {
    this.TriggeEvent('表格数据变更', common.clone(this.dataSource))
  }
  /** 行编辑结束，更新编辑数据源 */
  rowEditEnd(row: any) {
    let olddata = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源').value.content
    if (!olddata) {
      olddata = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源').value
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
        const addDatas = olddata.filter((item) => item[this.rowIdName] == element[this.rowIdName])
        if (!addDatas || addDatas.length === 0) {
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
        const updateDatas = olddata.filter((item) => item[this.rowIdName] == sourceData[this.rowIdName])
        if (updateDatas && updateDatas.length > 0) {
          resupdatedata.push(sourceData)
        }
      })
    }

    let addprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    addprop.value = resadddata
    let updateprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    updateprop.value = resupdatedata
    //行编辑结束
    this.TriggeEvent('行编辑结束', common.clone(currentRow))
    //window.console.log('-------------------------------------------------------行编辑结束记录', updateprop)
  }
  rowHover(row: any) {
    /**悬浮左侧行同时改变右侧对应行的颜色*/
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any
    this.rowHoverId = row.id
    gridLine.handleMouseover(row)
    this.TriggeEvent('表格行悬浮', row)
  }
  rowLeave(row: any) {
    /**悬浮左侧行同时改变右侧对应行的颜色*/
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any
    gridLine.handleMouseout(row)
  }
  dbClick(row: any) {
    let gantt = this.$refs.gantt as any
    let dbModel = gantt.$refs.doubleModel as any
    this.localTask(row)
    // dbModel.viedoublew(row)

    this.TriggeEvent('表格行双击', row)
  }

/*******************左侧表格公开的方法******************************/
  /** 全部勾选*/
  selectAllData(param: any) {
    //window.console.log('----------------------勾选全部param', param)
    // let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
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
              this.TriggeEvent('勾选行', null)
            }
          }
        } else {
          this.itemSelect([])
          if (param[0] === false) {
            this.TriggeEvent('取消勾选行', null)
          }
        }
      })
      // let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
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
        window.console.log('-------------------------------------选中指定行第三个参数（选择-反选）', param[2])
      }
      if (param.length > 4) {
        //window.console.log('-------------------------------------选中指定行第五个参数，表格字段', param[4])
      }
      //this.dataSource

      // let chooseType = this.FindPropertyByName(propertyGroupEnum.tableSetting, '是否可选')
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

        let selectproperty = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中行')
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
              this.TriggeEvent('勾选行', null)
            } else {
              this.TriggeEvent('取消勾选行', null)
            }
          }
        }
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
  /** 获取当前数据 */
  getCurrentDataSource() {

    if (!this.dataSource || this.dataSource.length === 0) {
      return []
    }
    return common.clone(this.dataSource)
  }
  //获取添加数据源
  getAddedDataSource() {
    let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return prop.value
    } else {
      return []
    }
  }
  //获取子表格添加数据源
  getAddedChildDataSource() {
    return this.getChildDataSourceByType(operationTypeEnum.addChild)
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
  //获取编辑数据源
  getUpdatedDataSource() {
    let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return prop.value
    } else {
      return []
    }
  }
  //获取子表格编辑数据源
  getUpdatedChildDataSource() {
    return this.getChildDataSourceByType(operationTypeEnum.updateChild)
  }
  //获取删除数据源
  getDeletedDataSource() {
    let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
    if (prop.value && prop.value instanceof Array && prop.value.length > 0) {
      return prop.value
    } else {
      return []
    }
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
    let prop = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源')
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
            const addDatas = olddata.filter((item) => item[this.rowIdName] == element[this.rowIdName])
            if (!addDatas || addDatas.length === 0) {
              resadddata.push(element)
            }
          })
        }

        return resadddata
      case operationTypeEnum.update:
        //编辑，旧数据有，新数据有
        if (olddata && this.dataSource) {
          this.dataSource.forEach((element) => {
            const updateDatas = olddata.filter((item) => item[this.rowIdName] == element[this.rowIdName])
            if (updateDatas && updateDatas.length > 0) {
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
              const deleteDatas = this.dataSource.filter((item) => item[this.rowIdName] == element[this.rowIdName])
              if (!deleteDatas || deleteDatas.length === 0) {
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
            const addDatas = olddata.filter((item) => item[this.childRowIdName] == element[this.childRowIdName])
            if (!addDatas || addDatas.length === 0) {
              resadddata.push(element)
            }
          })
        }
        return resadddata
      case operationTypeEnum.updateChild:
        //编辑，旧数据有，新数据有
        if (olddata && newdata) {
          newdata.forEach((element) => {
            const updateDatas = olddata.filter((item) => item[this.childRowIdName] == element[this.childRowIdName])
            if (updateDatas && updateDatas.length > 0) {
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
              const deleteDatas = newdata.filter((item) => item[this.childRowIdName] == element[this.childRowIdName])
              if (!deleteDatas || deleteDatas.length === 0) {
                resdeletedata.push(element)
              }
            })
          }
        }
        return resdeletedata
    }
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
      this.dataSource = this.dataSource.concat(tempAdd)
      this.dataSource = this.dataSource.concat(tempUpdate)
      let addprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
      addprop.value = tempAdd
      let updateprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
      updateprop.value = tempUpdate
      let deleteprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
      deleteprop.value = tempDelete
    }
  }
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
          item: selectDataSource,
        })
      } else {
        this.dictItemArr[idx].item = selectDataSource
      }
    }
  }
  /** 设置点击行
   * 参数是主键id
   * */
  setClickRow(param: any) {
    ;(this.$refs.table as any).setRowSelect(param[0])
  }
  /** 重置数据，还原到上次查询到的数据 */
  resetDataSource() {
    //window.console.log('----------------进入表格重置方法')
    let property = this.FindPropertyByName(PropertyGroupName.normal, '表格数据源')
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
    let table = this.$refs.table as any
    let xTable = table.$refs.xTable3 as any
    xTable.refreshData()
    // let childprop = this.FindPropertyByName(PropertyGroupName.normal, '子表格数据源')
    // this.SetPropertyVal(childprop.id, [])
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
    let addprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '新增数据源')
    let updateprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '编辑数据源')
    let deleteprop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '删除数据源')
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
    let property = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前点击行')
    var val = { modelCode: this.getModelCode(), data: common.clone(currentRow) }
    this.SetPropertyVal(property.id, val)
  }
  private currentClickRow: any
  childcelldbclick(value: any, isChecked: boolean) {
    this.childItemSelect(value, isChecked)
    this.currentClickRow = common.clone(value)
  }
  childrowClick(row: any) {
    this.currentClickRow = common.clone(row)
    //window.console.log('-----------------------触发子表格点击行事件', row)
    this.TriggeEvent('点击行', row)
  }
  getChildCurrentDataSource(param: any) {
    return common.clone(this.allChildDataSourceNoGroup)
  }
  exportTableToCsv(param: any) {
    ;(this.$refs.table as any).exportData()
  }

  //临时数据的批量删除，根据当前选中行来处理
  deleteRows() {
    let prop = this.FindPropertyByName(propertyGroupEnum.tableSetting, '当前选中模型')
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
    }
  }
  //行内临时数据的删除方法
  deleteRow(row: any) {
    if (row.length > 0) {
      //window.console.log('--------------------------------进入删除行-----------------', row[0])
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
      //let aaa = this.rowIdName
      this.dataSource.forEach((element) => {
        let row = selectRows.find((s) => s[this.rowIdName] === element[this.rowIdName])
        if (!row) {
          newData.push(element)
        }
      })
      this.dataSource = newData
      //this.dataSource = newData
      this.prepareData('删除')
    }
  }
  /** 子表格删除行 */
  deleteChildRow(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------删除子表格数据参数', param)
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
      // param[1] = 'event_name'
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
              // ;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
              this.$message.info('不能添加重复数据！')
              return
            }
          }
        }
        this.enumValueConvert(temp)
        let index = this.dataSource.findIndex((item) => item[this.rowIdName] === temp[this.rowIdName])
        this.$set(this.dataSource, index, temp)
      }
      this.prepareData('编辑')
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

    let prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    let propBind = this.getPropertyBindInfo(prop.id)
    let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === propBind.modelName)
    let detailInfo = modelInfo.modelDetailInfo
    //需要判断下是否有重复数据
    if (rows instanceof Array) {
      //重复的数据不添加，正常的数据还能添加进去
      let addRows = []
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
        addRows.push(element)
      }
      if (addRows.length !== rows.length) {
        // ;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
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
            // ;(window as any).layer.alert('不能添加重复数据', { icon: 7 })
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
  /** 子表格添加行，这样直接添加数据可能会跟折叠展开有冲突
   *  需要两个参数，第一个参数指定要添加的位置，传主表跟从表的关联id，第二个参数指定添加数据，第三个参数是验证重复的字段
   */
  addChildRow(param: any) {
    if (param instanceof Array) {
      //window.console.log('------------------添加子表格数据参数', param)
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
      if (tempchildData instanceof Object) {
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
      } else {
        if (tempchildData instanceof Array) {
          child.concat(tempchildData)
        }
      }
      ;(this.$refs.table as any).refreshChildData(tempRowId, child)
      let idx = childData.value.findIndex((item) => item[this.childRowIdName] === tempchildData[this.childRowIdName])
      if (idx < 0) {
        childData.value.push(tempchildData)
        let tempIdx = this.allChildDataSource.findIndex((item) => item.key == tempRowId)
        if (tempIdx > -1) {
          this.allChildDataSource[tempIdx] = childData
        }
        let ttt = this.allChildDataSourceNoGroup.findIndex((item) => item[this.childRowIdName] == tempchildData[this.childRowIdName])
        if (ttt < 0) {
          this.allChildDataSourceNoGroup.push(tempchildData)
        }
        window.console.log('------------------添加子表格数据当前子表格数据allChildDataSourceNoGroup', this.allChildDataSourceNoGroup)
      }
    }
  }
  dataClear() {
    // window.console.log('-------------表格临时数据清理')
    this.tempDataClear()
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

/*******************右侧甘特图公开的方法******************************/
  isHasClickedRow(): boolean {
    let gantt = this.$refs.gantt as any
    let gridLine = gantt.$refs.gridLine as any
    return gridLine.hasClick
  }
  addNewTask(item: any, depen: any[], type?: string): void {
    let gantt = this.$refs.gantt as any
    try {
      gantt.addNewTask(item[0], item[1], -1, 'add', null)
    } catch (error) {
      if (error != 'over' && error != 'have') {
        window.console.error(error)
        throw error
      }
    }
  }
  deleteTask(id: any, type?: string): void {
    let gantt = this.$refs.gantt as any
    try {
      gantt.deleteTask(id[0], 'add', null, null)
    } catch (error) {
      window.console.error(error)
    }
  }
  changeTask(item: any, type?: string): void {
    let gantt = this.$refs.gantt as any
    gantt.changeTask(item[0], 'add')
  }
  //撤销
  undo(): void {
    let gantt = this.$refs.gantt as any
    gantt.undo()
  }
  //重做
  redo(): void {
    let gantt = this.$refs.gantt as any
    gantt.redo()
  }
  //获取撤销列表
  getUndoList(): any[] {
    let gantt = this.$refs.gantt as any
    return gantt.undoList
  }

  //获取重做列表
  getRedoList(): any[] {
    let gantt = this.$refs.gantt as any
    return gantt.redoList
  }
  //锁定产线
  lockNode(row: any, list: any) {
    var locked = false
    if (list) {
      list.forEach((child) => {
        if (child.id === row[0].data.id) {
          child.locked = !child.locked
          locked = child.locked
          let gantt = this.$refs.gantt as any
          gantt.lockNode(row, null)
        } else if (child.children && child.children.length > 0) {
          this.lockNode(row, child.children)
        }
      })
    } else {
      this.dataSource.forEach((child) => {
        if (child.id === row[0].data.id) {
          child.locked = !child.locked
          locked = child.locked
          let gantt = this.$refs.gantt as any
          gantt.lockNode(row, null)
        } else if (child.children && child.children.length > 0) {
          this.lockNode(row, child.children)
        }
      })
    }
    return locked
  }
  checkTask(row: any) {
    var gantt = this.$refs.gantt as any
    let errorFlag = true
    try {
      gantt.checkTask(row)
    } catch (error) {
      errorFlag = false
      if (error === 'start-error') {
        this.$message.info('上一个任务的开始时间不能晚于下一个任务的开始时间')
      } else if (error === 'end-error') {
        this.$message.info('后一个任务的开始时间不能超过上一个任务的开始时间')
      } else {
        window.console.log(error)
        throw error
      }
    }
    //window.console.log('^^^^^^^^^^^^^^^^^^^^^^^')
    //window.console.log(errorFlag)
    return errorFlag
  }
  getDepen(row: any): any {
    var gantt = this.$refs.gantt as any
    var result = gantt.getDepen(row[0])
    return result
  }
  getTask(row: any): any {
    var table = this.$refs.table as any
    var result = table.getTask(row[0].data.id)
    return result.self
  }
  getSaveTask(): any[] {
    let gantt = this.$refs.gantt as any
    let saveTask = gantt.getResultTask()
    return saveTask
  }
  changeLevel(label: string): void {
    let gantt = this.$refs.gantt as any
    if (label[0] == 'hour') {
      gantt.handleSetDaySize('hour', 80, 2, 80, 10 * 60 * 1000, false)
    } else if (label[0] == 'day') {
      gantt.handleSetDaySize('day', 80, 4, 80, 60 * 60 * 1000, false)
    } else if (label[0] == 'week') {
      gantt.handleSetDaySize('week', 80, 9, 80, 24 * 60 * 60 * 1000, false)
    } else if (label[0] == 'month') {
      gantt.handleSetDaySize('month', 80, 10, 80, 24 * 60 * 60 * 1000, false)
    } else if (label[0] == 'year') {
      gantt.handleSetDaySize('year', 80, 12, 80, (365 / 12) * 24 * 60 * 60 * 1000, false)
    }
  }
  zoomDate(level: number): void {
    let gantt = this.$refs.gantt as any
    gantt.changeDaySize(level[0])
  }
  locateDate(dateString: any): void {
    let gantt = this.$refs.gantt as any
    gantt.handlerDateRangOnChange(dateString[0])
  }
  zoomToFit(): void {
    let gantt = this.$refs.gantt as any
    gantt.zoomToFit()
  }
  exportExcel() {
    var exportM = this.$refs.export as any
    var gantt = this.$refs.gantt as any
    exportM.currentDataSource = this.dataSource
    exportM.allDataSource = gantt.taskList
    exportM.columns = [...this.tableStyle.columnInfos]
    exportM.view('export')
  }
  printData() {
    var printM = this.$refs.export as any
    printM.columns = [...this.tableStyle.columnInfos]
    printM.view('print')
  }
  filters() {
    var table = this.$refs.table as any
    var xTable = table.$refs.xTable3 as any
    var gantt = this.$refs.gantt as any
    let options = { children: 'children' }
    let searchProps = ['id']
    var datasave = gantt.taskList
    this.filter.forEach((child) => {
      switch (child.type) {
        case 'text':
          datasave = XEUtils.searchTree(
            datasave,
            (item) =>
              searchProps.some(
                (key) =>
                  XEUtils.toString(item[child.key])
                    .toLowerCase()
                    .indexOf(child.value) > -1
              ),
            options
          )
          break
        case 'date':
          datasave = XEUtils.searchTree(
            datasave,
            (item) =>
              searchProps.some((key) =>
                child.value.length === 1
                  ? item[child.key] < child.value[0]
                  : child.value.length === 2
                  ? item[child.key] >= child.value[0] && item[child.key] < child.value[1]
                  : false
              ),
            options
          )
          break
        default:
          datasave = XEUtils.searchTree(
            datasave,
            (item) =>
              searchProps.some(
                (key) =>
                  item[child.key] != null &&
                  item[child.key] != undefined &&
                  XEUtils.toString(item[child.key])
                    .toLowerCase()
                    .indexOf(child.value) > -1
              ),
            options
          )
          break
      }
    })
    this.dataSource = datasave
    this.$nextTick(() => {
      table.haveExpand()
    })
  }
  getCheckDropResult(res: any) {
    this.checkDropResult = res[0]
  }
  exchangeTask(idf: any, ids: any, type?: string): void {
    // let gantt = this.$refs.gantt as any
    // if (type) {
    //   gantt.exchangeTask(idf, ids, type)
    // } else {
    //   gantt.exchangeTask(idf, ids, 'un')
    // }
  }
  moveToTask(id: any, newParentId: any, index?: number, type?: string): void {
    // let gantt = this.$refs.gantt as any
    // if (type) {
    //   gantt.moveToTask(id, newParentId, index, type)
    // } else {
    //   gantt.moveToTask(id, newParentId, index, 'un')
    // }
  }
  //展开收起
  handlerExpand(item: any, isexpand: boolean): void {
    let gantt = this.$refs.gantt as any
    gantt.handlerExpand(item.row.id, isexpand)

    let gridLine = gantt.$refs.gridLine as any
    gridLine.grindLineS = !gridLine.grindLineS
    if (item.row.children != undefined && item.row.children.length > 0) {
      //如果选中行是当前收起或展开行的children，则当前选中行清空还原
      let index = item.row.children.findIndex((element) => element.id === gridLine.clickRow.id)
      if (index > -1) {
        gridLine.hasClick = false
        gridLine.clickRow = {}
      }
    }
  }
  refreshganttData(date: any[]) {
    // if (this.FindProperties(PropertyGroupName.special, '数据源')) {
    //   if (this.FindProperties(PropertyGroupName.special, '数据源')[0]) {
    //     this.FindProperties(PropertyGroupName.special, '数据源')[0].value = date
    //   }
    // }
    // return date
  }

  /**************************其他************************************************************/
  private getcolumn(): any[] {
    var columnInfos = []
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
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

  /**判断数据源是否为空 */
  datasourceIsNull() {

    if (this.dataSource && this.dataSource.length > 0) {
      return false
    }
    return true
  }

  /** 准备子表格 */
  prepareChildData() {}

  // get popMsgList(): any {
  //   //无法获取数据
  //   return [
  //     { key: 'id', value: '156865978' },
  //     { key: '百分比', value: 20 },
  //   ]
  // }
}
</script>

<style lang="less">
.tableCotainer {
  // float: left;
  position: absolute;
  z-index: 1;
  top: 1px;
  .vxe-tree--btn-wrapper {
    background-color: #fff0;
  }
  table .vxe-body--row.row--current .vxe-tree--btn-wrapper {
    background-color: #e6f7ff00;
  }
  .vxe-icon--caret-right,
  .vxe-icon--caret-right:before {
    font-size: 9px;
    color: rgba(105, 105, 105, 1);
  }
  .vxe-table .vxe-tree-wrapper {
    padding-right: 17px;
  }
  .col--tree-node {
    .vxe-cell {
      padding-left: 0px;
    }
  }
  .vxe-table:before {
    border-top-color: #fff;
  }
  .mytable-style .vxe-table--body-wrapper::-webkit-scrollbar {
    width: 0px;
    height: 10px;
  }
  .drag-btn :hover {
    cursor: move;
  }
  .vxe-table .vxe-tree-wrapper.is--active .vxe-tree--node-btn{
    border:0px;
  }
  .vxe-table .vxe-tree-wrapper .vxe-tree--node-btn{
    border:0px;
  }

  .vxe-tree-wrapper{
    .vxe-tree--node-btn .vxe-icon--caret-bottom:before,
    .vxe-icon--caret-left:before,
    .vxe-icon--caret-right:before,
    .vxe-icon--caret-top:before{
      // background:#6c6a6b;
      border-width:0.4em;
      border-style:solid;
      // border-color:#fff0;
      content:"" !important;
      position:absolute;
      transform:rotate(225deg);
    }

    .vxe-icon--caret-right:before{
      left:0.2em !important;
      bottom:0.1em !important;
      border-left-color:inherit !important;
    }
  }


}
.tableBlank {
  position: absolute;
}
// .ganttTable {
//   float: left;
// }
.ganttPicture {
  position: absolute;
  z-index: 2;
}
.shadeScroll {
  position: absolute;
  z-index: 2;
}
</style>
<style lang="less" scoped>
.shadeScroll:hover {
  cursor: move;
}
</style>