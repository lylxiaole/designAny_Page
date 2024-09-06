function excuteJS(jscontent) {
  function getParameterName(fn) {
    if (typeof fn !== 'object' && typeof fn !== 'function') return
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
    const DEFAULT_PARAMS = /=[^,)]+/gm
    const FAT_ARROWS = /=>.*$/gm
    let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString()
    code = code.replace(COMMENTS, '').replace(FAT_ARROWS, '').replace(DEFAULT_PARAMS, '')
    let result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g)
    return result === null ? [] : result
  }

  this.validate = function () {
    let newjscontent = jscontent + "\n if(!main){throw '必须有main函数'}"
    newjscontent += '\n this.func=main'
    eval(newjscontent)
    let inparams = getParameterName(this.func)
    let isHaveOutput = jscontent.indexOf(' return ') > -1
    return {
      inparams: inparams,
      isHaveOutput: isHaveOutput
    }
  }

  this.startExcute = function () {
    let newjscontent = jscontent + "\n if(!main){throw '必须有main函数'}"
    newjscontent += '\n this.func=main'
    eval(newjscontent)
    let x = this
    debugger
  }
}
export default excuteJS
