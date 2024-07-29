import { ref, h, render, onMounted } from 'vue'
import { findOrginProps, findOrginMethods, findOrginEvents, findOrginCompInfo } from '@designEngine/03designerLayoutBase'
import designerContext from '../01designerContext/context'

export function designDrawDomVirtual(vueComp, isDesigning) {
  let fragment = window.document.createDocumentFragment() as any
  // let divdom = window.document.createElement('div')
  // fragment.appendChild(divdom)

  let allprops = findOrginProps(vueComp)
  let methods = findOrginMethods(vueComp)
  let events = findOrginEvents(vueComp)
  let compInfo = findOrginCompInfo(vueComp)

  let comp = h(vueComp, {
    designerMethods: methods,
    properties: allprops,
    designerEvents: events,
    designerContext: designerContext,
    compInfo: compInfo,
    isDesigning: isDesigning
  })
  render(comp, fragment)
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  ;(comp.component.proxy as any).renderContainer = fragment
  return { virtualDom: fragment, vueComp: comp.component.proxy }
}
export function designDrawDomReal(dom, vueComp, isDesigning) {
  // let divdom = window.document.createElement('div')
  // fragment.appendChild(divdom)
  let allprops = findOrginProps(vueComp)
  let methods = findOrginMethods(vueComp)
  let events = findOrginEvents(vueComp)
  let compInfo = findOrginCompInfo(vueComp)

  let comp = h(vueComp, {
    designerMethods: methods,
    properties: allprops,
    designerEvents: events,
    designerContext: designerContext,
    compInfo: compInfo,
    isDesigning: isDesigning
  })
  render(comp, dom)
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  ;(comp.component.proxy as any).renderContainer = dom
  return comp.component.proxy
}
