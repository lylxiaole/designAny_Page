import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header'
import styles from '../lay.module.less'

interface IProp {
  headerViewProps: HeaderViewProps
  defaultDom: any
}

const LeftMenu = React.forwardRef((props: IProp, ref: any) => {
  const [iscollapsed, localSetCollapsed] = useState(false)

  useImperativeHandle(ref, () => ({
    setCollapsed: (val: boolean) => {
      localSetCollapsed(val)
    }
  }))
  return <div className={styles.leftMenu}>{React.cloneElement(props.defaultDom, { ...props.defaultDom.props, collapsed: iscollapsed })}</div>
})

export default LeftMenu
