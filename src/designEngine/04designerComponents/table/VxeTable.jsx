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
import moment from 'moment'
//import { CurrentApis } from '../../01designerContext'

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

export default {
  name: 'VTable',
  components: {
    TableGrid
  },
  data() {
    return {
      //currentRender,
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
      //个性化配置用到的列信息，结构参考personTableColumn
      settingColumns: [],
      settingVisibleColumns: [],
      showColumns: [],
      //定义本地存储的列信息，需要保存列名，是否显示，宽度，顺序
      //{title:'',dataIndex:'',visible:true,width:100}
      //操作列是否要放进来呢？不应该放进来，单独写个方法来处理
      localStorageColumns: [],
      selectConfig: {
        checkAll: false,
        reserve: false
      },
      //树表格大量数据没有优化，在不使用树表格的情况下，不设置默认参数了
      treeConfig: {},
      //checkboxConfig: { checkAll: true },
      editConfig: { trigger: 'dblclick', mode: 'row' },
      scale: 1,
      expandRow: null,
      rowIdName: 'id',
      tempData: [],
      //selectOptionArr: [],
      activeRow: null,
      showIndex: true,
      showCheck: true,
      showRadio: true,
      selectValue: null,
      isCancelRow: false,
      //defaultSort: {},
      checkResult: true,
      disabled: false,
      hasChild: null,
      actionRowIndex: 0,
      max:9,
      lastScrollTop:0,
      selectSort:{},
      //isInnerTab:false,
      //用于设置的popover显示隐藏控制
      hovered:false,
      initMax:9
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
    showSelection: {
      type: Boolean,
      default: true
    },
    showRadioColumn: {
      type: Boolean,
      default: false
    },
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
      default: true
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
    isDesign:{
      type: Boolean,
      default: false
    },
    personConfig:{
      type: Array,
      required: false,
      default: function() {
        return []
      }
    },
    isUseParentLayout:{
      type: Boolean,
      default: false
    },
    dynamicheight:{
      type:String,
      default:'100%'
    }
  },
  watch: {
    tableStyle(newval) {
      if (!newval) {
        return
      }
      this.initStyle(newval,null)
    },
    showColumnIndex(newval) {
      this.showIndex = newval
    },
    // showSelection(newval) {
    //   this.showCheck = newval
    // },
    // showRadioColumn(newval) {
    //   this.showRadio = newval
    // },
    columns(newval) {
      //window.console.log('newval-col', newval)
      // this.initColumns()
      // this.tableColumns = this.cuteTableColumns(newval)
      // this.loadData()
    },
    data(newval) {
      //window.console.log('--------------------数据变更111111', newval)
      if (common.serialize(newval) == common.serialize(this.dataSource)) {
        return
      }
      this.resetDataSource(newval)
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
        //this.tablePage.pageSizes = [10]
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
      //window.console.log('-------------------------newval', newval)
      //this.$refs.ref64186426130433
      //window.console.log('-----------------------this.$refs', this.$refs)
      //this.expandRow[this.rowId]
      //window.console.log('-----------------------this.$refs-this.expandRow[this.rowId]', this.expandRow[this.rowId])
      //window.console.log('-----------------------this.$refs11111', this.$refs['ref' + this.expandRow[this.rowId]])
      this.$nextTick(() => {
        let ref = this.$refs['ref' + this.expandRow[this.rowId]]
        if (ref) {
          ref.loadData(newval)
          this.$nextTick(() => {
            this.refreshChildActionColumn(this.childtableColumns, this.tableStyle.child, newval, ref)
          })
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
    personConfig(newval){
      //window.console.error('-------------------初始化personConfig',newval)
      this.initStyle(this.tableStyle,newval)
    }
  },
  mounted() {
    if (!this.columns) {
      return
    }
    this.loadData()
    this.$refs.xTable3.$slots.empty = this.emptyTip
    //window.console.log('-----------dynamicheight',this.dynamicheight)
  },
  created() {},
  beforeDestroy(){
    this.hovered = false
  },
  methods: {
    initStyle(newval,personConfig) {
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
      if (!this.isDesign && !personConfig){
        //return
      }
      else{
        if (!this.isDesign){
          this.settingVisibleColumns = []
          this.settingColumns = []
          //重新组织一下数据
          if (personConfig && personConfig instanceof Array && personConfig.length > 0){
            let tempColumns = []
            this.preparePersonColumn(newval.columnInfos,personConfig)
            personConfig.forEach(item => {
              let element = newval.columnInfos.find(single=>single.field == item.field)
              if (element){
                element.isShow = item.isShow
                if (item.width){
                  element.width = item.width
                }
                element.sortable = item.orderType == 1 || item.orderType == 2?true:false
                //element.title = item.title
              }
              tempColumns.push(element)
              item.title = element.title
              this.settingColumns.push(item)
              if (item.isShow){
                this.settingVisibleColumns.push(item.field)
              }
            })
            let actionColumn = newval.columnInfos.find(single=>single.field == 'action')
            newval.columnInfos = tempColumns
            newval.columnInfos.push(actionColumn)
          }
          else{
            newval.columnInfos.forEach(element=>{
              if (element.field != 'action'){
                let item = {field:element.field,title:element.title,isShow:element.isShow,index:element.index}
                this.settingColumns.push(item)
                if (element.isShow){
                  this.settingVisibleColumns.push(element.field)
                }
              }
            })
          }
        }
      }
      window.console.error('-------------------初始化列配置',newval.columnInfos)
      this.showIndex = newval.showIndex      
      this.initColumns(newval.columnInfos)      

      newval.columnInfos.forEach((item) => {
        item.treeNode = undefined
      })
      if (newval.hasChildData && newval.columnInfos && newval.columnInfos.length > 0) {
        for (let index = 0; index < newval.columnInfos.length; index++) {
          let element = newval.columnInfos[index]
          if (element.isShow) {
            element.treeNode = true
            break
          }
        }
        this.treeConfig = {
          lazy: true,
          children: 'children',
          hasChild: this.tableStyle.hasChildTag?this.tableStyle.hasChildTag:'hasChild',
          loadMethod: this.loadChildrenMethod
        }
        // if (this.tableStyle.hasChildTag) {
        //   this.treeConfig.hasChild = this.tableStyle.hasChildTag
        // }
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
      this.refreshActionColumn()
    },
    //准备展示列和配置列
    preparePersonColumn(designColumns,personColumns){
      //需要区分一下几种情况
      //1.设计器选择的列和个性化配置的列可以一一对应，无需更新，按照个性化配置的数据来准备
      //2.设计器选择的列和个性化配置的列不可以一一对应
      //2.1 设计器选择的列少于个性化配置的列
      //2.2 设计器选择的列多于个性化配置的列
      //2.3 设计器选择的列和个性化配置的列不匹配，有多有少
      let oldAddColumns = []
      designColumns.forEach(element => {
        if (element.field != 'action'){
          let idx = personColumns.findIndex(item=>item.field == element.field)
          if (idx < 0){
            oldAddColumns.push(element)
          }
        }        
      })
      let newAddColumns = []
      personColumns.forEach(element => {
        let idx = designColumns.findIndex(item=>item.field == element.field)
        if (idx < 0){
          newAddColumns.push(element)
        }
      })
      //oldAddColumns有值的情况
      oldAddColumns.forEach(element => {
        let item = {field:element.field,title:element.title,isShow:element.isShow,index:element.index}
        personColumns.push(item)
      })

      //newAddColumns有值的情况
      newAddColumns.forEach(element => {
        let idx = personColumns.findIndex(item=>item.field == element.field)
        if (idx > -1){
          personColumns.splice(idx,1)
        }        
      })
    },
    /**目前只适用于操作列，暂时废弃 */
    cuteColumnSolts(colTemplateData, ischild = false) {
      if (!colTemplateData) {
        return undefined
      }
      //window.console.log('+++++++++++++++计算列模板+++++++++++++++')
      //window.console.log('*********************加载列模板开始')
      //要处理下行为
      return {
        default: ({ row, rowIndex, column }) => {          
          return [
                <table-grid
                  style={{ width: '100%', height: '35px' }}
                  currentRowData={row}
                  modelCode={colTemplateData.modelCode}
                  onOnMounted={(layout) => this.onPageMounted(layout, colTemplateData, row)}
                />
          ]       
        }
      }
    },
    onPageMounted(layout, columnTempData, row) {      
      // window.console.log('*********************加载列模板', layout)
      if (columnTempData) {
        //let prop = this.parentPage.properties.find((item) => item.propertyName === '表格行')
        let property = columnTempData.properties.find((item) => item.propertyName === '表格行')
        if (property) {
          let data = common.clone(row)
          data.hasChild = undefined
          property.value = { modelCode: columnTempData.modelCode, data: data }
          //prop.value = { modelCode: columnTempData.modelCode, data: Object.assign(row) }
        }
        //window.console.log('---------------当前行变更propertyproperty1111', property)
        let newproperty = columnTempData.properties.find((item) => item.propertyName === '表格行模型')
        if (newproperty) {
          newproperty.value = common.clone(row)
          newproperty.value.hasChild = undefined
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
        layout.LoadPageByData(columnTempData.id, columnTempData)
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
        window.console.log('+++++++++++++++列模板加载完成+++++++++++++++',Date.now())
      }
    },
    selectChange(row) {
      //window.console.log('点击行', row)
    },
    /**
     * 初始化显示列
     */
    initColumns(tempColumn) {      
      this.showColumns = []
      this.tableOrders = []      
      tempColumn.forEach((element) => {        
        if (element.defaultOrder != undefined) {
          this.tableOrders.push({ code: element.field, type: element.defaultOrder.toUpperCase() })
        }
        if (element.isShow !== false) {
          this.showColumns.push(element)
        }        
      })
      //console.log('----------------this.settingColumns', this.settingColumns)
    },
    /**
     * 列宽调整
     * @param {object} param0 当前列的变更信息
     */
    columnSizeChange({ column }) {
      //console.log('column111', column)
      // var key = this.name + ':colsettingsNew'
      // const colSettings = Vue.ls.get(key)
      // if (colSettings != null && colSettings != undefined) {
      //   colSettings.forEach((element) => {
      //     if (element.field === column.property) {
      //       element.width = column.renderWidth
      //     }
      //   })
      // }
      // // let colsizes = Vue.ls.get(key)
      // // if (colsizes == null || colsizes == undefined) {
      // //   colsizes = {}
      // // }
      // // colsizes[column.property] = column.renderWidth
      // //console.log('colSettings', colSettings)
      // Vue.ls.set(key, colSettings, 7 * 24 * 60 * 60 * 1000) //保存一周
    },
    /**
     * 变更页码触发方法
     * @param {object} param0 页码信息
     */
    handlePageChange({ currentPage, pageSize }) {
      this.resetScroll()
      //window.console.log('-----------------分页信息变更', Date.now())
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //this.loadData()
      this.$emit('changePage', currentPage, pageSize)
      //window.console.log('-----------------分页事件结束', Date.now())
    },

    handleSortChange({ column, property, order }) {
      //window.console.log('--------排序字段名',property)
      //window.console.log('--------排序规则',order)
      this.selectSort = {property:property,order:order}
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
      this.$emit('refresh', this.tablePage?this.tablePage.currentPage:1)
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
      //window.console.log('+++++++++++++重新组织列信息++++++++++++++++++')
      if (!resourceColumns) {
        return []
      }
      var columns = []
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
          } else {
            columns.push(this.makeFirstColumn())
          }
          columns.push(this.makeChildTableColumn(this.tableStyle.child, this.currentRender))
        } else {
          if (this.tableStyle.child.isCanCheck !== false) {
            columns.push(this.makeSelectionColumn())
          } else {
            columns.push(this.makeFirstColumn())
          }
        }
      } else {
        if (this.showCheck) {
          columns.push(this.makeSelectionColumn())
        } else if (this.showRadio) {
          columns.push(this.makeRadioColumn())
        } else {
          columns.push(this.makeFirstColumn())
        }
      }
      if (this.showIndex) {
        columns.push(this.makeIndexColumn())
      }

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

        //newcol.slots = this.cuteColumnSolts(currentCol.colTemplateData, ischild)
        //newcol.slots = currentCol.slots
        newcol.sortable = currentCol.sortable
        if (currentCol.field !== 'action' && currentCol.field !== this.rowIdName && this.isCanEdit) {
          //newcol.editRender = { type: 'default' }
        }

        //newcol['sort-method'] = currentCol.sortMethod
        //给最后一列的列头追加一个自定义列的插槽
        if (currentCol.field === 'action') {
          if (this.tableStyle.isTabInner){
            newcol.slots = this.cuteColumnSolts(currentCol.colTemplateData, false)
          }           
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
        if (currentCol.treeNode === true) {
          newcol.treeNode = true
          newcol.align = 'left'
        }
        const formatString = currentCol.formatString
        if (currentCol.isCanDropDown) {
          newcol = this.makeDropDownColumn(newcol)
        } else {
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
        }
        columns.push(newcol)
      }

      //columns.push(this.makeIndexColumn())
      return columns
    },

    /**
     * 第一列站位用，跟单选多选宽度一致
     * @param {*} col
     */
    makeFirstColumn(col) {
      var col = {}
      col.title = ''
      col.width = '40px'
      col.showOverflow = false
      if (!this.tableStyle.child) {
        col.fixed = 'left'
      }
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
        newcol.editRender = { name: 'ASwitch', props: { checkedChildren: '是', unCheckedChildren: '否' } }
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
        //格式化处理，这个格式化不支持dd，要用大写的d
        formatStr = formatStr.replace('dd', 'DD')
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
          //newcol.editRender = { name: 'AInput', attrs: { maxlength: maxLength } }
          newcol.editRender = { name: 'input', attrs: { maxlength: maxLength } }
        } else {
          //newcol.editRender = { name: 'AInput' }
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
          newcol.propertyDetail && newcol.propertyDetail.minValue == 0
            ? 0
            : newcol.propertyDetail && (newcol.propertyDetail.minValue != undefined && newcol.propertyDetail.minValue != null && newcol.propertyDetail.minValue != '')
            ? newcol.propertyDetail.minValue
            : null
        let max =
          newcol.propertyDetail && (newcol.propertyDetail.maxValue != undefined && newcol.propertyDetail.maxValue != null && newcol.propertyDetail.maxValue != '')  
          ? newcol.propertyDetail.maxValue : null
        // if (newcol.propertyDetail.maxLength && newcol.propertyDetail.maxLength > 0) {
        //   newcol.editRender = { name: 'input', attrs: { maxlength: newcol.propertyDetail.maxLength } }
        // }
        //let precision = newcol.propertyDetail && newcol.propertyDetail.per && newcol.propertyDetail.per > 0 ? newcol.propertyDetail.per : null
        if (min != null) {
          props.min = min
        }
        if (max) {
          props.max = max
        }
        // if (precision && !isInt) {
        //   props.precision = precision
        // } else {
        //   props.precision = 0
        // }
        if (isInt){
          props.precision = 0
        }
        window.console.log('-----------------------------------设置编辑列数值', props)
        newcol.editRender = { name: 'AInputNumber', props: props }
        //newcol.editRender = { name: 'AInputNumber', props: { max: max, min: min } }        
      }
      if (isInt) {
        newcol.slots = {
          default: ({ row, column }) => {
            //window.console.log('---------------整数row', newcol.field)
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
            //window.console.log('---------------浮点数row', newcol.field)
            //window.console.log('---------------浮点数row1111', row)
            let precision = newcol.propertyDetail && newcol.propertyDetail.per && newcol.propertyDetail.per > 0 ? newcol.propertyDetail.per : 0
            return [
              <span>
                {row[newcol.field] === undefined || row[newcol.field] === null || row[newcol.field] === '' || isNaN(row[newcol.field])
                  ? ''
                  : parseFloat(parseFloat(row[newcol.field]).toFixed(precision))}
              </span>
            ]
          }
        }
      }
      return newcol
    },
    /**
     * 设置下拉列 2020-08-27 add
     */
    makeDropDownColumn(col) {
      var newcol = Object.assign({}, col)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      if (newcol.isCanEdit) {
        newcol.editRender = { name: 'default' }
        newcol.slots.edit = (scope) => {
          //window.console.log('----------------下拉列数据编辑',scope)
          let options = this.selectOptionArr.find((item) => item.propertyCode === newcol.field)
          if (!options) {
            options = { item: [] }
          }
          let allowClear = true
          const select = (
            <a-select
              allowClear={allowClear}
              style="width:90%"
              defaultValue={scope.row[col.field] ? scope.row[col.field].itemValue + '' : ''}
              onchange={(e, option) => this.handleChange(e, option, scope, col.field)}
            >
              {options.item.map((item) => {
                return (
                  <a-select-option value={item.itemValue + ''} fieldName={col.field} item={scope.row[col.field]}>
                    <span style="display: inline-block;width: 100%">{item.itemName}</span>
                  </a-select-option>
                )
              })}
            </a-select>
          )
          return [<div>{select}</div>]
        }
      }
      newcol.slots.default = ({ row, rowIndex, column, columnIndex }) => {
        return [<span>{this.getSelectLabel(row, col.field)}</span>]
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
          let options = this.selectOptionArr.find((item) => item.propertyCode === newcol.field)
          if (!options) {
            options = { item: [] }
          }
          //window.console.log('-------------------------表格下拉框options', options)
          //window.console.log('-------------------------表格下拉框itemValue', itemValue)
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
          return [<span>{this.getSelectLabel(row, col.field)}</span>]
        }
      }
      //window.console.log('newcolnewcolnewcolnewcol', newcol)
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
          //window.console.log('-------------------------表格枚举数组格式化', param)
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
      if (!this.tableStyle.child) {
        col.fixed = 'left'
      }
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
      if (!this.tableStyle.child) {
        col.fixed = 'left'
      }
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
      if (!this.tableStyle.child) {
        col.fixed = 'left'
      }
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
      if (!this.tableStyle.child) {
        col.fixed = 'left'
      }
      return col
    },
    /**
     * 重新渲染操作列
     * @param {object} column 操作列
     */
    makeActionColumn(column) {
      var newcol = Object.assign({}, column)
      newcol.showOverflow = false
      if (this.isDesign){
        newcol.minWidth = '80px'      
      }      
      else{
        newcol.minWidth = '130px'      
      }
      newcol.fixed = 'right'
      //console.error('---------------操作列', newcol)
      if (!newcol.slots) {
        newcol.slots = {}
      }
      newcol.slots.header = ({ row, column }) => {
        return [
          <div>
            <span>{column.title}</span>
            <span style={{ display: this.showRefreshButton ? 'inline' : 'none' }}>
              <a
                style="margin-left: 5px"
                onClick={() => {
                  this.refresh()
                }}
              >
                <a-icon type="sync" /> 刷新
              </a>
            </span>
            <span style={{display:this.isDesign?'none':''}}>
              <a-popover title="显示隐藏列" trigger="click" placement="topRight" visible={this.hovered} onVisibleChange={this.handleClickChange}>
                <template slot="content">
                  <a-checkbox-group style="overflow-y:scroll;max-height:200px" value={this.settingVisibleColumns} onChange={this.changeSelectColumn}>
                    {this.settingColumns.map((item, index) => (
                      <a-row span="18" style="margin-bottom:5px">
                        <a-col span="11">
                          <a-checkbox value={item.field} onChange={this.changeCurrentColumnVisible}>{item.title}</a-checkbox>
                        </a-col>
                        <a-col span="6">
                          <input size="small" style="width:100px;height:25px" v-model={item.width} onChange={(value)=>{this.changeCloumnWidth(item.field,value)}}></input>
                        </a-col>                                                
                      </a-row>
                    ))}                    
                  </a-checkbox-group>
                  <a-row style="margin-top: 10px;">
                    <a-button style="width:60px;height:25px;margin-right:10px" onClick={() => {
                      this.cancelSetting()
                    }}>取消</a-button>
                    <a-button style="width:60px;height:25px;margin-right:10px" onClick={() => {
                      this.useSetting()
                    }}>应用</a-button>
                    <a-button style="width:60px;height:25px" onClick={() => {
                      this.advanceSetting()
                    }}>高级</a-button>
                  </a-row>                  
                </template>
                <a style="margin-left: 10px">
                  <a-icon type="setting" />
                  配置
                </a>
              </a-popover>
            </span>
          </div>
        ]
      }
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
              //auto-resize
              highlight-current-row
              row-id={this.childrowId}
              ref={'ref' + row[this.rowId]}
              columns={this.childtableColumns}
              on-select-change={this.selectchildRow}
              on-radio-change={this.radiochildChange}
              on-select-all={this.selectchildRow}
              on-current-change={this.childrowClick}
              edit-config={this.editConfig}
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
      if (this.disabled === true) {
        return
      }
      //window.console.log('------------------表格复选选中', param)
      this.$emit('select', param.selection, param.row, param.checked)
    },
    radioChange(param, event) {
      if (this.disabled === true) {
        return
      }
      const selection = []
      selection.push(param.row)
      //window.console.log('------------------表格单选选中', param)
      this.$emit('select', selection, param.row)
    },
    rowClick(param, event) {
      //window.console.log('---------------------进入行点击事件')
      this.$emit('rowClick', param.row)
    },
    //时间格式转换
    timeStamp2time(param, formatString) {
      //window.console.log('formatString', formatString)
      let formatStr = 'YYYY-MM-dd hh:mm:ss'
      if (formatString && formatString.length > 0) {
        formatStr = formatString
      }
      //window.console.log('formatString', formatStr)
      if (!param.cellValue) {
        return ''
      }
      //window.console.log('param.cellValue', param.cellValue)
      var datetime = new Date()
      datetime.setTime(param.cellValue)
      //window.console.log('datetime.format', datetime)
      return datetime.format(formatStr)
    },
    cellClick({ row }) {
      //window.console.log('点击表格行', row)
    },
    clearSelect() {
      this.$refs['xTable3'].clearSelection()
      // this.$refs['xTable3'].clearCheckboxRow()
    },
    toggleExpandChangeEvent({ expanded, row, rowIndex }, event) {
      window.console.log('--------------------------表格展开', row)
      if (expanded) {
        this.expandRow = row
        this.$emit('expand', row)
      }
    },
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
        //this.$XModal.alert('success')
        //保存之后触发数据源变更
        //this.$emit('rowEditEnd', tempRow)
      })
    },
    //编辑状态取消，不触发行编辑结束行为，用于表格行更新
    editRowCancelExtend(row) {
      //需要先判断一下是否存在编辑数据，没有编辑数据的话，直接返回
      let tempActiveRow = this.$refs.xTable3.getActiveRow()
      window.console.log('----------------------获取编辑状态', tempActiveRow)
      if (!tempActiveRow) {
        return
      }
      let tempRow = this.dataSource.find((item) => item[this.rowIdName] === row[this.rowIdName])
      //window.console.log('---------------------------编辑行保存取消tempRow', tempRow)
      this.isCancelRow = true
      this.$refs.xTable3.clearActived().then(() => {
        //this.$XModal.alert('success')
        //保存之后触发数据源变更
        //this.$emit('rowEditEnd', tempRow)
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
          if (row[item.field] < 0){
            row[item.field] = null
          }
          else{
            row[item.field] = moment(row[item.field]).valueOf()
          }
        }
        if (item.isCanEdit && item.columnType === ModelPropertyType.BOOL) {
          row[item.field] = row[item.field] == true || row[item.field] == 1 ? 1 : 0
        }
        //数值类型编辑之后如果为空的话就还原成最小值
        if ((row[item.field] === undefined || row[item.field] === null || row[item.field] === '') && (item.columnType === ModelPropertyType.INT || item.columnType === ModelPropertyType.FLOAT) && item.isCanEdit) {
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
        //parseFloat(parseFloat(row[newcol.field]).toFixed(precision))
        // if (item.columnType === ModelPropertyType.INT) {
        //   row[item.field] = parseInt(item.propertyDetail.minValue)
        // }
        let precision = item.propertyDetail && item.propertyDetail.per && item.propertyDetail.per > 0 ? item.propertyDetail.per : 0
        //处理下精度
        if (item.columnType === ModelPropertyType.FLOAT) {
          row[item.field] = parseFloat(parseFloat(row[item.field]).toFixed(precision))
        }
      })
      this.activeRow = row
      this.$emit('rowEditEnd', row)
    },

    /**下拉框的值改变方法 */
    handleChange(value, option, scope, field) {
      //window.console.log('---------------------------编辑行下拉选择value', value)
      //window.console.log('---------------------------编辑行下拉选择option', option)
      // window.console.log('---------------------------编辑行下拉选择option.data.attrs.fieldName', option.data.attrs.fieldName)
      //window.console.log('---------------------------编辑行下拉选择option.data.attrs.item', option.data.attrs.item)

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
      //window.console.log('---------------------------编辑行下拉选择scope', scope)
      //if ()
      //let tempRow = this.dataSource.find((item) => item[this.rowIdName] === scope.row[this.rowIdName])
      //tempRow = scope.row

      //this.$refs.xTable3.updateStatus({ row: scope.row, column: scope.column })
      //this.$refs.xTable3.clearActived().then(() => {})
      //let tempactive = this.$refs.xTable3.getActiveRecord()
      //window.console.log('---------------------------编辑行下拉选择this.tempactive', this.tempactive)
      //window.console.log('---------------------------编辑行下拉选择this.activeRow', this.activeRow)
      //window.console.log('---------------------------编辑行下拉选择this.dataSource', this.dataSource)
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
      //window.console.log('-----------------------------表格设置勾选', rows)
      this.$refs.xTable3.setSelection(rows, checked)
    },
    /**设置全部选中 */
    setAllRowsSelected(checked) {
      //window.console.log('-----------------------------表格设置全选', this.$refs.xTable3)
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
      window.console.log('-----------------------this.$refs', this.$refs)
      this.$nextTick(() => {
        if (this.$refs['ref' + masterId]) {
          window.console.log('-----------------------this.$refs111111111111111111', this.$refs['ref' + masterId])
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
      //window.console.log('------------------手动设置展开行')
      let row = this.dataSource.find((item) => item[this.rowIdName] == masterId)
      this.$refs.xTable3.setRowExpansion(row, false)
      this.$nextTick(() => {
        this.$refs.xTable3.setRowExpansion(row, true)
        this.expandRow = row
        this.$emit('expand', row)
      })
    },
    editchildClosed({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell }, parentId) {
      //window.console.log('-----------------------------编辑子表格结束', row)
      //this.activeRow = row
      this.$emit('childrowEditEnd', row, parentId)
    },
    /** 指定点击行 */
    setRowSelect(rowId) {
      this.$nextTick(() => {
        let row = this.dataSource.find((item) => item[this.rowIdName] == rowId)
        //window.console.log('---------------table内部设置点击行',row)
        if (row) {
          this.$refs.xTable3.setCurrentRow(row)
          this.$emit('rowClick', row)
        }
      })
    },
    clearRowExpand() {
      this.$refs.xTable3.clearRowExpand()
    },
    celldbclick(param) {
      if (this.disabled === true) {
        return
      }
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
     * 不使用属性变更，使用方法来触发
     */
    switchColumnStatus(columnCode, isshow) {
      this.$nextTick(() => {
        let columnIndex = this.tableStyle.columnInfos.findIndex((item) => item.field == columnCode)
        if (columnIndex < 0) {
          return
        }
        let column = this.tableStyle.columnInfos[columnIndex]
        column.isShow = isshow
        //window.console.log('----------切换列状态')
        this.tableColumns = this.cuteTableColumns(this.tableStyle.columnInfos)
        this.$nextTick(() => {
          this.refreshActionColumn()
        })
        // let column = this.$refs.xTable3.getColumnByField(columnCode)
        // if (isshow){
        //   this.$refs.xTable3.showColumn(column)
        // }
        // else{
        //   this.$refs.xTable3.hideColumn(column)
        // }
        // this.$refs.xTable3.refreshColumn()
      })
    },
    childcelldbclick(param, parentId) {
      //window.console.log('-------------------------------双击子表格', param)
      this.$emit('childcelldbclick', param.row, true)
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
    exportData(filename) {
      //准备导出的列名
      let nameArr = []
      let tempData = common.clone(this.dataSource)
      let formatStr = 'YYYY-MM-dd hh:mm:ss'
      this.tableColumns.forEach((item) => {
        if (item.field && item.field !== 'action') {
          nameArr.push(item.field)
        }
      })
      // if (!filename) {
      //   filename = 'export'
      // }
      this.$refs.xTable3.exportData({
        filename: filename,
        type: 'csv',
        columnFilterMethod: (column) => nameArr.includes(column.property),
        //不使用原始数据，使用格式化之后的数据
        original: false
      })
    },
    switchDblEditStatus(status) {
      this.$nextTick(() => {
        if (status == false) {
          this.editConfig.trigger = 'manual'
          this.disabled = true
        } else {
          this.editConfig.trigger = this.tableStyle.editMode
          this.disabled = false
        }
      })
    },
    /**
     * 加载当前行的子数据
     * @param {当前行} param0
     */
    loadChildrenMethod({ row }) {
      window.console.log('------------------懒加载展开行参数', row)
      this.expandTreeChildren = []
      this.$emit('treeExpand', row)
      // if (row.name == 'xww'){
      //   this.expandTreeChildren = []
      // }
      if (this.expandTreeChildren.length == 0) {
        //隐藏加号
        //window.console.log('------------------隐藏加号')
        if (!this.tableStyle.hasChildTag) {
          row.hasChild = undefined
        }
        // let temp = common.clone(this.dataSource)
        // let index = temp.findIndex(item=>item[this.rowIdName] == row[this.rowIdName])
        // temp[index].hasChild = false
        // this.$refs.xTable3.loadData(temp)
      } else {
        var responese = new Promise((resolve, reject) => {
          resolve(this.expandTreeChildren)
        })
        return responese
      }
    },
    setExpandTreeChildren(val) {
      this.expandTreeChildren = val
    },
    /**
     * 删除掉是否有子项的属性
     * @param {} row
     */
    deleteRowHasChildProp(row) {
      if (this.tableStyle.hasChildData) {
        let temp = common.clone(row)
        temp.hasChild = undefined
        return temp
      } else {
        return row
      }
    },
    recalculateTable() {
      //应该在检测到表格缩放的时候重绘
      //window.console.log('-------------重绘表格')
      this.$refs.xTable3.recalculate(true)
      // if (this.tabStyle.child){
      //   this.dataSource.forEach(element => {
      //     if (this.$refs['ref' + element[this.rowIdName]]) {
      //       this.$refs['ref' + element[this.rowIdName]].recalculate(true)
      //     }
      //   })
      // }
    },
    /**刷新操作列
     * 行为里面调用表格显示隐藏方法也可以通过刷新来实现，不使用变更检测的方式来渲染
     * 还是先判断渲染次数再重新渲染一轮吧
     */
    refreshActionColumn(scrollTop=0) {      
      if (this.tableStyle.isTabInner){
        return
      }
      window.console.log('*********************gundong渲染操作列xxxxxxxx',scrollTop)
      let action = this.tableColumns.find((item) => item.field == 'action')
      if (!action || !action.slots) {
        return
      }
      let currentCol = this.tableStyle.columnInfos.find((item) => item.field == 'action')
      if (!currentCol || !currentCol.colTemplateData) {
        return
      }
      action.slots.default = null
      let tempIdx = 0
      let dataLength = this.dataSource.length
      if (dataLength > 0) {
        this.$refs.xTable3.scrollTo(1, scrollTop)
        let location = this.$refs.xTable3.getVirtualScroller()
        let max = this.max
        action.slots.default = ({ row, rowIndex, column }) => {
          //销毁组件的时候不用重新渲染
          if (rowIndex < 0) {
            return []
          }
          if (location.scrollLeft > 0) {
            tempIdx++
            if (tempIdx > dataLength * 2) {
              //window.console.log('*********************渲染操作列max',this.max)
              if (rowIndex > max){
                return []
              }
              //window.console.log('*********************渲染操作列',rowIndex)
              return [
                <table-grid
                  style={{ width: '100%', height: '35px' }}
                  currentRowData={row}
                  modelCode={currentCol.colTemplateData.modelCode}
                  onOnMounted={(layout) => this.onPageMounted(layout, currentCol.colTemplateData, row)}
                />
              ]                                  
            } else {
              return []
            }
          } else {
            if (rowIndex > max){
              return []
            }
            return [
              <table-grid
                style={{ width: '100%', height: '35px' }}
                currentRowData={row}
                modelCode={currentCol.colTemplateData.modelCode}
                onOnMounted={(layout) => this.onPageMounted(layout, currentCol.colTemplateData, row)}
              />
            ]                                    
          }
        }
      } else {
        //数据为空的时候无需添加渲染逻辑，直接指定默认插槽
        action.slots.default = ({ row, rowIndex, column }) => {
          return [
            <table-grid
              style={{ width: '100%', height: '35px' }}
              currentRowData={row}
              modelCode={currentCol.colTemplateData.modelCode}
              onOnMounted={(layout) => this.onPageMounted(layout, currentCol.colTemplateData, row)}
            />
          ]                             
        }
      }
      this.$refs.xTable3.refreshColumn()
      //this.$refs.xTable3.reloadData(this.dataSource)
    },
    /**刷新子表操作列 */
    refreshChildActionColumn(childTableColumns, childTableStyle, newData, ref) {
      let action = childTableColumns.find((item) => item.field == 'action')
      if (!action || !action.slots) {
        return
      }
      let currentCol = childTableStyle.columnInfos.find((item) => item.field == 'action')
      if (!currentCol || !currentCol.colTemplateData) {
        return
      }
      let tempIdx = 0
      let dataLength = newData.length
      if (dataLength > 0) {
        ref.scrollTo(1, 0)
        let location = ref.getVirtualScroller()
        action.slots.default = ({ row, rowIndex, column }) => {
          //销毁组件的时候不用重新渲染
          if (rowIndex < 0) {
            return []
          }
          if (location.scrollLeft > 0) {
            tempIdx++
            if (tempIdx > dataLength * 2) {
              //window.console.log('*********************渲染操作列',rowIndex)
              return [
                <table-grid
                  style={{ width: '100%', height: '35px' }}
                  currentRowData={row}
                  modelCode={currentCol.colTemplateData.modelCode}
                  onOnMounted={(layout) => this.onPageMounted(layout, currentCol.colTemplateData, row)}
                />
              ]
            } else {
              return []
            }
          } else {
            return [
              <table-grid
                style={{ width: '100%', height: '35px' }}
                currentRowData={row}
                modelCode={currentCol.colTemplateData.modelCode}
                onOnMounted={(layout) => this.onPageMounted(layout, currentCol.colTemplateData, row)}
              />
            ]
          }
        }
      }
      ref.refreshColumn()
    },
    /**表格无法支持自定义显示的列名，尝试下别的方案吧 */
    customExportData(filename, columns) {
      //准备导出的列名
      let nameArr = []
      // let tempData = common.clone(this.dataSource)
      // let formatStr = 'YYYY-MM-dd hh:mm:ss'
      for (let index = 0; index < columns.length; index++) {
        let element = columns[index]
        if (element.isShow) {
          let col = this.tableColumns.find((item) => item.field == element.field)
          if (col) {
            nameArr.push(col.field)
          }
        }
      }
      // this.tableColumns.forEach((item) => {
      //   if (item.field && item.field !== 'action') {
      //     nameArr.push(item.field)
      //   }
      // })
      this.$refs.xTable3.exportData({
        filename: filename,
        type: 'csv',
        columnFilterMethod: (column) => nameArr.includes(column.property),
        //不使用原始数据，使用格式化之后的数据
        original: false
      })
    },
    /**折叠全部 */
    clearRowExpand() {
      this.$refs.xTable3.clearRowExpand()
    },
    /**展开全部 */
    expandAllRows() {
      this.$nextTick(() => {
        this.$refs.xTable3.setAllRowExpansion(true)
      })
    },      
    /**根据顺序号来显示列 */
    switchColumnStatusByIdx(columnIdx) {      
      this.$nextTick(() => {
        for (let index = 0; index < this.tableStyle.columnInfos.length; index++) {
          let element = this.tableStyle.columnInfos[index];
          if (element.field == 'action'){
            continue
          }
          if (index < columnIdx){            
            element.isShow = true
          }          
          else{
            element.isShow = false
          }
        }
        this.tableColumns = this.cuteTableColumns(this.tableStyle.columnInfos)
        this.$nextTick(()=>{          
          this.refreshActionColumn()
          this.resetScroll()
        })  
      })
    },  
    /**根据单元格数据来判断表格列是否显示 */
    switchColumnStatusByData() {            
      this.$nextTick(() => {
        if (!this.dataSource || this.dataSource.length === 0){
          return
        }
        let firstRow = this.dataSource[0]
        for (let index = 0; index < this.tableStyle.columnInfos.length; index++) {
          let element = this.tableStyle.columnInfos[index];
          if (element.field == 'action'){
            continue
          }
          //单元格数据为空，就不显示对应的列（暂时直接判断第一行数据）                              
          if (firstRow[element.field]){
            element.isShow = true
          }         
          else{
            element.isShow = false
          }
        }
        this.tableColumns = this.cuteTableColumns(this.tableStyle.columnInfos)
        this.$nextTick(()=>{          
          this.refreshActionColumn()
          this.resetScroll()
        })  
      })
    },  
    editActived({row}){
      this.$emit('rowEditBegin', row)
    },
      
    /**获取列模板 */
    getColumnTemp(row, modelCode, colTemplateData) {
      if (!this.currentColumnTemp) {
        this.currentColumnTemp = (
          <table-grid
            style={{ width: '100%', height: '35px' }}
            currentRowData={row}
            modelCode={modelCode}
            onOnMounted={(layout) => this.onPageMounted(layout, colTemplateData, row)}
          />
        )
      }
      return [this.currentColumnTemp]
    },
    tableScroll({ type, scrollTop, scrollLeft, isX, isY, $table }){
      //window.console.log('---------滚动开始')
      if (!isX){
        //window.console.log('-------------向下滚-高度',scrollTop)
        //计算显示的最大数量，还要判断是否是向下滚，向上滚的情况可以直接忽略掉        
        if (scrollTop < 30 || scrollTop < this.lastScrollTop || this.lastScrollTop > scrollTop-30){
          return
        }        
        let num = parseInt(scrollTop/30)
        // for (let index = 0; index < num; index++) {
        //   this.max++          
        // }
        //window.console.log('-------------向下滚',num)
        this.max = this.initMax +num
        this.lastScrollTop = scrollTop        
        //return
        this.refreshActionColumn(scrollTop)       
      }
    },
    resetScroll(){
      this.max = this.initMax
      this.lastScrollTop = 0   
      //使用nextTick重置滚动不生效，暂时使用延时操作来处理      
      setTimeout(() => {
        this.$refs.xTable3.scrollTo(0,0)
      }, 100)       
    },
    resetDataSource(newval){
      this.actionRowIndex = 0
      let tempArr = newval
      //重新渲染操作列
      this.tableColumns.forEach((element) => {
        if (element.field === 'action') {
          element = this.makeActionColumn(element)
        }
      })
      if (this.tableStyle.hasChildData) {
        this.$refs.xTable3.clearTreeExpand()
        if (!this.tableStyle.hasChildTag) {
          let hasChildTemp = false
          tempArr.forEach((element) => {
            if (element.children) {
              hasChildTemp = true
            } else {
              element.hasChild = true
            }
          })
          if (hasChildTemp) {
            this.treeConfig.lazy = false
          }
        }
      }
      else{
        this.treeConfig = null
      }
      this.loading = false
      if (this.tablePage) {
        this.tablePage.total = tempArr.length
      }
      // if (tempArr.length > 10){
      //   this.treeConfig = null
      // }
      this.dataSource = tempArr      
      //加载完成之后再刷新操作列      
      this.$nextTick(() => {        
        this.refreshActionColumn()
        if (this.dataSource && this.dataSource.length > 0) {
          this.$refs.xTable3.setCurrentRow(this.dataSource[0])
          this.$emit('rowClick', this.dataSource[0])
        } else {
          //没数据的时候清空一下tooltip
          this.$refs.xTable3.clostTooltip()
        }
        if (!this.selectSort.property){
          this.$refs.xTable3.sort(this.tableStyle.orderCode, this.tableStyle.orderType ? 'asc' : 'desc')
        }        
        else{
          if (this.selectSort.order){
            this.$refs.xTable3.sort(this.selectSort.property, this.selectSort.order)
          }          
        }
        this.$emit('dataChange', this.dataSource)
        //重新计算表格，用于高度的重置，暂时注释
        //this.$refs.xTable3.recalculate(true)
        this.resetScroll()        
      })
    },
    /**操作列配置相关方法*/
    /**取消设置
     * 将数据还原到上次打开时的状态，关闭popover
     */
    cancelSetting(){
      this.settingVisibleColumns = []
      this.columns.forEach((element) => {
        if (element.field != 'action' && element.field != 'expand' && element.isShow) {
          this.settingVisibleColumns.push(element.field)
        }
      })
      this.hovered = false
    },
    /** 应用设置
     * 保存当前设置信息，无需重置，完成之后关闭popover
     */
    useSetting(){
      this.hovered = false
      //this.settingColumns
      //组织一下保存的信息，需要把完整数据和目前勾选的数据对应一下，来存储是否显示和宽度，还需要记录顺序
      // let outparamArr = []
      // this.settingColumns.forEach((item)=>{
      //   let idx = this.settingVisibleColumns.findIndex(element=>element == item.field)
      //   let outparam = {field:item.field,title:item.title,index:item.index,width:item.width?item.width:'',isShow:idx > -1?true:false}        
      //   outparamArr.push(outparam)
      // })
      //window.console.error('----------------表格应用设置',this.settingColumns)
      this.$emit('saveTableSetting', this.settingColumns)
      //this.refreshActionColumn(0)
    },
    /** 高级设置
     * 弹出新的配置页面
     */
    advanceSetting(){
      this.hovered = false
      this.$emit('tableAdvanceSetting', this.settingColumns)
    },
    handleClickChange(visible){
      //点击改变
      //window.console.log('-----------------点击表格设置visible',visible)
      if (visible){
        this.hovered = visible
      }      
    },
    changeSelectColumn(selectValue){
      //window.console.log('-----------------选中值改变selectValue',selectValue)
      this.settingVisibleColumns = selectValue       
    },
    changeCurrentColumnVisible(e){
      //window.console.error('-----------------选中值改变eeeeeeeeeee',e)
      //this.settingVisibleColumns = selectValue       
      this.settingColumns.find(element=>element.field == e.target.value).isShow = e.target.checked
    },
    changeCloumnWidth(field,value){
      //window.console.log('-----------------修改列编码',field)
      //window.console.error('-----------------修改列宽度',value.target.value)     
      this.settingColumns.find(element=>element.field == field).width = value.target.value
      // this.settingColumns.forEach(element => {
      //   if (element.field == field){
      //     element.width = value
      //   }
      // }); 
    },
    /**指定子表格点击行 */
    setChildrenClickRow(id,childId){
      //首先判断下子表格是否存在
      setTimeout(() => {
        let ref = this.$refs['ref' + id]
        if (ref) {
          let row = ref.getRowById(childId)
          ref.setCurrentRow(row)
          this.scrollToRow(id)
        }
      }, 100)
    },
    setDynamicheight(newHeight){
      // this.$nextTick(()=>{
      //   let tableHeight = this.showPagination?(newHeight-70)+'px':(newHeight-40)+'px'
      //   this.$el.getElementsByClassName('vxe-table--body-wrapper body--wrapper')[0].style.height = tableHeight
      // })
    },
    setInitMax(newHeight){
      this.initMax = newHeight/36
      this.max = this.initMax
    },
    //切换多个自定义列的显示隐藏
    switchColumnStatusByCodeArr(columnCodeArr, isshow) {
      window.console.log('-----------开始切换',isshow)
      let tempShowColumns = common.clone(this.tableColumns)
      let prepareColums = common.clone(this.tableStyle.columnInfos)
      //需要结合着原始数据和目前的展示数据来处理
      //如果目前的数据里面没有，然后传递的参数要显示，就需要追加进来
      prepareColums.forEach(item=>{
        let idx = tempShowColumns.findIndex(element=>element.field == item.field)
        item.isShow = idx < 0?false:true
      })
      for (const columnCode of columnCodeArr) {
        let columnIndex = prepareColums.findIndex((item) => item.field == columnCode)
        if (columnIndex < 0) {
          continue
        }
        let column = prepareColums[columnIndex]
        column.isShow = isshow
      }
      this.tableColumns = this.cuteTableColumns(prepareColums)
      this.$nextTick(() => {
        this.refreshActionColumn()
      })
    },
    //滚动到指定位置
    scrollToRow(id){
      window.console.log('---------------滚动指定位置',id)
      let masterRow = this.$refs.xTable3.getRowById(id)
      this.$refs.xTable3.scrollToRow(masterRow)
    }
  },
  render() {
    //let dynamicheight = 'calc(~"100% – 40px")';
    //let dynamicheight = '100%';
    return (
      <vxe-grid
        stripe
        ref="xTable3"
        //auto-resize
        show-header-overflow
        row-id={this.rowIdName}
        data={this.dataSource}
        height={this.isUseParentLayout?this.dynamicheight:this.height}
        //height={'100%'}
        //max-height={this.isUseParentLayout?this.dynamicheight:this.height}
        highlight-current-row
        pager-config={this.tablePage}
        loading={this.loading}
        columns={this.tableColumns}
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
        sort-config={{
          trigger: 'cell',
          orders: ['desc', 'asc', null]
        }}
        on-sort-change={this.handleSortChange}
        remote-sort={this.remoteSort}
        on-toggle-row-expand={this.toggleExpandChangeEvent}
        on-edit-actived={this.editActived}
        on-edit-closed={this.editClosed}
        show-header={this.showHeader}
        on-cell-dblclick={this.celldbclick}
        on-scroll={this.tableScroll}
      />
    )
  }
}
//check-config={this.checkConfig}
//check-config={{ checkRowKeys: this.selectValues, strict: true, checkMethod: this.checkMethod }}
