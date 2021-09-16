import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { columnInfo, tableStyle } from '../table/tableCommonTypes'
import VXETable from 'vxe-table'
import common from '../../02common/commonMethod'

@Component({ name: 'tablemix' })
export default class table_mix extends Vue {
  @Prop() dataSource: Function | any[]
  @Prop() currentStyle: tableStyle

  /**属性 */
  @Prop() name: String
  @Prop() rowId: String
  @Prop() editConfig: any | null = {
    type: Object,
    require: false,
    default: function() {
      return { trigger: 'click', mode: 'row' }
    }
  }
  @Prop() height: String
  @Prop() columns: any[] | null
  @Prop() showPagination: Boolean
  @Prop() showSelection: Boolean = true
  @Prop() showColumnIndex: Boolean
  @Prop() showExpandColumn: Boolean | null
  @Prop() showRefreshButton: Boolean = true
  @Prop() showSetColumnButton: Boolean = true
  @Prop() expandAll: Boolean
  @Prop() selectValues: any[] | null

  /**私有变量 */
  private tablePage: any = {
    total: 0,
    currentPage: 1,
    pageSize: 10
  }
  //private dataSource: any[]
  private loading: Boolean = true
  private settingColumns: any[]
  private showColumns: any[]
  private localStorageColumns: any[] = []
  private selectConfig: any = {
    checkAll: true,
    reserve: false
  }
  private treeConfig: any = {
    children: 'children',
    expandAll: false
  }

  private currentRender: any = null
  private tableColumns: columnInfo[] = []

  @Watch('currentStyle', { deep: true })
  watchcurrentStylechange(newval: tableStyle) {
    //window.console.log('*********************表格样式变化了', newval)
    this.tableColumns = this.cuteTableColumns(newval)
  }

  mounted() {
    //window.console.log('********************* this.currentStyle', this.currentStyle)
    if (this.columns) {
      this.currentStyle = new tableStyle()
      this.currentStyle.columnInfos = this.columns
    }
    if (!this.showPagination) {
      this.tablePage = null
    }
    if (this.currentStyle && this.currentStyle.columnInfos) {
      this.initColumn()
      this.tableColumns = this.cuteTableColumns(this.currentStyle)
    }
    //window.console.log('********************* 初始化列完成', this.tableColumns)
  }

  public render(h: any) {
    //window.console.log('********************* 重新绘制了', h)
    //this.dataSource
    //window.console.log('********************* 重新绘制了,shuju', this.dataSource)
    this.currentRender = h
    return (
      <vxe-grid
        id="np_table_ppap"
        max-height="500px"
        data={this.dataSource}
        columns={this.tableColumns}
        on-select-change={this.selectRow}
        on-select-all={this.selectRow}
        tree-config={this.treeConfig}
        pager-config={this.tablePage}
        on-page-change={this.handlePageChange}
      />
    )
  }

  /**计算所有列 */
  private cuteTableColumns(tabstyle: tableStyle): columnInfo[] {
    if (!tabstyle || !tabstyle.columnInfos) {
      return []
    }
    var columns: columnInfo[] = []
    if (tabstyle.child) {
      //window.console.log('tabstyle.child', tabstyle.child)
      //columns.push(this.makeChileTableColumn(tabstyle.child, this.currentRender)) //渲染子table
    }
    if (this.showSelection) {
      columns.push(this.makeSelectionColumn())
    }
    //添加折叠展开项
    // var expandItem = tabstyle.columnInfos.find((item) => {
    //   return item.field === 'expand'
    // })
    // if (expandItem != undefined) {
    //   var tempItem = new columnInfo()
    //   tempItem.width = expandItem.width
    //   tempItem.slots = expandItem.slots
    //   tempItem.type = 'expand'
    //   columns.push(tempItem)
    // }
    if (tabstyle.showIndex) {
      columns.push(this.makeIndexColumn())
    }
    for (var i = 0; i < tabstyle.columnInfos.length; i++) {
      var currentCol = tabstyle.columnInfos[i]
      // if (currentCol.field === 'expand') {
      //   continue
      // }
      var newcol = new columnInfo()
      newcol.field = currentCol.field
      newcol.title = currentCol.title
      newcol.width = !currentCol.width ? '' : currentCol.width
      //newcol.fixed = currentCol.fixed
      newcol.sortable = currentCol.sortable
      newcol.slots = this.cuteColumnSolts(currentCol.colTemplateData, currentCol.colTemplateHeight, this.currentRender)
      newcol.colTemplateData = currentCol.colTemplateData
      newcol.colTemplateHeight = currentCol.colTemplateHeight
      if (currentCol.field === 'action') {
        newcol = this.makeActionColumn(newcol, this.currentRender)
      } else {
        if (currentCol.resizable === false) {
          newcol.resizable = false
        } else {
          newcol.resizable = true
        }
      }
      columns.push(newcol)
    }
    return columns
  }

  private makeChileTableColumn(tabStyle: tableStyle, h1: any): columnInfo {
    var col = new columnInfo()
    col.type = 'expand'
    col.width = '20px'
    col.slots = {
      default: ({ row, column }: any): any[] => {
        return [<tablemix name={this.name + 'child'} dataSource={row.children} currentStyle={tabStyle} />]
      }
    }
    return col
  }

  /**计算列的模板 */
  private cuteColumnSolts(colTemplateData: any, colTemplateHeight: number, h2: any) {
    if (!colTemplateData) {
      return undefined
    }
    return {
      default: ({ row, column }: any): any[] => {
        return [
          <geno-layoutSimple
            style={{ width: '100%', height: colTemplateHeight + 'px' }}
            onOnMounted={(layout: any) => this.onPageMounted(layout, colTemplateData)}
          />
        ]
      }
    }
  }
  private onPageMounted(layout: any, columnTempData: any) {
    //window.console.log('*********************加载列模板', columnTempData)
    if (columnTempData) {
      layout.loadComponentsData(columnTempData)
    }
  }

  /**
   * 设置可展开列
   */
  private makeExpandColumn(): columnInfo {
    var col = new columnInfo()
    col.type = 'expand'
    col.width = '60px'
    //col.slot
    return col
  }
  /**
   * 创建选中列
   */
  private makeSelectionColumn(): columnInfo {
    var col = new columnInfo()
    col.type = 'checkbox'
    col.width = '60px'
    return col
  }
  /**
   * 创建序号列
   */
  private makeIndexColumn(): columnInfo {
    var col = new columnInfo()
    col.title = '序号'
    col.type = 'index'
    col.width = '60px'
    //col['tree-node'] = true
    return col
  }
  /**
   * 重新渲染操作列
   * @param {object} column 操作列
   */
  private makeActionColumn(column: any, h3: any): columnInfo {
    var newcol = Object.assign({}, column)
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
    //window.console.log('初始化操作列newcol.slots', newcol.slots)
    return newcol
  }

  private refresh() {}

  private colSettingsChange() {}

  private checkMove() {}

  private selectRow(param: any, event: any) {
    this.$emit('select', param.selection)
  }

  private handlePageChange() {}

  private initColumn() {
    this.showColumns = []
    this.settingColumns = []
    var key = this.name + ':colsettingsNew'
    const colSettings = Vue.ls.get(key)
    if (colSettings != null && colSettings != undefined) {
      this.localStorageColumns = colSettings
      this.localStorageColumns.forEach((element) => {
        if (element.visible) {
          this.settingColumns.push(element.field)
        }
        for (let index = 0; index < this.currentStyle.columnInfos.length; index++) {
          const item = this.currentStyle.columnInfos[index]
          if (element.field === item.field && element.visible) {
            if (element.width) {
              item.width = element.width
            }
            this.showColumns.push(item)
            break
          }
        }
      })
      this.currentStyle.columnInfos.forEach((element) => {
        if (element.field === 'action' || element.field === 'expand') {
          this.showColumns.push(element)
        }
      })
    } else {
      this.showColumns = []
      this.currentStyle.columnInfos.forEach((element) => {
        if (element.field != 'action' && element.field != 'expand') {
          this.settingColumns.push(element.field)
          if (element.isShow === false) {
            this.localStorageColumns.push({ title: element.title, field: element.field, visible: false })
          } else {
            this.localStorageColumns.push({ title: element.title, field: element.field, visible: true })
          }
        }
        if (element.isShow !== false) {
          this.showColumns.push(element)
        }
      })
      Vue.ls.set(key, this.localStorageColumns, 7 * 24 * 60 * 60 * 1000) //保存一周
    }
  }
}
