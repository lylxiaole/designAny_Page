import { CurrentContext, CurrentApis } from '../../01designerContext'
import { modelOrderTypeEnum } from '../commonClasses/modelBingding'
import common from '../commonMethod'

export enum modelTypeEnum {
  VIEW = 'VIEW', //聚合模型
  BASIC = 'BASIC', //基础模型
  TREE = 'TREE' //树模型
}

export class modelRelation {
  compares: any
  master: boolean //是否为主表
  modelAlias: string //模型别名
  modelId: string //模型ID
  modelName: string //shanchu
  deleted: boolean //是否删除
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
  modelTreeMapperList: any[] //树模型的所有模型
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
  /**
   * 枚举数组
   */
  ENUMARRAY = 105,
  BIGTEXT = 106
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
  ruleId: string
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
  private static modelInfoCaches: modelDetailInfo[] = []
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public static getModelPropertyShowName(mproperty: ModelProperty): string {
    //Update By LH 2020/07/28
    var modelinfo = modelAnalysis.getModelInfoById(mproperty.modelId, false)

    if (modelinfo) {
      return mproperty.propertyName
      return modelinfo.modelIndo.modelName + '-' + mproperty.propertyName
    }
    return '已经删除的属性'
  }

  public static getModelInfoByCode(modelCode: string): modelDetailInfo {
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.modelIndo.modelCode == modelCode)
    if (!find) {
      var newmodelInfo = CurrentApis.GetModelInfosByCodes_Sync([modelCode])[0]
      find = modelAnalysis.makeModelDetailInfo(newmodelInfo as any)
      modelAnalysis.modelInfoCaches.push(find)
    }
    return common.clone(find)
  }

  public static getModelInfoById(modelId: string, isClone: boolean = true): modelDetailInfo {
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.modelIndo.id == modelId)
    if (!find) {
      //window.console.log('获取模型数据:', modelId)
      var newmodelInfo = CurrentApis.GetModelInfoById_sync(modelId) as any
      find = modelAnalysis.makeModelDetailInfo(newmodelInfo as any)
      modelAnalysis.modelInfoCaches.push(find)
    }
    if (isClone) {
      return common.clone(find)
    } else return find
  }

  public static getModelsInfoByIds(modelIds: string[], isClone: boolean = true): modelDetailInfo[] {
    let caches: modelDetailInfo[] = []
    let nothaveModelIds: string[] = []

    for (let index = 0; index < modelIds.length; index++) {
      const modelId = modelIds[index]
      var find = modelAnalysis.modelInfoCaches.find((o) => o && o.modelIndo.id == modelId)
      if (find) {
        caches.push(find)
      } else {
        nothaveModelIds.push(modelId)
      }
    }

    if (nothaveModelIds.length < 1) {
      return caches
    }

    var newmodelInfos = CurrentApis.GetModelsInfoByIds_sync(nothaveModelIds) as any
    let resmodels: modelDetailInfo[] = []
    for (let index = 0; index < newmodelInfos.length; index++) {
      const element = modelAnalysis.makeModelDetailInfo(newmodelInfos[index])
      resmodels.push(element)
    }

    modelAnalysis.modelInfoCaches = modelAnalysis.modelInfoCaches.concat(resmodels)
    caches = caches.concat(resmodels)
    return caches
  }

  public static addCache(modelId: string, modelInfo: any): modelDetailInfo {
    var find = modelAnalysis.modelInfoCaches.find((o) => o && o.modelIndo.id == modelId)
    if (find) {
      return find
    }
    find = modelAnalysis.makeModelDetailInfo(modelInfo)
    modelAnalysis.modelInfoCaches.push(find)
    return find
  }

  public static async getModelPage(pageIndex: number, pageSize: number, modelName?: string): Promise<any> {
    return CurrentApis.GetBaseModelList(pageIndex, pageSize, modelName)
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**获取所有简单类型 */
  public static getAllSimpleClass(): modelSimpleInfo[] {
    return [
      { name: '字符串', modelCode: 'String', modelId: 'String' },
      { name: '布尔', modelCode: 'Bool', modelId: 'Bool' },
      { name: '数字', modelCode: 'Number', modelId: 'Number' }
    ]
  }

  private static makeModelDetailInfo(modelInfo: ModelInfo): modelDetailInfo {
    var modelDetail = new modelDetailInfo()
    modelDetail.modelIndo = modelInfo
    //基础模型
    if (modelInfo.modelType == modelTypeEnum.BASIC) {
      modelDetail.properties = modelInfo.modelPropertyList
      return modelDetail
    }
    //树模型
    if (modelInfo.modelType == modelTypeEnum.TREE) {
      // window.console.log('**********************分析树模型数据')
      modelDetail.properties = []
      modelDetail.properties = modelAnalysis.cuteTreeModelProperties(modelInfo)
      return modelDetail
    }
    //聚合模型
    var masterModel = modelInfo.modelRelationList.find((o) => o.master == true) //主模型
    if (!masterModel) {
      return null
    }
    var masterAntonymModels = modelInfo.modelRelationList.filter((o) => o.master == false && o.deleted == false) //从模型
    var masterModelInfo = modelAnalysis.getModelInfoById(masterModel.modelId)
    var masterModelProperties = masterModelInfo.properties

    for (let index = 0; index < masterModelProperties.length; index++) {
      const o = masterModelProperties[index]
      var modelrelation = modelInfo.modelRelationList.find((p) => o.modelId == p.modelId)
      o.propertyCode = modelrelation.modelAlias + '__' + o.propertyCode
      o.propertyName = modelrelation.modelAlias + '__' + o.propertyName
    }

    for (let index = 0; index < masterAntonymModels.length; index++) {
      const masterAntonyM = masterAntonymModels[index]
      var modelinfo = modelAnalysis.getModelInfoById(masterAntonyM.modelId)
      var masterAntonyProperties = modelinfo.properties

      for (let index = 0; index < masterAntonyProperties.length; index++) {
        const o = masterAntonyProperties[index]
        o.propertyCode = masterAntonyM.modelAlias + '__' + o.propertyCode
        o.propertyName = masterAntonyM.modelAlias + '__' + o.propertyName
      }
      masterModelProperties = masterModelProperties.concat(masterAntonyProperties)
    }
    //聚合模型无法直接获取到关联的属性信息，需要重新赋值
    modelDetail.modelIndo.modelPropertyList = masterModelProperties
    modelDetail.properties = masterModelProperties
    return modelDetail
  }

  /**计算树模型的属性 */
  private static cuteTreeModelProperties(modelInfo: ModelInfo): ModelProperty[] {
    let res: ModelProperty[] = []

    if (modelInfo.modelTreeMapperList.length == 1) {
      let treemapperModel = modelAnalysis.getModelInfoById(modelInfo.modelTreeMapperList[0].modelId)
      return treemapperModel.properties
    }

    if (modelInfo.modelTreeMapperList.length > 2) {
      window.console.warn('暂不适配层次结构大于2的树模型')
    }

    let mainModelId = modelInfo.modelTreeMapperList[0].modelId
    let followModelId = modelInfo.modelTreeMapperList[1].modelId
    /**A-A模式，A是基础模型 */
    if (mainModelId == followModelId) {
      let treemapperModel = modelAnalysis.getModelInfoById(mainModelId)
      return treemapperModel.properties
    }
    //
    let mainModelInfo = modelAnalysis.getModelInfoById(mainModelId)
    let followModelInfo = modelAnalysis.getModelInfoById(followModelId)
    /**A-B模式,B是基础模型*/
    if (followModelInfo.modelIndo.modelType == modelTypeEnum.BASIC) {
      for (let index = 0; index < mainModelInfo.properties.length; index++) {
        const o = mainModelInfo.properties[index]
        o.propertyCode = mainModelInfo.modelIndo.modelCode + '__' + o.propertyCode
      }

      for (let index = 0; index < followModelInfo.properties.length; index++) {
        const o = followModelInfo.properties[index]
        o.propertyCode = followModelInfo.modelIndo.modelCode + '__' + o.propertyCode
      }
      res = mainModelInfo.properties.concat(followModelInfo.properties)
      return res
    }
    /**A-B模式,B是聚合模型*/
    if (followModelInfo.modelIndo.modelType == modelTypeEnum.VIEW) {
      for (let index = 0; index < mainModelInfo.properties.length; index++) {
        const o = mainModelInfo.properties[index]
        o.propertyCode = mainModelInfo.modelIndo.modelCode + '__' + o.propertyCode
      }
      res = mainModelInfo.properties.concat(followModelInfo.properties)
      return res
    }
  }

  public static clearCache() {
    modelAnalysis.modelInfoCaches = []
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
