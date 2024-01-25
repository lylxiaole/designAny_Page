import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../behaviorTypes'
import actResFuncBase from '../actResFuncBase'
import { resourceFuncAttr, resourceType, objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase, allCuteSigns, allFilterSigns } from '../01_actionCommon'

@resourceFuncAttr(resourceType.fixedVal)
export default class fixedValFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    // window.console.log('处理固定值')
    var valueType = obj.resourceId.split('&')[1]
    if (!valueType) {
      valueType = '字符串'
    }

    var newval = null
    try {
      if (valueType == '字符串') {
        newval = obj.val.toString()
      } else if (valueType == '布尔') {
        if (!obj.val) {
          newval = false
        } else if (obj.val.toLowerCase() == 'true') {
          newval = true
        } else {
          newval = false
        }
      } else if (valueType == '整数') {
        newval = parseInt(obj.val)
      } else if (valueType == '浮点数') {
        newval = parseFloat(obj.val)
      } else if (valueType == '空值') {
        newval = null
      }
    } catch {
      // window.console.log('固定值处理失败')
      if (valueType == '字符串') {
        newval = ''
      } else if (valueType == '布尔') {
        newval = false
      } else if (valueType == '整数') {
        newval = NaN
      } else if (valueType == '浮点数') {
        newval = NaN
      } else if (valueType == '空值') {
        newval = null
      }
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    var valueType = obj.resourceId.split('&')[1]
    if (!valueType) {
      valueType = '字符串'
    }

    return '固定值/' + valueType
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}
}
