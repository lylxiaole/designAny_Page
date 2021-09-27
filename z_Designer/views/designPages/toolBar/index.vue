<template>
  <div ref="miandiv" class="verticalAlignCenter" style="position: relative; background: rgba(9, 87, 106, 1)"
    :style="{ height: height + 'px', width: '100%' }">
    <div :style="{ height: height + 'px', width: '200px' }" style="display: flex; min-width: 200px">
      <div style="padding: 9px; line-height: 0px" class="themeBackground" :style="{ height: height + 'px', width: height + 'px', left: '0px' }">
        <!-- <img style="height: 100%; width: 100%" src="../../assets/imges/designerMainLogo.png" /> -->
      </div>
      <div class="verticalAlignCenter"
        style="color: #fff; font-size: 20px; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; margin-left: 8px">
        LYL设计
      </div>
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="left: 21%" class="verticalAlignCenter">
      <!-- *************************************************************************** -->
      <div :style="{ width:'60px'}" class="iconitem themeHover" @click="savePage">
        <div class="flexHorilanLayout">
          <span class="icon iconfont">&#xe616;</span>
        </div>
        <div class="flexHorilanLayout verticalAlignCenter">保存</div>
      </div>
      <!-- *************************************************************************** -->
    </div>
    <!-- *************************************************************************** -->
    <div :style="{ height: height + 'px' }" style="right: 8px; position: absolute" class="verticalAlignCenter">
      <div :style="{ width:  '200px' }" class="iconitem themeHover">
        <div class="flexHorilanLayout">
          <el-input-number v-model="pageScale" label="描述文字" :min="0.01" :step="0.01" :max="1000" :precision="2" />
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
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EnginePageBase, EngineComponentBase, LayoutBase, LayoutInfo } from '@src/designEngine/03designerLayoutBase'
import ComponentListControl from './ComponentListControl.vue'

@Component({
  components: {
    ComponentListControl
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
  private getPopupContainer() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-tooltip-inner')
        .css('padding', '0px')
    })
    return this.$refs.miandiv
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
  /*************对外公布事件************************************************************************ */
  @Emit('onSaveAs')
  private onSaveAs() {}

  @Emit('onLeadIn')
  private onLeadIn() {}

  @Emit('onLeadOut')
  private onLeadOut() {}

  @Emit('onRevert')
  private onRevert() {}

  @Emit('onQuit')
  private onQuit() {}

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
