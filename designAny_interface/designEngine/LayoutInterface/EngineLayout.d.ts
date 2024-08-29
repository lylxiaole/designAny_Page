import { Vue } from 'vue-class-component';
import { LayoutEvent, LayoutEventBehaviors } from '../LayoutAttr/EventInfo';
import { LayoutMethod } from '../LayoutAttr/MethodInfo';
import { Property, PropertySetting } from '../LayoutAttr/PropertyInfo';
export declare class SaveInfo {
    id: string;
    meta: any;
    properties: Property[];
    children: SaveInfo[];
}
export declare class Point {
    X: number;
    Y: number;
}
export default class EngineLayout extends Vue {
    renderContainer: any;
    isNeedSave: boolean;
    private lylevents;
    private lyleventsOnce;
    $on(eventname: any, callback: any): void;
    $once(eventname: any, callback: any): void;
    $off(): void;
    $lylemit(event: string, ...args: any[]): void;
    isSelected: boolean;
    /**父级布局 */
    parentLayout: EngineLayout;
    /**子级布局 */
    children: EngineLayout[];
    get topLayout(): EngineLayout;
    /**当前选中的直接子级布局 */
    get selectedChildren(): EngineLayout[];
    isDesigning: boolean;
    designerMethods: LayoutMethod[];
    designerEvents: LayoutEvent[];
    properties: PropertySetting[];
    designerContext: any;
    /**生命周期 */
    created(): void;
    /**生命周期 */
    mounted(): void;
    /**生命周期 */
    updated(): void;
    /**生命周期 */
    unmounted(): void;
    Id: string;
    name: string;
    positionInfo: any;
    marginInfo: any;
    paddingInfo: any;
    fontSize: number;
    background: string;
    background_img: any;
    behaviorBinds: LayoutEventBehaviors[];
    get width(): any;
    set width(val: any);
    get height(): any;
    set height(val: any);
    get left(): any;
    set left(val: any);
    get top(): any;
    set top(val: any);
    get margin_left(): number;
    set margin_left(val: number);
    get margin_right(): number;
    set margin_right(val: number);
    get margin_top(): number;
    set margin_top(val: number);
    get margin_bottom(): number;
    set margin_bottom(val: number);
    get padding_left(): number;
    set padding_left(val: number);
    get padding_right(): number;
    set padding_right(val: number);
    get padding_top(): number;
    set padding_top(val: number);
    get padding_bottom(): number;
    set padding_bottom(val: number);
    destorymethod(): Promise<void>;
    private getChildrenData;
    private loadChildrenData;
    private watch_properties_onDesigning;
    protected renderChildFromData(data: SaveInfo): Promise<void>;
    protected loadCompleted(): void;
    /**添加子级 */
    protected addChild(child: EngineLayout): void;
    protected addChilds(childs: EngineLayout[]): void;
    protected removeChild(child: EngineLayout): void;
    protected removeChilds(childs: EngineLayout[]): void;
    protected removeAllChilds(): void;
    loadData(data: SaveInfo): Promise<void>;
    reLoadData(data: SaveInfo): Promise<void>;
    getSaveData(): Promise<SaveInfo>;
    findSelectedLayoutsRecursion(comps: EngineLayout[]): EngineLayout[];
    findLayoutRecursion(id: string, lays: EngineLayout[]): EngineLayout;
    /**递归删除子组件 */
    removeChildRecursion(childId: string): void;
    /**通过已有数据加载 */
    loadingProperties(layout_properties: Property[]): Promise<void>;
    findProperties(groupName: string, name: string): PropertySetting[];
    findPropertyByName(groupName: string, name: string): PropertySetting;
    findPropertyById(Id: string): PropertySetting;
    protected onDPropertyChange(layout: EngineLayout, field: string, val: any): void;
    protected onChildrenCountChange(): void;
    protected onLYLCreated(layout: EngineLayout): void;
    protected onLYLMounted(layout: EngineLayout): void;
    protected onLYLUpdated(layout: EngineLayout): void;
    protected onLYLSizeChanged(e: any): void;
    protected onLYLDestroyed(layout: EngineLayout): void;
}
//# sourceMappingURL=EngineLayout.d.ts.map