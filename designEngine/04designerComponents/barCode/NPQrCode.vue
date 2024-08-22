<template>
  <div>
    <canvas style="width:100%;" :id="qrCodeId" :qr-value="codeValue" :qr-version="codeVersion" :qr-ecl="codeErrorCorrectionLevel"
      :qr-maskpattern="codeMaskPattern" :qr-margin="codeMargin" :qr-width="codeWidth" :qr-scale="codeScale" :qr-color-light="codeLightColor"
      :qr-color-dark="codeDarkColor">
    </canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import QRCode from 'qrcode'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr } from '@designEngine/03designerLayoutBase'
import {
  DPropAttr,
  Property,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting,
  Color_Setting
} from '@designEngine/03designerLayoutBase'

import { getUuid, deepClone } from '@common/utils'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '二维码组件', 'NPQrCode_001', null)
@Options({})
export default class NPQrCode extends EngineComponent {
  private qrCodeId: string = 'qrcode'

  beforeMount() {
    this.qrCodeId = 'qrcode_' + getUuid()
  }

  mounted() {
    this.width = '10%'
    this.height = '10%'

    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false
    this.initQrCode()
  }
  beforeUnmount() {}

  protected onDPropertyChange(layout: EngineLayout, field: string, val: any) {
    // this.initQrCode()
  }

  @DPropAttr(new Text_Setting('内容', PropertyGroupName.special, true))
  private codeValue: string = '123456789'

  @DPropAttr(new Number_Setting('版本', PropertyGroupName.special, true, null))
  private codeVersion: number = 0

  @DPropAttr(new Text_Setting('纠错等级', PropertyGroupName.special, true))
  private codeErrorCorrectionLevel: string = 'M'

  @DPropAttr(new Number_Setting('遮罩符号', PropertyGroupName.special, true, null))
  private codeMaskPattern: number = -1

  @DPropAttr(new Number_Setting('二维码外边距', PropertyGroupName.special, true, null))
  private codeMargin: number = 4

  @DPropAttr(new Number_Setting('二维码宽度', PropertyGroupName.special, true, null))
  private codeWidth: number = 0
  @DPropAttr(new Number_Setting('比例因子', PropertyGroupName.special, true, null))
  private codeScale: number = 0

  @DPropAttr(new Color_Setting('内容颜色', PropertyGroupName.special, true, null))
  private codeDarkColor: string = '#000000'

  @DPropAttr(new Color_Setting('留白颜色', PropertyGroupName.special, true, null))
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