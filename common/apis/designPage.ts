import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
import dataContactBase from './dataContactBase'
const apiAddr = () => getConfigByName('apiAddr')

export enum pageType {
  page = 0,
  dialogPage = 1,
  customPage = 2 //自定义页面
}
export class DesignPageDC extends dataContactBase {
  appId: string
  type: pageType
  index: number
  name: string
  parentGroupId: string
  designDetail: string
  customPageCode: string //当type是自定义页面时,这个字段存储自定义页面的code
}
export class DesignPageGroupDC extends dataContactBase {
  appId: string
  name: string
  index: number
  parentGroupId: string
  childrenGroups: DesignPageGroupDC[]
  childrenPages: DesignPageDC[]
}
export class TreeNodeDC {
  id: string
  parentGroupId: string
  label: string
  type: string
  index: number
  isDefault: boolean
  children: TreeNodeDC[] = []
}

export async function GetApplicationPages(appId: string): Promise<TreeNodeDC[]> {
  let url = apiAddr() + `api/designPage/getApplicationPages?appId=${appId}`
  const resp = await ajaxGet(url)
  return resp.data
}
export async function UpdateNodesSort(nodes: any[]): Promise<boolean> {
  let url = apiAddr() + `api/designPage/updateNodesSort`
  const resp = await ajaxPost(url, nodes)
  return resp.data
}
export async function GetPageDetail(pageId: string): Promise<DesignPageDC> {
  let url = apiAddr() + `api/designPage/getPageDetail?pageId=${pageId}`
  const resp = await ajaxGet(url)
  return resp.data
}
export async function SavePageDetail(page: DesignPageDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/savePageDetail`
  const resp = await ajaxPost(url, page)
  return resp.data
}

export async function SetDefaultPage(pageId: string): Promise<boolean> {
  let url = apiAddr() + `api/designPage/setDefaultPage`

  const resp = await ajaxPost(url, pageId)
  return resp.data
}

// **********************************************************************
export async function AddPage(page: DesignPageDC): Promise<DesignPageDC> {
  let url = apiAddr() + `api/designPage/addPage`
  const resp = await ajaxPost(url, page)
  return resp.data
}
export async function UpdatePageName(page: DesignPageDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/updatePageName`
  const resp = await ajaxPost(url, page)
  return resp.data
}
export async function ChangePageGroup(page: DesignPageDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/changePageGroup`
  const resp = await ajaxPost(url, page)
  return resp.data
}
export async function DeletePage(page: DesignPageDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/deletePage`
  const resp = await ajaxPost(url, page)
  return resp.data
}
// ********************************************************************
export async function AddGroup(group: DesignPageGroupDC): Promise<DesignPageGroupDC> {
  let url = apiAddr() + `api/designPage/addGroup`
  const resp = await ajaxPost(url, group)
  return resp.data
}
export async function UpdateGroupName(group: DesignPageGroupDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/saveGroupName`
  const resp = await ajaxPost(url, group)
  return resp.data
}
export async function ChangeGroupGroup(group: DesignPageGroupDC): Promise<boolean> {
  let url = apiAddr() + `api/designPage/changeGroupGroup`
  const resp = await ajaxPost(url, group)
  return resp.data
}
export async function DeleteGroup(group: DesignPageGroupDC): Promise<DesignPageGroupDC> {
  let url = apiAddr() + `api/designPage/deleteGroup`
  const resp = await ajaxPost(url, group)
  return resp.data
}
