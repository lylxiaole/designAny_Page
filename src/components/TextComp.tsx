import React from 'react'

export default class TextComp extends React.Component<any, any> {
  render() {
    window.console.log('TextComp渲染了:', this)
    return <h1>Hello World啊!</h1>
  }
}
