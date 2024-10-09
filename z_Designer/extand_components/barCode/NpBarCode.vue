<template>
  <div>
    <canvas
      style="width: 100%"
      ref="barcoderef"
      :jsbarcode-value="vlaue"
      :jsbarcode-width="codeWidth"
      :jsbarcode-height="codeHeight"
      :jsbarcode-displayvalue="codeDisplayValue"
      :jsbarcode-format="codeFormat"
      :jsbarcode-textalign="codeTextAlign"
      :jsbarcode-textposition="codeTextPosition"
      :jsbarcode-textmargin="codeTextMargin"
      :jsbarcode-fontSize="codeFontSize"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'

import { DPropAttr, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import JsBarcode from 'jsbarcode'
const codeFormats = ['CODE128', 'CODE128A', 'CODE128B', 'CODE128C', 'UPC', 'EAN2', 'EAN5', 'EAN8', 'EAN13', 'CODE39', 'ITF14', 'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', 'pharmacode', 'codabar']
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.universal, '基础组件', '一维码组件', 'NpBarCode_001', '')
@Options({})
export default class NpBarCode extends EngineComponent {
  beforeMount() {}

  mounted() {
    this.width = '10%'
    this.height = '10%'

    this.findPropertyByName(PropertyGroupName.style, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.style, '背景色').canSetting = false
    this.initBarCode()
  }

  protected onDPropertyChange(layout: EngineLayout, field: string, val: any) {
    // this.initBarCode()
  }

  @DPropAttr(new Text_Setting('内容', PropertyGroupName.data, true))
  private vlaue: string = '123456789'

  @DPropAttr(new Enum_Setting('格式', PropertyGroupName.data, true, null, true, codeFormats))
  private codeFormat: string = 'CODE128'

  @DPropAttr(new Number_Setting('码宽', PropertyGroupName.style, true, null))
  private codeWidth: number = 2

  @DPropAttr(new Number_Setting('码高', PropertyGroupName.style, true, null))
  private codeHeight: number = 100

  @DPropAttr(new Boolean_Setting('显示字', PropertyGroupName.style, true, null))
  private codeDisplayValue: boolean = true

  @DPropAttr(new Enum_Setting('字对齐方式', PropertyGroupName.style, true, null, true, ['left', 'center', 'right']))
  private codeTextAlign: string = 'center'

  @DPropAttr(new Enum_Setting('字位置', PropertyGroupName.style, true, null, true, ['top', 'bottom']))
  private codeTextPosition: string = 'bottom'

  @DPropAttr(new Number_Setting('字边距', PropertyGroupName.style, true, null))
  private codeTextMargin: number = 2

  @DPropAttr(new Number_Setting('字大小', PropertyGroupName.style, true, null))
  private codeFontSize: number = 20

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
