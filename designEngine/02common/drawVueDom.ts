import { ref, h, render, onMounted } from 'vue'
import { findOrginProps } from '@designEngine/03designerLayoutBase'

export function designDrawDomVirtual(vueComp) {
  let fragment = window.document.createDocumentFragment() as any
  // let divdom = window.document.createElement('div')
  // fragment.appendChild(divdom)
  let allprops = findOrginProps(vueComp)
  debugger
  let comp = h(vueComp)
  render(comp, fragment)
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  ;(comp.component.proxy as any).renderContainer = fragment
  return { virtualDom: fragment, vueComp: comp.component.proxy }
}
export function designDrawDomReal(dom, vueComp) {
  // let divdom = window.document.createElement('div')
  // fragment.appendChild(divdom)
  let allprops = findOrginProps(vueComp)
  debugger
  let comp = h(vueComp)
  render(comp, dom)
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  ;(comp.component.proxy as any).renderContainer = dom
  return comp.component.proxy
}
