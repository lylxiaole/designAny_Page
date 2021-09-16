import { fileInfo } from '../../01designerContext'

class buttonIcons {
  name: string
  value: string
}

export default class buttonAttributeInfos {
  key: string

  /**按钮状态 */
  buttonStatus: string

  /**设置按钮图标方式 1：直接设置 2：上传图片 */
  buttonIconType: number

  buttonIcons: buttonIcons

  buttonIconImages: fileInfo[]

  /**按钮文字颜色 */
  buttonTextColor: string = ''

  /**按钮背景色 */
  buttonBGColor: string = ''

  /**按钮边框颜色 */
  buttonFrameColor: string = ''

  get allButtonIcons(): any[] {
    if (this.buttonIconType == 1) {
      return [
        { name: '新增', value: 'plus' },
        { name: '查询', value: 'search' },
        { name: '删除', value: 'delete' },
        { name: '编辑', value: 'edit' },
      ]
    } else {
      return this.buttonIconImages
    }
  }
}
