<template>
  <div :style="{'width':width+'px','height':height+'px','left':left+'px','top':top+'px','background':background }">
    <div v-if="!IsDesigning">
      <a-row type="flex" v-for="row in rowDatas" :key="row.id">
        <a-col v-for="col in row.colDatas" :key="col.id" :ref="col.id">
          <div :style="cellStyle">
            <Placeholder :id="col.id" @onMounted="()=>{colMounted(col)}"></Placeholder>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="np-rg-full-class" v-else>
      <a-row class="np-rg-full-class">
        <a-col class="np-rg-full-class" :span="24">
          <div :style="cellDesignStyle">
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import $ from 'jquery'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  TextList_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property,
  PageTemplateSetting_Property
} from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'
import { AllComponents, ComponentBase } from '..'
import common from '../../02common/commonMethod'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import LayoutBase, { SaveInfo, LayoutInfo, LayoutType } from '../../03designerLayoutBase/LayoutBase'
import NpGridCell from './NpGridCell.vue'
import Placeholder from '../tabs/Placeholder.vue'
import XEUtils from 'xe-utils'

class ColData {
  id: string
  data: any
}

class RowData {
  id: string
  colDatas: ColData[]
}

enum DisplayMode {
  dataFill = '数据填充',
  cellClone = '单元复制'
}

@Component({
  name: 'npRepeatGrid',
  components: { NpGridCell: NpGridCell, Placeholder: Placeholder }
})
export default class NpRepeatGrid extends ComponentBase {
  private nprgId: string = 'nprgId'

  public readonly cellSettingPropGroupName: string = '单元格设置'

  beforeMount() {
    this.nprgId = common.getUuid()
  }

  created() {
    this.width = 400
    this.height = 400

    this.registerProperty('数据源', PropertyGroupName.special, null, [])
    this.registerProperty(
      '展示模式',
      PropertyGroupName.special,
      new Enum_Property(true, [DisplayMode.dataFill, DisplayMode.cellClone]),
      DisplayMode.dataFill
    )
    this.registerProperty('最大列数', PropertyGroupName.special, new Number_Property(1, 24, 1), 1)
    this.registerProperty('最大行数', PropertyGroupName.special, new Number_Property(0, 999, 1), 0)

    this.registerProperty('内容设置', this.cellSettingPropGroupName, new PageTemplateSetting_Property(), null)
    this.registerProperty('上外边距', this.cellSettingPropGroupName, new Number_Property(), 0, true, false, 'px')
    this.registerProperty('下外边距', this.cellSettingPropGroupName, new Number_Property(), 0, true, false, 'px')
    this.registerProperty('左外边距', this.cellSettingPropGroupName, new Number_Property(), 0, true, false, 'px')
    this.registerProperty('右外边距', this.cellSettingPropGroupName, new Number_Property(), 0, true, false, 'px')
  }

  mounted() {
    this.$on('onPropertyChanged', this.onGridPropertyChanged)
  }

  private onGridPropertyChanged(propertyId: string, property: Property, layout: LayoutBase) {
    if (property.groupName == PropertyGroupName.normal) {
      switch (property.propertyName) {
        case '宽度':
          {
            this.children.forEach((x) => {
              x.width = property.value
            })
          }
          break
        case '高度':
          {
            this.children.forEach((x) => {
              x.height = property.value
            })
          }
          break
        default:
          break
      }
    } else if (property.groupName == PropertyGroupName.special) {
      if (property.propertyName == '数据源' && property.value && !this.IsDesigning && this.hasMounted) {
        this.getRowData()
      }
    }
  }

  protected templateData: any = null

  private rowDatas: RowData[] = []

  get cellDesignStyle(): any {
    let style = {
      height: '-webkit-fill-available',
      width: '-webkit-fill-available',
      background: 'white',
      'margin-left': this.cellMarginLeft + 'px',
      'margin-right': this.cellMarginRight + 'px',
      'margin-top': this.cellMarginTop + 'px',
      'margin-bottom': this.cellMarginBottom + 'px'
    }
    return style
  }

  get cellStyle(): any {
    let style2 = {
      'margin-left': this.cellMarginLeft + 'px',
      'margin-right': this.cellMarginRight + 'px',
      'margin-top': this.cellMarginTop + 'px',
      'margin-bottom': this.cellMarginBottom + 'px'
    }
    return style2
  }

  get cellMarginLeft(): number {
    const marginLeftProp = this.findPropertyByName(this.cellSettingPropGroupName, '左外边距')
    let cellMarginLeft: number = 0
    if (marginLeftProp) {
      cellMarginLeft = marginLeftProp.value ? marginLeftProp.value : 0
    }
    return cellMarginLeft
  }

  get cellMarginRight(): number {
    const marginRightProp = this.findPropertyByName(this.cellSettingPropGroupName, '右外边距')
    let cellMarginRight: number = 0
    if (marginRightProp) {
      cellMarginRight = marginRightProp.value ? marginRightProp.value : 0
    }
    return cellMarginRight
  }

  get cellMarginTop(): number {
    const marginTopProp = this.findPropertyByName(this.cellSettingPropGroupName, '上外边距')
    let cellMarginTop: number = 0
    if (marginTopProp) {
      cellMarginTop = marginTopProp.value ? marginTopProp.value : 0
    }
    return cellMarginTop
  }

  get cellMarginBottom(): number {
    const marginBottomProp = this.findPropertyByName(this.cellSettingPropGroupName, '下外边距')
    let cellMarginBottom: number = 0
    if (marginBottomProp) {
      cellMarginBottom = marginBottomProp.value ? marginBottomProp.value : 0
    }
    return cellMarginBottom
  }

  private colMounted(colData: ColData) {
    let findcolCache = this.preloadedColComps.find((o) => o.id == colData.id)
    if (!findcolCache) {
      return
    }
    $('#' + colData.id)
      .parent()
      .append(findcolCache.cache)
  }

  private hasMounted: boolean = false

  private orgWidth: number = 0
  private orgHeight: number = 0

  protected onMounted(layout: LayoutBase) {
    const nameProp = this.findPropertyByName(PropertyGroupName.normal, '名称')
    if (nameProp && !nameProp.value) {
      nameProp.value = '数据栅格-' + this.nprgId
    }

    const ctsProp = this.findPropertyByName(this.cellSettingPropGroupName, '内容设置')
    if (ctsProp && ctsProp.value) {
      this.templateData = ctsProp.value
    }

    const widthProp = this.findPropertyByName(PropertyGroupName.normal, '宽度')
    if (widthProp && widthProp.value) {
      this.orgWidth = widthProp.value
    }
    const heightProp = this.findPropertyByName(PropertyGroupName.normal, '高度')
    if (heightProp && heightProp.value) {
      this.orgHeight = heightProp.value
    }

    if (!this.IsDesigning) {
      this.getRowData()
    }

    this.hasMounted = true
  }

  private getRowData(): void {
    this.preloadedColComps = []
    const dsProp = this.findPropertyByName(PropertyGroupName.special, '数据源')
    let dataSourceValue = null
    if (dsProp && dsProp.value) {
      dataSourceValue = dsProp.value
    } else {
      return
    }
    const smProp = this.findPropertyByName(PropertyGroupName.special, '展示模式')
    let smName: string = DisplayMode.dataFill
    if (smProp && smProp.value) {
      smName = smProp.value
    }

    const mlcProp = this.findPropertyByName(PropertyGroupName.special, '最大列数')
    let mlc: number = 0
    if (mlcProp) {
      mlc = mlcProp.value ? Math.floor(mlcProp.value) : 0
    }

    const mrcProp = this.findPropertyByName(PropertyGroupName.special, '最大行数')
    let mrc: number = 0
    if (mrcProp) {
      mrc = mrcProp.value ? Math.floor(mrcProp.value) : 0
    }

    let allRowData: RowData[] = []
    let colCount: number = 0
    if (dataSourceValue) {
      if (XEUtils.isArray(dataSourceValue)) {
        //数据源为数组时处理
        let dataLen: number = dataSourceValue.length
        if (dataLen == 0) {
          return
        }
        if (mlc != 0) {
          //最大行数设置为0时，根据数据源的长度来计算具体的最大行数
          if (mrc == 0) {
            mrc = Math.floor(dataLen / mlc)
            let leftcount = dataLen % mlc
            if (leftcount > 0) {
              mrc++
            }
          }
          for (let i = 0; i < mrc; i++) {
            if (colCount < dataLen) {
              let row = new RowData()
              row.id = common.getUuid()
              let clData: ColData[] = []
              for (let j = 0; j < mlc; j++) {
                colCount++
                if (colCount <= dataLen) {
                  let col = new ColData()
                  col.id = common.getUuid()
                  let itemData = null
                  if (smName == DisplayMode.cellClone) {
                    itemData = dataSourceValue[0]
                  } else {
                    itemData = dataSourceValue[colCount - 1]
                  }
                  col.data = itemData
                  clData.push(col)
                } else {
                  break
                }
              }
              row.colDatas = clData
              allRowData.push(row)
            } else {
              break
            }
          }
        } else {
          colCount++
          let row = new RowData()
          let clData: ColData[] = []
          row.id = common.getUuid()
          let col = new ColData()
          col.id = common.getUuid()
          if (dataLen > 0) {
            col.data = dataSourceValue[0]
          }
          clData.push(col)
          row.colDatas = clData
          allRowData.push(row)
        }
      } else {
        //数据源为非数组时处理
        if (mlc != 0 && mrc != 0 && smName == DisplayMode.cellClone) {
          for (let i = 0; i < mrc; i++) {
            let row = new RowData()
            row.id = common.getUuid()
            let clData: ColData[] = []
            for (let j = 0; j < mlc; j++) {
              colCount++
              let col = new ColData()
              col.id = common.getUuid()
              col.data = dataSourceValue
              clData.push(col)
            }
            row.colDatas = clData
            allRowData.push(row)
          }
        } else {
          colCount++
          let row = new RowData()
          let clData: ColData[] = []
          row.id = common.getUuid()
          let col = new ColData()
          col.id = common.getUuid()
          col.data = dataSourceValue
          clData.push(col)
          row.colDatas = clData
          allRowData.push(row)
        }
      }
    } else {
      //数据源未赋值时处理
      colCount++
      let row = new RowData()
      let clData: ColData[] = []
      row.id = common.getUuid()
      let col = new ColData()
      col.id = common.getUuid()
      clData.push(col)
      row.colDatas = clData
      allRowData.push(row)
    }
    if (mrc != 0 && mlc != 0 && colCount != 0) {
      let rColCount = Math.floor(colCount / mlc)
      if (rColCount == 0) {
        this.width = this.width * colCount
      } else {
        const leftCount = colCount % mlc
        if (leftCount > 0) {
          rColCount++
        }
        this.height = this.orgHeight * rColCount
        this.width = this.orgWidth * mlc
      }
    }
    this.rowDatas = allRowData
    ////////////////////////////////////////////
    for (let index = 0; index < this.rowDatas.length; index++) {
      const row = this.rowDatas[index]
      for (let index = 0; index < row.colDatas.length; index++) {
        const col = row.colDatas[index]
        this.preloadColComp(col)
      }
    }
  }

  private preloadedColComps: any[] = []
  private preloadColComp(colData: ColData) {
    let colChildData = common.clone(this.templateData)
    if (colData.data != undefined && colData != null) {
      let sdProp = colChildData.properties.find((x) => x.propertyName == '单元格数据' && x.groupName == PropertyGroupName.normal)
      if (sdProp) {
        sdProp.value = common.clone(colData.data)
      }
    }
    let domcache = this.renderNpGridCell(colData.id, colChildData)
    this.preloadedColComps.push({ id: colData.id, cache: domcache })
  }

  private childCells: Vue[] = []
  private renderNpGridCell(compId: string, compData?: SaveInfo): DocumentFragment {
    let domCache = window.document.createDocumentFragment()
    let tmpNode = window.document.createElement('div')
    domCache.appendChild(tmpNode)
    ///////////////////////////////////
    let compClass = this.findSystemCompByCode('NpGridCell')
    let compInfo = common.clone(AllComponents.find((x) => x.compCode == 'NpGridCell'))
    compInfo.compCode = compClass.compCode
    var dropcomp = new compClass()
    dropcomp.parentLayout = this
    dropcomp.layoutInfo = compInfo
    try {
      dropcomp.parentLayout = this
      dropcomp.parentPage = this.parentPage
      const itemId = common.getUuid()
      dropcomp.$mount(tmpNode)
      dropcomp.Id = itemId
      dropcomp.width = this.orgWidth - this.cellMarginLeft - this.cellMarginRight
      dropcomp.height = this.orgHeight - this.cellMarginTop - this.cellMarginBottom
      if (compData) {
        dropcomp.LoadData(compData)
      }
    } catch (error) {
      window.console.error('绘制子组件失败,请不要保存!!!')
    }
    if (dropcomp) {
      dropcomp.$on('onChildrenCountChange', this.onComponentChildrenCountChange)
      dropcomp.$on('onComponentChildrenCountChange', this.onComponentChildrenCountChange)
      dropcomp.$on('onPropertyChanged', this.onComponentPropertyChanged)
      dropcomp.$on('onComponentPropertyChanged', this.onComponentPropertyChanged)
    }
    this.childCells.push(dropcomp)
    return domCache
  }

  beforeDestroy() {
    for (let index = 0; index < this.childCells.length; index++) {
      const element = this.childCells[index]
      element.$destroy()
    }
  }
}
</script>
<style scoped>
.np-rg-full-class {
  height: 100%;
  width: 100%;
}
</style>