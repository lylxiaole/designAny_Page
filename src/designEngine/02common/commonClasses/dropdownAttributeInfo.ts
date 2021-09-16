import { fileInfo } from '../../01designerContext'

export default class buttonAttributeInfos {
  key: string
  value: string
  authCode: string
  checked: boolean
  confirmTitle: string
  imageUrl: fileInfo[]
  url: string
  iconFlag: boolean
  dropTextColor: string = ''
  dropVisable: boolean
  timeout: Number  
}
