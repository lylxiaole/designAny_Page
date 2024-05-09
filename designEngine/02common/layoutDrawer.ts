import { ref, h, render, onMounted } from 'vue'
import { EngineLayout } from '..'

export function drawEngineLayoutVirtual(vueComp) {
  let fragment = window.document.createDocumentFragment() as any as Element

  let comp = h(vueComp)
  render(comp, fragment)

  let compCtx = (comp.component as any).ctx as EngineLayout
  //获取初始化的值
  let initProperties = compCtx.getDefaultProperties()
  compCtx.properties = [...initProperties]
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  compCtx.renderContainer = fragment
  return { virtualDom: fragment, vueComp: compCtx as any }
}
