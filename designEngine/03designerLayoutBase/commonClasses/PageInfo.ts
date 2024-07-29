export const allPages: any[] = []
//TODO 参考https://github.com/kaorun343/vue-property-decorator/blob/master/src/helpers/provideInject.ts

export function DPageAttr(paltform: string, preOrDesign: string) {
  return function (target: Function) {
    !target.prototype.$lyl_page && (target.prototype.$lyl_page = {})

    target.prototype.$lyl_page.paltform = paltform
    target.prototype.$lyl_page.preOrDesign = preOrDesign
    let layoutInfo = { paltform: paltform, preOrDesign: preOrDesign, component: target }
    allPages.push(layoutInfo)
  }
}

export function findPageByPaltform(paltform: string, preOrDesign: string) {
  return allPages.find((o) => o.paltform === paltform && o.preOrDesign === preOrDesign).component
}
