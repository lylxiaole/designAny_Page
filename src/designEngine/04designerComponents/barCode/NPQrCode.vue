<template>
  <div>
    <canvas style="width:100%;" :id="qrCodeId" :qr-value="codeValue" :qr-version="codeVersion" :qr-ecl="codeErrorCorrectionLevel"
      :qr-maskpattern="codeMaskPattern" :qr-margin="codeMargin" :qr-width="codeWidth" :qr-scale="codeScale" :qr-color-light="codeLightColor"
      :qr-color-dark="codeDarkColor">
    </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import QRCode from 'qrcode'
import { LayoutBase, EngineComponentBase, LayoutType, layoutCompTypeAttr } from '@src/designEngine'
import { Property, PropertyGroupName, Number_Property, Text_Property, Boolean_Property, Enum_Property, Color_Property } from '@src/designEngine'

import { getUuid, deepClone } from '@src/utils'
@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '一维码组件', 'NPQrCode', null)
@Component
export default class NPQrCode extends EngineComponentBase {
  private qrCodeId: string = 'qrcode'

  beforeMount() {
    this.qrCodeId = 'qrcode_' + getUuid()
  }

  mounted() {
    this.width = 300
    this.height = 300

    this.registerProperty(PropertyGroupName.special, '内容', new Text_Property(), '123456789')
    this.registerProperty(PropertyGroupName.special, '版本', new Number_Property(0, 40, 1), 0)
    this.registerProperty(PropertyGroupName.special, '纠错等级', new Enum_Property(true, ['L', 'M', 'Q', 'H']), 'M')
    this.registerProperty(PropertyGroupName.special, '遮罩符号', new Number_Property(-1, 7, 1), -1)
    this.registerProperty(PropertyGroupName.special, '二维码外边距', new Number_Property(), 4)
    this.registerProperty(PropertyGroupName.special, '二维码宽度', new Number_Property(), 0)
    this.registerProperty(PropertyGroupName.special, '比例因子', new Number_Property(), 4)
    this.registerProperty(PropertyGroupName.special, '内容颜色', new Color_Property(), '#000000')
    this.registerProperty(PropertyGroupName.special, '留白颜色', new Color_Property(), '#ffffff')
    this.initQrCode()
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }
  beforeDestroy() {
    this.$off('onPropertyChanged', this.onPropertyChangedInner)
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: EngineComponentBase): void {
    this.initQrCode()
  }

  private qrCodeValue: string = '123456789'
  get codeValue(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '内容')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()
      this.qrCodeValue = data

      return data
    } else {
      return '123456789'
    }
  }

  private qrCodeVersion: number = 0
  get codeVersion(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '版本')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      this.qrCodeVersion = data

      return data
    } else {
      return 0
    }
  }

  private qrCodeErrorCorrectionLevel: string = 'M'
  get codeErrorCorrectionLevel(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '纠错等级')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()
      this.qrCodeErrorCorrectionLevel = data

      return data
    } else {
      return 'M'
    }
  }

  private qrCodeMaskPattern: number = -1
  get codeMaskPattern(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '遮罩符号')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      this.qrCodeMaskPattern = data

      return data
    } else {
      return -1
    }
  }

  private qrCodeMargin: number = 4
  get codeMargin(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '二维码外边距')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      this.qrCodeMargin = data

      return data
    } else {
      return 4
    }
  }

  private qrCodeWidth: number = 0
  get codeWidth(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '二维码宽度')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      this.qrCodeWidth = data

      return data
    } else {
      return 0
    }
  }

  private qrCodeScale: number = 0
  get codeScale(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '比例因子')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      this.qrCodeScale = data

      return data
    } else {
      return 0
    }
  }

  private qrCodeDarkColor: string = '#000000'
  get codeDarkColor(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '内容颜色')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()
      this.qrCodeDarkColor = data

      return data
    } else {
      return '#000000'
    }
  }

  private qrCodeLightColor: string = '#ffffff'
  get codeLightColor(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '留白颜色')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value as string
      this.qrCodeLightColor = data

      return data
    } else {
      return '#ffffff'
    }
  }

  private initQrCode() {
    //window.console.log('initQrCode completed:***************')
    let options = {
      errorCorrectionLevel: this.qrCodeErrorCorrectionLevel,
      margin: this.qrCodeMargin,
      scale: this.qrCodeScale,
      color: {
        dark: this.qrCodeDarkColor,
        light: this.qrCodeLightColor
      }
    }
    if (this.qrCodeVersion) {
      options['version'] = this.qrCodeVersion
    }
    if (this.qrCodeWidth) {
      options['width'] = this.qrCodeWidth
    }
    if (this.qrCodeMaskPattern >= 0) {
      options['maskPattern'] = this.qrCodeMaskPattern
    }

    // let canvasObj = document.getElementById(this.qrCodeId)
    QRCode.toCanvas($(this.$el).find('#' + this.qrCodeId)[0], this.qrCodeValue, options, function(error) {
      if (error) {
        window.console.error(error)
      }
    })
  }
}
</script>