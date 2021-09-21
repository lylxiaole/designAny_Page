export default class paramInfo {
  key: string
  /**参数名称 */
  paramName: string
  /**1:系统模型,2:简单类型 */
  paramType: number
  /**参数是否是集合 */
  paramIsList: boolean
  /****** */
  paramVal: any
}
