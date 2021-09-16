import './theme/default/layer.css'
require('./layer.js')

export default class Layer {
  static open(layeroption: any) {}

  static alert(content: string) {
    ;(window as any).layer.alert(content)
  }

  static warning(content: string) {
    ;(window as any).layer.alert(content, { icon: 7 })
  }
  // static open(layeroption: any) {}
  // static open(layeroption: any) {}
}
