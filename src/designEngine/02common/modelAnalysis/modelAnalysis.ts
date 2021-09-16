import { CurrentContext, CurrentApis } from '../../01designerContext'
import { modelOrderTypeEnum } from '../commonClasses/modelBingding'
import common from '../commonMethod'

export enum modelTypeEnum {
  VIEW = 'VIEW', //聚合模型
  BASIC = 'BASIC', //基础模型
}

export class modelRelation {
  compares: any
  master: boolean //是否为主表
  modelAlias: string //模型别名
  modelId: string //模型ID
  modelName: string //模型名称
  modelPropertyRelationList: modelRelation[] //关联关系下属性关系
  viewModelId: string //视图模型ID
}

/**系统模型信息 */
export class ModelInfo {
  deleted: Boolean
  description: string
  groupId: string
  id: string
  modelCode: string
  modelGroup: any
  modelName: string
  modelPropertyList: ModelProperty[]
  modelRelationList: modelRelation[]
  modelRelationListEx: modelRelation[]
  modelStatus: number //模型状态,0:新建中,1:启用,2:停用
  modelType: modelTypeEnum
  system: Boolean
}

export enum ModelPropertyType {
  STRING = 0,
  /**
   * 整数型
   */
  INT = 1,
  /**
   * FLOAT
   */
  FLOAT = 2,
  /**
   * BOOL
   */
  BOOL = 101,
  /**
   * 日期型
   */
  DATE = 102,
  /**
   * 枚举型
   */
  ENUM = 103,
  /**
   * 表达式类型
   */
  EXPRESSION = 104,
}

export class ModelBindingProperty {
  modelBindingName: string
  modelCode: string
  propertyCode: string
  compType: string
  modelProperty?: ModelProperty
}

export class ModelProperty {
  id: string
  propertyCode: string
  propertyName: string
  description: string
  propertyType: number
  defaultValue: string
  allowEdit: Boolean
  allowNull: Boolean
  allowRepeated: Boolean
  using: Boolean
  maxLength: number
  maxValue: number
  minValue: number
  per: number
  modelId: string
  keyField: Boolean
  jsonField: Boolean
  dictId: string
  formatter: string
  autoGenerate: Boolean
  show: boolean
  propertyAlias: string
  propertyValidatorList: propertyValidator[]
}

export class propertyValidator {
  id: string
  propertyId: string
  validateType: Number
  validateValue: string
  funcCode: string
  errorMsg: string
  customFunction: customFunction
}

export class customFunction {
  funcCode: string
  funcName: string
  funcContent: string
  funcDesc: string
  inJsonParam: any
  outJsonParam: any
  classifyDictCode: string
  classifyItemValue: string
}

export class modelDetailInfo {
  modelIndo: ModelInfo
  properties: ModelProperty[]
}

//模型的简易信息，它存储的可能是系统模型也可能是简单类型
export class modelSimpleInfo {
  name: string //
  modelId: string
  modelCode: string
}

/**模型解析器 */
export default class modelAnalysis {
  private static modelInfoCaches: ModelInfo[] = []

  public async analyModelInfo(modelId: string): Promise<modelDetailInfo> {
    window.console.log('获取模型数据')
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.id == modelId)
    if (!find) {
      find = (await CurrentApis.GetModelInfoById(modelId)) as any

      modelAnalysis.modelInfoCaches.push(find)
    }
    var modelInfo = modelAnalysis.makeModelDetailInfo(find)
    return modelInfo
  }

  public static getModelInfoById(modelId: string): modelDetailInfo {
    window.console.log('获取模型数据')
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.id == modelId)
    if (!find) {
      find = CurrentApis.GetModelInfoById_sync(modelId) as any
      modelAnalysis.modelInfoCaches.push(find)
    }
    var modelInfo = modelAnalysis.makeModelDetailInfo(find)
    return modelInfo
  }

  /**获取所有简单类型 */
  public static getAllSimpleClass(): modelSimpleInfo[] {
    return [
      { name: '字符串', modelCode: 'String', modelId: 'String' },
      { name: '布尔', modelCode: 'Bool', modelId: 'Bool' },
      { name: '数字', modelCode: 'Number', modelId: 'Number' },
    ]
  }

  public static async getModelPage(pageIndex: number, pageSize: number, modelName?: string): Promise<any> {
    return CurrentApis.GetBaseModelList(pageIndex, pageSize, modelName)
  }

  public static getModelInfoByCode(modelCode: string): modelDetailInfo {
    window.console.log('获取模型数据')
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.modelCode == modelCode)
    if (!find) {
      var newmodelInfo = CurrentApis.GetModelInfosByCodes_Sync([modelCode])[0]
      modelAnalysis.modelInfoCaches.push(newmodelInfo as any)
      find = newmodelInfo as any
    }
    var modelInfo = modelAnalysis.makeModelDetailInfo(find)
    return modelInfo
  }

  private static makeModelDetailInfo(modelInfo: ModelInfo): modelDetailInfo {
    var modelDetail = new modelDetailInfo()
    modelDetail.modelIndo = modelInfo
    //基础模型
    if (modelInfo.modelType == modelTypeEnum.BASIC) {
      modelDetail.properties = modelInfo.modelPropertyList
      return modelDetail
    }
    //聚合模型
    var masterModel = modelInfo.modelRelationList.find((o) => o.master == true) //主模型
    var masterAntonymModels = modelInfo.modelRelationList.filter((o) => o.master == false) //从模型
    var masterModelInfo = modelAnalysis.getModelInfoById(masterModel.modelId)
    var masterModelProperties = common.clone(masterModelInfo.properties) as ModelProperty[]
    masterModelProperties.forEach((o) => {
      var modelrelation = modelInfo.modelRelationList.find((p) => o.modelId == p.modelId)
      o.propertyCode = modelrelation.modelAlias + '_' + o.propertyCode
    })

    for (let index = 0; index < masterAntonymModels.length; index++) {
      const masterAntonyM = masterAntonymModels[index]
      var modelinfo = modelAnalysis.getModelInfoById(masterAntonyM.modelId)
      var masterAntonyProperties = common.clone(modelinfo.properties) as ModelProperty[]
      masterAntonyProperties.forEach((o) => {
        var modelrelation = modelInfo.modelRelationList.find((p) => o.modelId == p.modelId)
        o.propertyCode = modelrelation.modelAlias + '_' + o.propertyCode
      })
      masterModelProperties = masterModelProperties.concat(masterAntonyProperties)
      // masterModelProperties = masterModelProperties.filter((o) => o.show == true)
    }
    modelDetail.properties = masterModelProperties
    return modelDetail
  }
}

export class DecoratorOption {
  validateTrigger: ['change', 'blur', 'onSubmit']
  initialValue: any
  valuePropName: any
  rules: DecoratorRule[]
}

export class DecoratorRule {
  required: Boolean
  whitespace: Boolean
  message: String
  validator: Function
}

export class PageBaseModel {
  pageSize: number
  pageNumber: number
}
