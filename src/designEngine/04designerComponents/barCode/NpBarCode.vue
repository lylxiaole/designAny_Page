<template>
  <div>
    <canvas style="width:100%;" :id="barcodeId" :jsbarcode-value="vlaue" :jsbarcode-width="codeWidth" :jsbarcode-height="codeHeight"
      :jsbarcode-displayvalue="codeDisplayValue" :jsbarcode-format="codeFormat" :jsbarcode-textalign="codeTextAlign"
      :jsbarcode-textposition="codeTextPosition" :jsbarcode-textmargin="codeTextMargin" :jsbarcode-fontSize="codeFontSize">
    </canvas>
  </div>
</template>

<script lang="ts">
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { Property, PropertyGroupName, Number_Property, Text_Property, Boolean_Property, Enum_Property } from '../../03designerLayoutBase'
import JsBarcode from 'jsbarcode'
import { getUuid, deepClone } from '@src/utils'

@Component
export default class NpBarCode extends ComponentBase {
  private barcodeId: string = 'barcode'

  beforeMount() {
    this.barcodeId = 'barcode_' + common.getUuid()
  }

  mounted() {
    this.width = 300
    this.height = 300
    let codeFormats = [
      'CODE128',
      'CODE128A',
      'CODE128B',
      'CODE128C',
      'UPC',
      'EAN2',
      'EAN5',
      'EAN8',
      'EAN13',
      'CODE39',
      'ITF14',
      'MSI',
      'MSI10',
      'MSI11',
      'MSI1010',
      'MSI1110',
      'pharmacode',
      'codabar'
    ]
    this.registerProperty('格式', PropertyGroupName.special, new Enum_Property(true, codeFormats), 'CODE128')
    this.registerProperty('码高', PropertyGroupName.special, new Number_Property(), 100)
    this.registerProperty('码宽', PropertyGroupName.special, new Number_Property(), 2)
    this.registerProperty('内容', PropertyGroupName.special, new Text_Property(), '123456789')
    this.registerProperty('显示字', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('字对齐方式', PropertyGroupName.special, new Enum_Property(true, ['左', '中', '右']), '中')
    this.registerProperty('字位置', PropertyGroupName.special, new Enum_Property(true, ['底部', '顶部']), '底部')
    this.registerProperty('字边距', PropertyGroupName.special, new Number_Property(), 2)
    this.registerProperty('字大小', PropertyGroupName.special, new Number_Property(), 20)
  }

  private barCodeText: string = '123456789'
  get vlaue(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '内容')
    if (prop && prop.value != undefined && prop.value != null) {
      let data = prop.value.toString()
      this.barCodeText = data
      this.initBarCode()
      return data
    } else {
      return '123456789'
    }
  }

  private barCodeFormat: string = 'CODE128'
  get codeFormat(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '格式')
    let data = null
    if (prop && prop.value) {
      data = prop.value.toString()
      this.barCodeFormat = data
      this.initBarCode()
    } else {
      data = 'CODE128'
    }

    return data
  }

  private barCodeWidth: number = 2
  get codeWidth(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '码宽')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
      this.barCodeWidth = data
      this.initBarCode()
    } else {
      data = 2
    }

    return data
  }

  private barCodeHeight: number = 100
  get codeHeight(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '码高')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
      this.barCodeHeight = data
      this.initBarCode()
    } else {
      data = 100
    }

    return data
  }

  private barCodeDisplayValue: boolean = true
  get codeDisplayValue(): boolean {
    let prop = this.findPropertyByName(PropertyGroupName.special, '显示字')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Boolean(prop.value)
      this.barCodeDisplayValue = data
      this.initBarCode()
    } else {
      data = true
    }
    return data
  }

  private barCodeTextAlign: string = 'center'
  get codeTextAlign(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字对齐方式')
    let data = null
    if (prop && prop.value) {
      let pval = prop.value.toString()
      switch (pval) {
        case '左':
          data = 'left'
          break
        case '中':
          data = 'center'
          break
        case '右':
          data = 'right'
          break
        default:
          data = 'center'
          break
      }
      this.barCodeTextAlign = data
      this.initBarCode()
    } else {
      data = 'center'
    }
    return data
  }

  private barCodeTextPosition: string = 'bottom'
  get codeTextPosition(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字位置')
    let data = null
    if (prop && prop.value) {
      let pval = prop.value.toString()
      switch (pval) {
        case '顶部':
          data = 'top'
          break
        case '底部':
          data = 'bottom'
          break
        default:
          data = 'bottom'
          break
      }
      this.barCodeTextPosition = data
      this.initBarCode()
    } else {
      data = 'bottom'
    }
    return data
  }

  private barCodeTextMargin: number = 2
  get codeTextMargin(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字边距')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
      this.barCodeTextMargin = data
      this.initBarCode()
    } else {
      data = 2
    }

    return data
  }

  private barCodeFontSize: number = 20
  get codeFontSize(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字大小')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
      this.barCodeFontSize = data
      this.initBarCode()
    } else {
      data = 20
    }

    return data
  }

  private initBarCode() {
    let options = {
      width: this.barCodeWidth,
      height: this.barCodeHeight,
      displayValue: this.barCodeDisplayValue,
      format: this.barCodeFormat,
      textAlign: this.barCodeTextAlign,
      textPosition: this.barCodeTextPosition,
      textMargin: this.barCodeTextMargin,
      fontSize: this.barCodeFontSize
    }
    try {
      JsBarcode($(this.$el).find('#' + this.barcodeId)[0], this.barCodeText, options)
    } catch (error) {
      window.console.error(error)
    }
  }
}
</script>