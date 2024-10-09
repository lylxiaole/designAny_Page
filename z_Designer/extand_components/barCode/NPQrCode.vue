<template>
  <div>
    <canvas
      style="width: 100%"
      :id="qrCodeId"
      :qr-value="codeValue"
      :qr-version="codeVersion"
      :qr-ecl="codeErrorCorrectionLevel"
      :qr-maskpattern="codeMaskPattern"
      :qr-margin="codeMargin"
      :qr-width="codeWidth"
      :qr-scale="codeScale"
      :qr-color-light="codeLightColor"
      :qr-color-dark="codeDarkColor"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import QRCode from 'qrcode'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { DPropAttr, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting, Color_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.universal, '基础组件', '二维码组件', 'NPQrCode_001', null)
@Options({})
export default class NPQrCode extends EngineComponent {
  private qrCodeId: string = 'qrcode'

  beforeMount() {
    this.qrCodeId = 'qrcode_1'
  }

  mounted() {
    this.width = '10%'
    this.height = '10%'

    this.findPropertyByName(PropertyGroupName.style, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.style, '背景色').canSetting = false
    this.initQrCode()
  }
  beforeUnmount() {}

  protected onDPropertyChange(layout: EngineLayout, field: string, val: any) {
    // this.initQrCode()
  }

  @DPropAttr(new Text_Setting('内容', PropertyGroupName.data, true))
  private codeValue: string = '123456789'

  @DPropAttr(new Number_Setting('版本', PropertyGroupName.data, true, null))
  private codeVersion: number = 0

  @DPropAttr(new Text_Setting('纠错等级', PropertyGroupName.data, true))
  private codeErrorCorrectionLevel: string = 'M'

  @DPropAttr(new Number_Setting('遮罩符号', PropertyGroupName.style, true, null))
  private codeMaskPattern: number = -1

  @DPropAttr(new Number_Setting('二维码外边距', PropertyGroupName.style, true, null))
  private codeMargin: number = 4

  @DPropAttr(new Number_Setting('二维码宽度', PropertyGroupName.style, true, null))
  private codeWidth: number = 0
  @DPropAttr(new Number_Setting('比例因子', PropertyGroupName.style, true, null))
  private codeScale: number = 0

  @DPropAttr(new Color_Setting('内容颜色', PropertyGroupName.style, true, null))
  private codeDarkColor: string = '#000000'

  @DPropAttr(new Color_Setting('留白颜色', PropertyGroupName.style, true, null))
  private codeLightColor: string = '#ffffff'

  private initQrCode() {
    //window.console.log('initQrCode completed:***************')
    let options = {
      errorCorrectionLevel: this.codeErrorCorrectionLevel,
      margin: this.codeMargin,
      scale: this.codeScale,
      color: {
        dark: this.codeDarkColor,
        light: this.codeLightColor
      }
    }
    if (this.codeVersion) {
      options['version'] = this.codeVersion
    }
    if (this.codeWidth) {
      options['width'] = this.codeWidth
    }
    if (this.codeMaskPattern >= 0) {
      options['maskPattern'] = this.codeMaskPattern
    }

    // let canvasObj = document.getElementById(this.qrCodeId)
    QRCode.toCanvas($(this.$el).find('#' + this.qrCodeId)[0], this.codeValue, options, function (error) {
      if (error) {
        window.console.error(error)
      }
    })
  }
}
</script>
