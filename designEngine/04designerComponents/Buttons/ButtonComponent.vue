<template>
  <el-button @click="onClick" :style="{'background-color':background,'color':foreground}" style="width:100%;height:100%;display:block">
    <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:100%">
      {{btnText}}
    </div>
  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr, DPropAttr } from '@designEngine/03designerLayoutBase'
import { PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@designEngine/03designerLayoutBase'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '普通按钮', 'ButtonComponent1', null)
@Options({})
export default class ButtonComponent extends EngineComponent {
  @DPropAttr(new Text_Setting('按钮文本', PropertyGroupName.special, true))
  private btnText: any = '新增按钮'

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
.icon {
  width: 2em;
  height: 2em;
}
.iconCss {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: auto;
}
</style>

