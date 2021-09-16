import Axios, { AxiosPromise, Method } from 'axios'

export class fileInfo {
  uid: string = 'uid' // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  status: string = 'done' // 状态有：uploading done error removed
  response: string = '{status: success}' // 服务端响应内容
  name: string
  get thumbUrl(): string {
    //应对IE的兼容性
    return this.url
  }
  url: string
}

export class AuthorityCode {
  id: string
  code: string
  name: string
}

export class PageOrderClass {
  id: string
  orderIndex: number
  /**0 page,1 group */
  type: number
}

/***********接口请求类型封装******************************************************** */
export class Compare {
  compare: string = '' //'EQ'
  field: string = '' //
  value: Object = null //
}

export class Compares {
  combine: string = 'AND'
  combined: boolean = true
  compare: string = 'EQ'
  field: string = 'string'
  value: object = {}
  compare1: Compare = null
  compare2: Compare = null
}
//请求的数据类型
export class APIRequestClass {
  constructor(data: any) {
    if (!data) {
      return
    }
    var currentDomain = this as any
    for (var v in data) {
      currentDomain[v] = data[v]
    }
  }

  compares: Compares[] = []
  createTime: number
  creator: string
  creatorId: number
  deleted: boolean
  id: number | string
  appId: number
}

export class APIResponseClass {
  code: string
  data: APIRequestClass[] | APIRequestClass = null
  msg: string

  static analysisResponse(responese: AxiosPromise<APIResponseClass>): Promise<APIRequestClass[] | APIRequestClass> {
    var newpromise = new Promise<APIRequestClass[] | APIRequestClass>((resolve, reject) => {
      responese
        .then((data: any) => {
          // window.console.log('获取到服务端数据', data)
          if (data.code != '0') {
            reject(data.msg)
          } else {
            resolve(data.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
    return newpromise
  }
}
/*************页面类型****************************************************** */
export enum pagenNodeType {
  group = 1,
  pro = 2
}
