import EngineLayout from '../LayoutInterface/EngineLayout';
declare class DPropCache {
    layoutFunc: Function;
    properties: PropertySetting[];
}
export declare const allDPropCache: DPropCache[];
export declare function DPropAttr(prop: PropertySetting): (target: EngineLayout, key: string) => void;
export declare function findOrginProps(enginLayout: any): any;
export declare class Property {
    field: string;
    value: any;
}
export declare enum PropertyTypeEnum {
    boolean = "boolean",
    compPosition = "compPosition",
    margin = "margin",
    padding = "padding",
    text = "text",
    textList = "textList",
    number = "number",
    numberList = "numberList",
    enum = "enum",
    color = "color",
    uploadFile = "uploadFile",
    jsonContent = "jsonContent",
    timePicker = "timePicker",
    behavior = "behavior",
    pageInParams = "pageInParams",
    tableColumn = "tableColumn"
}
export declare enum PropertyGroupName {
    normal = "\u57FA\u7840\u8BBE\u7F6E",
    special = "\u7279\u6709\u5C5E\u6027",
    data = "\u6570\u636E"
}
export declare class PropertySetting {
    id: string;
    field?: string;
    type: PropertyTypeEnum;
    unit: string;
    groupName: string;
    propertyName: string;
    canSetting: boolean;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string);
    convert(val: any): any;
    destory(): void;
    private objectToBool;
    private objectToNumber;
}
export declare class CompPosition_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class Margin_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class Padding_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class Boolean_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class Text_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string);
}
export declare class Number_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, _min?: number, _max?: number, _step?: number);
    min: number;
    max: number;
    step: number;
    unit: string;
}
export declare class NumberList_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    min: number;
    max: number;
    minCount: number;
    maxCount: number;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, _min?: number, _max?: number, _min_count?: number, max_count?: number);
}
export declare class TextList_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    minCount: number;
    maxCount: number;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, _min_count?: number, max_count?: number);
}
export declare class Enum_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, _isSingleChoose?: boolean, _enums?: string[]);
    isSingleChoose: boolean;
    enums: string[];
}
export declare class Color_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class UploadFile_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    maxFileLength: number;
    fileType: string;
    fileSize: number;
    /**filetype:'image','file','vedio' */
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, maxFileCount?: number, filetype?: string);
}
export declare class JsonContent_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class TimePickerFile_Setting extends PropertySetting {
    type: PropertyTypeEnum;
    dateType: string;
    showTime: boolean | any;
    /**_dateType：month,week,date,time */
    constructor(name: string, groupname: string, canSetting: boolean, unit?: string, _dateType?: string, _showTime?: boolean);
}
export declare class Behavior_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class PageInParams_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export declare class TableColumn_Setting extends PropertySetting {
    type: PropertyTypeEnum;
}
export {};
//# sourceMappingURL=PropertyInfo.d.ts.map