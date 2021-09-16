/*
使用vxe-table 替换掉antd的table
 xuww 2019-10-10 add
 初始化的时候，先把列信息存储下来，以后用的时候就使用存储的信息，顺序调整之后也能生效
 列可以添加format方法
 添加列排序功能  xuww 2019-10-15 add

 -----xuww 2019-10-16 update log
 功能修改
 1.表格添加刷新和列设置的显示隐藏功能
 2.这两个功能移动到最后一列，不跟操作列绑定
 
 bug解决
 1.兼容一下操作列slot没有设置的问题

 -----
*/
import Vue from 'vue'
import CommonChart from 'viser/es/core/CommonChart'
//import T from 'vxe-table'
import common from '../../02common/commonMethod'
import TableGrid from '../../04designerComponents/table/TableGrid.vue'
import { ModelPropertyType } from '../../02common/impResourcesCache/modelAnalysis'
import { CurrentContext } from '../../01designerContext'
import moment from 'moment'
import ganttTableStyle from './tableStyle.css'
import { lineLevelIcon, projectLevelIcon, taskLevelIcon, lockIcon, dropIcon } from '../../assets/icons.js'

Date.prototype.format = function(fmt) {
  var o = {
    'y+': this.getFullYear(), //年
    'Y+': this.getFullYear(), //年
    'M+': this.getMonth() + 1, //月份
    'D+': this.getDate(), //日
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  // if (/(y+)/.test(fmt)) {
  //   fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  // }
  for (var k in o) {
    if (k === 'y+' || k === 'Y+') {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
    } else {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
  }
  return fmt
}

let count = 0 //为了奇偶行使用
export default {
  name: 'VTable',
  components: {
    TableGrid
  },
  data() {
    return {
      //currentRender,
      // allBackgroundColor:'',
      tableColumns: [],
      childtableColumns: [],
      toolbar: {
        id: 'toolbar_demo_2',
        //refresh: { query: this.refresh },
        resizable: { storage: true }
        // setting: {
        //   storage: true,
        // },
      },
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      tableOrders: [],
      dataSource: [],
      childdataSource: [],
      loading: true,
      settingColumns: [],
      showColumns: [],
      //定义本地存储的列信息，需要保存列名，是否显示，宽度，顺序
      //{title:'',dataIndex:'',visible:true,width:100}
      //操作列是否要放进来呢？不应该放进来，单独写个方法来处理
      localStorageColumns: [],
      selectConfig: {
        checkAll: false,
        reserve: false
      },
      treeConfig: {
        children: 'children',
        expandAll: true,
        indent: 8
      },
      //checkboxConfig: { checkAll: true },
      editConfig: { trigger: 'dblclick', mode: 'row' },
      scale: 1,
      expandRow: null,
      rowIdName: 'id',
      tempData: [],
      // selectOptionArr: [],
      activeRow: null,
      showIndex: false,
      showCheck: false,
      showRadio: false,
      selectValue: null,
      isCancelRow: false,
      //defaultSort: {},
      currentSelectedRowID: '', //选中行id
      currentHoveredRowID: '', //悬浮行id
      currentHoveredRow: {},
      styleRecord: {}
    }
  },
  props: {
    name: { type: String, default: '' },
    parentPage: null,
    rowId: {
      type: String,
      default: 'id'
    },
    childrowId: {
      type: String,
      default: 'id'
    },
    height: {
      type: String,
      require: false,
      default: null
    },
    data: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Function | Array,
      required: true
    },
    childdata: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Function | Array,
      required: false
    },
    columns: {
      type: Array,
      required: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    pageNumber: {
      type: Number,
      required: false,
      default: 1
    },
    pageSize: {
      type: Number,
      required: false,
      default: 10
    },
    // showSelection: {
    //   type: Boolean,
    //   default: true,
    // },
    // showRadioColumn: {
    //   type: Boolean,
    //   default: false,
    // },
    showColumnIndex: {
      type: Boolean,
      default: true
    },
    // rowSelection: {
    //   type: Object,
    //   default: null,
    // },
    showExpandColumn: {
      type: Boolean,
      default: false
    },
    showRefreshButton: {
      type: Boolean,
      default: false
    },
    showSetColumnButton: {
      type: Boolean,
      default: false
    },
    selectValues: {
      type: Array,
      require: false,
      default: null
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    reserveData: {
      type: Boolean,
      default: false
    },
    // checkConfig: {
    //   type: Object,
    //   require: false,
    //   default: function() {
    //     return { strict: true, checkMethod: this.checkMethod }
    //   },
    // },
    checkMethod: {
      type: Function,
      require: false,
      default: function() {
        return true
      }
    },
    remoteSort: {
      type: Boolean,
      default: true
    },
    tablePageConfig: {
      type: Object,
      required: false,
      default: function() {
        return { total: 0, currentPage: 1, pageSize: 10 }
      }
    },
    tableStyle: {
      type: Object,
      required: false,
      default: function() {
        return {}
      }
    },
    hasChildData: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    /**表格是否可编辑 */
    isCanEdit: {
      type: Boolean,
      default: false
    },
    selectOptionArr: {
      type: Array,
      required: false,
      default: function() {
        return []
      }
    },
    emptyTip: {
      type: String,
      default: '暂无数据'
    },
    headerCellStyle: {
      type: Function,
      default: function() {
        return {}
      }
    },
    showOverflow: {
      type: Boolean,
      defaylt: true
    },
    oddRowBackgroundColor: {
      //奇数行颜色
      type: String,
      default: null
    },
    evenRowBackgroundColor: {
      //偶数行颜色
      type: String,
      default: null
    },
    projectBackgroundColor: {
      //project行颜色
      type: String,
      default: null
    },
    middleBackgroundColor: {
      //middle行颜色
      type: String,
      default: null
    },
    fontColor: {
      //行字体颜色
      type: String,
      default: null
    },
    tableCellFontSize: {
      //行字体大小
      type: String,
      default: null
    },
    rowClickColor: {
      //行选中颜色
      type: String,
      default: null
    },
    rowHoverColor: {
      //行悬浮颜色
      type: String,
      default: null
    },
    allBackgroundColor: {
      type: String,
      default: null
    },
    rowHeight: {
      type: Number,
      default: 50
    },
    getIcon: {
      type: Object,
      default: function() {
        return { projectIcon: null, middleIcon: null, taskIcon: null, lockIcon: null }
      }
    },
    iconWandH: {
      type: Number,
      default: 14
    },
    showAble: {
      type: Boolean,
      default: false
    },
    showResourceColor: {
      type: String,
      default: '#ff0000'
    }
  },
  watch: {
    tableStyle(newval) {
      if (!newval) {
        return
      }
      this.tableColumns = []
      switch (newval.canChoose) {
        case 0:
          this.showCheck = false
          this.showRadio = false
          break
        case 2:
          this.showCheck = false
          this.showRadio = true
          break
        default:
          this.showCheck = true
          this.showRadio = false
          break
      }
      //this.showSelection = newval.canChoose
      //window.console.log('-----------------------------表格内部样式变更', newval.canChoose)
      this.showIndex = newval.showIndex
      this.initColumns()
      for (let index = 0; index < newval.columnInfos.length; index++) {
        const item = newval.columnInfos[index]
        item.treeNode = undefined
      }
      if (newval.hasChildData && newval.columnInfos && newval.columnInfos.length > 0) {
        newval.columnInfos[0].treeNode = true
        // } else {
        //   newval.columnInfos.forEach((item) => {
        //     item.treeNode = undefined
        //   })
      }
      if (newval.child) {
        this.childtableColumns = []
        //window.console.log('-------------------------------------xxxxxxxx----------有子表格')
        let tempchildCol = this.cuteTableColumns(this.tableStyle.child.columnInfos, true)
        tempchildCol.forEach((element) => {
          this.childtableColumns.push(element)
        })
        //window.console.log('-------------------------------------xxxxxxxx----------有子表格', this.childtableColumns)
      }
      let tempCol = this.cuteTableColumns(newval.columnInfos)
      tempCol.forEach((element) => {
        this.tableColumns.push(element)
      })
      if (newval.editMode) {
        this.editConfig.trigger = newval.editMode
      }
      //this.defaultSort = { field: this.tableStyle.orderCode, order: this.tableStyle.orderType ? 'asc' : 'desc' }
      //window.console.log('-------------------------------------xxxxxxxx----------this.tableColumns', this.tableColumns)
      // this.loadData()
      //window.console.log('newval', newval)
    },
    showColumnIndex(newval) {
      this.showIndex = newval
    },
    showSelection(newval) {
      this.showCheck = newval
    },
    showRadioColumn(newval) {
      this.showRadio = newval
    },
    columns(newval) {
      //window.console.log('newval-col', newval)
      this.initColumns()
      this.tableColumns = this.cuteTableColumns(newval)
      this.loadData()
    },
    data(newval) {
      if (common.serialize(newval) == common.serialize(this.dataSource)) {
        return
      }
      let tempArr = newval
      //重新渲染操作列
      this.tableColumns.forEach((element) => {
        if (element.field === 'action') {
          element = this.makeActionColumn(element)
        }
        // if (element.isCanEdit) {
        //   tempArr.forEach((single) => {
        //     // if (single[element.field] === undefined) {
        //     //   single[element.field] = '1'
        //     // }
        //     if (single[element.field] && element.columnType === ModelPropertyType.DATE) {
        //       single[element.field] = moment(single[element.field])
        //     }
        //   })
        // }
      })
      //准备下拉框数据源
      //if ()
      // this.selectOptionArr.push({
      //   id: '640903034603442176',
      //   options: [
      //     { itemName: 'GET', itemValue: '0' },
      //     { itemName: 'POST', itemValue: '1' },
      //     { itemName: 'PUT', itemValue: '2' },
      //     { itemName: 'DELETE', itemValue: '3' },
      //   ],
      // })

      // window.console.log(
      //   'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      //   common.clone(tempArr)
      // )
      this.loading = false
      if (this.tablePage) {
        this.tablePage.total = tempArr.length
      }
      this.$emit('dataChange', null)
      this.dataSource = tempArr
      // 默认点击第一行
      // if (this.dataSource && this.dataSource.length > 0) {
      //   this.$refs.xTable3.setCurrentRow(this.dataSource[0])
      //   this.$emit('rowClick', this.dataSource[0])
      // } else {
      //   // 没数据的时候清空一下tooltip
      //   this.$refs.xTable3.clostTooltip()
      // }
    },
    tablePageConfig(newval) {
      if (this.tablePage) {
        this.tablePage.pageSize = newval.pageSize
        this.tablePage.currentPage = newval.currentPage
        // if (!newval.pageSizes) {
        //   this.tablePage.pageSizes = [10]
        // } else {
        //   this.tablePage.pageSizes = newval.pageSizes
        // }
        this.tablePage.total = newval.total
        //window.console.log('-----------------this.tablePage', this.tablePage)
      }
    },
    showPagination(newval) {
      if (!newval) {
        this.tablePage = null
      } else {
        this.tablePage = {}
        this.tablePage.pageSize = 10
        this.tablePage.currentPage = 1
        // this.tablePage.pageSizes = [10]
        this.tablePage.total = 0
      }
    },
    childdata(newval) {
      //window.console.log('-------------------------this.expandRow', this.expandRow)
      if (!this.expandRow) {
        return
      }

      // this.dataSource.forEach((element) => {
      //   if (element.id === this.expandRow.id) {
      //     element.child = newval
      //   }
      // })
      // window.console.log('-------------------------newval', newval)
      //this.$refs.ref64186426130433
      // window.console.log('-----------------------this.$refs', this.$refs)
      //this.expandRow[this.rowId]
      // window.console.log('-----------------------this.$refs-this.expandRow[this.rowId]', this.expandRow[this.rowId])
      // window.console.log('-----------------------this.$refs11111', this.$refs['ref' + this.expandRow[this.rowId]])
      this.$nextTick(() => {
        if (this.$refs['ref' + this.expandRow[this.rowId]]) {
          this.$refs['ref' + this.expandRow[this.rowId]].loadData(newval)
        }
      })
      //this.$refs.ref64186426130433.loadData(newval) //触发一下刷新操作
      //this.dataSource = this.dataSource
    },
    rowId(newval) {
      //window.console.log('------------------------------------rowId', newval)
      this.rowIdName = newval
    },
    emptyTip(newval) {
      //window.console.log('------------------------------------表格空值设置', newval)
      this.$refs.xTable3.$slots.empty = newval
    },
    allBackgroundColor() {
      this.$el.querySelector('.mytable-style .vxe-table').style.setProperty('--background-color', this.allBackgroundColor)
    }
  },
  mounted() {
    // if (this.expandAll) {
    //   this.treeConfig = { children: 'children', expandAll: true }
    // }
    //this.treeConfig.expandAll = this.expandAll
    //this.selectConfig.reserve = this.reserveData
    //this.column根据缓存更新
    //把展开列从列头中拿出来，单独处理，不控制列宽，显示隐藏以及顺序调整
    if (!this.columns) {
      return
    }
    //window.console.log('this.columns',this.columns)
    this.initColumns()
    //window.console.log('this.showColumns', this.showColumns)
    this.tableColumns = this.cuteTableColumns(this.columns)
    //window.console.log('this.tableColumns', this.tableColumns)
    this.loadData()
    this.$refs.xTable3.$slots.empty = this.emptyTip
    // this.checkConfig.checkMethod = (param) => {
    //   return false
    // }

    // this.nextTick(()=>{
    this.$el.querySelector('.mytable-style .vxe-table').style.setProperty('--background-color', this.allBackgroundColor)
    // })
  },
  created() {},
  methods: {
    init() {
      this.initColumns()
      this.tableColumns = this.cuteTableColumns(this.showColumns)
      this.loadData()
    },
    cuteColumnSolts(colTemplateData, colTemplateHeight) {
      if (!colTemplateData) {
        return undefined
      }
      // window.console.log('*********************加载列模板开始')
      //要处理下行为
      return {
        default: ({ row, rowIndex, column }) => {
          // window.console.log('*********************渲染操作列')
          return [
            <table-grid
              style={{ width: '100%', height: '100%', marginTop: '-15px' }}
              currentRowData={row}
              modelCode={colTemplateData.modelCode}
              onOnMounted={(layout) => this.onPageMounted(layout, colTemplateData, row)}
            />
          ]
        }
      }
    },
    onPageMounted(layout, columnTempData, row) {
      window.console.log('*********************加载列模板', columnTempData)
      if (columnTempData) {
        //let prop = this.parentPage.properties.find((item) => item.propertyName === '表格行')
        let property = columnTempData.properties.find((item) => item.propertyName === '表格行')
        if (property) {
          property.value = { modelCode: columnTempData.modelCode, data: common.clone(row) }
          //prop.value = { modelCode: columnTempData.modelCode, data: Object.assign(row) }
        }
        // window.console.log('---------------当前行变更propertyproperty1111', property)
        let newproperty = columnTempData.properties.find((item) => item.propertyName === '表格行模型')
        if (newproperty) {
          newproperty.value = common.clone(row)
          //prop.value = { modelCode: columnTempData.modelCode, data: Object.assign(row) }
        }
        //this.currentPageSimple.LoadingProperties(data.id, data.properties)
        columnTempData.children.forEach((element) => {
          let tempPro = element.properties.find((item) => item.propertyName === '顶部位置')
          if (tempPro) {
            tempPro.value = 0
          }
        })
        //window.console.log('表格行数据', layout)
        //layout.loadData
        //LoadData(common.clone(this.layoutData))
        //var tableGrid = layout
        //layout.currentRow = property.value
        //layout.RegisterMethods('表格行数据', PropertyGroupName.normal, null, this.currentRow)
        //** */
        //**layout是一个页面，把当前组件的父页面作为layout的父级布局 */
        layout.parentPage = this.parentPage
        layout.LoadPageByData(columnTempData.id,columnTempData)
        layout.ppap = common.getUuid()
        // layout.RegisterMethods('表格刷新', '', this.refresh, null, null)
        layout.$on('onCellLayoutRefreshCurrentPage', () => {
          this.refresh(false)
        })
        layout.$on('onCellLayoutRefresh', () => {
          this.refresh(true)
        })

        // layout.onClick_Event = (row) => {
        //   window.console.log('组件外壳收到点击', row)
        // }
        layout.StartShow(true)
      }
    },
    selectChange(row) {
      //window.console.log('点击行', row)
    },

    /**
     * 列拖拽
     * @param {object} param
     */
    checkMove(param) {
      var key = this.name + ':colsettingsNew'
      Vue.ls.set(key, this.localStorageColumns, 7 * 24 * 60 * 60 * 1000) //保存一周
      this.initColumns()
      this.tableColumns = this.cuteTableColumns(this.showColumns)
    },
    /**
     * 初始化显示列
     */
    initColumns() {
      //console.log('this.Columns', this.columns)
      this.showColumns = []
      this.tableOrders = []
      this.settingColumns = []
      if (!this.showSetColumnButton)
        this.columns.forEach((element) => {
          if (element.field === 'action' || element.field === 'expand') {
            this.showColumns.push(element)
            if (element.visible) {
              this.settingColumns.push(element.field)
            }
          }
        })
      else {
        var key = this.name + ':colsettingsNew'
        const colSettings = Vue.ls.get(key)
        if (colSettings != null && colSettings != undefined) {
          this.localStorageColumns = colSettings
          this.localStorageColumns.forEach((element) => {
            if (element.visible) {
              this.settingColumns.push(element.field)
            }
            if (element.defaultOrder != undefined) {
              this.tableOrders.push({ code: element.field, type: element.defaultOrder.toUpperCase() })
            }
            for (let index = 0; index < this.columns.length; index++) {
              const item = this.columns[index]
              if (element.field === item.field && element.visible) {
                if (element.width) {
                  item.width = element.width
                }
                this.showColumns.push(item)
                break
              }
            }
          })
          this.columns.forEach((element) => {
            if (element.field === 'action' || element.field === 'expand') {
              this.showColumns.push(element)
            }
          })
        } else {
          this.showColumns = []
          this.columns.forEach((element) => {
            if (element.field != 'action' && element.field != 'expand') {
              this.settingColumns.push(element.field)
              if (element.isShow === false) {
                this.localStorageColumns.push({
                  title: element.title,
                  dataIndex: element.field,
                  visible: false,
                  defaultOrder: element.defaultOrder
                })
              } else {
                this.localStorageColumns.push({ title: element.title, dataIndex: element.field, visible: true, defaultOrder: element.defaultOrder })
              }
            }
            if (element.defaultOrder != undefined) {
              this.tableOrders.push({ code: element.field, type: element.defaultOrder.toUpperCase() })
            }
            if (element.isShow !== false) {
              this.showColumns.push(element)
            }
          })
          Vue.ls.set(key, this.localStorageColumns, 7 * 24 * 60 * 60 * 1000) //保存一周
        }
      }
    },
    /**
     * 设置列的显示隐藏
     * @param {array} checkedValues 选中的数据
     */
    colSettingsChange(checkedValues) {
      var key = this.name + ':colsettingsNew'
      this.localStorageColumns.forEach((element) => {
        if (checkedValues.includes(element.field)) {
          element.visible = true
        } else {
          element.visible = false
        }
      })
      Vue.ls.set(key, this.localStorageColumns, 7 * 24 * 60 * 60 * 1000) //保存一周
      this.initColumns()
      this.tableColumns = this.cuteTableColumns(this.showColumns)
    },
    /**
     * 列宽调整
     * @param {object} param0 当前列的变更信息
     */
    columnSizeChange({ column }) {
      //console.log('column111', column)
      var key = this.name + ':colsettingsNew'
      const colSettings = Vue.ls.get(key)
      let columnMaxWidth = this.$parent.tableWidth - 34
      this.columns.forEach((child) => {
        if (child.isShow) {
          //window.console.log('child:', child)
          if (column.property != child.field) {
            if (child.width) {
              columnMaxWidth -= parseInt(child.width)
            } else {
              columnMaxWidth -= 40
            }
          }
        }
      })
      if (colSettings != null && colSettings != undefined) {
        colSettings.forEach((element) => {
          if (element.field === column.property) {
            element.width = column.renderWidth
          }
        })
      }
      this.columns.forEach((child) => {
        if (child.field === column.property) {
          child.width = column.renderWidth
        }
      })
      // let colsizes = Vue.ls.get(key)
      // if (colsizes == null || colsizes == undefined) {
      //   colsizes = {}
      // }
      // colsizes[column.property] = column.renderWidth
      //console.log('colSettings', colSettings)
      Vue.ls.set(key, colSettings, 7 * 24 * 60 * 60 * 1000) //保存一周
    },
    /**
     * 变更页码触发方法
     * @param {object} param0 页码信息
     */
    handlePageChange({ currentPage, pageSize }) {
      //window.console.log('-----------------分页信息变更', pageSize)
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //this.loadData()
      this.$emit('changePage', currentPage, pageSize)
    },

    handleSortChange({ column, property, order }) {
      if (!order) {
        this.$emit('sort', [])
        return
      }
      //window.console.info('property', property)
      // console.info('order', order)
      let orders = [{ code: property, type: order.toUpperCase() }]
      this.tableOrders = orders
      //console.info('ordersordersorders', orders)
      //this.loadData()
      //this.defaultSort = {}
      //window.console.info('order', orders)
      this.$emit('sort', orders)
    },

    /**
     * 刷新数据源
     */
    refresh(firstPage) {
      //window.console.log('刷新了', firstPage)
      if (this.showPagination && firstPage) {
        this.tablePage.currentPage = 1
      }
      //this.loadData()
      this.$emit('refresh', this.tablePage.currentPage)
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      if (!this.showPagination) {
        this.tablePage = null
      } else {
        this.tablePage.currentPage = this.pageNumber
        this.tablePage.pageSize = this.pageSize
      }
      const parameter = Object.assign({
        pageNumber: this.showPagination ? this.tablePage.currentPage : 1,
        pageSize: this.showPagination ? this.tablePage.pageSize : 10,
        tableCode: '',
        filter: [],
        orders: this.tableOrders
      })

      if (typeof this.data === 'object') {
        this.loading = false
        if (this.showPagination) {
          //this.tablePage.total = this.data.length
          //window.console.log('总数据', this.tablePage.total)
        }
        return
      }
      const result = this.data(parameter)
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        // if (typeof result === 'object') {
        //   console.log('resultresult', result)
        // }
        result.then((res) => {
          this.loading = false
          if (res != undefined && res != null) {
            //window.console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            this.dataSource = res.content
            if (this.showPagination) {
              this.tablePage.total = res.totalElements
            }
          }
        })
      }
    },
    /**
     * 重新组织列信息
     * @param {array} resourceColumns
     */
    cuteTableColumns(resourceColumns, ischild = false) {
      if (!resourceColumns) {
        return []
      }
      var columns = []
      // if (this.showCheck) {
      //   columns.push(this.makeSelectionColumn())
      // }
      // if (this.showRadio) {
      //   columns.push(this.makeRadioColumn())
      // }
      // if (this.showExpandColumn) {
      //   columns.push(this.makeExpandColumn())
      // }
      //子表格的设置
      if (this.tableStyle.child) {
        if (!ischild) {
          if (this.showCheck) {
            columns.push(this.makeSelectionColumn())
          } else if (this.showRadio) {
            columns.push(this.makeRadioColumn())
          }
          columns.push(this.makeChildTableColumn(this.tableStyle.child, this.currentRender))
        } else {
          if (this.tableStyle.child.isCanCheck !== false) {
            columns.push(this.makeSelectionColumn())
          }
        }
      } else {
        if (this.showCheck) {
          columns.push(this.makeSelectionColumn())
        }
        if (this.showRadio) {
          columns.push(this.makeRadioColumn())
        }
      }
      if (this.showIndex) {
        columns.push(this.makeIndexColumn())
      }
      columns.push(this.makeDropColumn())
      var firstFlag = true
      for (var i = 0; i < resourceColumns.length; i++) {
        var currentCol = resourceColumns[i]
        if (currentCol.field === 'expand') {
          continue
        }
        if (!currentCol.isShow) {
          continue
        }
        let newcol = common.clone(currentCol)
        //newcol.visible = currentCol.isShow
        newcol.field = currentCol.field
        newcol.title = currentCol.title
        newcol.minWidth = !currentCol.width ? '' : currentCol.width
        newcol.slots = this.cuteColumnSolts(currentCol.colTemplateData, currentCol.colTemplateHeight)
        //newcol.slots = currentCol.slots
        newcol.sortable = currentCol.sortable
        if (currentCol.field !== 'action' && currentCol.field !== this.rowIdName && this.isCanEdit) {
          // newcol.editRender = { type: 'default' }
        }

        //newcol['sort-method'] = currentCol.sortMethod
        //给最后一列的列头追加一个自定义列的插槽
        if (currentCol.field === 'action') {
          newcol = this.makeActionColumn(newcol)
          newcol.visible = currentCol.isShow
        } else {
          newcol.showOverflow = true
          // if (currentCol.resizable === false) {
          //   newcol.resizable = false
          // } else {
          //   newcol.resizable = true
          // }
          newcol.resizable = true
        }
        if (firstFlag) {
          //window.console.log('+++++++++++++++++++++++++++')
          //window.console.log(newcol)
          firstFlag = false
          currentCol.treeNode = true
        }
        if (currentCol.treeNode === true) {
          newcol.treeNode = true
        }
        const formatString = currentCol.formatString
        switch (currentCol.columnType) {
          case ModelPropertyType.DATE:
            newcol.formatter = (param) => {
              //window.console.log('-----------------表格列时间格式转换', param)
              return this.timeStamp2time(param, formatString)
            }
            newcol = this.makeDateEditColumn(newcol, formatString)
            break
          case ModelPropertyType.BOOL:
            //var formatString = currentCol.formatString
            //console.log('currentCol111', currentCol)
            // newcol.formatter = (param) => {
            //   window.console.log('--------------布尔类型进来了', param)
            //   //return this.timeStamp2time(param, formatString)
            //   return param.cellValue === 1 ? '是' : '否'
            // }
            newcol = this.makeBoolEditColumn(newcol)
            break
          case ModelPropertyType.ENUM:
            newcol = this.makeEnumColumn(newcol)
            break
          case ModelPropertyType.ENUMARRAY:
            newcol = this.makeEnumArrayColumn(newcol)
            break
          //FLOAT
          case ModelPropertyType.INT:
            newcol = this.makeInputNumberEditColumn(newcol, true)
            break
          case ModelPropertyType.FLOAT:
            newcol = this.makeInputNumberEditColumn(newcol, false)
            break
          default:
            //不指定类型的情况下，编辑状态使用输入框，antd的适配有点问题，使用vxetable中原生的input
            newcol = this.makeInputEditColumn(newcol)
            break
        }
        if (currentCol.treeNode == true) {
          newcol.isShowIcon = true
          //window.console.log('===================================')
          newcol = this.makeTreeNodeColumn(newcol)
          //window.console.log(newcol)
        }
        columns.push(newcol)
      }
      return columns
    },

    makeFirstColumn(oldcol) {
      var col = {}
      col.title = ''
      col.width = '40px'
      col.showOverflow = false
      return col
    },

    /**
     * 设置布尔类型可编辑列
     */
    makeBoolEditColumn(col) {
      var newcol = Object.assign({}, col)
      if (col.field === 'action' || col.field === this.rowIdName) {
        return newcol
      }
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        //window.console.log('-----------------------------------设置编辑列文本', newcol)
        newcol.editRender = { name: 'ASwitch' }
      }
      newcol.formatter = (param) => {
        //window.console.log('--------------布尔类型进来了', param)
        //return this.timeStamp2time(param, formatString)
        return param.cellValue == 1 ? '是' : '否'
      }
      return newcol
    },

    /**
     * 设置日期类型的可编辑列
     */
    makeDateEditColumn(col, formatString) {
      var newcol = Object.assign({}, col)
      if (col.field === 'action' || col.field === this.rowIdName) {
        return newcol
      }
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        let formatStr = 'YYYY/MM/DD HH:mm:ss'
        if (formatString && formatString.length > 0) {
          formatStr = formatString
        }
        //window.console.log('-----------------------------------设置编辑列日期', newcol)
        newcol.editRender = { name: 'ADatePicker', props: { type: 'date', format: formatStr, showTime: true } }
      }
      return newcol
    },

    /**
     * 设置输入框可编辑列
     */
    makeInputEditColumn(col) {
      var newcol = Object.assign({}, col)
      if (col.field === 'action' || col.field === this.rowIdName) {
        return newcol
      }
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        let maxLength =
          newcol.propertyDetail && newcol.propertyDetail.maxLength && newcol.propertyDetail.maxLength > 0 ? newcol.propertyDetail.maxLength : null
        if (maxLength && maxLength > 0) {
          // newcol.editRender = { name: 'AInput', attrs: { maxlength: maxLength } }
          newcol.editRender = { name: 'input', attrs: { maxlength: maxLength } }
        } else {
          // newcol.editRender = { name: 'AInput' }
          newcol.editRender = { name: 'input' }
        }
        //window.console.log('-----------------------------------设置编辑列文本', newcol)
      }
      return newcol
    },

    /**
     * 设置输入框可编辑列
     */
    makeInputNumberEditColumn(col, isInt) {
      var newcol = Object.assign({}, col)
      if (col.field === 'action' || col.field === this.rowIdName) {
        return newcol
      }
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        //如果有最大长度就按最大长度来判断
        let props = {}
        let min =
          newcol.propertyDetail && newcol.propertyDetail.minValue !== '' && newcol.propertyDetail.minValue == 0
            ? 0
            : newcol.propertyDetail && newcol.propertyDetail.minValue && newcol.propertyDetail.minValue > 0
            ? newcol.propertyDetail.minValue
            : null
        let max =
          newcol.propertyDetail && newcol.propertyDetail.maxValue && newcol.propertyDetail.maxValue > 0 ? newcol.propertyDetail.maxValue : null
        // if (newcol.propertyDetail.maxLength && newcol.propertyDetail.maxLength > 0) {
        //   newcol.editRender = { name: 'input', attrs: { maxlength: newcol.propertyDetail.maxLength } }
        // }
        let precision = newcol.propertyDetail && newcol.propertyDetail.per && newcol.propertyDetail.per > 0 ? newcol.propertyDetail.per : null
        if (min != null) {
          props.min = min
        }
        if (max) {
          props.max = max
        }
        if (precision) {
          props.precision = precision
        }
        newcol.editRender = { name: 'AInputNumber', props: props }
        //newcol.editRender = { name: 'AInputNumber', props: { max: max, min: min } }
        //window.console.log('-----------------------------------设置编辑列数值', newcol)
      }
      if (isInt) {
        newcol.slots = {
          default: ({ row, column }) => {
            // window.console.log('---------------整数row', newcol.field)
            //window.console.log('---------------整数row111', row)
            return [
              <span>
                {row[newcol.field] === undefined || row[newcol.field] === null || row[newcol.field] === '' || isNaN(row[newcol.field])
                  ? ''
                  : parseInt(row[newcol.field])}
              </span>
            ]
          }
        }
      } else {
        newcol.slots = {
          default: ({ row, column }) => {
            // window.console.log('---------------浮点数row', newcol.field)
            //window.console.log('---------------浮点数row1111', row)
            return [
              <span>
                {row[newcol.field] === undefined || row[newcol.field] === null || row[newcol.field] === '' || isNaN(row[newcol.field])
                  ? ''
                  : parseFloat(row[newcol.field])}
              </span>
            ]
          }
        }
      }
      return newcol
    },

    /**
     * 设置枚举列
     */
    makeEnumColumn(col) {
      var newcol = Object.assign({}, col)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        //选择框不支持自定义赋选中值，只能使用field，自定义来实现
        newcol.editRender = { name: 'default' }
        newcol.slots.edit = (scope) => {
          //const itemValue = scope.row[col.field].itemValue + ''
          //window.console.log('-------------------------表格下拉框selectOptionArr', this.selectOptionArr)
          const options = this.selectOptionArr.find((item) => item.propertyCode === newcol.field)
          //window.console.log('-------------------------表格下拉框options', options)
          // window.console.log('-------------------------表格下拉框itemValue', itemValue)
          //window.console.log('-------------------------表格下拉框this.selectOptionArr[0].options', common.clone(this.selectOptionArr[0].item))
          let allowClear = true
          const select = (
            <a-select
              allowClear={allowClear}
              defaultValue={scope.row[col.field] ? scope.row[col.field].itemValue + '' : ''}
              style="width:90%"
              onchange={(e, option) => this.handleChange(e, option, scope, col.field)}
            >
              {options.item.map((item) => {
                return (
                  <a-select-option value={item.itemValue} fieldName={col.field} item={scope.row[col.field]}>
                    <span style="display: inline-block;width: 100%">{item.itemName}</span>
                  </a-select-option>
                )
              })}
            </a-select>
          )
          return [<div>{select}</div>]
        }
      }
      if (col.isShowIcon) {
        newcol.slots.default = ({ row, rowIndex, column, columnIndex }) => {
          //const showName = row[col.field].itemName ? row[col.field].itemName : ''
          return [
            <div>
              <a-icon type={row[col.field].iconUrl} />
              <span>{this.getSelectLabel(row, col.field)}</span>
            </div>
          ]
        }
      } else {
        newcol.slots.default = ({ row, rowIndex, column, columnIndex }) => {
          //const showName = row[col.field].itemName ? row[col.field].itemName : ''
          return [
            <div>
              <span>{this.getSelectLabel(row, col.field)}</span>
            </div>
          ]
        }
      }
      //window.console.log('newcolnewcolnewcolnewcol', newcol)
      return newcol
    },

    /**
     * 设置树图标
     */
    makeTreeNodeColumn(col) {
      //window.console.log('==============================makeTreeNodeColumn')
      //window.console.log(col)
      var newcol = Object.assign({}, col)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      var projectIcon = projectLevelIcon
      var middleIcon = lineLevelIcon
      var taskIcon = taskLevelIcon
      // var lockedIcon = lockIcon
      if (this.getIcon.projectIcon && this.getIcon.projectIcon.length > 0) {
        //window.console.log('this.getIcon.projectIcon', this.getIcon.projectIcon)
        projectIcon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.getIcon.projectIcon[0].url.split('?')[0])
      }
      if (this.getIcon.middleIcon && this.getIcon.middleIcon.length > 0) {
        //window.console.log('this.getIcon.middleIcon', this.getIcon.middleIcon)
        middleIcon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.getIcon.middleIcon[0].url.split('?')[0])
      }
      if (this.getIcon.taskIcon && this.getIcon.taskIcon.length > 0) {
        //window.console.log('this.getIcon.taskIcon', this.getIcon.taskIcon)
        taskIcon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.getIcon.taskIcon[0].url.split('?')[0])
      }
      // if (this.getIcon.lockIcon && this.getIcon.lockIcon.length > 0) {
      //   window.console.log('this.getIcon.lockIcon', this.getIcon.lockIcon)
      //   lockedIcon = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.getIcon.lockIcon[0].url.split('?')[0])
      // }
      newcol.slots.default = ({ row, rowIndex, column, columnIndex }) => {
        let name = row[column.property]
        return [
          <span style="white-space:noworp">
            <span style="margin-right:4px;display:inline;white-space:noworp">
              {row.type === 'project' ? (
                <img referrer="no-referrer|origin|unsafe-url" v-lazy={projectIcon} width={this.iconWandH + 'px'} height={this.iconWandH + 'px'} />
              ) : row.type === 'middle' ? (
                <img referrer="no-referrer|origin|unsafe-url" v-lazy={middleIcon} width={this.iconWandH + 'px'} height={this.iconWandH + 'px'} />
              ) : (
                <img referrer="no-referrer|origin|unsafe-url" v-lazy={taskIcon} width={this.iconWandH + 'px'} height={this.iconWandH + 'px'} />
              )}
            </span>
            {row.type === 'task' ? (
              <span style="white-space:noworp">{name}</span>
            ) : (
              <span style="white-space:noworp;font-weight:600;color:#2E2424">{name}</span>
            )}
          </span>
        ]
      }
      newcol.align = 'left'
      newcol.headerAlign = 'center'
      return newcol
    },

    /**
     * 设置枚举数组列
     */
    makeEnumArrayColumn(col) {
      var newcol = Object.assign({}, col)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        //选择框不支持自定义赋选中值，只能使用field，自定义来实现
        newcol.editRender = { name: 'default' }
        newcol.slots.edit = (scope) => {
          //window.console.log('-------------------------表格多选下拉框selectOptionArr', this.selectOptionArr)
          const options = this.selectOptionArr.find((item) => item.propertyCode === newcol.field)
          //window.console.log('-------------------------表格多选下拉框options', options)
          //window.console.log('-------------------------表格多选下拉框scope.row[col.field]', scope.row[col.field])
          let defaultValue = []
          if (scope.row[col.field] instanceof Array && scope.row[col.field].length > 0) {
            scope.row[col.field].forEach((item) => {
              defaultValue.push(item.itemValue + '')
            })
          } else {
            defaultValue = undefined
          }
          let allowClear = true
          const select = (
            <a-select
              allowClear={allowClear}
              mode="multiple"
              defaultValue={defaultValue}
              style="width:90%"
              onchange={(e, option) => this.arrayHandleChange(e, option, scope, col.field)}
            >
              {options.item.map((item) => {
                return (
                  <a-select-option value={item.itemValue} fieldName={col.field} item={scope.row[col.field]}>
                    <span style="display: inline-block;width: 100%">{item.itemName}</span>
                  </a-select-option>
                )
              })}
            </a-select>
          )
          return [<div>{select}</div>]
        }
      }

      if (col.isShowIcon) {
        newcol.slots.default = ({ row, rowIndex, column, columnIndex }) => {
          let temp = row[col.field]
          let iconUrl = ''
          let showName = ''
          if (temp && temp.length > 0) {
            iconUrl = temp[0].iconUrl
            temp.forEach((element) => {
              showName += element.itemName + ','
            })
          }
          if (showName.length > 0) {
            showName = showName.substring(0, showName.length - 1)
          }
          return [
            <div>
              <a-icon type={iconUrl} />
              <span>{showName}</span>
            </div>
          ]
        }
      } else {
        newcol.formatter = (param) => {
          //return this.timeStamp2time(param, formatString)
          //window.console.log('param111', param)
          let temp = param.cellValue
          let showName = ''
          if (temp && temp.length > 0) {
            temp.forEach((element) => {
              showName += element.itemName + ','
            })
          }
          if (showName.length > 0) {
            showName = showName.substring(0, showName.length - 1)
          }
          return showName
        }
      }
      //window.console.log('newcolnewcolnewcolnewcol', newcol)
      return newcol
    },

    /**
     * 设置可展开列
     */
    makeExpandColumn() {
      var col = {}
      col.type = 'expand'
      col.width = '60px'
      col.showOverflow = false
      //col.slot
      return col
    },
    /**
     * 创建选中列
     */
    makeSelectionColumn() {
      var col = {}
      col.type = 'checkbox'
      col.width = '40px'
      col.showOverflow = false
      return col
    },
    /**
     * 创建选中列
     */
    makeRadioColumn() {
      var col = {}
      col.type = 'radio'
      col.width = '40px'
      col.showOverflow = false
      return col
    },
    /**
     * 创建序号列
     */
    makeIndexColumn() {
      var col = {}
      col.title = '序号'
      col.type = 'index'
      col.width = '60px'
      col.showOverflow = false
      //col['tree-node'] = true
      return col
    },
    /**
     * 创建拖拽列
     */
    makeDropColumn() {
      // var newcol = Object.assign({}, column)
      var col = {}
      col.title = ''
      col.width = '25px'
      // col.class = 'drag-btn'
      col.showOverflow = false
      col.slots = {}
      col.resizable = false
      col.slots.default = ({ row, rowIndex, column, columnIndex }) => {
        var flag = true
        if (row.type === 'task' && row.locked != true) {
          flag = true
        } else {
          flag = false
        }
        return [
          <div>
            {flag ? (
              <div class="drag-btn">
                <img referrer="no-referrer|origin|unsafe-url" v-lazy={dropIcon} width={'14px'} height={'14px'} />
              </div>
            ) : (
              <div class="filterDrag">
                <img referrer="no-referrer|origin|unsafe-url" v-lazy={dropIcon} width={'14px'} height={'14px'} />
              </div>
            )}
          </div>
        ]
      }
      //col['tree-node'] = true
      return col
    },
    /**
     * 重新渲染操作列
     * @param {object} column 操作列
     */
    makeActionColumn(column) {
      var newcol = Object.assign({}, column)
      newcol.showOverflow = false
      // newcol.minWidth = '80px'
      // newcol.width = 80
      newcol.resizable = true
      //console.info('newcol.slots', newcol)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      newcol.slots.header = ({ row, column }) => {
        return [
          <div>
            <span>{column.title}</span>
            <span style={{ display: this.showRefreshButton ? 'inline' : 'none' }}>
              <a
                style="margin-left: 10px"
                onClick={() => {
                  this.refresh()
                }}
              >
                <a-icon type="sync" /> 刷新
              </a>
            </span>
            <span style={{ display: this.showSetColumnButton ? 'inline' : 'none', marginLeft: '10px' }}>
              <a-popover title="自定义列" trigger="click" placement="leftBottom">
                <template slot="content">
                  <a-checkbox-group onChange={this.colSettingsChange} v-model={this.settingColumns} defaultValue={this.settingColumns}>
                    {this.localStorageColumns.map((item, index) => (
                      <a-row span="12">
                        <a-checkbox value={item.field}>{item.title}</a-checkbox>
                      </a-row>
                    ))}
                  </a-checkbox-group>
                </template>
                <a>
                  <a-icon type="setting" />
                  配置
                </a>
              </a-popover>
            </span>
          </div>
        ]
      }

      // newcol.slots.default = ({ row, rowIndex, column }) => {
      //   return [
      //     <span>
      //       <a-button onClick={() => this.$message.info('查看' + rowIndex)}>查看</a-button>
      //       <a-divider type="vertical" />
      //       <a-button onClick={() => this.$message.info('编辑' + rowIndex)}>编辑</a-button>
      //       <a-divider type="vertical" />
      //       <a-button onClick={() => this.$message.info('删除' + rowIndex)}>删除</a-button>
      //     </span>,
      //   ]
      // }
      //window.console.log('newcol', newcol.slots.default)
      return newcol
    },
    makeChildTableColumn(tabStyle) {
      //window.console.log('---------------------------------------------添加折叠展开列xxxxxxxxxxxxxxxxxxxxxxxxxxx')
      var col = {}
      col.type = 'expand'
      col.width = '60px'
      col.slots = {
        default: ({ row, column }) => {
          //window.console.log('-----------------------展开行row[this.rowId]', row[this.rowId])
          return [
            <vxe-grid
              highlight-current-row
              row-id={this.childrowId}
              ref={'ref' + row[this.rowId]}
              columns={this.childtableColumns}
              on-select-change={this.selectchildRow}
              on-radio-change={this.radiochildChange}
              on-select-all={this.selectchildRow}
              on-current-change={this.childrowClick}
              on-edit-closed={(scope) => this.editchildClosed(scope, row[this.rowId])}
              on-cell-dblclick={(scope) => this.childcelldbclick(scope, row[this.rowId])}
            />
          ]
        }
      }
      return col
    },
    getchildRow(e, row) {
      //window.console.log('---------------------------展开了xxxx')
    },
    expendRow(param) {
      // console.log('展开行', param)
      // this.tempData.push({ eventName: '111' })
    },
    selectRow(param, event) {
      //this.selectRows = param.selection
      //window.console.log('------------------表格复选选中', param)
      this.$emit('select', param.selection, param.row, param.checked)
    },
    radioChange(param, event) {
      const selection = []
      selection.push(param.row)
      //window.console.log('------------------表格单选选中', param)
      this.$emit('select', selection, param.row)
    },
    rowClick(param, event) {
      this.currentSelectedRowID = param.row.id
      this.$emit('rowClick', param.row)
    },
    dbClick({ row }) {
      //表格行双击事件
      this.celldbclick({ row })
      this.$emit('dbClick', row)
    },
    //时间格式转换
    timeStamp2time(param, formatString) {
      let formatStr = 'YYYY-MM-dd hh:mm:ss'
      if (formatString && formatString.length > 0) {
        formatStr = formatString
      }
      // window.console.log('formatString', formatStr)
      if (!param.cellValue) {
        return ''
      }
      // window.console.log('param.cellValue', param.cellValue)
      var datetime = new Date()
      datetime.setTime(param.cellValue)
      return datetime.format(formatStr)
    },
    clearSelect() {
      // this.$refs['xTable3'].clearSelection()
      // this.$refs['xTable3'].clearCheckboxRow()
    },
    toggleExpandChangeEvent({ expanded, row, rowIndex }, event) {
      //window.console.log('--------------------------表格展开', row)
      if (expanded) {
        this.expandRow = row
        this.$emit('expand', row)
      }
    },
    //表格编辑的相关操作
    /**
     * 表格编辑的相关操作
     */

    /**编辑开始 */
    editRow(row) {
      //window.console.log('---------------------------编辑行开始row', row)
      //this.dataSource[0]
      //window.console.log('---------------------------编辑行开始this.dataSource[0]', this.dataSource[0])
      let tempRow = this.dataSource.find((item) => item[this.rowIdName] === row[this.rowIdName])
      this.tableColumns.forEach((element) => {
        if (element.isCanEdit && element.columnType === ModelPropertyType.DATE) {
          if (tempRow[element.field]) {
            tempRow[element.field] = moment(tempRow[element.field])
          }
        }
      })
      this.$refs.xTable3.setActiveRow(tempRow)
      this.activeRow = tempRow
      //window.console.log('---------------------------编辑行开始tempRow', tempRow)
    },

    /**编辑取消 */
    editRowCancel(row) {
      const xTable = this.$refs.xTable3
      this.isCancelRow = true
      xTable.clearActived().then(() => {
        // 还原行数据
        this.tableColumns.forEach((element) => {
          if (element.isCanEdit && element.columnType === ModelPropertyType.DATE) {
            if (row[element.field]) {
              row[element.field] = moment(row[element.field])
            }
          }
        })

        let tempRow = this.dataSource.find((item) => item[this.rowIdName] === row[this.rowIdName])
        //window.console.log('---------------------------编辑行取消tempRow', tempRow)
        Object.keys(row).forEach((item) => {
          tempRow[item] = row[item]
        })
        xTable.revertData(tempRow)
        this.activeRow = row
        this.$emit('rowEditEnd', row)
      })
    },

    /**编辑保存 */
    editRowSave(row) {
      let tempRow = this.dataSource.find((item) => item[this.rowIdName] === row[this.rowIdName])
      //window.console.log('---------------------------编辑行保存tempRow', tempRow)
      this.$refs.xTable3.clearActived().then(() => {
        // this.$XModal.alert('success')
        //保存之后触发数据源变更
        // this.$emit('rowEditEnd', tempRow)
      })
    },
    /** 编辑结束 */
    editClosed({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell }) {
      //行编辑取消不触发行编辑结束方法，自行处理
      if (this.isCancelRow) {
        this.isCancelRow = false
        return
      }

      //let editData = this.$refs.xTable3.getActiveRecord()
      //window.console.log('------------------获取当前编辑行', editData)
      //rowEditEnd
      this.tableColumns.forEach((item) => {
        if (item.isCanEdit && item.columnType === ModelPropertyType.DATE) {
          row[item.field] = moment(row[item.field]).valueOf()
        }
        if (item.isCanEdit && item.columnType === ModelPropertyType.BOOL) {
          row[item.field] = row[item.field] == true || row[item.field] == 1 ? 1 : 0
        }
        //数值类型编辑之后如果为空的话就还原成最小值
        if (!row[item.field] && (item.columnType === ModelPropertyType.INT || item.columnType === ModelPropertyType.FLOAT) && item.isCanEdit) {
          if (item.propertyDetail && item.propertyDetail.minValue) {
            row[item.field] = item.propertyDetail.minValue
          } else {
            row[item.field] = 0
          }
        }
        if (item.columnType === ModelPropertyType.INT && row[item.field] < item.propertyDetail.minValue) {
          row[item.field] = parseInt(item.propertyDetail.minValue)
        }
        if (item.columnType === ModelPropertyType.FLOAT && row[item.field] < item.propertyDetail.minValue) {
          row[item.field] = parseFloat(item.propertyDetail.minValue)
        }
      })
      this.activeRow = row
      this.$emit('rowEditEnd', row)
    },

    /**下拉框的值改变方法 */
    handleChange(value, option, scope, field) {
      // window.console.log('---------------------------编辑行下拉选择value', value)
      //window.console.log('---------------------------编辑行下拉选择option', option)
      // window.console.log('---------------------------编辑行下拉选择option.data.attrs.fieldName', option.data.attrs.fieldName)
      // window.console.log('---------------------------编辑行下拉选择option.data.attrs.item', option.data.attrs.item)
      //window.console.log('-------------------------编辑行下拉选择this.selectOptionArr[0].options', common.clone(this.selectOptionArr[0].item))
      if (!option) {
        scope.row[field] = null
        return
      }
      if (field) {
        if (!scope.row[field]) {
          scope.row[field] = {}
        }
        scope.row[field].itemValue = value
        let tempOption = this.selectOptionArr.find((item) => item.propertyCode == field).item.find((item) => item.itemValue == value)
        scope.row[field].itemName = tempOption.itemName
        scope.row[field].itemCode = tempOption.itemCode
      }
    },
    getSelectLabel(row, field) {
      //let tempRow = this.dataSource.find((item) => item[this.rowIdName] === row[this.rowIdName])
      //window.console.log('---------------------------编辑行下拉选择显示tempRow', row)
      //window.console.log('---------------------------编辑行下拉选择显示field', field)
      //window.console.log('---------------------------编辑行下拉选择显示row[field]', row[field])
      return row[field] ? (row[field].itemName ? row[field].itemName : '') : ''
    },

    /** 日期组件的值改变方法 */
    DateValueChange(value, option) {
      // if (option.data.attrs.fieldName) {
      //   this.activeRow[option.data.attrs.fieldName].itemValue = value
      //   let tempOption = this.selectOptionArr[0].item.find((item) => item.itemValue == value)
      //   this.activeRow[option.data.attrs.fieldName].itemName = tempOption.itemName
      // }
    },

    /**
     * 设置选中相关方法
     */

    /**设置选中 */
    setRowsSelected(rows, checked) {
      window.console.log('-----------------------------表格设置勾选', rows)
      this.$refs.xTable3.setSelection(rows, checked)
    },
    /**设置全部选中 */
    setAllRowsSelected(checked) {
      window.console.log('-----------------------------表格设置全选', this.$refs.xTable3)
      if (this.showRadio) {
        //单选不支持全选
        return
      }
      if (checked) {
        if (!this.selectValues) {
          this.selectValues = []
        }
        this.dataSource.forEach((item) => {
          this.selectValues.push(item[this.rowIdName])
        })
      } else {
        this.selectValues = []
      }
      //window.console.log('-----------------------------this.selectValues', this.selectValues)
      this.$refs.xTable3.setAllSelection(checked)
    },

    selectchildRow(param, event) {
      //window.console.log('-----------------------------子表格选中行多选', param)
      this.$emit('selectchild', param.row, param.checked)
    },
    radiochildChange(param, event) {
      // const selection = []
      // selection.push(param.row)
      //window.console.log('-----------------------------子表格选中行单选', param)
      this.$emit('selectchild', param.row, true)
    },
    refreshChildData(masterId, newval) {
      //window.console.log('-----------------------this.$refs', this.$refs)
      this.$nextTick(() => {
        if (this.$refs['ref' + masterId]) {
          this.$refs['ref' + masterId].loadData(newval)
        }
      })
    },
    getEditRow() {
      let editData = this.$refs.xTable3.getActiveRow()
      if (editData) {
        return editData.row
      } else {
        return this.activeRow
      }
      //window.console.log('------------------获取当前编辑行', editData)
      //window.console.log('------------------获取当前编辑行activeRow', this.activeRow)
    },
    setRowExpand(masterId) {
      //需要修改
      //window.console.log('------------------手动设置展开行')
      let row = this.dataSource.find((item) => item[this.rowIdName] == masterId)
      this.$refs.xTable3.setRowExpansion(row, true)
      this.expandRow = row
      this.$emit('expand', row)
    },
    editchildClosed({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell, parentId }) {
      //window.console.log('-----------------------------编辑子表格结束', row)
      //this.activeRow = row
      this.$emit('childrowEditEnd', row, parentId)
    },
    /** 指定点击行 */
    setRowSelect(rowId) {
      let row = this.dataSource.find((item) => item[this.rowIdName] == rowId)
      if (row) {
        this.$refs.xTable3.setCurrentRow(row)
        this.$emit('rowClick', row)
      }
    },
    clearRowExpand() {
      this.$refs.xTable3.clearRowExpand()
    },
    celldbclick(param) {
      //window.console.log('-------------------------------双击表格', param)
      //点击行之后勾选当前行，只有手动点击才触发
      let rows = []
      rows.push(param.row)
      let checked = true
      let selectedRow = this.$refs.xTable3.getSelectRecords()
      let idx = -1
      if (selectedRow && selectedRow.length > 0) {
        idx = selectedRow.findIndex((item) => item[this.rowIdName] == param.row[this.rowIdName])
      }
      checked = idx == -1
      //window.console.log('---------------------行点击选中xxxx', selectedRow)
      this.setRowsSelected(rows, checked)
      if (this.editConfig.trigger === 'dblclick') {
        let row = this.dataSource.find((single) => single[this.rowIdName] == param.row[this.rowIdName])
        this.tableColumns.forEach((item) => {
          if (item.isCanEdit && item.columnType === ModelPropertyType.DATE) {
            if (row[item.field]) {
              row[item.field] = moment(row[item.field])
            }
          }
        })
      }
      //触发勾选事件
      this.$emit('celldbclick', this.$refs.xTable3.getSelectRecords(), param.row, checked)
    },

    /**切换列状态
     * 组件自带的visible属性在某些条件下无法生效
     */
    switchColumnStatus(columnCode, isshow) {
      //window.console.log('----------切换列状态')
      this.$nextTick(() => {
        let columnIndex = this.tableStyle.columnInfos.findIndex((item) => item.field == columnCode)
        if (columnIndex < 0) {
          return
        }
        let column = this.tableStyle.columnInfos[columnIndex]
        column.isShow = isshow
        this.tableColumns = this.cuteTableColumns(this.tableStyle.columnInfos)
      })
    },
    childcelldbclick(param, parentId) {
      //window.console.log('-------------------------------双击子表格', param)
      this.$emit('childcelldbclick', param.row, true)
    },
    exportData() {
      //准备导出的列名
      let nameArr = []
      let tempData = common.clone(this.dataSource)
      let formatStr = 'YYYY-MM-dd hh:mm:ss'
      this.tableColumns.forEach((item) => {
        if (item.field && item.field !== 'action') {
          nameArr.push(item.field)
        }
        // tempData.forEach((row) => {
        //   if (item.columnType === ModelPropertyType.BOOL) {
        //     if (row[item.field]) {
        //       row[item.field] = row[item.field] == '1' ? '是' : '否'
        //     }
        //   }
        //   if (item.columnType === ModelPropertyType.ENUM) {
        //     if (row[item.field]) {
        //       row[item.field] = row[item.field].itemName
        //     }
        //   }
        //   let itemNameArr = ''
        //   if (item.columnType === ModelPropertyType.ENUMARRAY) {
        //     if (row[item.field] instanceof Array && row[item.field].length > 0) {
        //       row[item.field].forEach((item) => {
        //         itemNameArr += item.itemName + ','
        //       })
        //     }
        //     if (itemNameArr.length > 0) {
        //       itemNameArr = itemNameArr.substring(0, itemNameArr.length - 1)
        //     }
        //     row[item.field] = itemNameArr
        //   }
        //   if (item.columnType === ModelPropertyType.DATE) {
        //     if (row[item.field]) {
        //       var datetime = new Date()
        //       datetime.setTime(moment(row[item.field]).valueOf())
        //       row[item.field] = datetime.format(formatStr)
        //     }
        //   }
        // })
      })
      this.$refs.xTable3.exportData({
        type: 'csv',
        columnFilterMethod: (column) => nameArr.includes(column.property),
        //不使用原始数据，使用格式化之后的数据
        original: false
      })
    },
    childrowClick(param, event) {
      //window.console.log('---------------------进入子表格行点击事件')
      this.$emit('childrowClick', param.row)
    },
    arrayHandleChange(value, option, scope, field) {
      //window.console.log('---------------------------编辑行下拉多选option', option)
      //window.console.log('---------------------------编辑行下拉多选value', value)
      if (!option) {
        scope.row[field] = null
        return
      }
      if (field) {
        if (!scope.row[field]) {
          scope.row[field] = {}
        }
        let currentValueStr = ''
        let currentNameStr = ''
        let currentCodeStr = ''
        let tempOption = this.selectOptionArr.find((item) => item.propertyCode == field).item
        value.forEach((element) => {
          currentValueStr += element + ','
          currentNameStr += tempOption.find((item) => item.itemValue == element).itemName + ','
          currentCodeStr += tempOption.find((item) => item.itemValue == element).itemCode + ','
        })
        if (currentValueStr.length > 0) {
          currentValueStr = currentValueStr.substring(0, currentValueStr.length - 1)
        }
        if (currentNameStr.length > 0) {
          currentNameStr = currentNameStr.substring(0, currentNameStr.length - 1)
        }
        if (currentCodeStr.length > 0) {
          currentCodeStr = currentCodeStr.substring(0, currentCodeStr.length - 1)
        }
        // scope.row[field].itemName = currentNameStr
        // scope.row[field].itemCode = currentCodeStr
        scope.row[field] = currentValueStr
      }
    },

    toggleTreeExpand({ row, expanded }) {
      //window.console.log('节点展开事件' + expanded)
      //window.console.log('展开收起事件')
      //window.console.log(' this.dataSource', this.dataSource)
      if (row.children != undefined && row.children.length > 0) {
        //如果选中行是当前收起或展开行的children，则当前选中行清空还原
        let index = row.children.findIndex((item) => item.id === this.currentSelectedRowID)
        if (index > -1) {
          this.currentSelectedRowID = ''
        }
      }

      count = 0
      this.$emit('toggleTreeExpand', { row, expanded })
    },
    rowStyle({ row }) {
      // this.$el.querySelector('.mytable-style .vxe-table').style.setProperty('--background-color',this.allBackgroundColor)
      let styleRecord = {
        color: this.fontColor,
        fontSize: this.tableCellFontSize,
        height: this.rowHeight + 'px'
      }
      if (row.type == 'task') {
        count++
        if (count % 2 == 1) {
          styleRecord.backgroundColor = this.oddRowBackgroundColor
        } else {
          styleRecord.backgroundColor = this.evenRowBackgroundColor
        }
      } else if (row.type == 'project') {
        if (this.showAble && row.portability) {
          styleRecord.backgroundColor = this.showResourceColor
        } else {
          styleRecord.backgroundColor = this.projectBackgroundColor
        }
      } else if (row.type == 'middle') {
        if (this.showAble && row.portability) {
          styleRecord.backgroundColor = this.showResourceColor
        } else {
          styleRecord.backgroundColor = this.middleBackgroundColor
        }
      }
      if (row.id == this.currentSelectedRowID) {
        styleRecord.backgroundColor = this.rowClickColor
      } else if (row.id == this.currentHoveredRowID) {
        styleRecord.backgroundColor = this.rowHoverColor
      }
      return styleRecord
    },
    cellStyle() {
      let styleRecord = {
        'border-bottom': '1px solid #D9D9D9'
      }
      return styleRecord
    },
    mouseenterCell({ row }) {
      //鼠标悬停事件
      count = 0
      this.currentHoveredRowID = row.id
      this.currentHoveredRow = row
      this.$emit('rowHover', row)
    },
    mouseleaveCell({ row }) {
      //鼠标离开事件
      count = 0
      this.currentHoveredRowID = ''
      this.$emit('rowLeave', row)
    },
    changeStyle(row, rowID, isClick, isLeave) {
      //右侧甘特图选中行时调用（为了左右两侧选中行同步）
      count = 0
      if (isClick) {
        //鼠标选中
        this.currentSelectedRowID = rowID
        this.currentHoveredRow = row
      } else {
        //鼠标悬浮
        this.currentHoveredRowID = rowID
        this.currentHoveredRow = row
      }
      if (isLeave) {
        //鼠标离开
        this.currentHoveredRowID = ''
        this.currentHoveredRow = {}
      }
    },
    /**查找 */
    getTask(id, list) {
      try {
        this.getOne(id, this.$parent.dataSource)
      } catch (error) {
        if (error.item === 'get') return { self: error.self }
        else {
          //window.console.log(error)
          return { self: null }
        }
      }
      return { self: null }
    },
    getOne(id, list) {
      list.forEach((child) => {
        if (child.id === id) {
          throw { item: 'get', self: child }
        } else if (child.children && child.children.length > 0) {
          this.getOne(id, child.children)
        }
      })
    },
    /**左右拖拽拉伸 */
    reundoTime(type, doItem, list) {
      if (type == null || doItem == null) return
      let timeList = []
      if (type === 'old') {
        timeList = doItem.old
      } else if (type === 'new') {
        timeList = doItem.new
      }
      var has = false
      var flag = false
      var thisList = []
      if (list) thisList = list
      else {
        thisList = this.$parent.dataSource
        flag = true
      }
      thisList.forEach((child) => {
        var index = timeList.idList.indexOf(child.id)
        if (index >= 0) {
          has = true
          child.planBeginTime = timeList.stList[index]
          child.planEndTime = timeList.enList[index]
        } else {
          if (child.children && child.children.length > 0) {
            this.reundoTime(type, doItem, child.children)
            // var result = this.reundoTime(type, doItem, child.children)
            // if (result) this.handlerFatherNode(child)
          }
        }
      })
      // if (flag) this.changeTaskList()
      return has
    },
    /**新增任务 */
    addNewTask(task, depen, index, type, list) {
      // window.console.log('#######################')
      // window.console.log('addNewTask')
      try {
        this.addNewTaskOne(task, depen, index, type, this.$parent.dataSource)
      } catch (error) {
        if (error === 'have') {
          this.$message.info('当前信息已存在')
        } else if (error === 'over') {
          //
          if (task.children && task.children.length > 0) {
            if (task.isexpand === false) {
              this.$refs.xTable3.setTreeExpansion(task, task.isexpand)
            } else {
              this.$refs.xTable3.setTreeExpansion(task, true)
            }
          }
        } else {
          //window.console.log(error)
          throw error
        }
      }
    },
    //
    haveExpand() {
      var expandList1 = []
      var expandList2 = []
      this.haveExpandList(this.dataSource, expandList1, expandList2)
      this.$refs.xTable3.setTreeExpansion(expandList1, true)
      this.$refs.xTable3.setTreeExpansion(expandList2, false)
    },
    //
    haveExpandList(data, list1, list2) {
      data.forEach((child) => {
        if (child.isexpand === true) {
          list1.push(child)
        } else if (child.isexpand === false) {
          list2.push(child)
        }
        if (child.children && child.children.length > 0) {
          this.haveExpandList(child.children, list1, list2)
        }
      })
    },
    addNewTaskOne(task, depen, index, type, list) {
      let result = this.getTask(task.id, null)
      if (result.self) {
        throw 'have'
      }
      let parentId
      //添加task
      if (!task.parentId) {
        if (index >= 0) {
          this.$parent.dataSource.splice(index, 0, task)
        } else {
          this.$parent.dataSource.push(task)
        }
        this.addDependency(depen)
        throw 'over'
      } else {
        parentId = task.parentId
        list.forEach((item) => {
          if (item.id == parentId) {
            if (!item.children) {
              item.children = []
            }
            if (index >= 0) {
              item.children.splice(index, 0, task)
            } else {
              item.children.push(task)
              this.$refs.xTable3.setTreeExpansion(item, true)
            }
            this.addDependency(depen)
            throw 'over'
          } else if (item.children && item.children.length > 0) {
            this.addNewTaskOne(task, depen, index, type, item.children)
          }
        })
      }
    },
    /**添加依赖关系 */
    addDependency(depen, list) {
      if (depen === null) return
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.$parent.dataSource
        flag = true
      }
      try {
        if (depen && depen.length > 0) {
          thisList.forEach((item) => {
            if (depen.length > 0) {
              for (let i = 0; i < depen.length; i++) {
                if (depen[i].to == item.id) {
                  if (item.dependOn && item.dependOn.length > 0) {
                    item.dependOn.push(depen[i].from)
                  } else {
                    item.dependOn = [depen[i].from]
                  }
                  depen.splice(i, 1)
                  i--
                } else if (depen.length > 0 && item.children && item.children.length > 0) {
                  this.addDependency(depen, item.children)
                }
              }
            } else throw '依赖添加完毕'
          })
        }
      } catch (error) {
        //window.console.log('error:', error)
      }
    },
    /**删除task */
    deleteTask(id, type, list, undoItem) {
      let result = this.getTask(id, null)
      if (!result.self) return
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.$parent.dataSource
        flag = true
      }
      for (let i = 0; i < thisList.length; i++) {
        if (thisList[i].id == id) {
          thisList.splice(i, 1)
          i--
        } else {
          if (thisList[i].dependOn && thisList[i].dependOn.length > 0) {
            let index = thisList[i].dependOn.indexOf(id)
            if (index > -1) {
              thisList[i].dependOn.splice(index, 1)
            }
          }
          if (thisList[i].children && thisList[i].children.length > 0) {
            this.deleteTask(id, '', thisList[i].children, undoItem)
          }
        }
      }
    },
    /**修改task */
    changeTask(task, type, list) {
      // let result = this.getTask(task.id)
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        thisList = this.$parent.dataSource
        flag = true
      }
      var index = -1
      thisList.forEach((child, i) => {
        if (child.id === task.id) index = i
      })
      if (index > -1) {
        thisList[index] = task
        return true
      } else {
        thisList.forEach((child) => {
          if (child.children && child.children.length > 0) {
            var result = this.changeTask(task, type, child.children)
            if (result === true) {
              return true
            }
          }
        })
      }
    },
    handleScroll({ scrollTop }) {
      //滑块事件
      this.$emit('handleScroll', { scrollTop })
    },
    /**
     * 将某条数据移动到某个数组下或某条数据旁
     * selfRow：移动的数据
     * prevRow：选中的数据
     * currRow：当前数据
     * type：类型  in  side
     * list：选中数组，为null时是数据源
     */
    drop(selfRow, prevRow, currRow, type, rowIndex, list, thisType, result) {
      var thisList = []
      var flag = false
      if (list) {
        thisList = list
      } else {
        flag = true
        thisList = this.$parent.dataSource
        result = this.deleteOne(selfRow.id, list)
        result.newIndex = null
      }
      thisList.forEach((child) => {
        if (type === 'in') {
          if (prevRow.id === child.id) {
            selfRow.parentId = prevRow.id
            if (child.children && child.children.length > 0) {
              child.children.splice(0, 0, selfRow)
            } else {
              child.children = [selfRow]
            }
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        } else if (type === 'side') {
          if (prevRow.parentId === child.id) {
            selfRow.parentId = prevRow.parentId
            result.newIndex = rowIndex
            child.children.splice(rowIndex, 0, selfRow)
          } else if (child.children && child.children.length > 0) {
            result.newIndex = this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result).newIndex
          }
        } else if (type === 'side-define') {
          if (prevRow.parentId === child.id) {
            selfRow.parentId = prevRow.parentId
            child.children.splice(rowIndex, 0, selfRow)
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        } else if (type === 'in-define') {
          if (prevRow.id === child.id) {
            selfRow.parentId = prevRow.id
            child.children.splice(rowIndex, 0, selfRow)
          } else if (child.children && child.children.length > 0) {
            this.drop(selfRow, prevRow, currRow, type, rowIndex, child.children, null, result)
          }
        }
      })
      return result
    },

    /**
     * 删除某条数据
     * selfRowId:删除数据Id
     * list：数据所在数组，为null时为数据源
     */
    deleteOne(selfRowId, list) {
      var thisList = []
      let result = { thisIndex: -1, preRow: null }
      if (list) {
        thisList = list
      } else {
        thisList = this.$parent.dataSource
      }
      var index = -1
      thisList.forEach((child, i) => {
        if (child.id === selfRowId) {
          index = i
        } else {
          if (index === -1 && result.thisIndex === -1) {
            if (child.children && child.children.length > 0) {
              if (result.thisIndex > -1) {
                return result
              }
              result = this.deleteOne(selfRowId, child.children)
            }
          }
        }
      })
      if (index > -1) {
        result.preRow = { ...thisList[index] }
        result.thisIndex = index
        thisList.splice(index, 1)
      }
      return result
    },

    handlerExportExpand(copyColumn, lists, list) {
      var xTable = this.$refs.xTable3
      var flag = false
      if (!lists) {
        lists = this.dataSource
        flag = true
        list = []
      }
      lists.forEach((child) => {
        var lis = []
        copyColumn.filter((k) => {
          if (k.id === child.id) lis.push(k)
        })
        if (lis.length > 0) {
          if (lis[0].isexpand === false) {
            list.push(child)
          }
          if (lis[0].children) {
            this.handlerExportExpand(lis[0].children, child.children, list)
          }
        }
      })
      if (flag) {
        xTable.setTreeExpansion(list, false)
      }
    }
  },
  render() {
    return (
      <vxe-grid
        ref="xTable3"
        class="mytable-style"
        row-id={this.rowIdName}
        auto-resize
        data={this.dataSource}
        height={this.height ? this.height : 'auto'}
        // max-height={this.height ? this.height : '620px'}
        highlight-current-row
        pager-config={this.tablePage}
        loading={this.loading}
        columns={this.tableColumns}
        row-style={this.rowStyle}
        on-cell-mouseenter={this.mouseenterCell}
        on-cell-mouseleave={this.mouseleaveCell}
        on-cell-dblclick={this.dbClick}
        on-scroll={this.handleScroll}
        on-page-change={this.handlePageChange}
        on-resizable-change={this.columnSizeChange}
        on-select-change={this.selectRow}
        on-radio-change={this.radioChange}
        on-current-change={this.rowClick}
        on-select-all={this.selectRow}
        tree-config={this.treeConfig}
        edit-config={this.editConfig}
        select-config={{ checkRowKeys: this.selectValues, strict: true, checkMethod: this.checkMethod }}
        radio-config={{ checkRowKey: this.selectValue }}
        sort-config={{ trigger: 'cell' }}
        // sort-config={{
        //   trigger: 'cell',
        //   orders: ['desc', 'asc', null],
        // }}
        on-sort-change={this.handleSortChange}
        remote-sort={this.remoteSort}
        on-toggle-row-expand={this.toggleExpandChangeEvent}
        on-edit-closed={this.editClosed}
        show-header={this.showHeader}
        header-cell-style={this.headerCellStyle}
        show-overflow={this.showOverflow}
        show-header-overflow={this.showOverflow}
        on-toggle-tree-expand={this.toggleTreeExpand}
        get-icon={this.getIcon}
        cell-style={this.cellStyle}
      />
    )
  }
}
//check-config={this.checkConfig}
//check-config={{ checkRowKeys: this.selectValues, strict: true, checkMethod: this.checkMethod }}
