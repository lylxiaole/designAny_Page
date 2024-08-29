import ComponentBase from './EngineComponent';
import EngineLayout, { SaveInfo } from './EngineLayout';
import EngineContainer from './EngineContainer';
import { LayoutMethod } from '../LayoutAttr/MethodInfo';
import { behavior, param } from '../../bahaviorEngine';
import { PropertySetting } from '../LayoutAttr/PropertyInfo';
export default class EnginePage extends EngineContainer {
    /***************************** */
    behaviors: behavior[];
    tickTime: number;
    inParams: param[];
    fontFamily: string;
    mounted(): void;
    unmounted(): void;
    reLoadPageData(pageData: SaveInfo): Promise<void>;
    setPageInParams(params?: param[]): void;
    getPropertyInPageById(propertyId: string): PropertySetting;
    getCompMethodById(compId: string, methodName: string, comps?: ComponentBase[]): LayoutMethod;
    adaptSize(newwidth: any, newheight: any): void;
    scaleSize(sizechange: number): void;
    private onWindowResize_Scale;
    private onWindowResize_NotScale;
    private scaleToSize;
    private watchWindowSize_NotScale;
    private watchWindowSize_Scale;
    recursiveChangeNeedSave(layout: EngineLayout): Promise<void>;
    loadPageByData(pageId: string, pageData: SaveInfo, params?: param[]): Promise<void>;
    private onLoadComplete;
    onLYLLeadToOtherPage(pageId: string): void;
}
//# sourceMappingURL=EnginePage.d.ts.map