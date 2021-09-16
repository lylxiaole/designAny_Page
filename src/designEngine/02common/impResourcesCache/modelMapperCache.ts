import { CurrentContext, CurrentApis } from '../../01designerContext'

export default class modelMapperCache {
  static mapperCaches: any[] = []

  public static getModelMapperByCode_Sync(code: string): any {
    var find = modelMapperCache.mapperCaches.find((o) => o.code == code)
    if (find) {
      return find.val
    }

    var res = CurrentApis.GetModelMapperByCode_Sync(code)
    if (!res) {
      throw '模型映射不存在!'
    }
    modelMapperCache.mapperCaches.push({ code: code, val: res })
    return res
  }

  public static addCache(code: string, mapper: any) {
    var find = modelMapperCache.mapperCaches.find((o) => o.code == code)
    if (find) {
      return
    }
    modelMapperCache.mapperCaches.push({ code: code, val: mapper })
  }

  public static getModelMappersByCodes_Sync(codes: string[]): any[] {
    let caches: any[] = []
    let nothaveCodes: string[] = []

    for (let index = 0; index < codes.length; index++) {
      const code = codes[index]
      var find = modelMapperCache.mapperCaches.find((o) => o.code == code)
      if (find) {
        caches.push(find)
      } else {
        nothaveCodes.push(code)
      }
    }

    if (nothaveCodes.length < 1) {
      return caches
    }
    let newMappers = CurrentApis.GetModelMappersByCodes_Sync(nothaveCodes)
    let resMappers: any[] = []
    for (let index = 0; index < newMappers.length; index++) {
      const element = newMappers[index] as any
      resMappers.push({ code: element.mapperCode, val: element })
    }

    modelMapperCache.mapperCaches = modelMapperCache.mapperCaches.concat(resMappers)
    caches = caches.concat(resMappers)
    return caches
  }

  public static clearCache() {
    modelMapperCache.mapperCaches = []
  }
}
