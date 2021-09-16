import { CurrentApis } from '../../01designerContext'
import { modelSimpleInfo, ModelProperty } from '../impResourcesCache/modelAnalysis'
import modelAnalysis, { ModelInfo } from '../impResourcesCache/modelAnalysis'
import common from '../commonMethod'

export enum modelFilterTypeEnum {
  GE = 'GE',
  LE = 'LE',
  NE = 'NE',
  EQ = 'EQ',
  GT = 'GT',
  LT = 'LT',
  ALL_LIKE = 'ALL_LIKE',
  LEFT_LIKE = 'LEFT_LIKE',
  RIGHT_LIKE = 'RIGHT_LIKE',
  IN = 'IN',
  NOT_IN = 'NOT_IN'
}

export class filterCollect {
  name: string
  val: modelFilterTypeEnum
}

export function getAllFilters(): filterCollect[] {
  var res: filterCollect[] = []
  res.push({ val: modelFilterTypeEnum.GE, name: '大于等于' })
  res.push({ val: modelFilterTypeEnum.LE, name: '小于等于' })
  res.push({ val: modelFilterTypeEnum.NE, name: '不等于' })
  res.push({ val: modelFilterTypeEnum.EQ, name: '等于' })
  res.push({ val: modelFilterTypeEnum.GT, name: '大于' })
  res.push({ val: modelFilterTypeEnum.LT, name: '小于' })
  res.push({ val: modelFilterTypeEnum.ALL_LIKE, name: '全模糊' })
  res.push({ val: modelFilterTypeEnum.LEFT_LIKE, name: '左模糊' })
  res.push({ val: modelFilterTypeEnum.RIGHT_LIKE, name: '右模糊' })
  res.push({ val: modelFilterTypeEnum.IN, name: '位于' })
  res.push({ val: modelFilterTypeEnum.NOT_IN, name: '不位于' })
  return res
}

export enum modelOrderTypeEnum {
  DESC = 'DESC', //倒序
  ASC = 'ASC' //顺序
}
export enum modelDataTypeEnum {
  single = 'single', //单模
  list = 'list', //列表
  tree = 'tree' //递归树
}

export enum funcColumnEnum {
  COUNT = 'COUNT', //求总数
  SUM = 'SUM', //求和
  AVG = 'AVG', //求平均数
  MAX = 'MAX', //求最大值
  MIN = 'MIN' //求最小值
}

export class modelFilter {
  id: string
  code: string //模型字段
  type: string //filter条件
  combine: String = 'AND' //筛选条件的OR和AND
  value: any //filter的值,来自于控件或者自定义值
}

export class modelOrder {
  code: string
  /**null:不排序  true:倒序  false:顺序 */
  val?: boolean
  type?: string
}

export class modelFuncColumn {
  code: string //模型字段
  func?: funcColumnEnum
  isChoose: boolean
}

export class modelBingValue {
  modelCode: string
  modelName: string
  data: any = {}
  children: modelBingValue[]
}

/** 模型实例的类型，在页面中会记录当前所有的模型实例 */
export default class modelBingding {
  public clone(mb: modelBingding) {
    var mbclone = { ...mb } as modelBingding
    this.modelBindingName = mbclone.modelBindingName
    this.modelBindingType = mbclone.modelBindingType
    this.modelBindingInfo = mbclone.modelBindingInfo
    this.modelDataType = !mbclone.modelDataType ? modelDataTypeEnum.single : mbclone.modelDataType
    this.modelFilters = mbclone.modelFilters
    this.modelOrders = mbclone.modelOrders
    this.modelFuncColumns = mbclone.modelFuncColumns
    this.val = mbclone.val
  }
  /**模型实例的名称，再一个页面中，模型实例的名称是不能重复的 */
  modelBindingName: string
  /**模型实例的类型 1:系统模型,2:简单类型 */
  modelBindingType: number
  /**模型信息，如果是系统模型就存在*/
  modelBindingInfo: modelSimpleInfo

  /**虚模型属性列表，关联虚模型的时候使用 xuww 2020-04-08 add*/
  virtualModelPropertyList: ModelProperty[]

  /**模型的验证信息 */
  get modelDetailInfo(): ModelInfo {
    if (this.modelBindingType == 2) {
      return null
    }

    if (!this.modelBindingInfo || !this.modelBindingInfo.modelId) {
      return null
    }
    //Update By LH 2020/07/28
    var modeld = modelAnalysis.getModelInfoById(this.modelBindingInfo.modelId, false)
    // var modeld = modelAnalysis.getModelInfoById(this.modelBindingInfo.modelId)
    if (!modeld) {
      return null
    }

    // window.console.log('获取模型详细信息')
    if (this.virtualModelPropertyList && this.virtualModelPropertyList.length > 0) {
      for (let index = 0; index < this.virtualModelPropertyList.length; index++) {
        const element = this.virtualModelPropertyList[index]
        if (!modeld.modelIndo.modelPropertyList.find((item) => item.id == element.id)) {
          modeld.modelIndo.modelPropertyList.push(element)
        }
      }
    }
    return modeld.modelIndo
  }

  set modelDetailInfo(val: ModelInfo) {}

  /**当前模型的所有属性  */
  get modelAllProperties(): ModelProperty[] {
    if (this.modelBindingType == 2) {
      return null
    }

    if (!this.modelBindingInfo || !this.modelBindingInfo.modelId) {
      return null
    }
    //Update By LH 2020/07/28
    var modeld = modelAnalysis.getModelInfoById(this.modelBindingInfo.modelId, false)
    // var modeld = modelAnalysis.getModelInfoById(this.modelBindingInfo.modelId)
    if (!modeld) {
      return []
    }
    return modeld.properties
  }

  /**当前可用属性,根据设置的函数列和模型属性计算得出 */
  get modelDetailProperties(): ModelProperty[] {
    if (!this.modelAllProperties) {
      return null
    }
    if (!this.modelFuncColumns) {
      return this.modelAllProperties
    }

    var properties: ModelProperty[] = []
    var choosedColums = this.modelFuncColumns.filter((o) => o.isChoose == true)

    for (let index = 0; index < choosedColums.length; index++) {
      const col = choosedColums[index]
      let find = this.modelAllProperties.find((allp) => allp.propertyCode == col.code)

      if (!find) {
        continue
      } else {
        properties.push(find)
      }
      if (!col.func) {
        continue
      }

      let findClone = { ...find } as ModelProperty
      findClone.propertyCode = col.func.toLowerCase() + '__' + findClone.propertyCode
      findClone.propertyName = findClone.propertyName + '(' + col.func + ')'
      properties.push(findClone)
    }

    return properties
  }

  /**模型实例的数据类型 */
  modelDataType: modelDataTypeEnum
  /**当前设置的filters */
  modelFilters: modelFilter[] = []
  /**当前设置的orders */
  modelOrders: modelOrder[] = []
  /**当前所有的函数列 */
  modelFuncColumns: modelFuncColumn[]
  /**模型实例缓存的值 */
  val: any = new modelBingValue()
}

export class modelCodeInfo {
  modelId: string //模型Id
  code: string //英文
  codeName: string //中文
}

export enum bindTypeEnum {
  code = 'code', //绑定模型字段
  filter = 'filter', //绑定模型查询条件
  order = 'order' //绑定模型排序
}
//组件属性绑定模型的信息，组件的一个属性，可以绑定模型中的多个字段，所以又modalCodes
export class bindingModelVal_InProperty {
  propertyId: string
  modelName: string //绑定的模型实例的名称
  bindType: bindTypeEnum
  /**以下绑定的三种信息，每一个属性只能绑定其中一种 */
  /**绑定的模型属性 */
  modelCodes: modelCodeInfo[] = []
  /**绑定的filter字段 */
  modelFilterId: string
  /**绑定到的code的order*/
  modelOrderCode: string
}
