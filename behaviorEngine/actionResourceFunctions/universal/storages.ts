import { getUuid } from '@common/utils'
import { EnginePage, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'
import fontActFuncBase from '../fontFuncBase'

@resourceFuncAttr(getLocale().t('behav.StringCache'), '', funcGroup.storages, funcCode.windowLocalStorage, platform.universal, [{ key: getUuid(), name: 'input' }], { key: getUuid(), name: 'output' })
export class windowLocalStorage implements fontActFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let localStorageKey = this.currentActObj.resourceFilter.key
    if (!localStorageKey) {
      throw 'The key does not exist'
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
