import EngineContainer from './EngineContainer';
import { DCompInfo } from '../LayoutAttr/ComponentInfo';
export default class EngineComponent extends EngineContainer {
    protected compInfo: DCompInfo;
    foreground: string;
    display: boolean;
    disabled: boolean;
    zIndex: number;
    created(): void;
    mounted(): void;
    protected loadCompleted(): void;
    /**通用的验证方法，根据编码获取 */
    commonValid(validatorArr: any[], value: any, callback: any, message: any): void;
    getModelValidate(propCode: string): void;
    private onCompLoaded;
}
//# sourceMappingURL=EngineComponent.d.ts.map