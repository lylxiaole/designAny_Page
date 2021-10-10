import { toFixed } from 'xe-utils/toFixed'
import { BuildingFileUrlForShow } from '@src/utils'
import { parse } from 'uuid'
import { uploadFile } from '@src/apis/fileManager'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export default class fileUpload {
  constructor() {}

  /**开始上传 */
  public async startUpload(file: File) {
    if (!file) {
      window.console.error('文件不存在')
    }
    let relativePath = await uploadFile(file)
    // this.onUploadProgress(e.part, precent)
    // this.onUploadError(err)
    // this.onUploadSuccess(res.relativePath, data.Key)
  }

  /**拼接文件路径 */
  public getFilePath(relativePath: string) {
    //window.console.log(this.serverAddr + relativePath + '&access_token=' + token)
    return apiAddr() + '/api/file/GetFile?fileId=' + relativePath
  }

  /**********可注册时间************************************************************* */
  /**文件上传进度 */
  public onUploadProgress: (part: string, precent: number) => void = function() {}
  /**上传成功 */
  public onUploadError: (error: any) => void = function() {}
  /**上传失败 */
  public onUploadSuccess: (relativePath: string, fileName: string) => void = function() {}
}
