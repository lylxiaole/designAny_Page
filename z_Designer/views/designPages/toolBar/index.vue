<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgba(9, 87, 106, 1)"
    :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px', width: '200px' }" style="display: flex; min-width: 200px">
      <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }">
        <!-- <img style="height: 100%; width: 100%" src="../../assets/imges/designerMainLogo.png" /> -->
      </div>
      <div class="verticalAlignCenter"
        style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">
        {{ title }}
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="left: 20%; border-right: 1px solid rgba(233, 236, 240, 0.5); padding-right: 20px"
      class="verticalAlignCenter">
      <a-tooltip v-if="systemControlsVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip"
        style="background: transparent"
        :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 357px; background-color: #ffffff; background: #ffffff">
          <geno-componentListControl :sys_limitGroupNames="sys_limitGroupNames" :sys_limitCompCodes="sys_limitCompCodes" ref="systemComps"
            style="width: 100%; height: 100%" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="systemCompIcon" />
          <div class="verticalAlignCenter">系统组件</div>
        </div>
      </a-tooltip>
      <!-- *************************************************************************** -->
      <a-tooltip v-if="compComponentsVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip"
        style="background: transparent"
        :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 357px; background-color: rgba(255, 255, 255, 1); background: rgba(255, 255, 255, 1)">
          <geno-componentTemplateControl style="width: 100%; height: 100%" @onOpenPage="onOpenComppnentPage" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="componentTempIcon" />
          <div class="verticalAlignCenter">组件模板</div>
        </div>
      </a-tooltip>
      <!-- *************************************************************************** -->
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="left: 21%" class="verticalAlignCenter">
      <!-- *************************************************************************** -->
      <div :style="{ width: height + 'px' }" @click="savePage" class="flexItem themeHover"
        v-if="saveBtnVisible && ((currentPage && currentPage.checkoutInfo.checkoutStatus == 2) || (currentPage && currentPage.IsComponentTemplate == true))">
        <div class="iconitem flexHorilanLayout">
          <span class="icon iconfont">&#xe616;</span>
        </div>
        <div class="verticalAlignCenter">保存</div>
      </div>
      <!-- *************************************************************************** -->
      <div v-if="saveAndCloseBtnVisible" :style="{ width: height + 20 + 'px' }" @click="savePageAndClose" class="flexItem themeHover">
        <div class="iconitem flexHorilanLayout">
          <span class="icon iconfont">&#xe616;</span>
        </div>
        <div class="verticalAlignCenter">保存并关闭</div>
      </div>
      <!-- *************************************************************************** -->
      <div :style="{ width: height + 'px' }" class="flexItem themeHover" @click="this.onCancelCheckOut"
        v-if="currentPage && currentPage.checkoutInfo.checkoutStatus == 2">
        <div class="iconitem flexHorilanLayout">
          <span class="icon iconfont">&#xe617;</span>
        </div>
        <div class="verticalAlignCenter">撤销</div>
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="right: 8px; position: absolute" class="verticalAlignCenter">
      <div :style="{ width: height + 'px' }" class="flexItem">
        <div class="iconitem flexHorilanLayout">
          <a-input-number v-model="pageScale" size="small" :min="0.01" :step="0.01" :max="1000" :defaultValue="1" />
        </div>
        <div class="verticalAlignCenter">缩放窗口</div>
      </div>
      <!-- *************************************************************************** -->
      <div v-if="printBtnVisible" :style="{ width: height + 'px' }" @click="onPrint" class="flexItem themeHover">
        <div class="iconitem flexHorilanLayout">
          <a-icon class="icon iconfont" type="printer" />
        </div>
        <div class="verticalAlignCenter">打印</div>
      </div>
      <!-- *************************************************************************** -->
      <div v-if="previewBtnVisible" :style="{ width: height + 'px' }" class="flexItem themeHover" @click="onPreView">
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="previewIcon" />
        <div class="verticalAlignCenter">预览</div>

      </div>
      <!-- *************************************************************************** -->
      <div v-if="quitBtnVisible" :style="{ width: height + 'px' }" @click="onQuit" class="flexItem themeHover">
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="quitIcon" />
        <div class="verticalAlignCenter">退出设计</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePageBase, EngineComponentBase, LayoutBase, LayoutInfo } from '@src/designEngine/03designerLayoutBase'

import PagePreview from '../page_Preview/PagePreview.vue'
import ComponentListControl from '../../components/ComponentListControl.vue'
import Icon from 'ant-design-vue/es/icon'
import InputDescModal from '../../components/InputDescModal.vue'

@Component({
  components: {
    PagePreview,
    Icon,
    InputDescModal
  }
})
export default class quickActionBar extends Vue {
  @Prop() private height: number
  /**当前的布局页面属性，外部通过绑定传递进来 */
  @Prop() public currentPage: EnginePageBase

  private get pageScale(): number {
    if (!this.currentPage) {
      return 0
    }
    return this.currentPage.currentScaleSize
  }
  private set pageScale(val: number) {
    // window.console.log('aaaaaa')
    if (!this.currentPage) {
      return
    }
    var valchange = val - this.currentPage.currentScaleSize
    this.currentPage.scaleSize(valchange)
  }

  created() {}

  public savePage() {
    if (!this.currentPage) {
      return
    }
    this.currentPage.save()
  }

  public savePageAndClose() {}

  private getPopupContainer() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-tooltip-inner')
        .css('padding', '0px')
    })
    return this.$refs.miandiv
  }

  private preCheckIn() {
    ;(this.$refs.InputDescPopup as any).show()
  }

  private onGetDescStr(val: string) {
    this.onCheckIn(val)
  }
  /****************预览功能************************************************************* */
  private previewWindowVisible: boolean = false
  private onPreviewOk() {
    this.previewWindowVisible = false
  }
  private handleCancel() {
    this.previewWindowVisible = false
  }
  private onPreView() {
    this.previewWindowVisible = true
  }

  /*************定制化控制项************************************************************************ */
  public title: string = '二次开发平台'
  public pageResourcesVisible: boolean = true
  public systemControlsVisible: boolean = true
  public compComponentsVisible: boolean = true
  public modelComponentsVisible: boolean = true
  public saveBtnVisible: boolean = true
  public saveAndCloseBtnVisible: boolean = false
  public saveAsBtnVisible: boolean = true
  public leadInBtnVisible: boolean = true
  public leadOutBtnVisible: boolean = true
  public printBtnVisible: boolean = false
  public previewBtnVisible: boolean = true
  public quitBtnVisible: boolean = true
  ///////////////////////////////////////////
  private sys_limitGroupNames: string[] = []
  private sys_limitCompCodes: string[] = []
  public limitSysCompGroup(names: string[]) {
    if (!names) {
      this.sys_limitGroupNames = []
    } else {
      this.sys_limitGroupNames = names
    }
  }
  public limitSysComps(codes: string[]) {
    if (!codes) {
      this.sys_limitCompCodes = []
    } else {
      this.sys_limitCompCodes = codes
    }
  }
  /*************对外公布事件************************************************************************ */
  @Emit('onSaveAs')
  private onSaveAs() {}

  @Emit('onLeadIn')
  private onLeadIn() {}

  @Emit('onLeadOut')
  private onLeadOut() {}

  @Emit('onRevert')
  private onRevert() {}

  @Emit('onGo')
  private onGo() {}

  @Emit('onQuit')
  private onQuit() {}

  @Emit('onAddModel')
  private addModel() {
    //window.console.info('进入模型新增')
  }
  @Emit('onDblClick')
  private onDblClick(record) {
    //window.console.info('编辑模型', record)
  }

  @Emit('onPrint')
  public onPrint() {}

  @Emit('onCheckOut')
  public onCheckOut() {}
  @Emit('onCancelCheckOut')
  public onCancelCheckOut() {}
  @Emit('onCheckIn')
  public onCheckIn(desc: string) {}

  @Emit('onViewHistroy')
  public onViewHistroy(histroyId: number) {}
  @Emit('onRestoreHistroy')
  public onRestoreHistroy(histroyId: number) {}
}
</script>

<style lang="less" scoped>
</style>
