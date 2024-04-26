import { getUuid } from '@common/utils'
import { isBoolean, isString, isNumber } from 'xe-utils'

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
  javaScriptCode = 'javaScriptCode',
  timePicker = 'timePicker',
  behavior = 'behavior',
  authority = 'authority',
  bindingModels = 'bindingModels',
  pageInParams = 'pageInParams',
  buttonAttribute = 'buttonAttribute',
  calendarEvents = 'calendarEvents',
  tableStyleSetting = 'tableStyleSetting',
  breadcrumAttribute = 'breadcrumAttribute',
  selectElement = 'selectElement',
  selectGroupElement = 'selectGroupElement',
  selectDictModel = 'selectDictModel',
  dropDown = 'dropDown',
  enumModal = 'enumModal',
  fileTemplateModal = 'fileTemplateModal',
  pageTemplateSetting = 'pageTemplateSetting',
  tableExportSetting = 'tableExportSetting'
}

export enum PropertyGroupName {
  normal = '基础设置',
  special = '特有属性'
  //theme = '主题',
}

export abstract class PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.text
  public unit: string = '' //属性单位
}

export class Property {
  constructor(name: string, groupname: string, type: PropertySetting, defaultVal?: any) {
    this.propertyName = name
    this.groupName = groupname
    this.propertySetting = type
    this.id = getUuid()
    this.value = defaultVal
  }

  public id: string = '' //属性的唯一ID,自动生成
  public value: any = '' //属性的值
  public propertySetting: PropertySetting //属性的类型
  public groupName: string = '' //属性分组名称
  public propertyName: string = '' //属性名称
  public canSetting: boolean = true //控制属性窗中按钮是否可见
  public secondGroup: string //第二级分组

  public convert(val: any): any {
    try {
      switch (this.propertySetting.type) {
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

//添加布尔类型属性
export class Boolean_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.boolean
}
export class Text_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.text
}
export class Number_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.number

  constructor(_min?: number, _max?: number, _step?: number) {
    //小数点后几位
    super()
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

  constructor(_min?: number, _max?: number, _min_count?: number, max_count?: number) {
    super()
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

  constructor(_min_count?: number, max_count?: number) {
    super()
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
  constructor(_isSingleChoose?: boolean, _enums?: string[]) {
    //小数点后几位
    super()
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
  constructor(maxFileCount: number, filetype: string) {
    super()
    this.maxFileLength = maxFileCount
    this.fileType = filetype
  }
}
export class JavaScriptCode_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.javaScriptCode
}
export class TimePickerFile_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.timePicker

  public dateType: string = 'date'
  public showTime: boolean | any = false
  /**_dateType：month,week,date,time */
  constructor(_dateType: string, _showTime?: boolean | any) {
    super()
    this.dateType = _dateType
    if (_showTime) {
      this.showTime = _showTime
    }
  }
}
export class Behavior_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.behavior
  constructor() {
    super()
  }
}
export class Authority_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.authority
  constructor() {
    super()
  }
}
export class BindingModels_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.bindingModels
  constructor() {
    super()
  }
}
export class PageInParams_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.pageInParams
  constructor() {
    super()
  }
}
export class Button_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.buttonAttribute
  constructor() {
    super()
  }
}
export class EnumModal_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.enumModal
  constructor() {
    super()
  }
}
export class FileTemplateModal_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.fileTemplateModal
  constructor() {
    super()
  }
}
export class TableStyleSetting_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.tableStyleSetting
  constructor() {
    super()
  }
}
/**表格导出设置 */
export class TableExportSetting_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.tableExportSetting
  constructor() {
    super()
  }
}
export class PageTemplateSetting_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.pageTemplateSetting
  constructor() {
    super()
  }
}
export class CalendarEvents_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.calendarEvents
  constructor() {
    super()
  }
}
export class Breadcrum_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.breadcrumAttribute
  constructor() {
    super()
  }
}
export class Select_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.selectElement
  constructor() {
    super()
  }
}
export class SelectGroup_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.selectGroupElement
  constructor() {
    super()
  }
}
export class selectDict_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.selectDictModel
  constructor() {
    super()
  }
}
export class dropDown_Setting extends PropertySetting {
  public type: PropertyTypeEnum = PropertyTypeEnum.dropDown
  constructor() {
    super()
  }
}
