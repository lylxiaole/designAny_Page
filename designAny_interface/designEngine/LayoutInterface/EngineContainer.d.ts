import EngineLayout, { SaveInfo } from './EngineLayout';
export default class EngineContainer extends EngineLayout {
    private horRule;
    private verRule;
    currentScaleSize: number;
    created(): void;
    mounted(): void;
    /**********************************底层拖拽改变尺寸方法 ******************************/
    /**对外公布方法 尺寸向上变化*/
    private childSizeChange_Up;
    /**对外公布方法 尺寸向下变化*/
    private childSizeChange_Down;
    /**对外公布方法 尺寸向左变化*/
    private childSizeChange_Left;
    /**对外公布方法 尺寸向右变化*/
    private childSizeChange_Right;
    /**对外公布方法 尺寸左上变化*/
    private sizeChange_Up_Left;
    /**对外公布方法 尺寸右上变化*/
    private sizeChange_Up_Right;
    /**对外公布方法 尺寸左下变化*/
    private sizeChange_Down_Left;
    /**对外公布方法 尺寸右下变化*/
    private sizeChange_Down_Right;
    protected changeComponentSize(xchanged: number, ychanged: number, mouseleft: number, mousetop: number, compId: string, compParentEle: Element, position: string): void;
    protected changeComponentPosition(xchanged: number, ychanged: number, mouseleft: number, mousetop: number, compId: string): void;
    /**********************************拖拽时的描边尺子 ******************************/
    private cuteNearbyPointInPage;
    /**计算一个点相对于控件的四边，最近的距离 */
    private cuteNearbyPointToComp;
    private drawHorRule;
    private drawVerRule;
    clearHorRule(): void;
    clearVerRule(): void;
    chooseComps(comps: EngineLayout[]): void;
    private cancelCompSelected;
    protected renderChildFromData(data: SaveInfo): Promise<void>;
    insertComponentLayout(dropcompclass: any, compInfo: any, dragType?: any, data?: SaveInfo): Promise<EngineLayout>;
    /*************容器渲染子组件的虚方法**********************/
    protected renderComponent(compCon: EngineLayout): Promise<EngineLayout>;
    protected getCompTemplateData(tempId: string): any;
}
//# sourceMappingURL=EngineContainer.d.ts.map