import { Row, Col } from 'ant-design-vue'
import { ComponentBase } from '../../04designerComponents'
import LayoutCell from './LayoutCell.vue'

export class rowDataBase {
  height: string = '0%'
  width: string = '100%'
}

export class colDataBase {
  span: number = 0
  height: string = '100%'
}

export class rowData extends rowDataBase {
  layoutRow: Row
  vueComp: LayoutCell
}

export class colData extends colDataBase {
  layoutCol: Col
  vueComp: LayoutCell | ComponentBase
}
