// ***************************************************************
import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
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
  public Id: string
  public TableId: string
  public ColumnName: string
  public ColumnCode: string
  public ColumnDataType: ColumnDataType = ColumnDataType.String
  public IsRequired: boolean = false
}

export class ExtCellData {
  public Id: string
  public RowId: string
  public ColumnCode: string
  public Val: any
}

export class ExtDatabase {
  public Id: string
  public UserId: string
  public DatabaseName: string
  public DatabaseCode: string
  public Tables: ExtTable[]
}

export class ExtRow {
  public Id: string
  public TableId: string
  public RowDatas: ExtCellData[] = []
}

export class ExtTable {
  public Id: string
  public DatabaseId: string
  public TableName: string
  public TableCode: string
  public Columns: ExtColumn[]
  public Rows: ExtRow[]
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
  public Relation?: FilterRelation
  public ColumnCode: string
  public Judge: FilterJudge
  public Val: string
  public Order: OrderSequence
}
// **************************************************************
export class DataBaseDC {
  public UserId: string
  public DatabaseId: string
  public DatabaseName: string
  public DatabaseCode: string
  public Tables: TableDC[] = []
}

export class TableDC {
  public DatabaseId: string
  public TableId: string
  public TableName: string
  public TableCode: string
  public PageSearchInfo: PageSearch
  public Columns: ExtColumn[] = []
  public Filters: Filter[]
}

export class ColumnDC {
  public DatabaseId: string
  public TableId: string
  public ColumnId: string
  public ColumnCode: string
  public ColumnName: string
  public IsRequired: boolean
  public ColumnDataType: ColumnDataType
}

export class RowDC extends TableDC {
  public RowId: string
  public RowDatas: ExtCellData[] = []
}

export class SearchPageResult<T> {
  /// <summary>
  /// 每一页的最大数量
  /// </summary>
  public PageSize: number
  /// <summary>
  /// 当前页数
  /// </summary>
  public PageIndex: number
  /// <summary>
  /// 总页数
  /// </summary>
  public TotalPageCount: number
  /// <summary>
  /// 数据总条数
  /// </summary>
  public TotalItemCount: number
  public Items: T[]
}
// **************************************************************

export default class databaseManagerApis {
  /**
   * name
   */
  public static async AddDataBase(databaseName: string, databaseCode: string): Promise<boolean> {
    var database: DataBaseDC = new DataBaseDC()
    database.DatabaseCode = databaseCode
    database.DatabaseName = databaseName
    let url = apiAddr() + 'api/LYLDesigner/AddDataBase'
    const resp = await ajaxPost(url, database)
    return resp.data
  }
  public static async GetUserDataBases(): Promise<DataBaseDC[]> {
    let url = apiAddr() + 'api/LYLDesigner/GetUserDataBases'
    const resp = await ajaxPost(url)
    return resp.data
  }
  public static async UpdateDatabaseName(database: DataBaseDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateDatabaseName'
    const resp = await ajaxPost(url, database)
    return resp.data
  }
  public static async DeleteDatabase(database: DataBaseDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteDatabase'
    const resp = await ajaxPost(url, database)
    return resp.data
  }
  // *****************Table**********************************
  public static async GetTables(databaseId: string): Promise<TableDC[]> {
    let url = apiAddr() + 'api/LYLDesigner/GetTables?databaseId = ' + databaseId
    const resp = await ajaxGet(url)
    return resp.data
  }
  public static async GetTable(table: TableDC): Promise<TableDC> {
    let url = apiAddr() + 'api/LYLDesigner/GetTable'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async GetTablesPage(table: TableDC): Promise<SearchPageResult<TableDC>> {
    let url = apiAddr() + 'api/LYLDesigner/GetTablesPage'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async AddTable(databaseId: string, tableName: string, tableCode): Promise<boolean> {
    var table = new TableDC()
    table.DatabaseId = databaseId
    table.TableName = tableName
    table.TableCode = tableCode

    let url = apiAddr() + 'api/LYLDesigner/AddTable'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async UpdateTable(table: TableDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateTable'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async DeleteTable(table: TableDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteTable'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  // *****************Column**********************************
  public static async GetColumns(databaseId: string, tableId: string): Promise<ColumnDC[]> {
    let table: TableDC = new TableDC()
    table.DatabaseId = databaseId
    table.TableId = tableId
    let url = apiAddr() + 'api/LYLDesigner/GetColumns'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async UpDateColumn(col: ColumnDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpDateColumn'
    const resp = await ajaxPost(url, col)
    return resp.data
  }
  public static async AddColumn(col: ColumnDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/AddColumn'
    const resp = await ajaxPost(url, col)
    return resp.data
  }

  public static async UpdateColumns(table: TableDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateColumns'
    const resp = await ajaxPost(url, table)
    return resp.data
  }
  public static async DeleteColumn(col: ColumnDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteColumn'
    const resp = await ajaxPost(url, col)
    return resp.data
  }
  // *****************Row**********************************
  public static async GetRow(dc: RowDC): Promise<RowDC> {
    let url = apiAddr() + 'api/LYLDesigner/GetRow'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
  public static async UpsertTableData(dc: RowDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpsertTableData'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
  public static async FirstData(dc: RowDC): Promise<ExtRow> {
    let url = apiAddr() + 'api/LYLDesigner/FirstData'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
  public static async SearchListData(dc: TableDC): Promise<ExtRow[]> {
    let url = apiAddr() + 'api/LYLDesigner/SearchListData'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
  public static async SearchPageData(dc: TableDC): Promise<SearchPageResult<ExtRow>> {
    let url = apiAddr() + 'api/LYLDesigner/SearchPageData'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
  public static async DeleteTableData(dc: TableDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteTableData'
    const resp = await ajaxPost(url, dc)
    return resp.data
  }
}
