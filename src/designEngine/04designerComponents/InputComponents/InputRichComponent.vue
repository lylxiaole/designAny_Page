<template>
  <div :enabled='true'>
    <div ref="editor" style="text-align:left;background:white"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ComponentBase } from '../../03designerLayoutBase'
import { Component } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property,
  Boolean_Property
} from '../../03designerLayoutBase'
import E from 'wangeditor'
import { EditSession } from 'ace-builds'

@Component
export default class InputRichComponent extends ComponentBase {
  editor: any
  mounted() {
    this.width = 800
    this.height = 400
    this.registerProperty('富文本内容', PropertyGroupName.special, new Text_Property(), '', false)
    this.registerProperty('是否可用', PropertyGroupName.special, new Boolean_Property(), true)

    //初始化
    this.editor = new E(this.$refs.editor)

    //自定义菜单配置
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code' // 插入代码
    ]

    //粘贴文本过滤
    this.editor.customConfig.pasteFilterStyle = false

    //粘贴图片过滤
    this.editor.customConfig.pasteIgnoreImg = false

    this.editor.customConfig.pasteTextHandle = function(content: any) {
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      return content + '<p>在粘贴内容后面追加一行</p>'
    }

    //插入图片回调
    this.editor.customConfig.linkImgCallback = function(url: any) {}

    //url文本校验
    this.editor.customConfig.linkCheck = function(text: any, link: any) {
      return true
    }
    //url图片校验
    this.editor.customConfig.linkImgCheck = function(src: any) {
      return true
    }

    //上传本地图片
    this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片

    //输入内容变化时
    this.editor.customConfig.onchange = (html: any) => {
      this.findProperties(PropertyGroupName.special, '富文本内容')[0].value = html
    }
    this.editor.create()

    setTimeout(() => {
      this.editor.txt.html(this.findProperties(PropertyGroupName.special, '富文本内容')[0].value)
    })
  }

  destroyed() {
    this.editor.destroyed()
  }

  //是否可用
  get Enabled(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否可用')[0]) {
      let data = this.findProperties(PropertyGroupName.special, '是否可用')[0].value as boolean
      this.editor.$textElem.attr('contenteditable', data)
      return data
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .w-e-toolbar {
  flex-wrap: wrap;
}
</style>


