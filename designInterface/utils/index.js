import CircularJSON from 'circular-json-es6'
import pako from 'pako'

export function deepClone(item) {
  if (item == undefined || item == null || item.constructor == String || item.constructor == Number || item.constructor == Boolean) {
    /**此处判断条件不能更改，要考虑NaN的情况 */
    return item
  }
  return deserialize(serialize(item))
  // return clonedeep(item)
}

export function getUuid() {
  var len = 32
  var radix = 16
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i = 0
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
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return 'A' + uuid.join('')
}

//反序列化
export function deserialize(str) {
  if (str == undefined || str == null) {
    /**此处判断条件不能更改，要考虑NaN的情况 */
    return str
  }
  return CircularJSON.parse(str)
}
//序列化
export function serialize(item) {
  if (item == undefined || item == null) {
    /**此处判断条件不能更改，要考虑NaN的情况 */
    return item
  }
  return CircularJSON.stringify(item)
}

export function byteToString(arr) {
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

export function strZip(str) {
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

export function strUnZip(str) {
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

/**
 *浏览器进入全屏
 */
export function reqFullScreen(el, closeCallback) {
  if (!el) {
    el = document.documentElement
  }
  if (el.requestFullScreen) {
    el.requestFullScreen()
  } else if (el.webkitRequestFullScreen) {
    /* Chrome, Safari and Opera */
    el.webkitRequestFullScreen()
  } else if (el.mozRequestFullScreen) {
    /* Firefox */
    el.mozRequestFullScreen()
  } else if (el.msRequestFullscreen) {
    /* IE/Edge */
    el.msRequestFullscreen()
  }

  if (closeCallback) {
    el.addEventListener('fullscreenchange', function(e) {
      if (!document.fullscreenElement) {
        closeCallback()
      }
    })
    el.addEventListener('mozfullscreenchange', function(e) {
      if (!document.mozFullScreenElement) {
        closeCallback()
      }
    })
    el.addEventListener('webkitfullscreenchange', function(e) {
      if (!document.webkitFullscreenElement) {
        closeCallback()
      }
    })
    el.addEventListener('msfullscreenchange', function(e) {
      if (!document.msFullscreenElement) {
        closeCallback()
      }
    })
  }
}

/**
 *浏览器退出全屏
 */
export function exitFullScreen(el) {
  if (!el) {
    el = document
  }
  if (el.exitFullScreen) {
    document.exitFullScreen()
  } else if (el.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (el.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (el.msRequestFullScreen) {
    document.msCancelFullScreen()
  }
}
