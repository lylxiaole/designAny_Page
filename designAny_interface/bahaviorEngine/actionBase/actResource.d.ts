import { funcGroup, funcCode } from './actFuncBase';
import { actionObj } from './actObject';
export declare class object_group {
    key: string;
    title: string;
    childrenObjs: actionObj[];
    childrenGroups: object_group[];
}
export declare function funcToObj(actFunc: any): actionObj;
export declare function getFuncObjsTree(): any[];
export declare function getFuncObjByGroup(group: funcGroup): any[];
export declare function getFuncByType(funcCode: funcCode): any;
export declare function getFuncObjByType(funcCode: funcCode): actionObj;
//# sourceMappingURL=actResource.d.ts.map