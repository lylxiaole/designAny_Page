export declare enum DCompType {
    /**系统组件 */
    system_component = "system_component",
    /**组件模板 */
    component_template = "component_template",
    /**功能组件 */
    functional_component = "functional_component"
}
export declare class DCompInfo {
    constructor(_type: DCompType, _groupName: string, _name: string, _component: any, _icon: any, _platform: string, _compCode?: string);
    type: DCompType;
    compCode: string;
    groupName: string;
    name: string;
    component: any;
    icon: any;
    platform: string;
}
/**设计器的组件 以索引形式保存 */
export declare class CompIndex {
    static indexs: {};
}
/**设计器的组件 以数组形式保存 */
export declare const allComponents: DCompInfo[];
/** */
export declare function findSystemCompByCode(code: string): any;
export declare function DCompnentAttr(paltform: string, dCompType: DCompType, groupName: string, name: string, compCode: string, icon: any): (target: Function) => void;
export declare function findOrginCompInfo(enginLayout: any): DCompInfo;
//# sourceMappingURL=ComponentInfo.d.ts.map