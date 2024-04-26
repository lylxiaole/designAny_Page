<template>
  <el-button @click="onClick">
    <el-icon class="el-icon--right">
      <Upload />
    </el-icon>
    Upload

  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import {
  Property,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting,
  Button_Setting
} from '@designEngine/03designerLayoutBase'
import designerContext from '@designEngine/01designerContext/context'

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '普通按钮', 'ButtonComponent1', null)
@Options({})
export default class ButtonComponent extends EngineComponent {
  created() {}

  mounted() {
    this.width = 80
    this.height = 34
    //注册特有属性
    this.registerProperty(PropertyGroupName.special, '按钮文本', new Text_Setting(), '新增')
    this.registerProperty(PropertyGroupName.special, '图标大小', new Number_Setting(), 20)
    this.registerProperty(
      PropertyGroupName.special,
      '按钮类型',
      new Enum_Setting(true, ['主按钮', '次按钮', '虚线按钮', '危险按钮', '链接按钮']),
      '主按钮'
    )
    this.registerProperty(PropertyGroupName.special, '按钮设置', new Button_Setting())
    //新增点击时间间隔属性
    this.registerProperty(PropertyGroupName.special, '点击时间间隔', new Number_Setting(), 1000)
    this.findPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false
  }

  private onClick(e) {}
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

