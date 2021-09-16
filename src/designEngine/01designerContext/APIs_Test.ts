import IAPIBase from './IApiBase'
import { CurrentContext } from './index'
import { fileInfo, AuthorityCode, APIRequestClass, APIResponseClass, PageOrderClass } from './commonTypes'
import common from '../02common/commonMethod'
import { AxiosPromise } from 'axios'
import { jsonlint } from '../02common/netRequest/jsonlint'
import { getDistributedUID_Sync } from '@/utils/util'
import ajaxrequest from '../02common/netRequest/requestAjax'

export default class APIs implements IAPIBase {
  GetGroup(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group?id=' + id
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }
  UpdateGroupShow(groupId: string, isShow: boolean): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      id: groupId,
      isShow: isShow
    })
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group', data)
    )
  }
  //更新分组的菜单图标Url
  UpdateGroupIconUrl(groupId: string, iconUrl: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      id: groupId,
      iconUrl: iconUrl
    })
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group', data)
    )
  }
  /****************页面列表相关******************/
  GetTreeList(): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/pagetree?appId=' + CurrentContext.AppID
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }
  GetGroupList(): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/list'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post<APIResponseClass>(url, null))
  }
  GetPageList(groupId: number): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/pages?id=' + groupId
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }
  /**根据id获取页面信息列表 */

  GetPage(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page?id=' + id
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }
  /**根据id获取页面权限信息列表 */
  GetPagePermission(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/permission/permission?id=' + id
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }
  GetPagePermission_Sync(id: string): APIRequestClass[] {
    var res = ajaxrequest.ajaxget_sync(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/permission/permission?id=' + id)
    return res
  }
  SavePagePermissions(id: string, permissionCodes: string[]): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/permission/code'
    let data: any = {
      pageId: id,
      permissionCodes: permissionCodes
    }
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(url, data))
  }
  AddPage(newId: string, name: string, pageType: number, parentGroupId: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      pageName: name,
      parentGroupId: !parentGroupId ? 0 : parentGroupId,
      pageType: pageType,
      appId: CurrentContext.AppID,
      isSystem: false,
      isShow: true
    })

    data.id = newId
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page', data))
  }
  SaveComponentConfig(compId: string, pageId: string, config: any, oldId: any): Promise<APIRequestClass> {
    var data = {
      comConfiguration: config,
      comId: compId,
      pageId: pageId,
      id: oldId
    }
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/user/component/save', data)
    ) as any
  }

  CheckOutPage(pageIds: string[]): Promise<APIRequestClass | APIRequestClass[]> {
    let url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/checkout'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(url, pageIds))
  }
  CancelCheckOutPage(pageIds: string[]): Promise<APIRequestClass | APIRequestClass[]> {
    let url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/cancel/checkout'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(url, pageIds))
  }

  CheckInPage(pageId: string, pagecontent: string, resourceObj: any, description: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({ pageId: pageId, designContent: pagecontent, resourceObject: resourceObj, description: description })
    let url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/checkin'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(url, [data]))
  }

  GetPageCheckInfo(pageId: string): Promise<APIRequestClass> {
    let param = {
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: pageId
        }
      ],
      modelCode: 'app_page'
    }

    return this.SimpleListQuery(param) as any
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/list', data)
    return APIResponseClass.analysisResponse(promise) as any
  }

  GetPageHistories(questdata: any): Promise<APIRequestClass[]> {
    let url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/history/list'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(url, questdata)) as any
  }
  GetPageHistoryContent(pageHistoryID: number): Promise<APIRequestClass> {
    let url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/history/content?pageHistoryID=' + pageHistoryID
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get(url)) as any
  }

  UpdateIsShow(pageId: string, isShow: boolean): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      id: pageId,
      isShow: isShow
    })
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-user-manage-service/page', data))
  }
  AddGroup(newId: string, name: string, parentGroupId?: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      groupName: name,
      isSystem: false,
      parentId: !parentGroupId ? 0 : parentGroupId,
      appId: CurrentContext.AppID
    })
    data.id = newId
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group', data)
    )
  }
  /**应用页面权限-新增 */

  AddPermission(data: any): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/permission', data)
    )
  }
  DeletePage(pageId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.delete(CurrentContext.SeverAddress + 'genoany-user-manage-service/page', { data: [pageId] })
    )
    // return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.delete(CurrentContext.SeverAddress + 'genoany-user-manage-service/page?id=' + pageId))
  }
  DeleteGroup(groupId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.delete(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/del', { data: [groupId] })
    )
  }
  UpdatePage(pageId: string, name: string, parentGroupId: string): Promise<APIRequestClass | APIRequestClass[]> {
    if (!parentGroupId) {
      parentGroupId = '0'
    }
    var data = new APIRequestClass({ pageName: name, id: pageId, parentGroupId: parentGroupId })
    //data.id = pageId
    // window.console.log('data', data)
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-user-manage-service/page', data))
  }
  RestorPage(pageId: string): Promise<APIRequestClass | APIRequestClass[]> {
    // window.console.log('pageId', pageId)
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/restore', { params: { id: pageId } })
    )
  }
  UpdateGroup(groupId: string, name: string, pageType: number, parentGroupId?: string): Promise<APIRequestClass | APIRequestClass[]> {
    if (!parentGroupId) {
      parentGroupId = '0'
    }

    var data = new APIRequestClass({ groupName: name, parentId: parentGroupId, pageType: pageType })
    data.id = groupId
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group', data)
    )
  }

  RefreshPageIndex(indexInfos: PageOrderClass[]): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/index'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.put(url, indexInfos))
  }

  SavePageData(pageId: string, pagecontent: any, resourceObj: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({ designContentString: pagecontent, appId: CurrentContext.AppID, resourceObject: resourceObj })
    data.id = pageId
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/change/content', data)
    )
  }
  GetPageData(pageId: string): APIRequestClass | APIRequestClass[] {
    var requestUrl = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/page/content?pageId=' + pageId
    return ajaxrequest.ajaxget_sync(requestUrl)
    // return APIResponseClass.analysisResponse(
    //   CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/find/content', { params: { id: pageId } })
    // )
  }

  GetPageVersion(pageId: string): Promise<APIRequestClass> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/find/design/content/version?id=' + pageId)
    ) as any
  }

  LeadOutPage(data: any): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/export/page/data', data)
    ) as any
  }
  LeadInPage(data: any, parentMenuId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/page/import/page/data', data)
    ) as any
  }

  /******模型相关**************************************** */
  GetModelPage(pageNumber: number): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      pageNumber: pageNumber,
      pageSize: 10,
      filter: {},
      orders: []
    })
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/model/page', data))
  }

  GetModelPageDetail(
    pageNumber: number,
    pageSize: number,
    groupId?: number,
    modelName?: string,
    modelCode?: string
  ): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: { groupId: groupId, modelName: modelName, modelCode: modelCode, modelType: 'BASIC' },
      orders: [{ fieldName: 'modifyTime', direction: 'DESC' }]
    })
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/model/page/all', data)
    )
  }

  GetBaseModelList(pageIndex: number, pageSize: number, modelName?: string, modelCode?: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      pageNumber: pageIndex,
      pageSize: pageSize,
      filter: { modelName: modelName, modelCode: modelCode, deleted: false },
      orders: [{ fieldName: 'modifyTime', direction: 'DESC' }]
    })
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/model/page', data))
  }
  GetModelInfoById(modelId: string): Promise<APIRequestClass> {
    // window.console.log('获取模型信息')
    var res = APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/model?id=' + modelId)
    )
    return res as Promise<APIRequestClass>
  }
  GetModelInfoById_sync(modelId: string): APIRequestClass {
    var requestUrl = CurrentContext.SeverAddress + 'genoany-crud-service/model?id=' + modelId
    return ajaxrequest.ajaxget_sync(requestUrl)
  }
  GetModelsInfoByIds_sync(modelIds: string[]): APIRequestClass[] {
    var requestUrl = CurrentContext.SeverAddress + 'genoany-crud-service/model/ids'
    return ajaxrequest.ajaxpost_sync(requestUrl, modelIds)
  }
  GetModelInfoByCode(modelcode: string): Promise<APIRequestClass> {
    //window.console.log('获取模型信息**************by code')
    var res = APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/model/code?code=' + modelcode)
    )
    return res as Promise<APIRequestClass>
  }

  GetModelInfosByCodes(modelcodes: string[]): Promise<APIRequestClass> {
    // window.console.log('获取多个模型信息')
    var res = APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/model/code', modelcodes)
    )
    return res as Promise<APIRequestClass>
  }
  GetModelInfosByCodes_Sync(modelcodes: string[]): APIRequestClass[] {
    var data = new APIRequestClass(modelcodes)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/model/code'
    return ajaxrequest.ajaxpost_sync(url, modelcodes)
  }

  GetModelDeatilInfo(modelId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/property/model?modelId=' + modelId)
    )
  }
  /********工作流************************************** */
  GetWorkOrderFlowList(pageNumber: number, pageSize: number, workflowName: string): APIRequestClass | APIRequestClass[] {
    var data = new APIRequestClass({
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: {
        wfName: workflowName
      }
    })
    // window.console.log('获取工作流分页数据')
    var res = ajaxrequest.ajaxpost_sync(CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow/page', data)

    return res
    // return APIResponseClass.analysisResponse(promise)
  }
  GetWorkOrderFlowDetail(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass({
      pageNumber: 1,
      pageSize: 500
    })
    var promise = CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow?id=' + id)
    return APIResponseClass.analysisResponse(promise)
  }

  GetWorkOrderFlowDetail_Sync(id: string): APIRequestClass {
    var url = CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow?id=' + id
    // var promise = CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow?id=' + id)
    return ajaxrequest.ajaxget_sync(url)
    // return APIResponseClass.analysisResponse(promise)
  }

  StartWorkOrderFlow(workflowId: string, inparams: any): APIRequestClass | APIRequestClass[] {
    var responsedata: APIRequestClass = null
    var requestData = new APIRequestClass({ workflowId: workflowId, data: inparams })
    var requestUrl = CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow/start'
    return ajaxrequest.ajaxpost_sync(requestUrl, requestData)
  }

  StartWorkOrderFlow_Async(workflowId: string, inparams: any): Promise<APIRequestClass | APIRequestClass[]> {
    var requestData = new APIRequestClass({ workflowId: workflowId, data: inparams })
    var res = APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow/start', requestData)
    )
    return res as Promise<APIRequestClass>
    // var requestData = new APIRequestClass({ workflowId: workflowId, data: inparams })
    // var requestUrl = CurrentContext.SeverAddress + 'genoany-workflow-scheduler-service/workflow/start'
    // return ajaxrequest.ajaxpost_sync(requestUrl, requestData)
  }
  /********************************************** */
  GetComponentMoudels(appId: number): any[] {
    throw new Error('Method not implemented.')
  }
  //获取树形选择框的模拟数据
  GetTreeSelectData(): any[] {
    const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        disabled: false,
        children: [
          {
            title: 'Child Node1',
            value: '0-0-1',
            key: '0-0-1',
            disabled: false
          },
          {
            title: 'Child Node2',
            value: '0-0-2',
            key: '0-0-2',
            disabled: false
          }
        ]
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        disabled: false
      }
    ]
    return treeData
  }
  GetAuthorityCodes(): AuthorityCode[] {
    var allcodes: AuthorityCode[] = [
      {
        id: '1',
        code: '1',
        name: '增加'
      },
      {
        id: '2',
        code: '2',
        name: '删除'
      },
      {
        id: '3',
        code: '3',
        name: '查看'
      },
      {
        id: '4',
        code: '4',
        name: '修改'
      }
    ]
    return allcodes
  }
  /********************************************** */
  GetServerUUID(): string {
    return getDistributedUID_Sync(1)
    // let url = CurrentContext.SeverAddress + 'genoany-common-service/global/unique/id'
    // return ajaxrequest.ajaxget_sync(url).toString()
  }

  GetUniqueIds(num: number): string[] {
    if (num == 1) {
      return [getDistributedUID_Sync(1)]
    } else {
      return getDistributedUID_Sync(num) as string[]
    }
  }

  GetUniqueIds_Api(num: number): string[] {
    let url = CurrentContext.SeverAddress + 'genoany-common-service/global/unique/ids?number=' + num
    return ajaxrequest.ajaxget_sync(url)
  }

  GetServerTime(): string {
    let url = CurrentContext.SeverAddress + 'genoany-common-service/datetime'
    return ajaxrequest.ajaxget_sync(url)
  }

  /**
   * 通用的添加方法
   * @param param
   */
  SimpleAdd(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/crud', data)
    return APIResponseClass.analysisResponse(promise)
  }

  SimpleDelete(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.delete(CurrentContext.SeverAddress + 'genoany-crud-service/crud', { data: data })
    //var promise = CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-crud-service/crud', data)
    return APIResponseClass.analysisResponse(promise)
  }

  /**
   * 通用的更新方法
   * @param param
   */
  SimpleUpdate(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-crud-service/crud', data)
    return APIResponseClass.analysisResponse(promise)
  }

  /**
   * 通用不分页查询
   * @param param
   */
  SimpleListQuery(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    // window.console.log('param', param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/list', data)
    return APIResponseClass.analysisResponse(promise)
  }

  SimplePageQuery(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/page', data)
    return APIResponseClass.analysisResponse(promise)
  }

  SimplePageQuery_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/page'
    return ajaxrequest.ajaxpost_sync(url, data)
  }

  simpleQueryView(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/crud/view/filter/list', data)
    return APIResponseClass.analysisResponse(promise)
  }

  simpleQueryView_Sync(param: any): APIRequestClass | APIRequestClass[] {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/crud/view/filter/list'
    return ajaxrequest.ajaxpost_sync(url, data)
  }

  SimpleListQuery_Sync(param: any): APIRequestClass | APIRequestClass[] {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/list'
    return ajaxrequest.ajaxpost_sync(url, data)
  }

  /**获取组件模板详情 */
  GetComponentTemplateDetail(pageId: any): APIRequestClass | APIRequestClass[] {
    let param = {
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: pageId
        }
      ],
      modelCode: 'app_component_template'
    }

    var simpleInfo = this.SimpleListQuery_Sync(param)

    var data = new APIRequestClass({
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: simpleInfo[0].template_content_id
        }
      ],
      modelCode: 'app_component_template_content'
    })

    return ajaxrequest.ajaxpost_sync(CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/list', data)
  }

  /**保存组件模板详情 */
  SaveComponentTemplateDetail(pageId: any, saveinfoStr: any): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: pageId
        }
      ],
      modelCode: 'app_component_template'
    }
    return this.SimpleListQuery(param).then((res) => {
      let param111 = {
        data: [
          {
            code: 'design_content',
            value: saveinfoStr
          }
        ],
        filter: [
          {
            code: 'id',
            type: 'EQ',
            value: res[0].template_content_id
          }
        ],
        modelCode: 'app_component_template_content'
      }
      var promise = CurrentContext.CurrentAxios.put(CurrentContext.SeverAddress + 'genoany-crud-service/crud', param111)
      return APIResponseClass.analysisResponse(promise)
    })
  }

  GetModelMapperByCode(mapperCode: string): Promise<APIRequestClass | APIRequestClass[]> {
    var promise = CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/model/mapper/code?code=' + mapperCode)
    return APIResponseClass.analysisResponse(promise)
  }

  GetModelMapperByCode_Sync(mapperCode: string): Promise<APIRequestClass | APIRequestClass[]> {
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/model/mapper/code?code=' + mapperCode
    return ajaxrequest.ajaxget_sync(url)
  }

  GetModelMappersByCodes_Sync(mapperCodes: string[]): APIRequestClass[] {
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/model/mapper/code'
    return ajaxrequest.ajaxpost_sync(url, mapperCodes)
  }

  ModelMapperPageQuery(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/model/mapper/page', data)
    return APIResponseClass.analysisResponse(promise)
  }

  ModelMapperPageQuery_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/model/mapper/page'
    return ajaxrequest.ajaxpost_sync(url, data)
  }

  /*================================Start 系统枚举相关 Start=======================================================  */
  //枚举分页信息带缓存（同步）
  getDictPage2Cache(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    delete data.compares
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/dict/page', data)
    return APIResponseClass.analysisResponse(promise)
  }
  //枚举分页信息带缓存（异步）
  GetDictPage2Cache_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    delete data.compares
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/dict/page'
    return ajaxrequest.ajaxpost_sync(url, data)
  }
  //根据枚举id获取枚举信息带缓存（同步）
  getDictInfoById2Cache(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    var promise = CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/dict?id=' + id)
    return APIResponseClass.analysisResponse(promise)
  }
  //根据枚举id获取枚举信息带缓存（异步）
  getDictInfoById2Cache_Sync(id: string): APIRequestClass {
    var url = CurrentContext.SeverAddress + 'genoany-crud-service/dict?id=' + id
    return ajaxrequest.ajaxget_sync(url)
  }
  //分页获取系统枚举信息
  GetSysDictPage(pageNumber: number, pageSize: number, dictName: string): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: {},
      orders: [
        {
          direction: 'DESC',
          fieldName: 'modifyTime'
        }
      ]
    }
    if (dictName) {
      param.filter = { dict_name: dictName }
    }
    return this.getDictPage2Cache(param)
  }
  //根据枚举id获取枚举信息
  GetSysDictById(dictId: string): APIRequestClass {
    return this.getDictInfoById2Cache_Sync(dictId) as any
  }
  //获取系统枚举项的信息（同步）
  GetSysDictItems(dictItemId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return this.getDictInfoById2Cache(dictItemId) as any
  }
  //获取系统枚举项的信息（异步）
  GetSysDictItems_Sync(dictItemId: string): APIRequestClass | APIRequestClass[] {
    return this.getDictInfoById2Cache_Sync(dictItemId) as any
  }
  GetSysDictsItems_Sync(dictItemIds: string[]): APIRequestClass[] {
    var url = CurrentContext.SeverAddress + 'genoany-crud-service/dict/ids'
    return ajaxrequest.ajaxpost_sync(url, dictItemIds)
  }
  /*================================End 系统枚举相关 End=======================================================  */

  /*================================Start 系统公式库相关 Start=======================================================  */
  //公式库分页信息带缓存（同步）
  getFuncPage2Cache(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    delete data.compares
    var promise = CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-crud-service/func/page', data)
    return APIResponseClass.analysisResponse(promise)
  }
  //公式库分页信息带缓存（异步）
  GetFuncPage2Cache_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    delete data.compares
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/func/page'
    return ajaxrequest.ajaxpost_sync(url, data)
  }
  //根据公式code获取公式库信息带缓存（同步）
  getFuncInfoByCode2Cache(code: string): Promise<APIRequestClass | APIRequestClass[]> {
    var promise = CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/func?code=' + code)
    return APIResponseClass.analysisResponse(promise)
  }
  //根据公式code获取公式库信息带缓存（异步）
  getFuncInfoByCode2Cache_Sync(code: string): APIRequestClass {
    var url = CurrentContext.SeverAddress + 'genoany-crud-service/func/code?code=' + code
    return ajaxrequest.ajaxget_sync(url)
  }
  //分页获取系统公式库信息
  GetSysFuncPage_Sync(pageNumber: number, pageSize: number, codeName: string): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: {},
      orders: [
        {
          direction: 'DESC',
          fieldName: 'modifyTime'
        }
      ]
    }
    if (codeName) {
      param.filter = { func_code: codeName }
    }
    return this.GetFuncPage2Cache_Sync(param)
  }
  //根据公式code获取系统公式库信息
  GetSysFuncByCode_Sync(codeName: string): APIRequestClass {
    return this.getFuncInfoByCode2Cache_Sync(codeName) as any
  }

  GetSysFuncsByCodes_Sync(codeNames: string[]): APIRequestClass[] {
    var url = CurrentContext.SeverAddress + 'genoany-crud-service/func/codes'
    return ajaxrequest.ajaxpost_sync(url, codeNames)
  }
  /*================================End 系统公式库相关 End=======================================================  */

  GetFileTemplatePage(pageNumber: number, pageSize: number, name: string): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: [],
      orders: [
        {
          code: 'modify_time',
          type: 'DESC'
        }
      ],
      modelCode: 'sys_file'
    }

    if (name) {
      param.filter = [{ code: 'file_name', value: name, type: 'ALL_LIKE' }]
    }
    return this.SimplePageQuery(param)
  }

  GetLocalStoragePage(pageNumber: number, pageSize: number, name: string): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      filter: [],
      orders: [
        {
          code: 'modify_time',
          type: 'DESC'
        }
      ],
      modelCode: 'app_local_storage'
    }

    if (name) {
      param.filter = [{ code: 'storage_name', value: name, type: 'ALL_LIKE' }]
    }
    return this.SimplePageQuery(param)
  }

  GetFileTemplateById(fileId: string): APIRequestClass {
    let param = {
      pageNumber: 1,
      pageSize: 1,
      filter: [{ code: 'id', value: fileId, type: 'EQ' }],
      orders: [
        {
          code: 'modify_time',
          type: 'DESC'
        }
      ],
      modelCode: 'sys_file'
    }

    var res = this.SimplePageQuery_Sync(param) as any
    return res.content[0]
  }

  simplePageQueryView_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/crud/view/filter/page'
    return ajaxrequest.ajaxpost_sync(url, data)
  }

  simpleQuerySingle_Sync(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    var data = new APIRequestClass(param)
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/crud/filter/single'
    return ajaxrequest.ajaxpost_sync(url, data)
  }
  GetPageConfig(data: any): APIRequestClass {
    let url = CurrentContext.SeverAddress + 'genoany-crud-service/config'
    return ajaxrequest.ajaxpost_sync(url, data)
  }
  /** 虚模型详细属性的获取 */
  GetVirtulModelByCode(modelCode: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/virtul/code?code=' + modelCode)
    )
  }

  GetVirtulModelById(modelId: string): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-crud-service/virtul?id=' + modelId)
    )
  }

  GetAppMenuTree(param: any): Promise<APIRequestClass | APIRequestClass[]> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.post(CurrentContext.SeverAddress + 'genoany-user-manage-service/app/user/menu', param)
    )
  }

  GetUserInfo(userId: number): Promise<APIRequestClass> {
    return APIResponseClass.analysisResponse(
      CurrentContext.CurrentAxios.get(CurrentContext.SeverAddress + 'genoany-user-manage-service/sys/user?id=' + userId)
    ) as any
  }

  GetAllTreeList(): Promise<APIRequestClass | APIRequestClass[]> {
    var url = CurrentContext.SeverAddress + 'genoany-user-manage-service/page/group/pagetree'
    return APIResponseClass.analysisResponse(CurrentContext.CurrentAxios.get<APIResponseClass>(url))
  }

  async SearchPrintContent(id: string): Promise<APIRequestClass | APIRequestClass[]> {
    let param = {
      pageNumber: 1,
      pageSize: 1,
      filter: [{ code: 'id', value: id, type: 'EQ' }],
      orders: [
        {
          code: 'modify_time',
          type: 'DESC'
        }
      ],
      modelCode: 'app_report_content'
    }

    return this.SimpleListQuery(param)
  }

  async SavePrintContent(id: string, content: any): Promise<boolean> {
    var res = (await this.SearchPrintContent(id)) as any[]

    if (res && res.length > 0) {
      let param = {
        data: [
          {
            code: 'design_content',
            value: content
          }
        ],
        filter: [
          {
            code: 'id',
            type: 'EQ',
            value: id
          }
        ],
        modelCode: 'app_report_content'
      }
      this.SimpleUpdate(param)
    } else {
      let param = {
        data: [
          {
            code: 'id',
            value: id
          },
          {
            code: 'design_content',
            value: content
          }
        ],
        modelCode: 'app_report_content'
      }
      this.SimpleAdd(param)
    }

    return true
    // var res = this.SimplePageQuery(param) as any
    // return res.content[0]
  }
}
