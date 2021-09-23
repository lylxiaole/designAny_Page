export class CompIndex {
  static indexs = {}
}
export function findSystemComp(groupName: string, name: string, compType?: any): any {
  // window.console.log('findSystemComp', CompIndex.indexs)
  if (!CompIndex.indexs[groupName] || !CompIndex.indexs[groupName][name]) {
    return null
  }
  var find = CompIndex.indexs[groupName][name]
  var compInfo: any = null

  if (!compType) {
    compInfo = find
  }
  if (find.type === compType) {
    compInfo = find
  }

  if (compInfo) {
    compInfo.component.compCode = compInfo.compCode
    return compInfo.component
  } else {
    return null
  }
}

export function findSystemCompByCode(code: string): any {
  var comp: any = CompIndex.indexs[code].component
  comp.compCode = code
  return comp
}
