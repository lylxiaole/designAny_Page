var CircularJSON = require('circular-json-es6')
import pako from 'pako'
import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'
import { Modal, notification, message, Spin } from 'ant-design-vue'
import clonedeep from 'lodash.clonedeep'
import { Store } from 'vuex'

class loadingWinInfo {
  key: string
  layerIndex: number
  isMain: boolean = false
}

export default class common {
  //*******生成唯一标识******************************************************
  public static getUuid() {
    var len = 32 //32长度
    var radix = 16 //16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    var i
    radix = radix || chars.length
    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)]
      }
    } else {
      var r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return 'A' + uuid.join('')
  }

  //深度clone对象
  public static clone(item: any): any {
    if (item == undefined || item == null || item.constructor == String || item.constructor == Number || item.constructor == Boolean || (item.constructor == Object && Object.keys(item).length == 0) || (item.constructor == Array && item.length == 0)) {
      /**此处判断条件不能更改，要考虑NaN的情况 */
      return item
    }
    return common.deserialize(common.serialize(item))
    // return clonedeep(item)
  }

  //反序列化
  public static deserialize(str: string): any {
    if (str == undefined || str == null) {
      /**此处判断条件不能更改，要考虑NaN的情况 */
      return str
    }
    return CircularJSON.parse(str)
  }
  //序列化
  public static serialize(item: any): string {
    if (item == undefined || item == null) {
      /**此处判断条件不能更改，要考虑NaN的情况 */
      return item
    }
    return CircularJSON.stringify(item)
  }

  public static byteToString(arr: any): string {
    var str = '',
      _arr = arr
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/)
      if (v && one.length == 8) {
        var bytesLength = v[0].length
        var store = _arr[i].toString(2).slice(7 - bytesLength)
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2)
        }
        str += String.fromCharCode(parseInt(store, 2))
        i += bytesLength - 1
      } else {
        str += String.fromCharCode(_arr[i])
      }
    }
    return str
  }

  public static strZip(str: string): string {
    try {
      if (!str) {
        return str
      }
      var binaryString = pako.gzip(str, {
        to: 'string'
      })
      return btoa(binaryString)
    } catch (error) {
      return str
    }
  }

  public static strUnZip(str: string): string {
    try {
      if (!str) {
        return str
      }
      str = atob(str)
      var x = pako.ungzip(str, {
        to: 'string'
      })
      return x
    } catch (error) {
      return str
    }
  }

  /**使用相对路径，转换成文件的绝对路径，供给页面使用 */
  public static BuildingFileUrlForShow(fileserverAddr: string, relativePath: string) {
    if (!relativePath) {
      return ''
    }
    if (relativePath.indexOf('?') < 1) {
      relativePath += '?'
    } else {
      relativePath += '&'
    }
    return fileserverAddr + relativePath
  }

  public static getMillionSecond(): number {
    return new Date().getTime()
  }
  /////////////////////////////////////////////////////////////////
  private static asyncLoadingWindowInfo: loadingWinInfo[] = []
  private static findLoadingInfo(key: string): loadingWinInfo {
    return common.asyncLoadingWindowInfo.find((o) => o.key == key)
  }

  private static removeLoadingInfo(key: string) {
    let index = common.asyncLoadingWindowInfo.findIndex((o) => o.key == key)
    if (index < 0) {
      return
    }
    common.asyncLoadingWindowInfo.splice(index, 1)
  }

  /**isMain:防止闪烁 */
  public static showLoading_Async(isMain: boolean = false): string {
    if (common.asyncLoadingWindowInfo.length > 1) {
      return
    }
    let newKey = common.getUuid()
    common.asyncLoadingWindowInfo.push({ key: newKey, layerIndex: -1, isMain: isMain })
    window.setTimeout(() => {
      let findh = common.findLoadingInfo(newKey)
      if (!findh || findh.isMain != isMain) {
        return
      }
      // window.console.log('*********************打开loading:', isMain)
      findh.layerIndex = (window as any).layer.load(1, {
        shade: [0.3, '#000'] //0.1透明度的白色背景
      })
    }, 150)
    return newKey
  }
  // isMain:防止闪烁
  public static closeLoading_Async(key: string, isMain: boolean = false) {
    let findh = common.findLoadingInfo(key)
    if (!findh || findh.isMain != isMain) {
      return
    }
    window.console.log('*********************关闭loading:', $('body'))
    ;(window as any).layer.close(findh.layerIndex)
    common.removeLoadingInfo(key)
  }

  ////////////////////虚拟dom绘制/////////////////////////////////////////////
  public static drawVueOnVirtualDom(comp: Vue): DocumentFragment {
    let fragment = window.document.createDocumentFragment()
    let divdom = window.document.createElement('div')
    fragment.appendChild(divdom)
    comp.$mount(divdom)

    return fragment
  }
}
