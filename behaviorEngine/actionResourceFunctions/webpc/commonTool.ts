import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { ElNotification } from 'element-plus'
import { pageEmitter } from '@common/utils/eventBus'

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

    pageEmitter.emit('onLYLLeadToOtherPage', newpageId)
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
    debugger
    pageEmitter.emit('onPopupPage', newpageId)

    // this.currentPage.$lylemit('onLYLLeadToOtherPage', newpageId)
  }
}
