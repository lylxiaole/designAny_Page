// ***************************************************************
import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export enum ColumnDataType {
  String = 1,
  Boolean = 2,
  Number = 3,
  Json = 4
}

export function GetDataTypeName(type: ColumnDataType) {
  switch (type) {
    case ColumnDataType.String:
      return '字符串'
    case ColumnDataType.Boolean:
      return '布尔'
    case ColumnDataType.Number:
      return '数值'
    case ColumnDataType.Json:
      return 'JSON'
    default:
      return '字符串'
  }
}

export function GetAllDataTypes() {
  var res: number[] = []
  for (const key in ColumnDataType) {
    if (isNaN(parseInt(key))) {
      continue
    }
    res.push(parseInt(key))
  }
  return res
}

export class PageSearch {
  public pageIndex: number
  public pageSize: number
}
export class ExtColumn {
  public id: string
  public tableId: string
  public columnName: string
  public columnCode: string
  public columnDataType: ColumnDataType = ColumnDataType.String
  public isRequired: boolean = false
}

export class ExtCellData {
  public id: string
  public rowId: string
  public columnCode: string
  public val: any
}

export class ExtDatabase {
  public id: string
  public userId: string
  public databaseName: string
  public databaseCode: string
  public tables: ExtTable[]
}

export class ExtRow {
  public id: string
  public tableId: string
  public rowDatas: ExtCellData[] = []
}

export class ExtTable {
  public id: string
  public databaseId: string
  public tableName: string
  public tableCode: string
  public columns: ExtColumn[]
  public rows: ExtRow[]
}
// ***************************************************************
export enum FilterJudge {
  Equal = 1,
  GreaterThan = 2,
  GreaterThanOrEqual = 3,
  LessThan = 4,
  LessThanOrEqual = 5,
  NotEqual = 6,
  Between = 7,
  In = 8,
  Contains = 9,
  Like = 10
}

export enum FilterRelation {
  Or = 1,
  And = 2
}

export enum OrderSequence {
  ASC = 1, //正序
  DESC = 2 //倒序
}

export class Filter {
  public relation?: FilterRelation
  public columnCode: string
  public judge: FilterJudge
  public val: string
  public rrder: OrderSequence
}
// **************************************************************
export class DataBaseDC {
  public userId: string
  public id: string
  public databaseName: string
  public databaseCode: string
  public tables: TableDC[] = []
}

export class TableDC {
  public databaseId: string
  public tableId: string
  public tableName: string
  public tableCode: string
  public pageSearchInfo: PageSearch
  public columns: ExtColumn[] = []
  public filters: Filter[]
}

export class ColumnDC {
  public databaseId: string
  public tableId: string
  public columnId: string
  public columnCode: string
  public columnName: string
  public isRequired: boolean
  public columnDataType: ColumnDataType
}

export class RowDC extends TableDC {
  public rowId: string
  public rowDatas: ExtCellData[] = []
}

export class SearchPageResult<T> {
  /// <summary>
  /// 每一页的最大数量
  /// </summary>
  public pageSize: number
  /// <summary>
  /// 当前页数
  /// </summary>
  public pageIndex: number
  /// <summary>
  /// 总页数
  /// </summary>
  public totalPageCount: number
  /// <summary>
  /// 数据总条数
  /// </summary>
  public totalItemCount: number
  public items: T[]
}
// **************************************************************

export async function AddDataBase(data: DataBaseDC): Promise<boolean> {
  var database: DataBaseDC = new DataBaseDC()

  let url = apiAddr() + 'api/designDb/AddDataBase'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function GetDataBases(): Promise<DataBaseDC[]> {
  let url = apiAddr() + 'api/designDb/GetDataBases'
  const resp = await ajaxGet(url)
  return resp.data
}
export async function UpdateDatabaseName(database: DataBaseDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/UpdateDatabaseName'
  const resp = await ajaxPost(url, database)
  return resp.data
}
export async function DeleteDatabase(database: DataBaseDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/DeleteDatabase'
  const resp = await ajaxPost(url, database)
  return resp.data
}
// *****************Table**********************************
export async function GetTables(databaseId: string): Promise<TableDC[]> {
  let url = apiAddr() + 'api/designDb/GetTables?databaseId=' + databaseId
  const resp = await ajaxGet(url)
  return resp.data
}
export async function GetTable(table: TableDC): Promise<TableDC> {
  let url = apiAddr() + 'api/designDb/GetTable'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function GetTablesPage(table: TableDC): Promise<SearchPageResult<TableDC>> {
  let url = apiAddr() + 'api/designDb/GetTablesPage'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function AddTable(databaseId: string, tableName: string, tableCode): Promise<boolean> {
  var table = new TableDC()
  table.databaseId = databaseId
  table.tableName = tableName
  table.tableCode = tableCode

  let url = apiAddr() + 'api/designDb/AddTable'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function UpdateTable(table: TableDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/UpdateTable'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function DeleteTable(table: TableDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/DeleteTable'

  const resp = await ajaxPost(url, table)
  return resp.data
}
// *****************Column**********************************
export async function GetColumns(databaseId: string, tableId: string): Promise<ColumnDC[]> {
  let table: TableDC = new TableDC()
  table.databaseId = databaseId
  table.tableId = tableId
  let url = apiAddr() + 'api/designDb/GetColumns'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function UpDateColumn(col: ColumnDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/UpDateColumn'
  const resp = await ajaxPost(url, col)
  return resp.data
}
export async function AddColumn(col: ColumnDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/AddColumn'
  const resp = await ajaxPost(url, col)
  return resp.data
}

export async function UpdateColumns(table: TableDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/UpdateColumns'
  const resp = await ajaxPost(url, table)
  return resp.data
}
export async function DeleteColumn(col: ColumnDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/DeleteColumn'
  const resp = await ajaxPost(url, col)
  return resp.data
}
// *****************Row**********************************
export async function GetRow(dc: RowDC): Promise<RowDC> {
  let url = apiAddr() + 'api/designDb/GetRow'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function UpsertTableData(dc: RowDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/UpsertTableData'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function FirstData(dc: RowDC): Promise<ExtRow> {
  let url = apiAddr() + 'api/designDb/FirstData'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function SearchListData(dc: TableDC): Promise<ExtRow[]> {
  let url = apiAddr() + 'api/designDb/SearchListData'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function SearchPageData(dc: TableDC): Promise<SearchPageResult<ExtRow>> {
  let url = apiAddr() + 'api/designDb/SearchPageData'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function DeleteTableData(dc: TableDC): Promise<boolean> {
  let url = apiAddr() + 'api/designDb/DeleteTableData'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
