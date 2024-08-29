import { getUuid } from '@common/utils'
import { EnginePage } from '@design-any/interface/dist/index'
import { EngineLayout } from '@design-any/interface/dist'
import { behavior } from '@design-any/interface/dist'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '@design-any/interface/dist'
import { actionObj, object_InParam } from '@design-any/interface/dist'

@resourceFuncAttr('字符串缓存', '', funcGroup.storages, funcCode.windowLocalStorage, funcStack.universal, [{ key: getUuid(), name: '设定值' }], { key: getUuid(), name: '输出' })
export class windowLocalStorage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let localStorageKey = this.currentActObj.resourceFilter.key
    if (!localStorageKey) {
      throw '键不存在'
    }
    //为了不污染系统的其它缓存
    localStorageKey = 'leldesignLocalStorage&' + localStorageKey

    if (inparams[0]) {
      let val = inparams[0].val
      window.localStorage.setItem(localStorageKey, val)
    }
    return window.localStorage.getItem(localStorageKey)
  }
}
