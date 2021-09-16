// 转为unicode 编码
export function encodeUnicode(str) {
  var res = []
  for (var i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}

export function timeStamp2time(param, formatString) {
  //window.console.log('formatString', formatString)
  let formatStr = 'YYYY-MM-dd hh:mm:ss'
  if (formatString && formatString.length > 0) {
    formatStr = formatString
  }
  //console.log('formatString', formatString)
  if (!param.cellValue) {
    if (!param){
      return ''
    }
  }
  var datetime = new Date()
  datetime.setTime(param.cellValue?param.cellValue:param)
  //window.console.log('datetime.format', datetime)
  return datetime.format(formatStr)
}

Date.prototype.format = function(fmt) {
  var o = {
    'y+': this.getFullYear(), //年
    'Y+': this.getFullYear(), //年
    'M+': this.getMonth() + 1, //月份
    'D+': this.getDate(), //日
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  // if (/(y+)/.test(fmt)) {
  //   fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  // }
  for (var k in o) {
    if (k === 'y+' || k === 'Y+') {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
    } else {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
  }
  return fmt
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

const concatUrl = (base, rest) => {
  base = base.trim();
  rest = rest.trim();
  if (base.substr(base.length - 1) == '/') base = base.substr(0, base.length - 1);
  if (rest.substr(0, 1) == '/') rest = rest.substr(1);
  return `${base}/${rest}`
}

import '../../04designerComponents/npReportComponents/viewer-app.js'
import { simpleQueryAll} from '@/api/crud'
/**
 * 
 * @param {根据报表id删除报表} portalUrl 
 * @param {*} referenceToken 
 * @param {*} reportId 
 */
export const deleteReportById = async (reportId) => {
  let portalUrl = 'http://localhost:51980/'
  let username = 'admin'
  let password = 'admin'   
  let parameter = {filter:[],modelCode:'sys_param'}
  parameter.filter = [
    {
      code: 'param_name',
      value: 'REPORT_URL',
      type: 'EQ',
    },
  ]
  let reportParam = await simpleQueryAll(parameter)
  if (reportParam.data instanceof Array && reportParam.data.length > 0){
    portalUrl = reportParam.data[0].param_value
  }         
  let referenceToken = await GrapeCity.ActiveReports.getReferenceToken(portalUrl, username, password)
  const url = concatUrl(portalUrl, 'api/graphql')
  const init = {
      headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Accept: 'application/json',
          'content-type': 'application/json',
          'pragma': 'no-cache',
          'Reference-Token': referenceToken
      },
      method: 'post',
      body: JSON.stringify({ query: 'mutation { deleteDocument(documentId: \"'+reportId+'\", force: false) { deleted_id } }' })
  };
  const res = await fetch(url, init);
  if (!res.ok) return null
  let response = await res.json()
  return response
}