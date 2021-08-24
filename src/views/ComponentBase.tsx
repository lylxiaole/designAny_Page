import React from 'react'
export default class ComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  constructor(props: any) {
    super(props)
  }
}
