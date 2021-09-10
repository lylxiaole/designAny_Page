// ****************************************
import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public Id: string
  public ModifiedTime: string
  public IsDeleted: boolean
}
export class ApiContentDC extends BaseClass {
  public ApiId: string
  public Content: string
}
export class DesignedAPIDC extends BaseClass {
  public GroupId: string
  public APIName: string
  public Desc: string
}
export class DesignedAPIGroupDC extends BaseClass {
  public ParentGroupId: string
  public GroupName: string
  public ChildrenGroups: DesignedAPIGroupDC[]
  public ChildrenAPIs: DesignedAPIDC[]
}

export default class apiDesignManagerApis {
  public static async AddApiGroup(dc: DesignedAPIGroupDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/AddApiGroup'
    return ajaxPost(url, dc)
  }
  public static async DeleteApiGroup(groupId: string): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteApiGroup'
    return ajaxPost(url, groupId)
  }
  public static async UpdateApiGroup(dc: DesignedAPIGroupDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateApiGroup'
    return ajaxPost(url, dc)
  }
  public static async GetGroupApisAll(): Promise<DesignedAPIGroupDC[]> {
    let url = apiAddr() + 'api/LYLDesigner/GetGroupApisAll'
    return ajaxGet(url)
  }

  public static async AddAPI(api: DesignedAPIDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/AddAPI'
    return ajaxPost(url, api)
  }

  public static async DeleteAPI(apiId: string): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/DeleteAPI'
    return ajaxPost(url, apiId)
  }

  public static async UpdateAPI(api: DesignedAPIDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateAPI'
    return ajaxPost(url, api)
  }

  public static async UpdateSertAPIContent(api: ApiContentDC): Promise<boolean> {
    let url = apiAddr() + 'api/LYLDesigner/UpdateSertAPIContent'
    return ajaxPost(url, api)
  }

  public static async GetApiSimpleInfo(apiId: string): Promise<DesignedAPIDC> {
    let url = apiAddr() + 'api/LYLDesigner/GetApiSimpleInfo?apiId=' + apiId
    return ajaxGet(url)
  }
}
