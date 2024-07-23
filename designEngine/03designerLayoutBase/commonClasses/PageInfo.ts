export const allPages: any[] = []

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
