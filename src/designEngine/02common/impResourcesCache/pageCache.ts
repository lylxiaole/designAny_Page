import common from '../commonMethod'
import { CurrentApis, pagenNodeType } from '../../01designerContext'
import { data } from 'jquery'
import { Modal, notification } from 'ant-design-vue'

export enum pageStatus {
  unCheckout = 0,
  checkoutByOther = 1,
  checkoutBySelf = 2
}

export class pageContentTable {
  id: string
  version: string
  configs: any
  content: object
  checkoutStatus: pageStatus
  checkoutUsername: string
}

var pageContentTableStr = 'pagecontent'

export default class pageCache {
  private static _localdb: IDBDatabase = null
  private static loadTable(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (!pageCache._localdb) {
        var request = window.indexedDB.open('designerPageDB', 1)
        request.onerror = (event) => {
          console.log('数据库打开报错')
        }
        request.onsuccess = (event) => {
          pageCache._localdb = request.result
          if (!pageCache._localdb.objectStoreNames.contains(pageContentTableStr)) {
            pageCache._localdb.createObjectStore(pageContentTableStr, { keyPath: 'id' })
          }
          resolve()
        }
        request.onupgradeneeded = (event) => {
          pageCache._localdb = (event.target as any).result as any
          if (!pageCache._localdb.objectStoreNames.contains(pageContentTableStr)) {
            pageCache._localdb.createObjectStore(pageContentTableStr, { keyPath: 'id' })
          }
        }
      } else {
        resolve()
      }
    })
  }

  private static async getPageDataFromDB(pageId: string): Promise<pageContentTable> {
    await pageCache.loadTable()
    return new Promise((resolve: any, reject: any) => {
      try {
        var request = pageCache._localdb
          .transaction([pageContentTableStr])
          .objectStore(pageContentTableStr)
          .get(pageId)
        request.onsuccess = function(event) {
          resolve(request.result)
        }

        request.onerror = function(event) {
          notification.warn({
            message: '系统提示',
            description: '很抱歉，网页缓存已被清除,请刷新页面重试！',
            duration: 4
          })
          reject('数据读取失败')
        }
      } catch (error) {
        if (error.name == 'InvalidStateError') {
          notification.warn({
            message: '系统提示',
            description: '请刷新页面重试!',
            duration: 4
          })
        }
        reject(error.message)
      }
    })
  }
  private static async addPageDataToDB(
    pageId: string,
    version: string,
    configs: any,
    content: any,
    checkoutUsername: string,
    checkoutStaus: number
  ): Promise<any> {
    await pageCache.loadTable()
    var newdata = new pageContentTable()
    newdata.id = pageId
    newdata.version = version
    newdata.configs = configs
    newdata.content = content
    newdata.checkoutStatus = checkoutStaus
    newdata.checkoutUsername = checkoutUsername
    return new Promise((resolve: any, reject: any) => {
      try {
        var request = pageCache._localdb
          .transaction([pageContentTableStr], 'readwrite')
          .objectStore(pageContentTableStr)
          .add(newdata)

        request.onsuccess = function(event) {
          resolve()
        }

        request.onerror = function(event) {
          reject('数据写入失败')
        }
      } catch (error) {
        if (error.name == 'InvalidStateError') {
          notification.warn({
            message: '系统提示',
            description: '请刷新页面重试!',
            duration: 4
          })
        }
        reject(error.message)
      }
    })
  }

  private static async updatePageDataToDB(
    pageId: string,
    version: string,
    configs: any,
    content: any,
    checkoutUsername: string,
    checkoutStaus: number
  ): Promise<any> {
    await pageCache.loadTable()
    var newdata = new pageContentTable()
    newdata.id = pageId
    newdata.version = version
    newdata.configs = configs
    newdata.content = content
    newdata.checkoutStatus = checkoutStaus
    newdata.checkoutUsername = checkoutUsername
    return new Promise((resolve: any, reject: any) => {
      try {
        var request = pageCache._localdb
          .transaction([pageContentTableStr], 'readwrite')
          .objectStore(pageContentTableStr)
          .put(newdata)

        request.onsuccess = function(event) {
          resolve()
        }

        request.onerror = function(event) {
          reject('数据写入失败')
        }
      } catch (error) {
        if (error.name == 'InvalidStateError') {
          notification.warn({
            message: '系统提示',
            description: '请刷新页面重试!',
            duration: 4
          })
        }
        reject(error.message)
      }
    })
  }

  private static async pageIsRightVersion(tabledata: pageContentTable): Promise<boolean> {
    if (!tabledata) {
      return false
    }
    let versionInfos = (await CurrentApis.GetPageVersion(tabledata.id)) as any
    // window.console.log('pageIsRightVersion:', versionInfos, tabledata)
    if (!versionInfos) {
      return false
    }
    if (versionInfos.version == tabledata.version) {
      return true
    }
    return false
  }

  public static async getPageData(pageId: string): Promise<pageContentTable> {
    var datafrom = await pageCache.getPageDataFromDB(pageId)
    if ((await this.pageIsRightVersion(datafrom)) == true) {
      return datafrom
    }
    let res = CurrentApis.GetPageData(pageId) as any
    let pageData = new pageContentTable()
    let pagecontent = null
    if (!res.pageContent) {
      pagecontent = null
    } else {
      pagecontent = res.pageContent.designContentString
    }

    pagecontent = common.strUnZip(pagecontent)
    if (pagecontent) {
      pagecontent = common.deserialize(pagecontent)
    }
    pageData.id = pageId

    pageData.configs = res.pageContent ? res.pageContent.resourceObject : {}
    pageData.content = pagecontent
    pageData.version = res.pageContent ? res.pageContent.version : 0
    pageData.checkoutStatus = res.pageInfo.status
    if (pageData.checkoutStatus == pageStatus.checkoutByOther) {
      pageData.checkoutUsername = res.pageInfo.modifier
    }
    // window.console.log('*************正在从Network读取页面数据******', res)
    if (datafrom) {
      await pageCache.updatePageDataToDB(
        pageData.id,
        pageData.version,
        pageData.configs,
        pageData.content,
        pageData.checkoutUsername,
        pageData.checkoutStatus
      )
    } else {
      await pageCache.addPageDataToDB(
        pageData.id,
        pageData.version,
        pageData.configs,
        pageData.content,
        pageData.checkoutUsername,
        pageData.checkoutStatus
      )
    }

    return pageData
  }

  public static async upDataPageCheckStatus(pageId: string, checkoutUsername: string, checkoutStatus: number) {
    var datafrom = await pageCache.getPageDataFromDB(pageId)
    if (!datafrom) {
      return
    }
    datafrom.checkoutStatus = checkoutStatus
    datafrom.checkoutUsername = checkoutUsername
    await pageCache.updatePageDataToDB(
      datafrom.id,
      datafrom.version,
      datafrom.configs,
      datafrom.content,
      datafrom.checkoutUsername,
      datafrom.checkoutStatus
    )
  }

  public static async cacheAllAppPages(data: any[]) {
    // window.console.log('开始缓存整个页面的数据')
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      if (element.meta && element.meta.query && element.meta.query.pageId) {
        await pageCache.lazyLoadPageData(element.meta.query.tag.obj.pageId)
      }

      if (element.children) {
        await pageCache.cacheAllAppPages(element.children)
      }
    }
  }

  private static lazyLoadPageData(pageId: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      pageCache
        .getPageData(pageId)
        .then(() => {
          resolve()
        })
        .catch(() => {
          resolve()
        })
    })
  }
}
