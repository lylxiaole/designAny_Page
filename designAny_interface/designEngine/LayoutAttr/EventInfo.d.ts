import { param } from '../../bahaviorEngine';
import EngineLayout from '../LayoutInterface/EngineLayout';
export declare class LayoutEventBehaviors {
    eventName: string;
    behaviorIds: string[];
}
export declare class LayoutEvent {
    eventName?: string;
    description?: string;
    inParams?: param[];
    hasOutParam: boolean;
    eventField?: string;
}
declare class LayoutEventCache {
    target: any;
    info: LayoutEvent[];
}
export declare const allEventCache: LayoutEventCache[];
export declare function DEventAttr(info: LayoutEvent): (target: EngineLayout, eventField: any, desc: any) => void;
export declare function findOrginEvents(enginLayout: any): any;
export {};
//# sourceMappingURL=EventInfo.d.ts.map