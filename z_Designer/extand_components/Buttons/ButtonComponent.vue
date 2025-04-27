<template>
  <el-button @click.stop="onClick" type="primary" :style="{ 'background-color': background, color: foreground, 'border-color': borderColor }"
    style="width: 100%; height: 100%">
    <template #icon>
      <img v-if="btnIconUrl" style="height: 100%" :src="btnIconUrl" />
    </template>
    <div class="verticalAlignCenter flexHorilanLayout" :style="{ height: 'calc(' + height + ' - 12px)' }">
      {{ btnText }}
    </div>
  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'

import { PropertyGroupName, UploadFile_Setting, Text_Setting, Color_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { DEventAttr } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { DPropAttr } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import platform from '@design-any/interface/dist/enums/platform'
import { getLocale } from '@common/baseConfigs'
import { deepClone } from '@common/utils'

@DCompnentAttr(
  platform.universal,
  getLocale().t('tip.basic'),
  getLocale().t('tip.classicButton'),
  'ButtonComponent_001',
  require('../compIcons/按钮.png')
)
@Options({
  components: {}
})
export default class ButtonComponent extends EngineComponent {
  @DPropAttr(new Text_Setting(getLocale().t('tip.buttonText'), PropertyGroupName.data, true))
  private btnText: any = 'New Button'

  @DPropAttr(new Color_Setting(getLocale().t('tip.borderColor'), PropertyGroupName.style, true))
  private borderColor: any = '#cdcdcd'

  @DPropAttr(new UploadFile_Setting(getLocale().t('tip.buttonIcon'), PropertyGroupName.style, true, null, 1, 'image'))
  private btnIcon: any[] = []

  private get btnIconUrl() {
    if (!this.btnIcon || this.btnIcon.length < 1) {
      return ''
    }
    return this.applicationContext.getFileApiAddr(this.btnIcon[0].uid)
  }

  mounted() {
    this.width = '10%'
    this.height = '4%'
    console.log('*******', deepClone(this.properties))
    this.findPropertyInfo((o) => o.background_img).canSetting = false
  }

  private onClick(e) {
    e.stopPropagation()
    this.onClickEvent()
  }

  @DEventAttr({ eventName: getLocale().t('tip.onClick'), description: '', inParams: [], hasOutParam: false })
  private onClickEvent() {}
}
</script>

<style lang="less" scoped>
.el-button {
  padding: 6px;
  /deep/.el-icon {
    height: 100% !important;
    width: auto !important;
  }
}
</style>
