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
  Property,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting,
  Color_Setting
} from '@designEngine/03designerLayoutBase'

import { getUuid, deepClone } from '@common/utils'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '二维码组件', 'NPQrCode', null)
@Options({})
export default class NPQrCode extends EngineComponent {
  private qrCodeId: string = 'qrcode'

  beforeMount() {
    this.qrCodeId = 'qrcode_' + getUuid()
  }

  mounted() {
    this.width = '300px'
    this.height = '300px'

    // this.registerProperty(PropertyGroupName.special, '内容', new Text_Setting(), '123456789')
    // this.registerProperty(PropertyGroupName.special, '版本', new Number_Setting(0, 40, 1), 0)
    // this.registerProperty(PropertyGroupName.special, '纠错等级', new Enum_Setting(true, ['L', 'M', 'Q', 'H']), 'M')
    // this.registerProperty(PropertyGroupName.special, '遮罩符号', new Number_Setting(-1, 7, 1), -1)
    // this.registerProperty(PropertyGroupName.special, '二维码外边距', new Number_Setting(), 4)
    // this.registerProperty(PropertyGroupName.special, '二维码宽度', new Number_Setting(), 0)
    // this.registerProperty(PropertyGroupName.special, '比例因子', new Number_Setting(), 4)
    // this.registerProperty(PropertyGroupName.special, '内容颜色', new Color_Setting(), '#000000')
    // this.registerProperty(PropertyGroupName.special, '留白颜色', new Color_Setting(), '#ffffff')
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false
    this.initQrCode()
  }
  beforeUnmount() {}

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: EngineComponent): void {
    this.initQrCode()
  }

  get codeValue(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '内容')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()

      return data
    } else {
      return '123456789'
    }
  }

  get codeVersion(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '版本')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)
      return data
    } else {
      return 0
    }
  }

  get codeErrorCorrectionLevel(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '纠错等级')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()

      return data
    } else {
      return 'M'
    }
  }

  get codeMaskPattern(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '遮罩符号')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)

      return data
    } else {
      return -1
    }
  }

  get codeMargin(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '二维码外边距')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)

      return data
    } else {
      return 4
    }
  }

  get codeWidth(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '二维码宽度')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)

      return data
    } else {
      return 0
    }
  }

  get codeScale(): number {
    const prop = this.findPropertyByName(PropertyGroupName.special, '比例因子')
    if (prop && prop.value != undefined && prop.value != null) {
      const data: number = Number(prop.value)

      return data
    } else {
      return 0
    }
  }

  get codeDarkColor(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '内容颜色')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value.toString()

      return data
    } else {
      return '#000000'
    }
  }

  get codeLightColor(): string {
    const prop = this.findPropertyByName(PropertyGroupName.special, '留白颜色')
    if (prop && prop.value != undefined && prop.value != null) {
      const data = prop.value as string

      return data
    } else {
      return '#ffffff'
    }
  }

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