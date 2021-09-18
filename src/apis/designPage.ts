import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
import dataContactBase from './dataContactBase'
const apiAddr = () => getConfigByName('apiAddr')

export enum pageType {
  pcPage = 0,
  mobilePage = 1
}
export class DesignPageDC extends dataContactBase {
  appId: string
  type: pageType
  name: string
  parentGroupId: string
  designDetail: string
}
export class DesignPageGroupDC extends dataContactBase {
  appId: string
  name: string
  parentGroupId: string
  childrenGroups: DesignPageGroupDC[]
  childrenPages: DesignPageDC[]
}

export async function GetApplicationPages(appId: string): Promise<DesignPageGroupDC[]> {
  let url = apiAddr() + `api/designPage/getApplicationPages?appId=${appId}`
  const resp = await ajaxGet(url)
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
export async function SaveGroupName(group: DesignPageGroupDC): Promise<boolean> {
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
