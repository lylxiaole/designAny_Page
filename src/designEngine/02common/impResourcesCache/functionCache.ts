import { CurrentContext, CurrentApis } from '../../01designerContext'

export default class functionCache {
  static funcCaches: any[] = []
  public static getFuncInfoByCode2Cache_Sync(code: string) {
    var find = functionCache.funcCaches.find((o) => o.code == code)
    if (find) {
      return find.content
    }
    let result = CurrentApis.GetSysFuncByCode_Sync(code) as any
    var functionContent = result.func_content

    functionCache.funcCaches.push({ code: code, content: functionContent })
    return functionContent
  }

  public static addCache(code: string, func_content: any) {
    var find = functionCache.funcCaches.find((o) => o.code == code)
    if (find) {
      return
    }
    functionCache.funcCaches.push({ code: code, content: func_content })
  }

  public static getFuncInfosByCode2Caches_Sync(codes: string[]) {
    let caches: any[] = []
    let nothaveFuncCodes: string[] = []

    for (let index = 0; index < codes.length; index++) {
      const code = codes[index]
      var find = functionCache.funcCaches.find((o) => o && o.codes == code)
      if (find) {
        caches.push(find)
      } else {
        nothaveFuncCodes.push(code)
      }
    }

    if (nothaveFuncCodes.length < 1) {
      return caches
    }

    let newfunccaches = CurrentApis.GetSysFuncsByCodes_Sync(nothaveFuncCodes)
    let resFuncs: any[] = []
    for (let index = 0; index < newfunccaches.length; index++) {
      const element = newfunccaches[index] as any
      resFuncs.push({ code: element.func_code, content: element.func_content })
    }

    functionCache.funcCaches = functionCache.funcCaches.concat(resFuncs)
    caches = caches.concat(resFuncs)
    return caches
  }

  public static clearCache() {
    functionCache.funcCaches = []
  }
}
