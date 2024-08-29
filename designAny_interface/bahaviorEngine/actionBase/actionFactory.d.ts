import { EnginePage, EngineLayout } from '../../designEngine';
import { behavior } from './behaviorTypes';
import { actionObj } from './actObject';
import { actFuncBase, funcCode } from './actFuncBase';
export declare class factory {
    currentLayout: EngineLayout;
    currentPage: EnginePage;
    currentBehavior: behavior;
    constructor(_layout: EngineLayout, _page: EnginePage, _behavior: behavior);
    /********制造object*************************************************** */
    getObjFunc(obj: actionObj): actFuncBase;
    fillFuncToObj(obj: actionObj, funcCode: funcCode): void;
    /********执行行为*************************************************** */
    exacteAction(): Promise<void>;
    private excuteChildObjs;
    private cuteFilterVal;
}
//# sourceMappingURL=actionFactory.d.ts.map