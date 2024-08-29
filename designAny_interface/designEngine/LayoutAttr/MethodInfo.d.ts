import { param } from '../../bahaviorEngine';
export declare class LayoutMethod {
    methodName?: string;
    description?: string;
    inParams?: param[];
    hasOutParam: boolean;
    behaviorIds?: string[];
    methodField?: string;
}
declare class LayoutMethodCache {
    target: any;
    info: LayoutMethod[];
}
export declare const allDMethodCache: LayoutMethodCache[];
export declare function DMethodAttr(info?: LayoutMethod): (target: any, methodField: any, detail: any) => void;
export declare function findOrginMethods(enginLayout: any): any;
export {};
//# sourceMappingURL=MethodInfo.d.ts.map