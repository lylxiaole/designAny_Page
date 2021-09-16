class groupInfo {
  name: string
  disabled: boolean
}
export default class selectElementInfo {
  key: string
  //是否设置组别 2:不设置   1：设置
  // selectGroupType: number
  //组别名称
  selectGroupName: string
  //选择项名称
  selectEleName: string
  //选择项是否可选
  selectEleDisabled: boolean
  selectGroupEleInfo: groupInfo[]
}
