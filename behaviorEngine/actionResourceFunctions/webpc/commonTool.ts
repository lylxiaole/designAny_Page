import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { ElNotification } from 'element-plus'
import { pageEmitter } from '@common/utils/eventBus'
import { toRaw } from 'vue'

// *************************************************************************
@resourceFuncAttr('MessageBox', '', funcGroup.universalTool, funcCode.notificationDialog, platform.page, [], null)
export class NotificationError implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let msg = this.currentActObj.resourceFilter.message
    let type = this.currentActObj.resourceFilter.type

    if (type === 'success') {
      ElNotification.success({
        title: 'success',
        message: msg,
        onClose: () => {}
      })
    } else if (type === 'error') {
      ElNotification.error({
        title: 'error',
        message: msg,
        onClose: () => {}
      })
    } else {
      ElNotification.info({
        title: 'info',
        message: msg,
        onClose: () => {}
      })
    }
  }
}

@resourceFuncAttr('Page jump', '', funcGroup.universalTool, funcCode.leadToOtherPage, platform.page, [], null)
export class leadToPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let newpageId = this.currentActObj.resourceFilter.pageId

    pageEmitter.emit('onLYLLeadToOtherPage', newpageId, inparams[0].val)
    // this.currentPage.$lylemit('onLYLLeadToOtherPage', newpageId)
  }
}

@resourceFuncAttr('Page popup', '', funcGroup.universalTool, funcCode.pagePopup, platform.universal, [], null)
export class pagePopup implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let newpageId = this.currentActObj.resourceFilter.pageId

    pageEmitter.emit('onPopupPage', newpageId, inparams[0].val)
    // this.currentPage.$lylemit('onLYLLeadToOtherPage', newpageId)
  }
}

@resourceFuncAttr('Page Context', '', funcGroup.resoucesInPage, funcCode.pageContext, platform.universal, [], null)
export class pageContext implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { contextKey } = this.currentActObj.resourceFilter
    let context = this.currentPage.pageContext.find((o) => o.key === contextKey)
    if (!context) {
      return null
    }
    if (inparams[0]) {
      let val = inparams[0].val
      context.val = toRaw(val)
    }

    return toRaw(context.val)
  }
}
