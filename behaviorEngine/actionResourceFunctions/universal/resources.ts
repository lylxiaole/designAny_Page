import { getUuid } from '@common/utils'
import { EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { actionObj } from '../../actObject'

@resourceFuncAttr('字典', '', funcGroup.pageOption, funcCode.dictionary, funcStack.webpc)
export class dictionarys implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {}
}

@resourceFuncAttr('外部接口', '', funcGroup.pageOption, funcCode.thirtyApi, funcStack.webpc)
export class thirtyApis implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {}
}
