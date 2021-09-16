import { CurrentContext, CurrentApis } from '../../01designerContext'

export default class dictCache {
  static dictCaches: any[] = []

  public static getSystemDictById_Sync(dictId: string): any[] {
    var find = dictCache.dictCaches.find((o) => o.dictId == dictId)
    if (find) {
      return find.dictItems
    }

    var res = CurrentApis.GetSysDictItems_Sync(dictId)
    if (!res) {
      throw '枚举已经不存在,行为执行失败'
    }
    var dictItems = (res as any).sysDictItemList
    if (!dictItems || dictItems.length < 1) {
      throw '枚举已经不存在,行为执行失败'
    }
    dictCache.dictCaches.push({ dictId: dictId, dictItems: dictItems })
    return dictItems
  }
  public static addCache(dictId: string, sysDictItemList: any) {
    var find = dictCache.dictCaches.find((o) => o.dictId == dictId)
    if (find) {
      return
    }
    dictCache.dictCaches.push({ dictId: dictId, dictItems: sysDictItemList })
  }
  public static getSystemDictsByIds_Sync(dictIds: string[]): any[] {
    let caches: any[] = []
    let nothaveIds: string[] = []

    for (let index = 0; index < dictIds.length; index++) {
      const dictId = dictIds[index]
      var find = dictCache.dictCaches.find((o) => o && o.dictId == dictId)
      if (find) {
        caches.push(find)
      } else {
        nothaveIds.push(dictId)
      }
    }

    if (nothaveIds.length < 1) {
      return caches
    }

    let newDicts = CurrentApis.GetSysDictsItems_Sync(nothaveIds)
    let resDicts: any[] = []
    for (let index = 0; index < newDicts.length; index++) {
      const element = newDicts[index] as any
      if (!element) {
        continue
      }
      resDicts.push({ dictId: element.id, dictItems: element.sysDictItemList })
    }

    dictCache.dictCaches = dictCache.dictCaches.concat(resDicts)
    caches = caches.concat(resDicts)
    return caches
  }

  public static clearCache() {
    dictCache.dictCaches = []
  }
}
