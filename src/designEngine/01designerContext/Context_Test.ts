import IContext from './IContext'
var md5 = require('md5')
import { AxiosStatic } from 'axios'
import { axios } from '../02common/netRequest/requestAxios'

export default class Context_Test implements IContext {
  constructor() {
    this.CurrentAxios = axios as any
  }

  SeverAddress: string = 'http://192.168.1.18:30041/'
  // AppID: string = '654677875739463680'
  AppID: string = '8'
  //用于设计器配置的文件上传
  FileServerAddress: string = 'http://192.168.1.18:30041/fileservice'
  // 用于应用的业务文件上传
  BusinessFileServerAddress: string = 'http://192.168.1.18:30041/businessfileservice'
  //应用的AppCode
  AppCode: string = '8'

  CurrentAxios: AxiosStatic
  GetCompanyId(): string {
    return '999'
  }

  GetUserToken(): string {
    return '222222222'
  }

  //获取应用权限信息
  GetAppPrivilege(): any[] {
    return []
  }

  RoutePage(pageId: string, param: any): void {}
}
