import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { ElNotification } from 'element-plus'
import { pageEmitter } from '@common/utils/eventBus'
import { toRaw } from 'vue'
import { getLocale } from '@common/baseConfigs'
import fontActFuncBase from '../fontFuncBase'
// *************************************************************************
@resourceFuncAttr(getLocale().t('behav.BehaviorInparam'), '', funcGroup.currentBehaviorInparam, funcCode.behaviorInparam, platform.universal, [], null)
export class behaviorInparamMethod implements fontActFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { inparamName } = this.currentActObj.resourceFilter
    let inparam = this.currentBehavior.inParams.find((o) => o.key == this.currentActObj.id)
    return inparam.val
  }
}
