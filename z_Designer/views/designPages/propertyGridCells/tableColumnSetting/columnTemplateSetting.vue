<template>
  <el-dialog ref="previewPopup" class="columnTemplateSettingDialog" style="height: 100%" width="100%" top="0px" v-model="windowVisible" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
    <el-row style="height: 100%; width: 100%; display: block; position: relative; display: block"></el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ApplicationDC, GetApplication } from '@common/apis/designApplication'

import { findPageByPaltform } from '@design-any/interface/dist/LayoutAttr/PageInfo'

import { EnginePage, SaveInfo } from '@design-any/interface/dist/LayoutInterface'
import * as utils from '@design-any/interface/dist/utils'

import { MobilePagePreview, PCPagePreview } from '@designEngine/index'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import paltform from '@design-any/interface/dist/enums/paltform'
import applicationContext from '@designEngine/01designerContext/context'

import { DesignPageDC, GetApplicationPages, GetPageDetail, pageType, SavePageDetail } from '@common/apis/designPage'

import behaviorList from '@behaviorEngine/behaviorDebugger/behaviorList.vue'
import flowDebugger from '@behaviorEngine/behaviorDebugger/flowDebugger.vue'
import behaviorSetting from '@behaviorEngine/behaviorList/behaviorSetting.vue'

import { action, actionDetail, behavior, paramType, param } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { deepClone } from '@common/utils'

@Options({
  components: {}
})
export default class columnTemplateSetting extends PageBase {
  private windowVisible: boolean = false
  private onClose() {
    this.windowVisible = false
  }
}
</script>

<style lang="less">
.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}
</style>
