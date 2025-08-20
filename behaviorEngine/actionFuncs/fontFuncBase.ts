import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'

export default interface fontActFuncBase extends actFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
}
