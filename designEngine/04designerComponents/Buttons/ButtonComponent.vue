<template>
  <el-button @click="onClick" type="primary" :style="{'background-color':background,'color':foreground}" style="width:100%;height:100%;display:block">
    <el-row>
      <el-col :style="{'width':height,'height':'100%'}">
        <img v-if="btnIconUrl" style="height:100%;" :src="btnIconUrl" />
      </el-col>
      <el-col :style="{'width':'calc(100% - '+height+')'}">
        <span class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:100%">
          {{btnText}}
        </span>
      </el-col>
    </el-row>
  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr, DPropAttr } from '@designEngine/03designerLayoutBase'
import { PropertyGroupName, UploadFile_Setting, Text_Setting } from '@designEngine/03designerLayoutBase'

import * as elemenpComps from 'element-plus'
console.log('xxxxx:', elemenpComps)

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '普通按钮', 'ButtonComponent1', null)
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
    this.width = 80
    this.height = 34
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.registerEvents('点击', '', [], null)
  }

  private onClick(e) {
    this.triggerEvent('点击', null)
  }
}
</script>

<style scoped>
</style>

