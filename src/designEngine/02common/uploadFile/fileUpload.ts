import x from './ceph'
var AWS = x as any

export default class fileUpload {
  urlfileserviceAddress: URL = null
  serverAddr: string = null
  constructor(serverAddr: string) {
    this.urlfileserviceAddress = new URL(serverAddr)
    this.serverAddr = serverAddr
    AWS.config.update({
      endpoint: this.urlfileserviceAddress.host
    })
  }

  public changeFileServer(url: string) {
    this.urlfileserviceAddress = new URL(url)
    this.serverAddr = url
  }
  /**开始上传 */
  public startUpload(file: File, token: string, isKeepVersion: boolean = false) {
    if (!file) {
      window.console.error('文件不存在')
    }

    let params = {
      Bucket: this.urlfileserviceAddress.pathname.substring(1),
      Key: file.name,
      Body: file
    }

    var s3 = new AWS.S3({
      accessKeyId: 'i',
      secretAccessKey: 'like',
      region: 'it',
      s3ForcePathStyle: true,
      sslEnabled: false,
      clientSideMonitoring: false,
      sessionToken: token
    })

    let upload = s3
      .upload(params, {
        queueSize: 3,
        connectTimeout: 60 * 1008 * 10,
        httpoptions: {
          timeout: 60 * 100 * 10
        }
      })
      .on('httpUploadProgress', (e: any) => {
        var precent = parseInt(e.loaded, 10) / parseInt(e.total, 10)
        this.onUploadProgress(e.part, precent)
      })

    upload.send((err: any, data: any) => {
      if (err) {
        window.console.log(err)
        this.onUploadError(err)
        return
      }
      // data.Key = data.Key.replace(/&amp;/g, '&')
      data.Location = data.Location.replace(data.Key, this.myurlEncode(data.Key, true))

      let resurl = new URL(data.Location)
      let res: any = {}
      res.key = data.Key
      let filePath = new URL(data.Location)
      filePath.port = this.urlfileserviceAddress.port
      filePath.host = this.urlfileserviceAddress.host
      res.path = filePath.href
      res.relativePath = '/' + res.path.substring(res.path.indexOf(data.Bucket), res.path.length)
      // res.md5 = '';
      res.version = this.getUrlParam(resurl, 'versionId')
      res.etag = data.ETag
      console.info('文件上传拉')
      data.Key = data.Key.substring(data.Key.indexOf('/', data.Key.indexOf('/') + 1) + 1, data.Key.length)
      window.console.log('上传文件完成', res.relativePath, data.Key)
      this.onUploadSuccess(res.relativePath, data.Key)
    })
  }

  private myurlEncode(url, keepPathSlash) {
    let encoded
    encoded = encodeURIComponent(url.replace(/&amp;/g, '&'))
    encoded = encoded.replace(/\+/g, '%20')
    if (keepPathSlash) {
      encoded = encoded.replace('%2F/g', '/')
    }
    return encoded
  }

  private getUrlParam(url, name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = url.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }

  /**拼接文件路径 */
  public getFilePath(relativePath: string) {
    //window.console.log(this.serverAddr + relativePath + '&access_token=' + token)
    return relativePath
  }

  /**********可注册时间************************************************************* */
  /**文件上传进度 */
  public onUploadProgress: (part: string, precent: number) => void = function() {}
  /**上传成功 */
  public onUploadError: (error: any) => void = function() {}
  /**上传失败 */
  public onUploadSuccess: (relativePath: string, fileName: string) => void = function() {}
}
