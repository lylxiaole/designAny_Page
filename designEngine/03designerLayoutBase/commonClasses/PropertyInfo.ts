import { deepClone, getUuid } from '@common/utils'
import { EngineLayout } from '@designEngine/index'
import { isBoolean, isString, isNumber } from 'xe-utils'

export class DPropCache {
  layoutFunc: Function
  properties: PropertySetting[]
}

export const allDPropCache: DPropCache[] = []

export function DPropAttr(prop: PropertySetting) {
  return function (target: EngineLayout, key: string) {
    prop.field = key

    let targetCons = target.constructor
    let findCache = allDPropCache.find((o) => o.layoutFunc === targetCons)
    if (!findCache) {
      allDPropCache.push({ layoutFunc: targetCons, properties: [] })
      findCache = allDPropCache.find((o) => o.layoutFunc === targetCons)
    }
    // **************************************
    let findProp = findCache.properties.find((o) => o.field === key)
    if (!findProp) {
      var newperperty = deepClone(prop)
      findCache.properties.push(newperperty)
    }
    // **************************************
    target.properties = () => {
      let findx = allDPropCache.find((o) => o.layoutFunc === target.constructor)
      if (!findx) {
        return []
      }

      let resProps = findx.properties
      for (let index = 0; index < allDPropCache.length; index++) {
        const oneDPropCache = allDPropCache[index]

        if (target instanceof oneDPropCache.layoutFunc) {
          resProps = resProps.concat(oneDPropCache.properties)
        }
      }

      return resProps
    }
    // **************************************
    // prop.field = key
    // !(target as any).constructor.prototype.$DProperties && ((target as any).constructor.prototype.$DProperties = [])
    // let find = (target as any).constructor.prototype.$DProperties.find((o) => o.field === key)
    // if (!find) {
    //   var newperperty = deepClone(prop)
    //   ;(target as any).constructor.prototype.$DProperties.push(newperperty)
    // }
  }
}

export class Property {
  public id: string = '' //属性的唯一ID,自动生成
  public field: string = '' //属性在类型中的字段名称
  public value: any = '' //属性的值
}

export enum PropertyTypeEnum {
  boolean = 'boolean',
  compPosition = 'compPosition',
  margin = 'margin',
  padding = 'padding',
  text = 'text',
  textList = 'textList',
  number = 'number',

  numberList = 'numberList',
  enum = 'enum',
  color = 'color',
  uploadFile = 'uploadFile',
  jsonContent = 'jsonContent',

  timePicker = 'timePicker',
  behavior = 'behavior',
  pageInParams = 'pageInParams'
}
export enum PropertyGroupName {
  normal = '基础设置',
  special = '特有属性'
  //theme = '主题',
}
export class PropertySetting {
  public id: string = '' //属性的唯一ID,自动生成
  public field?: string = '' //属性在类型中的字段名称
  public value: any = '' //属性的值

  public type: PropertyTypeEnum
  public unit: string = '' //属性单位
  public groupName: string = '' //属性分组名称
  public propertyName: string = '' //属性名称
  public canSetting: boolean = true //控制属性窗中按钮是否可见

  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string) {
    this.propertyName = name
    this.groupName = groupname
    this.canSetting = canSetting
    this.unit = unit
    this.id = getUuid()
    this.value = defaultVal
  }

  public convert(val: any): any {
    try {
      switch (this.type) {
        case PropertyTypeEnum.boolean:
          return this.objectToBool(val)
        case PropertyTypeEnum.number:
          return this.objectToNumber(val)
        case PropertyTypeEnum.text:
          if (!val) {
            return ''
          }
          return val
        default:
          break
      }
    } catch (error) {
      return val
    }

    return val
  }
  public destory() {
    if (!this) {
      debugger
    }
    for (const key in this) {
      delete this[key]
    }
  }

  private objectToBool(val: any): boolean {
    if (!val) {
      return false
    }
    if (isString(val) && val.toLowerCase() == 'true') {
      return true
    }
    if (isString(val) && val.toLowerCase() == 'false') {
      return false
    }
    if (val) {
      return Boolean(val)
    }
    return false
  }
  private objectToNumber(val: any): number {
    if (val == undefined || val == null) {
      return 0
    }

    if (isNumber(val)) {
      return val
    }

    try {
      return parseFloat(val)
    } catch {
      return 0
    }
  }
}

export class CompPosition_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.compPosition
}
export class Margin_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.margin
}
export class Padding_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.padding
}
export class Boolean_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.boolean
}
export class Text_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.text

  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string) {
    super(name, groupname, canSetting, defaultVal, unit)
  }
}
export class Number_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.number

  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, _min?: number, _max?: number, _step?: number) {
    //小数点后几位
    super(name, groupname, canSetting, defaultVal, unit)

    if (_min) {
      this.min = _min
    }
    if (_max) {
      this.max = _max
    }
    if (_step) {
      this.step = _step
    }
  }
  public min: number = 0
  public max: number = 999999999999
  public step: number = 1
  public unit: string = '' //属性单位
}
export class NumberList_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.numberList
  public min: number = 0
  public max: number = 999999999999
  public minCount: number = 0
  public maxCount: number = 999999999999

  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, _min?: number, _max?: number, _min_count?: number, max_count?: number) {
    super(name, groupname, canSetting, defaultVal, unit)
    if (_min) {
      this.min = _min
    }
    if (_max) {
      this.max = _max
    }
    if (_min_count) {
      this.minCount = _min_count
    }
    if (max_count) {
      this.maxCount = max_count
    }
  }
}
export class TextList_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.textList
  public minCount: number = 0
  public maxCount: number = 99

  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, _min_count?: number, max_count?: number) {
    super(name, groupname, canSetting, defaultVal, unit)
    if (_min_count) {
      this.minCount = _min_count
    }
    if (max_count) {
      this.maxCount = max_count
    }
  }
}
export class Enum_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.enum
  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, _isSingleChoose?: boolean, _enums?: string[]) {
    //小数点后几位
    super(name, groupname, canSetting, defaultVal, unit)
    if (_isSingleChoose) {
      this.isSingleChoose = _isSingleChoose
    }
    if (_enums) {
      this.enums = _enums
    }
  }

  isSingleChoose: boolean = true
  enums: string[] = []
}
export class Color_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.color
}
export class UploadFile_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.uploadFile
  public maxFileLength: number = 1
  public fileType: string
  public fileSize: number = 10485760
  /**filetype:'image','file','vedio' */
  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, maxFileCount?: number, filetype?: string) {
    super(name, groupname, canSetting, defaultVal, unit)
    this.maxFileLength = maxFileCount
    this.fileType = filetype
  }
}
export class JsonContent_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.jsonContent
}
export class TimePickerFile_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.timePicker

  public dateType: string = 'date'
  public showTime: boolean | any = false
  /**_dateType：month,week,date,time */
  constructor(name: string, groupname: string, canSetting: boolean, defaultVal?: any, unit?: string, _dateType?: string, _showTime?: boolean) {
    super(name, groupname, canSetting, defaultVal, unit)
    this.dateType = _dateType
    if (_showTime) {
      this.showTime = _showTime
    }
  }
}
export class Behavior_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.behavior
}
export class PageInParams_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.pageInParams
}
