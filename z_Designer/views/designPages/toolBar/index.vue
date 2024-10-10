<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgb(61, 61, 61)" :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px' }" style="display: flex; min-width: 200px">
      <!-- <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }" /> -->
      <div class="verticalAlignCenter" style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">{{ application ? application.name : '' }}</div>
    </div>
    <!-- *************************************************************************** -->
    <optionBtn v-if="currentPage" :style="{ height: height + 'px' }" :tooltiptext="'Crtl+S'" :label="'Save' + (needSave ? '*' : '')" :icon="saveIcon" @click="savePage" />

    <optionBtn v-if="currentPage && currentPage.canToPreStack" :style="{ height: height + 'px' }" :tooltiptext="'Crtl+Z'" :icon="chexiaoIcon" :label="'前一步'" @mouseup="topre" />
    <optionBtn v-if="currentPage && currentPage.canToNextStack" :style="{ height: height + 'px' }" :tooltiptext="'Crtl+Y'" :icon="fanchexiaoIcon" :label="'后一步'" @mouseup="tonext" />

    <optionBtn :style="{ height: height + 'px', width: '80px' }" style="margin-left: 15px" :icon="previewIcon" label="Preview" @mouseup="onPreView" />

    <el-tooltip placement="bottom" effect="light" overlayClassName="nptooltip" style="background: transparen" :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
      <template #content>
        <div style="width: 467px; height: 357px; background-color: #ffffff; background: #ffffff">
          <componentListControl :sys_limitGroupNames="[]" :sys_limitCompCodes="[]" style="width: 100%; height: 100%" />
        </div>
      </template>
      <optionBtn :style="{ height: height + 'px' }" style="margin-left: 30px; width: 80px" :icon="componentsIcon" label="Components" />
    </el-tooltip>

    <optionBtn v-if="currentPage" :style="{ height: height + 'px', width: '80px' }" style="margin-left: 15px" :icon="behaviorIcon" label="Behaviors" @click="onSettingBehavior" />
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="right: 8px; position: absolute" class="verticalAlignCenter">
      <!-- *************************************************************************** -->
      <div :style="{ width: '150px' }" style="margin-right: 15px" class="iconitem themeHover">
        <div class="flexHorilanLayout" style="width: 100%; height: 50%">
          <el-input-number v-model="pageScale" style="width: 100%" controls-position="right" size="small" :min="0.01" :step="0.01" :max="1000" :precision="2" />
        </div>
        <div class="flexHorilanLayout verticalAlignCenter" style="color: white; width: 100%; height: 50%">Zoom Tool</div>
      </div>
      <!-- *************************************************************************** -->
      <optionBtn :style="{ height: height + 'px', width: '80px' }" :icon="quitIcon" label="Exit" @click="onQuit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import componentListControl from './ComponentListControl.vue'
import optionBtn from './optionBtn.vue'

import { saveIcon, componentsIcon, quitIcon, previewIcon, behaviorIcon, chexiaoIcon, fanchexiaoIcon } from '@/assets/designIcons'
import { ApplicationDC } from '@common/apis/designApplication'

@Options({
  components: {
    componentListControl,
    optionBtn
  }
})
export default class quickActionBar extends Vue {
  private saveIcon: any = saveIcon
  private componentsIcon: any = componentsIcon
  private quitIcon: any = quitIcon
  private previewIcon: any = previewIcon
  private behaviorIcon: any = behaviorIcon
  private chexiaoIcon: any = chexiaoIcon
  private fanchexiaoIcon: any = fanchexiaoIcon

  @Prop() private height: number
  /**当前的布局页面属性，外部通过绑定传递进来 */
  @Prop() public currentPage: EnginePage

  @Prop({
    default: () => {
      return false
    }
  })
  public needSave: boolean

  @Prop()
  public application: ApplicationDC

  private get pageScale(): number {
    if (!this.currentPage) {
      return 1
    }
    return this.currentPage.currentScaleSize
  }
  private set pageScale(val: number) {
    if (!this.currentPage) {
      return
    }
    var valchange = val - this.currentPage.currentScaleSize
    this.currentPage.scaleSize(valchange)
  }

  created() {}
  public savePage() {
    window.console.log('savePage:', this.currentPage)
    if (!this.currentPage) {
      return
    }
    this.onSave(this.currentPage.Id)
  }

  public topre() {
    console.log('topre')
    this.currentPage.toPreStack()
  }

  public tonext() {
    this.currentPage.toNextStack()
  }

  private getPopupContainer() {
    this.$nextTick(() => {
      $(this.$el).find('.ant-tooltip-inner').css('padding', '0px')
    })
    return this.$refs.miandiv
  }
  //************导入插件********************************************************
  private leadinPlugin() {}

  /*************定制化控制项************************************************************************ */
  private async onQuit() {
    this.$router.push('/designApplications')
  }
  /*************对外公布事件************************************************************************ */
  @Emit('onSave')
  private onSave(pageId: string) {}

  @Emit('onLeadIn')
  private onLeadIn() {}

  @Emit('onLeadOut')
  private onLeadOut() {}

  @Emit('onRevert')
  private onRevert() {}

  @Emit('onPreView')
  private onPreView() {}

  @Emit('onSettingBehavior')
  private onSettingBehavior() {}
}
</script>

<style lang="less" scoped>
.iconitem {
  padding: 4px 4px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  color: white;
}
</style>
