import { EnginePage, EngineLayout } from '../../designEngine';
import { behavior, param } from './behaviorTypes';
import { actionObj, object_InParam } from './actObject';
export declare enum funcGroup {
    universalTool = "\u901A\u7528\u5DE5\u5177",
    storages = "\u7F13\u5B58",
    pageOption = "\u9875\u9762\u8D44\u6E90"
}
export declare enum funcCode {
    signAdd = "signAdd",//加
    signReduce = "signReduce",//减
    signAssign = "signAssign",//赋值
    signMultiply = "signReduce",//乘
    signDivide = "signReduce",//除
    signEqual = "signEqual",//相等于
    signNotEqual = "signNotEqual",//不等于
    signGreaterThan = "signGreaterThan",//大于
    signLessThan = "signLessThan",//小于
    signGTOQ = "signGTOQ",//大于等于
    signLTOQ = "signLTOQ",//小于等于
    signAnd = "signAnd",//且
    signOr = "signOr",//或
    propertiesInPage = "propertiesInPage",
    methodsInPage = "methodsInPage",
    dictionary = "dictionary",//字典
    thirtyApi = "thirtyApi",//外部API
    oneParamJude = "oneParamJude",//单条件判断
    notificationDialog = "notificationDialog",//提示窗
    fixedVal = "fixedVal",
    leadToOtherPage = "leadToOtherPage",
    windowLocalStorage = "windowLocalStorage"
}
export declare enum funcStack {
    webpc = "webpc",
    webapp = "webapp",
    server = "server",
    universal = "universal"
}
declare var allActFunctions: any[];
export declare function resourceFuncAttr(name: string, desc: string, funcGroup?: funcGroup, funcCode?: funcCode, funcStack?: funcStack, inparams?: param[], outParam?: param, isJudeNode?: boolean): (target: Function) => void;
export { allActFunctions };
export interface actFuncBase {
    currentActObj: actionObj;
    currentLayout: EngineLayout;
    currentPage: EnginePage;
    currentBehavior: behavior;
    excute: (inparams: object_InParam[]) => Promise<any>;
}
//# sourceMappingURL=actFuncBase.d.ts.map