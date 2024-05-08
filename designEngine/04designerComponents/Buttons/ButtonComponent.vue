<template>
  <el-button @click="onClick" :style="{'background-color':background,'color':foreground}" style="width:100%;height:100%;display:block">
    <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:100%">
      {{btnText}}
    </div>
  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import { Property, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@designEngine/03designerLayoutBase'
import designerContext from '@designEngine/01designerContext/context'

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '普通按钮', 'ButtonComponent1', null)
@Options({})
export default class ButtonComponent extends EngineComponent {
  get btnText(): string {
    var pro = this.findPropertyByName(PropertyGroupName.special, '按钮文本')
    if (!pro) {
      return ''
    }
    return pro.value
  }
  set btnText(val: string) {
    var pro = this.findPropertyByName(PropertyGroupName.special, '按钮文本')
    if (!pro) {
      return
    }
    pro.value = val
    this.setPropertyVal(pro.id, pro.value)
  }

  mounted() {
    this.width = 80
    this.height = 34
    //注册特有属性
    this.registerProperty(PropertyGroupName.special, '按钮文本', new Text_Setting(), '新增按钮')
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

