<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgb(61, 61, 61)"
    :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px', width: '200px' }" style="display: flex; min-width: 200px">
      <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }">
        <!-- <img style="height: 100%; width: 100%" src="../../assets/imges/designerMainLogo.png" /> -->
      </div>
      <div class="verticalAlignCenter"
        style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">
        看板
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" class="verticalAlignCenter">
      <div :style="{ width:'60px'}" class="iconitem themeHover" @click="savePage">
        <div class="flexHorilanLayout">
          <span class="icon iconfont">&#xe616;</span>
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">保存</div>
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" class="verticalAlignCenter">
      <div :style="{ width:'60px'}" class="iconitem themeHover" @click="leadinPlugin">
        <div class="flexHorilanLayout">
          <span class="icon iconfont">&#xe616;</span>
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">导入插件</div>
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="right: 8px; position: absolute" class="verticalAlignCenter">
      <el-tooltip placement="bottom" overlayClassName="nptooltip" style="background: transparent"
        :overlayStyle="{ maxWidth: '20000px', background: 'rgba(255,255,255,1)', backgroundColor: 'rgba(255,255,255,1)' }">
        <div slot="content" style="width: 467px; height: 357px; background-color: #ffffff; background: #ffffff">
          <componentListControl :sys_limitGroupNames="[]" :sys_limitCompCodes="[]" style="width: 100%; height: 100%" />
        </div>
        <div :style="{ width: '100px' }" class="iconitem themeHover">
          <div class="flexHorilanLayout">
          </div>
          <div class="flexHorilanLayout verticalAlignCenter">系统组件</div>
        </div>
      </el-tooltip>
      <!-- *************************************************************************** -->
      <div :style="{ width:  '120px' }" class="iconitem themeHover">
        <div class="flexHorilanLayout">
          <el-input-number v-model="pageScale" controls-position="right" label="描述文字" size="mini" :min="0.01" :step="0.01" :max="1000"
            :precision="2" />
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">缩放窗口</div>
      </div>
      <!-- *************************************************************************** -->
      <div :style="{ width: '60px' }" class="iconitem themeHover" @click="onPrint">
        <div class="flexHorilanLayout">
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">打印</div>
      </div>
      <!-- *************************************************************************** -->
      <div :style="{ width: '60px' }" class="iconitem themeHover" @click="onPreView">
        <div class="flexHorilanLayout">
          <span class="icon iconfont">&#xe61e;</span>
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">预览</div>
      </div>
      <!-- *************************************************************************** -->
      <div :style="{ width: '80px' }" class="iconitem themeHover" @click="onQuit">
        <div class="flexHorilanLayout">
          <span class="icon iconfont">&#xe61b;</span>
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">退出设计</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout, LayoutInfo } from '@src/designEngine'
import componentListControl from './ComponentListControl.vue'

@Options({
  components: {
    componentListControl
  }
})
export default class quickActionBar extends Vue {
  @Prop() private height: number
  /**当前的布局页面属性，外部通过绑定传递进来 */
  @Prop() public currentPage: EnginePage

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
  private getPopupContainer() {
    this.$nextTick(() => {
      $(this.$el).find('.ant-tooltip-inner').css('padding', '0px')
    })
    return this.$refs.miandiv
  }
  //************导入插件********************************************************
  private leadinPlugin() {}
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
  private async onQuit() {
    this.$router.back()
  }
  /*************对外公布事件************************************************************************ */
  @Emit('onSave')
  private onSave(pageId: string) {}

  @Emit('onSaveAs')
  private onSaveAs() {}

  @Emit('onLeadIn')
  private onLeadIn() {}

  @Emit('onLeadOut')
  private onLeadOut() {}

  @Emit('onRevert')
  private onRevert() {}

  @Emit('onPrint')
  public onPrint() {}
}
</script>

<style lang="less" scoped>
.iconitem {
  padding: 8px 0px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  color: white;
}
.iconitem .iconfont {
  font-size: 26px;
}
</style>
