import { funcCode } from './actFuncBase';
import { param } from './behaviorTypes';
export declare class object_InParam extends param {
    refOutParamId?: string;
    valueFilter?: string;
}
export declare class actionObj {
    id: string;
    resourceFilter: any;
    name: string;
    description: string;
    funcCode: funcCode;
    isJudeNode: boolean;
    preObjIds: string[];
    nextObjIds: string[];
    inputParams: object_InParam[];
    outParam: param;
    excuted: boolean;
    cloneFrom(obj: actionObj): void;
    destory(): void;
}
//# sourceMappingURL=actObject.d.ts.map