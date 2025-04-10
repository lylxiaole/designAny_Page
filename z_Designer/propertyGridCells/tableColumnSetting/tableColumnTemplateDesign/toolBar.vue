<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgb(61, 61, 61)"
    :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px' }" style="display: flex; min-width: 200px">
      <!-- <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }" /> -->
      <div class="verticalAlignCenter"
        style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">Column Design</div>
    </div>
    <!-- *************************************************************************** -->
    <optionBtn v-if="currentPage" :enable="currentPage.canToPreStack" :style="{ height: height + 'px' }" :tooltiptext="'Crtl+Z'"
      :enableIcon="chexiaoIcon" :disableIcon="chexiaodisableIcon" :label="'Undo'" @mouseup="topre" />
    <optionBtn v-if="currentPage" :enable="currentPage.canToNextStack" :style="{ height: height + 'px' }" :tooltiptext="'Crtl+Y'"
      :enableIcon="fanchexiaoIcon" :disableIcon="fanchexiaodisableIcon" :label="'Redo'" @mouseup="tonext" />
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="right: 8px; position: absolute" class="verticalAlignCenter">
      <el-tooltip placement="bottom" effect="light" popper-class="designtooltip" style="background: transparen"
        :overlayStyle="{ maxWidth: '20000px' }">
        <template #content>
          <div style="width: 467px; height: 357px; background: #e0e4ea; padding: 5px 11px">
            <componentListControl :platform="platform" style="width: 100%; height: 100%" />
          </div>
        </template>
        <optionBtn :style="{ height: height + 'px' }" style="margin-right: 30px; width: 80px" :enableIcon="componentsIcon" label="Components" />
      </el-tooltip>

      <el-tooltip placement="bottom" effect="light" popper-class="designtooltip" style="background: transparen" append-to="body"
        :overlayStyle="{ maxWidth: '20000px' }">
        <template #content>
          <div style="width: 467px; height: 357px; background: #e0e4ea; padding: 5px 11px">
            <behaviorList :currentPage="currentPage" @onDesignBehavior="onDesignBehavior" style="width: 100%; height: 100%" />
          </div>
        </template>
        <optionBtn v-if="currentPage" :style="{ height: height + 'px', width: '80px' }" style="margin-right: 30px" :enableIcon="behaviorIcon"
          label="Behaviors" />
      </el-tooltip>
      <!-- *************************************************************************** -->
      <div :style="{ width: '150px' }" style="margin-right: 15px" class="iconitem themeHover">
        <div class="flexHorilanLayout" style="width: 100%; height: 50%">
          <el-input-number v-model="pageScale" style="width: 100%" controls-position="right" size="small" :min="0.01" :step="0.01" :max="1000"
            :precision="2" />
        </div>
        <div class="flexHorilanLayout verticalAlignCenter" style="color: white; width: 100%; height: 50%">Zoom Tool</div>
      </div>
      <!-- *************************************************************************** -->
      <optionBtn v-if="currentPage" :style="{ height: height + 'px' }" label="Save" :enableIcon="saveIcon" @click.stop="onSave" />
      <optionBtn :style="{ height: height + 'px', width: '50px' }" :enableIcon="quitIcon" label="Cancel" @click.stop="onCancel" />
    </div>
    <behaviorDesigner ref="behaviorDesigner" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout } from '@design-any/interface/dist/LayoutInterface'
import componentListControl from '@/commonTool/componentListControl.vue'
import optionBtn from '@/commonTool/optionBtn.vue'
import {
  saveIcon,
  componentsIcon,
  quitIcon,
  previewIcon,
  behaviorIcon,
  chexiaoIcon,
  fanchexiaoIcon,
  fanchexiaodisableIcon,
  chexiaodisableIcon
} from '@/assets/designIcons'
import { ApplicationDC, applicationType } from '@common/apis/designApplication'
import platform from '@design-any/interface/dist/enums/platform'
import behaviorList from '@/commonTool/behaviorList.vue'
import behaviorDesigner from '@behaviorEngine/behaviorDesigner/behaviorDesigner.vue'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: {
    componentListControl,
    optionBtn,
    behaviorList,
    behaviorDesigner
  }
})
export default class toolBar extends Vue {
  private saveIcon: any = saveIcon
  private componentsIcon: any = componentsIcon
  private quitIcon: any = quitIcon
  private previewIcon: any = previewIcon
  private behaviorIcon: any = behaviorIcon
  private chexiaoIcon: any = chexiaoIcon
  private fanchexiaoIcon: any = fanchexiaoIcon
  private fanchexiaodisableIcon: any = fanchexiaodisableIcon
  private chexiaodisableIcon: any = chexiaodisableIcon

  @Prop() private height: number
  /**当前的布局页面属性，外部通过绑定传递进来 */
  @Prop() public currentPage: EnginePage

  @Prop({
    default: () => {
      return false
    }
  })
  public needSave: boolean

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
  private get platform(): platform {
    if (!this.currentPage) {
      return
    }
    return this.currentPage.platform
  }

  created() {}

  public topre() {
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

  private onDesignBehavior(behav: behavior) {
    ;(this.$refs.behaviorDesigner as behaviorDesigner).show(behav, this.currentPage, this.platform)
  }
  /*************定制化控制项**************************************************** */
  @Emit('onSave')
  private onSave() {}
  @Emit('onCancel')
  private onCancel() {}
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
