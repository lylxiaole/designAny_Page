/**设计器的组件以 索引形式保存 */
export class CompIndex {
  static indexs = {}
}

/** */
export function findSystemCompByCode(code: string): any {
  var comp: any = CompIndex.indexs[code].component
  comp.compCode = code
  return comp
}
