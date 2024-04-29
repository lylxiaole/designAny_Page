<template>
  <div>
    <canvas style="width:100%;" ref="barcoderef" :jsbarcode-value="vlaue" :jsbarcode-width="codeWidth" :jsbarcode-height="codeHeight"
      :jsbarcode-displayvalue="codeDisplayValue" :jsbarcode-format="codeFormat" :jsbarcode-textalign="codeTextAlign"
      :jsbarcode-textposition="codeTextPosition" :jsbarcode-textmargin="codeTextMargin" :jsbarcode-fontSize="codeFontSize">
    </canvas>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import { Property, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@designEngine/03designerLayoutBase'
import JsBarcode from 'jsbarcode'
import { getUuid, deepClone } from '@common/utils'
import { npGridIco } from '@designEngine/assets/icons.js'

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '一维码组件', 'NpBarCode', npGridIco)
@Options({})
export default class NpBarCode extends EngineComponent {
  beforeMount() {}

  mounted() {
    this.width = '300px'
    this.height = '300px'
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
    this.registerProperty(PropertyGroupName.special, '格式', new Enum_Setting(true, codeFormats), 'CODE128')
    this.registerProperty(PropertyGroupName.special, '码高', new Number_Setting(), 100)
    this.registerProperty(PropertyGroupName.special, '码宽', new Number_Setting(), 2)
    this.registerProperty(PropertyGroupName.special, '内容', new Text_Setting(), '123456789')
    this.registerProperty(PropertyGroupName.special, '显示字', new Boolean_Setting(), true)
    this.registerProperty(PropertyGroupName.special, '字对齐方式', new Enum_Setting(true, ['左', '中', '右']), '中')
    this.registerProperty(PropertyGroupName.special, '字位置', new Enum_Setting(true, ['底部', '顶部']), '底部')
    this.registerProperty(PropertyGroupName.special, '字边距', new Number_Setting(), 2)
    this.registerProperty(PropertyGroupName.special, '字大小', new Number_Setting(), 20)

    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false

    this.initBarCode()
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: EngineComponent): void {
    this.initBarCode()
  }
  get vlaue(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '内容')
    if (prop && prop.value != undefined && prop.value != null) {
      let data = prop.value.toString()
      return data
    } else {
      return '123456789'
    }
  }

  get codeFormat(): string {
    let prop = this.findPropertyByName(PropertyGroupName.special, '格式')
    let data = null
    if (prop && prop.value) {
      data = prop.value.toString()
    } else {
      data = 'CODE128'
    }

    return data
  }

  get codeWidth(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '码宽')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
    } else {
      data = 2
    }

    return data
  }

  get codeHeight(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '码高')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
    } else {
      data = 100
    }

    return data
  }

  get codeDisplayValue(): boolean {
    let prop = this.findPropertyByName(PropertyGroupName.special, '显示字')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Boolean(prop.value)
    } else {
      data = true
    }
    return data
  }

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
    } else {
      data = 'center'
    }
    return data
  }

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
    } else {
      data = 'bottom'
    }
    return data
  }

  get codeTextMargin(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字边距')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
    } else {
      data = 2
    }

    return data
  }

  get codeFontSize(): number {
    let prop = this.findPropertyByName(PropertyGroupName.special, '字大小')
    let data = null
    if (prop && prop.value != undefined && prop.value != null) {
      data = Number(prop.value)
    } else {
      data = 20
    }

    return data
  }

  private initBarCode() {
    let options = {
      width: this.codeWidth,
      height: this.codeHeight,
      displayValue: this.codeDisplayValue,
      format: this.codeFormat,
      textAlign: this.codeTextAlign,
      textPosition: this.codeTextPosition,
      textMargin: this.codeTextMargin,
      fontSize: this.codeFontSize
    }
    try {
      JsBarcode($(this.$refs.barcoderef)[0], this.vlaue, options)
    } catch (error) {
      window.console.error(error)
    }
  }
}
</script>