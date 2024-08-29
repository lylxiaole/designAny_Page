/******************************行为相关 **************************/
import { actionObj } from './actObject';
export declare enum formulaType {
    cute = "cute",//计算
    filter = "filter"
}
export declare enum paramType {
    number = "number",
    string = "string",
    complexType = "complexType",//复杂类型
    boolean = "boolean"
}
export declare class param {
    key?: string;
    name?: string;
    val?: any;
}
export declare class variable {
    name: string;
    val: any;
}
export declare class behavior {
    id: string;
    name: string;
    workRange: string;
    description: string;
    inparam: any;
    variables: variable[];
    actObjs: actionObj[];
    flowData: any;
}
export declare class action {
    id: string;
    name: string;
    judgingCondition: actionObj[];
    actionDetails: (actionDetail | action)[];
}
export declare class actionDetail {
    id: string;
    name: string;
    detail: string;
    isActionDetail: boolean;
    objs: actionObj[];
}
//# sourceMappingURL=behaviorTypes.d.ts.map