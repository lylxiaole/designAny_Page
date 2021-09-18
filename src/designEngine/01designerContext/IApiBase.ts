import { fileInfo, AuthorityCode, APIRequestClass, APIResponseClass, PageOrderClass } from './commonTypes'

export default interface IApiBase {
  /****************页面列表相关******************/
  GetTreeList(): Promise<APIRequestClass | APIRequestClass[]>
  GetGroupList(): Promise<APIRequestClass | APIRequestClass[]>
  GetPageList(groupId: number): Promise<APIRequestClass | APIRequestClass[]>
  /**pageType:pro|group */
  /**根据id获取页面信息列表 */
  GetPage(id: string): Promise<APIRequestClass | APIRequestClass[]>
  GetGroup(id: string): Promise<APIRequestClass | APIRequestClass[]>
  /**根据id获取页面权限信息列表 */
  GetPagePermission(id: string): Promise<APIRequestClass | APIRequestClass[]>
  GetPagePermission_Sync(id: string): APIRequestClass[]
  SavePagePermissions(id: string, permissionCodes: string[]): Promise<APIRequestClass | APIRequestClass[]>
  AddPage(newId: string, name: string, pageType: number, parentGroupId: string): Promise<APIRequestClass | APIRequestClass[]>
  SaveComponentConfig(compId: string, pageId: string, config: any, oldId: any): Promise<APIRequestClass>

  AddGroup(newId: string, name: string, parentGroupId?: string): Promise<APIRequestClass | APIRequestClass[]>

  CheckOutPage(pageIds: string[]): Promise<APIRequestClass | APIRequestClass[]>
  CancelCheckOutPage(pageIds: string[]): Promise<APIRequestClass | APIRequestClass[]>
  CheckInPage(pageId: string, pagecontent: string, resourceJson: any, description: string): Promise<APIRequestClass | APIRequestClass[]>
  GetPageCheckInfo(pageId: string): Promise<APIRequestClass>
  GetPageHistories(questdata: any): Promise<APIRequestClass[]>
  GetPageHistoryContent(pageHistoryID: number): Promise<APIRequestClass>
  /**应用页面权限-新增 */
  AddPermission(data: any): Promise<APIRequestClass | APIRequestClass[]>
  DeletePage(pageId: string): Promise<APIRequestClass | APIRequestClass[]>
  DeleteGroup(groupId: string): Promise<APIRequestClass | APIRequestClass[]>
  UpdatePage(pageId: string, name: string, parentGroupId: string): Promise<APIRequestClass | APIRequestClass[]>
  UpdateIsShow(pageId: string, isShow: boolean): Promise<APIRequestClass | APIRequestClass[]>
  //更新分组的菜单图标Url
  UpdateGroupIconUrl(groupId: string, iconUrl: string): Promise<APIRequestClass | APIRequestClass[]>
  UpdateGroupShow(groupId: string, isShow: boolean): Promise<APIRequestClass | APIRequestClass[]>
  UpdateGroup(groupId: string, name: string, pageType: number, parentGroupId?: string): Promise<APIRequestClass | APIRequestClass[]>
  SavePageData(pageId: string, pagecontent: any, resourceJson: any): Promise<APIRequestClass | APIRequestClass[]>
  GetPageData(pageId: string): APIRequestClass | APIRequestClass[]
  GetPageVersion(pageId: string): Promise<APIRequestClass>
  RestorPage(pageId: string): Promise<APIRequestClass | APIRequestClass[]>
  RefreshPageIndex(indexInfos: PageOrderClass[]): Promise<APIRequestClass | APIRequestClass[]>
  LeadOutPage(data: any): Promise<APIRequestClass | APIRequestClass[]>
  LeadInPage(data: any, parentMenuId: string): Promise<APIRequestClass | APIRequestClass[]>
  /****************模型相关******************/
  GetBaseModelList(pageIndex: number, pageSize: number, modelName?: string, modelCode?: string): Promise<APIRequestClass | APIRequestClass[]>
  GetModelPage(pageNumber: number): Promise<APIRequestClass | APIRequestClass[]>
  /**分页获取模型详细信息 */
  GetModelPageDetail(pageNumber: number, pageSize: number, groupId?: number, modelName?: string, modelCode?: string): Promise<APIRequestClass | APIRequestClass[]>
  GetModelInfoById(modelId: string): Promise<APIRequestClass>
  GetModelInfoById_sync(modelId: string): APIRequestClass
  GetModelsInfoByIds_sync(modelIds: string[]): APIRequestClass[]
  GetModelInfoByCode(modelcode: string): Promise<APIRequestClass>
  GetModelInfosByCodes(modelcodes: string[]): Promise<APIRequestClass>
  GetModelInfosByCodes_Sync(modelcodes: string[]): APIRequestClass[]
  GetModelDeatilInfo(modelId: string): Promise<APIRequestClass | APIRequestClass[]>
  /********工作流************************************** */
  GetWorkOrderFlowList(pageNumber: number, pageSize: number, workflowName: string): APIRequestClass | APIRequestClass[]
  GetWorkOrderFlowDetail(id: string): Promise<APIRequestClass | APIRequestClass[]>
  GetWorkOrderFlowDetail_Sync(id: string): APIRequestClass
  StartWorkOrderFlow(workflowId: string, inparams: any): APIRequestClass | APIRequestClass[]
  StartWorkOrderFlow_Async(workflowId: string, inparams: any): Promise<APIRequestClass | APIRequestClass[]>
  /**********************************************/
  GetComponentMoudels(appId: number): any[] //获取应用的所有组件模板
  GetTreeSelectData(): any[] //获取树形选择框的模拟数据
  // UploadFile(file: FormData): AxiosPromise<fileInfo>
  GetAuthorityCodes(): AuthorityCode[]
  /**********************************************/

  GetUniqueIds_Api(num: number): string[]
  GetServerTime(): string
  /**通用添加方法 */
  SimpleAdd(param: any): Promise<APIRequestClass | APIRequestClass[]>
  /**通用更新方法 */
  SimpleUpdate(param: any): Promise<APIRequestClass | APIRequestClass[]>
  /**通用列表查询（不分页） */
  SimpleListQuery(param: any): Promise<APIRequestClass | APIRequestClass[]>
  SimpleListQuery_Sync(param: any): APIRequestClass | APIRequestClass[]
  simpleQueryView(param: any): Promise<APIRequestClass | APIRequestClass[]>
  simpleQueryView_Sync(param: any): APIRequestClass | APIRequestClass[]
  /**通用列表查询（分页） */
  SimplePageQuery(param: any): Promise<APIRequestClass | APIRequestClass[]>
  SimplePageQuery_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]>
  GetModelMapperByCode(mapperCode: string): Promise<APIRequestClass | APIRequestClass[]>
  GetModelMapperByCode_Sync(mapperCode: string): Promise<APIRequestClass | APIRequestClass[]>
  GetModelMappersByCodes_Sync(mapperCodes: string[]): APIRequestClass[]
  ModelMapperPageQuery(param: any): Promise<APIRequestClass | APIRequestClass[]>
  ModelMapperPageQuery_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]>
  /**根据页面id获取组件模板详细信息 */
  GetComponentTemplateDetail(pageId: any): APIRequestClass | APIRequestClass[]
  SaveComponentTemplateDetail(pageId: any, saveinfoStr: any): Promise<APIRequestClass | APIRequestClass[]>
  SimpleDelete(param: any): Promise<APIRequestClass | APIRequestClass[]>
  GetSysDictPage(pageNumber: number, pageSize: number, dictName: string): Promise<APIRequestClass | APIRequestClass[]>
  GetFileTemplatePage(pageNumber: number, pageSize: number, dictName: string): Promise<APIRequestClass | APIRequestClass[]>
  GetLocalStoragePage(pageNumber: number, pageSize: number, dictName: string): Promise<APIRequestClass | APIRequestClass[]>
  GetSysDictById(dictId: string): APIRequestClass
  GetFileTemplateById(fileId: string): APIRequestClass
  GetSysDictItems(dictItemId: string): Promise<APIRequestClass | APIRequestClass[]>
  GetSysDictItems_Sync(dictItemId: string): APIRequestClass | APIRequestClass[]
  GetSysDictsItems_Sync(dictItemIds: string[]): APIRequestClass[]
  GetSysFuncPage_Sync(pageNumber: number, pageSize: number, codeName: string): Promise<APIRequestClass | APIRequestClass[]>
  GetSysFuncByCode_Sync(codeName: string): APIRequestClass
  GetSysFuncsByCodes_Sync(codeNames: string[]): APIRequestClass[]
  GetDictPage2Cache_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]>
  simpleQuerySingle_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]>
  simplePageQueryView_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]>
  /** */
  GetPageConfig(data: any): APIRequestClass
  /** 获取虚模型 */
  GetVirtulModelByCode(param: any): Promise<APIRequestClass | APIRequestClass[]>
  GetVirtulModelById(param: any): Promise<APIRequestClass | APIRequestClass[]>
  /**根据appid获取菜单树 */
  GetAppMenuTree(param: any): Promise<APIRequestClass | APIRequestClass[]>
  GetUserInfo(userId: number): Promise<APIRequestClass>

  GetAllTreeList(): Promise<APIRequestClass | APIRequestClass[]>
  /**打印报表数据 */
  SearchPrintContent(id: string): Promise<APIRequestClass | APIRequestClass[]>
  SavePrintContent(id: string, content: any): Promise<boolean>
}
