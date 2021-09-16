import Axios, { AxiosStatic } from 'axios'

export default interface IContext {
  SeverAddress: string
  AppID: string
  AppCode: string
  GetCompanyId(): string
  FileServerAddress: string
  BusinessFileServerAddress: string
  GetUserToken(): string
  RoutePage(pageId: string, param: any): void
  CurrentAxios: AxiosStatic
}
