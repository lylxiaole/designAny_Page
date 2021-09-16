import modelAnalysis, { ModelProperty } from '../../02common/impResourcesCache/modelAnalysis'
export class columnInfo {
  field: string //数据字段名称
  title: string //列显示的名称
  width: number | string //列宽
  //fixed: string = 'none' //列固定--left|right
  sortable: boolean = false //是否可以排序
  align: string = 'center' //'列头文字对其'

  type: string //expand|index
  slots: any = null
  colTemplateData: any //列模板信息
  colTemplateHeight: number

  resizable: boolean = false
  isShow: boolean = true
  dataIndex: string

  columnType: number
  formatString: string
  isShowIcon: boolean = false
  /**是否可编辑 */
  isCanEdit: boolean = false
  isCanDropDown: boolean = false
  dictId: string = ''
  fixed: string = '0'
  propertyDetail: ModelProperty
}

export class tableStyle {
  columnInfos: columnInfo[] = []
  child: tableStyle = null
  /**是否显示多选 */
  canChoose: number = 0
  /** 是否显示序号 */
  showIndex: boolean = false
  /**是否显示边框 */
  border: boolean = false
  /**是否隔行变色 */
  stripe: boolean = true
  /**是否显示列头 */
  showheader: boolean
  /**列是否可以拖拽大小 */
  resizable: boolean
  /**是否有子级数据 */
  hasChildData: boolean = false
  /**默认排序字段 */
  orderCode: string
  /**排序规则 true是升序，false降序，默认为false*/
  orderType: boolean = false
  isCanCheck: boolean = true
  editMode: string = 'dblclick'
}
