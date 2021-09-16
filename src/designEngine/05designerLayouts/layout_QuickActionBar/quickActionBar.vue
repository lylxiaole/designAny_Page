<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgba(9, 87, 106, 1)" :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px', width: '200px' }" style="display: flex; min-width: 200px">
      <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }">
        <img style="height: 100%; width: 100%" src="../../assets/imges/designerMainLogo.png" />
      </div>
      <div class="verticalAlignCenter" style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">
        {{ title }}
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="left: 20%; border-right: 1px solid rgba(233, 236, 240, 0.5); padding-right: 20px" class="verticalAlignCenter">
      <a-tooltip v-if="pageResourcesVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip" style="background: transparent" :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 457px; background-color: #ffffff; background: #ffffff">
          <geno-allPageListControl style="width: 100%; height: 100%" @onOpenCommonPage="onOpenCommonPageNew" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="pageResource" />
          <div class="verticalAlignCenter">页面资源</div>
        </div>
      </a-tooltip>
      <a-tooltip v-if="systemControlsVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip" style="background: transparent" :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 357px; background-color: #ffffff; background: #ffffff">
          <geno-componentListControl :sys_limitGroupNames="sys_limitGroupNames" :sys_limitCompCodes="sys_limitCompCodes" ref="systemComps" style="width: 100%; height: 100%" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="systemCompIcon" />
          <div class="verticalAlignCenter">系统组件</div>
        </div>
      </a-tooltip>
      <!-- *************************************************************************** -->
      <a-tooltip v-if="compComponentsVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip" style="background: transparent" :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 357px; background-color: rgba(255, 255, 255, 1); background: rgba(255, 255, 255, 1)">
          <geno-componentTemplateControl style="width: 100%; height: 100%" @onOpenPage="onOpenComppnentPage" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="componentTempIcon" />
          <div class="verticalAlignCenter">组件模板</div>
        </div>
      </a-tooltip>
      <!-- *************************************************************************** -->
      <a-tooltip v-if="modelComponentsVisible" ref="compref1" placement="bottom" :getPopupContainer="getPopupContainer" overlayClassName="nptooltip" style="background: transparent" :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="title" style="width: 467px; height: 357px; background-color: rgba(255, 255, 255, 1); background: rgba(255, 255, 255, 1)">
          <geno-modelcontrol style="width: 100%; height: 100%" @onAddModel="addModel" @onDblClick="onDblClick" />
        </div>
        <div :style="{ width: height + 'px' }" class="flexItem themeHover">
          <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="componentModelIcon" />
          <div class="verticalAlignCenter">模型组件</div>
        </div>
      </a-tooltip>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="left: 21%" class="verticalAlignCenter">
      <!-- <div :style="{width:height+'px'}" class="flexItem themeHover">
        <div class="iconitem flexHorilanLayout"><span class="icon iconfont">&#xe617;</span></div>
        <div class="verticalAlignCenter">撤销</div>
      </div> -->
      <!-- *************************************************************************** -->
      <!-- <div :style="{width:height+'px'}" class="flexItem themeHover">
        <div class="iconitem flexHorilanLayout"><span class="icon iconfont">&#xe61d;</span></div>
        <div class="verticalAlignCenter">前进</div>
      </div> -->
      <!-- *************************************************************************** -->
      <div :style="{ width: height + 'px' }" @click="savePage" class="flexItem themeHover" v-if="saveBtnVisible && ((CurrentPage && CurrentPage.checkoutInfo.checkoutStatus == 2) || (CurrentPage && CurrentPage.IsComponentTemplate == true))">
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="saveIcon" />
        <div class="verticalAlignCenter">保存</div>
      </div>
      <!-- *************************************************************************** -->
      <div v-if="saveAndCloseBtnVisible" :style="{ width: height + 20 + 'px' }" @click="savePageAndClose" class="flexItem themeHover">
        <div class="iconitem flexHorilanLayout"><span class="icon iconfont">&#xe616;</span></div>
        <div class="verticalAlignCenter">保存并关闭</div>
      </div>
      <!-- *************************************************************************** -->
      <!-- <div v-if="saveAsBtnVisible" :style="{width:height+'px'}" class="flexItem themeHover" @click="()=>{this.onSaveAs()}">
        <a-icon style="margin-top: 4px;margin-bottom: 2px;font-size: 23px;height: 57%;width: 100%;" :component="saveAsIcon" />
        <div class="verticalAlignCenter">另存为</div>
      </div> -->
      <!-- *************************************************************************** -->
      <!-- <div v-if="leadInBtnVisible" :style="{width:height+'px'}" class="flexItem themeHover" @click="()=>{this.onLeadOut()}">
        <div class="iconitem flexHorilanLayout"><span class="icon iconfont">&#xe619;</span></div>
        <div class="verticalAlignCenter">导入文件</div>
      </div>
       <div v-if="leadOutBtnVisible" :style="{width:height+'px'}" class="flexItem themeHover" @click="()=>{this.onLeadOut()}">
        <div class="iconitem flexHorilanLayout"><span class="icon iconfont">&#xe618;</span></div>
        <div class="verticalAlignCenter">导出文件</div>
      </div> -->
      <div
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.onCheckOut();
          }
        "
        v-if="CurrentPage && CurrentPage.checkoutInfo.checkoutStatus == 0"
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="checkoutIcon" />
        <div class="verticalAlignCenter">签出</div>
      </div>
      <div
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.preCheckIn();
          }
        "
        v-if="CurrentPage && CurrentPage.checkoutInfo.checkoutStatus == 2"
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="checkinIcon" />
        <div class="verticalAlignCenter">签入</div>
        <InputDescModal ref="InputDescPopup" @onSuccess="onGetDescStr"></InputDescModal>
      </div>
      <div
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.onCancelCheckOut();
          }
        "
        v-if="CurrentPage && CurrentPage.checkoutInfo.checkoutStatus == 2"
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="revertIcon" />
        <div class="verticalAlignCenter">撤销</div>
      </div>
      <div
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.showPageHistory();
          }
        "
        v-if="CurrentPage"
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="historyIcon" />
        <div class="verticalAlignCenter">历史</div>
        <PageHistory @onSelectHistory="viewHistroy" ref="historyPopup"></PageHistory>
      </div>
      <div
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.showPageHistory_Restore();
          }
        "
        v-if="CurrentPage && CurrentPage.checkoutInfo.checkoutStatus == 2"
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="restoreIcon" />
        <div class="verticalAlignCenter">回滚</div>
        <PageHistory @onSelectHistory="restoreHistroy" ref="historyRestorePopup"></PageHistory>
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
      <div
        v-if="previewBtnVisible"
        :style="{ width: height + 'px' }"
        class="flexItem themeHover"
        @click="
          () => {
            this.onPreView();
          }
        "
      >
        <a-icon style="margin-top: 4px; margin-bottom: 2px; font-size: 23px; height: 57%; width: 100%" :component="previewIcon" />
        <div class="verticalAlignCenter">预览</div>
        <a-modal ref="previewPopup" :title="null" width="100%" style="top: 0; bottom: 0; height: 100%; overflow-y: hidden" :bodyStyle="modalBodyStyle" wrapClassName="ant-modal-cust-warp" class="preview-modal" :visible="previewWindowVisible" :closable="false" :footer="null" destroyOnClose :zIndex="100">
          <PagePreview :v-if="previewWindowVisible" :pageId="CurrentPage ? CurrentPage.Id : null" style="height: 100%; width: 100%" @close="handleCancel"> </PagePreview>
        </a-modal>
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
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import PageBase from "../PageBase";
import PagePreview from "../page_Preview/PagePreview.vue";
import { pagenNodeType } from "../../01designerContext";
import ComponentListControl from "../../components/ComponentListControl.vue";
import Icon from "ant-design-vue/es/icon";
import PageHistory from "../../components/PageHistory.vue";
import InputDescModal from "../../components/InputDescModal.vue";

import {
  save,
  revert,
  leadoutFile,
  leadinFile,
  restore,
  reback_popup,
  save_as,
  componengModel,
  checkout,
  checkin,
  lock,
  quitLogin,
  unLock,
  fileGroup,
  systemComponent,
  pageResources,
  save_as_tab,
  lock_tab,
  unlock_tab,
  edit_rightMenu,
  revert_rightMenu,
  unfilegroup_rightMenu,
  save_as_rightMenu,
  checkout_rightMenu,
  checkin_rightMenu,
  delete_rightMenu,
  hide_rightMenu,
  rename_rightMenu,
  preview,
  redo,
  componentTemp,
  history,
} from "../../02common/icons.js";

@Component({
  components: {
    PagePreview,
    Icon,
    PageHistory,
    InputDescModal,
  },
})
export default class quickActionBar extends Vue {
  private systemCompIcon: any;
  private componentTempIcon: any;
  private componentModelIcon: any;
  private saveIcon: any;
  private saveAsIcon: any;

  private pageResource: any;
  private checkoutIcon: any;
  private checkinIcon: any;
  private revertIcon: any;
  private historyIcon: any;
  private restoreIcon: any;

  private previewIcon: any;
  private quitIcon: any;

  @Prop() private height: number;
  /**当前的布局页面属性，外部通过绑定传递进来 */
  @Prop() public CurrentPage: PageBase;

  private get pageScale(): number {
    if (!this.CurrentPage) {
      return 0;
    }
    return this.CurrentPage.currentScaleSize;
  }
  private set pageScale(val: number) {
    // window.console.log('aaaaaa')
    if (!this.CurrentPage) {
      return;
    }
    var valchange = val - this.CurrentPage.currentScaleSize;
    this.CurrentPage.scaleSize(valchange);
  }

  private get modalBodyStyle(): any {
    return {
      padding: "0",
      height: "100% !important",
    };
  }

  created() {
    this.systemCompIcon = systemComponent;
    this.componentTempIcon = componentTemp;
    this.componentModelIcon = componengModel;
    this.saveIcon = save;
    this.saveAsIcon = save_as;
    this.pageResource = pageResources;
    this.checkoutIcon = checkout;
    this.checkinIcon = checkin;
    this.revertIcon = revert;
    this.historyIcon = history;
    this.previewIcon = preview;
    this.quitIcon = quitLogin;
    this.restoreIcon = restore;
  }

  public savePage() {
    if (!this.CurrentPage) {
      return;
    }
    this.CurrentPage.Save();
  }

  public savePageAndClose() {}

  private getPopupContainer() {
    this.$nextTick(() => {
      $(this.$el).find(".ant-tooltip-inner").css("padding", "0px");
    });
    return this.$refs.miandiv;
  }
  private showPageHistory() {
    // window.console.log('showPageHistory')
    (this.$refs.historyPopup as any).show(this.CurrentPage.Id);
    (this.$refs.historyPopup as any).startViewHistory();
  }
  private showPageHistory_Restore() {
    (this.$refs.historyRestorePopup as any).show(this.CurrentPage.Id);
    (this.$refs.historyRestorePopup as any).startRostore();
  }

  private viewHistroy(histroyId: number) {
    this.onViewHistroy(histroyId);
  }
  private restoreHistroy(histroyId: number) {
    this.onRestoreHistroy(histroyId);
  }

  private preCheckIn() {
    (this.$refs.InputDescPopup as any).show();
  }

  private onGetDescStr(val: string) {
    this.onCheckIn(val);
  }
  /****************预览功能************************************************************* */
  private previewWindowVisible: boolean = false;
  private onPreviewOk() {
    this.previewWindowVisible = false;
  }
  private handleCancel() {
    this.previewWindowVisible = false;
  }
  private onPreView() {
    this.previewWindowVisible = true;
  }
  /**新增一个打开页面的方法 */
  onOpenComppnentPage(pageId: string, pageName: string, pageType: pagenNodeType) {
    this.onOpenComponentTemplate(pageId, pageName, pageType);
  }
  onOpenCommonPageNew(pageId: string, pageName: string, pageType: pagenNodeType) {
    this.onOpenCommonPage(pageId, pageName, pageType);
  }
  /*************定制化控制项************************************************************************ */
  public title: string = "二次开发平台";
  public pageResourcesVisible: boolean = true;
  public systemControlsVisible: boolean = true;
  public compComponentsVisible: boolean = true;
  public modelComponentsVisible: boolean = true;
  public saveBtnVisible: boolean = true;
  public saveAndCloseBtnVisible: boolean = false;
  public saveAsBtnVisible: boolean = true;
  public leadInBtnVisible: boolean = true;
  public leadOutBtnVisible: boolean = true;
  public printBtnVisible: boolean = false;
  public previewBtnVisible: boolean = true;
  public quitBtnVisible: boolean = true;
  ///////////////////////////////////////////
  private sys_limitGroupNames: string[] = [];
  private sys_limitCompCodes: string[] = [];
  public limitSysCompGroup(names: string[]) {
    if (!names) {
      this.sys_limitGroupNames = [];
    } else {
      this.sys_limitGroupNames = names;
    }
  }
  public limitSysComps(codes: string[]) {
    if (!codes) {
      this.sys_limitCompCodes = [];
    } else {
      this.sys_limitCompCodes = codes;
    }
  }
  /*************对外公布事件************************************************************************ */
  @Emit("onSaveAs")
  private onSaveAs() {}

  @Emit("onLeadIn")
  private onLeadIn() {}

  @Emit("onLeadOut")
  private onLeadOut() {}

  @Emit("onRevert")
  private onRevert() {}

  @Emit("onGo")
  private onGo() {}

  @Emit("onQuit")
  private onQuit() {}

  @Emit("onOpenComponentTemplate")
  public onOpenComponentTemplate(pageId: string, pageName: string, pageType: pagenNodeType) {}

  @Emit("onAddModel")
  private addModel() {
    //window.console.info('进入模型新增')
  }
  @Emit("onDblClick")
  private onDblClick(record) {
    //window.console.info('编辑模型', record)
  }
  @Emit("onOpenCommonPage")
  public onOpenCommonPage(pageId: string, pageName: string, pageType: pagenNodeType) {}

  @Emit("onPrint")
  public onPrint() {}

  @Emit("onCheckOut")
  public onCheckOut() {}
  @Emit("onCancelCheckOut")
  public onCancelCheckOut() {}
  @Emit("onCheckIn")
  public onCheckIn(desc: string) {}

  @Emit("onViewHistroy")
  public onViewHistroy(histroyId: number) {}
  @Emit("onRestoreHistroy")
  public onRestoreHistroy(histroyId: number) {}
}
</script>

<style lang="less" scoped>
@import (less) "../../02common/iconfont1/iconfont.css";

.verticalAlignCenter {
  display: flex;
  position: relative;
  flex-wrap: nowrap;
  /* justify-content: center; */
  align-items: center;
}

.flexItem {
  height: 100%;
  line-height: 0;
  padding: 8px 0px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.flexItem .verticalAlignCenter {
  height: 30%;
  width: 100%;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  justify-content: center;
}

.flexItem .iconitem {
  height: 70%;
  width: 100%;
  color: white;
}

.flexItem .iconitem .iconfont {
  font-size: 26px;
}

.ant-modal {
  top: 0px;
}

.preview-modal {
  line-height: 1.5;
}

.ant-modal .ant-modal-content .ant-modal-body {
  // padding: 0px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
</style>
