<template>
  <el-button @click="onClick" type="primary" :style="{'background-color':background,'color':foreground}" style="width:100%;height:100%;"
    class="verticalAlignCenter ">
    <template #icon>
      <img v-if="btnIconUrl" style="height:100%;" :src="btnIconUrl" />
    </template>
    <div class="verticalAlignCenter flexHorilanLayout" :style="{'height':'calc('+height+' - 12px)'}">
      {{btnText}}
    </div>
  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr, DPropAttr } from '@design-any/interface/dist/index'
import { PropertyGroupName, UploadFile_Setting, Text_Setting } from '@design-any/interface/dist/index'
import { DEventAttr } from '@design-any/interface/dist/index'

import * as elemenpComps from 'element-plus'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '普通按钮', 'ButtonComponent_001', null)
@Options({
  components: {
    ...(elemenpComps as any)
  }
})
export default class ButtonComponent extends EngineComponent {
  @DPropAttr(new Text_Setting('按钮文本', PropertyGroupName.special, true))
  private btnText: any = '新增按钮'

  @DPropAttr(new UploadFile_Setting('按钮图标', PropertyGroupName.special, true, null, 1, 'image'))
  private btnIcon: any[] = []
  private get btnIconUrl() {
    if (!this.btnIcon || this.btnIcon.length < 1) {
      return ''
    }

    return this.designerContext.getFileApiAddr(this.btnIcon[0].uid)
  }

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
  }

  private onClick(e) {
    e.stopPropagation()
    this.onClickEvent()
  }

  @DEventAttr({ eventName: '点击', description: '', inParams: [], hasOutParam: false })
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

