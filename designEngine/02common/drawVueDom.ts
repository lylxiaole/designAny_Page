import { ref, h, render, onMounted, createApp } from 'vue'
import { findOrginProps, findOrginMethods, findOrginEvents, findOrginCompInfo } from '@design-any/interface/dist'
import designerContext from '../01designerContext/context'
import ElementPlus from 'element-plus'
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

  let app = createApp({ render: () => comp })
  app.use(ElementPlus)

  app.mount(fragment)

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
  let app = createApp({ render: () => comp })
  app.use(ElementPlus)
  app.mount(dom)
  //记录显然的目标dom,销毁时需要用到 render(null,renderContainer)
  ;(comp.component.proxy as any).renderContainer = dom
  return comp.component.proxy
}
