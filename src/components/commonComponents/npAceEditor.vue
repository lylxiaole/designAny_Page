<template>
  <div style="width:100%;height:100%">
    <el-button class="themeButton" type="primary" size="mini" :icon="npicon"
      style="width:118px;height:34px;background:rgba(241,182,90,0.1);border-color:rgba(241,182,90,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEditText">
      扩展js
    </el-button>
    <el-dialog :maskClosable="false" title="编辑" v-model="windowVisible" width="900px" :destroyOnClose="true">
      <editor ref="editor" lang="javascript" @init="editorInit" v-model="currentCode" width="850" height="500" :options="options">
      </editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator' // import ace from 'ace-builds'
import aceEditor from 'vue2-ace-editor'
// import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
// import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
// import 'ace-builds/src-noconflict/mode-javascript' // 默认设置的语言模式
// import 'ace-builds/src-noconflict/ext-language_tools'
import { npAceEditorIco } from '@src/designEngine/assets/icons.js'

@Options({
  components: {
    editor: aceEditor
  }
})
export default class npAceEditor extends Vue {
  @Prop() currentCode: string
  @Emit('update:currentCode')
  UpdateCode_Inner(code: string) {}

  private currentEditor: aceEditor
  private themePath: string = 'ace/theme/monokai' // 不导入 webpack-resolver，该模块路径会报错
  private modePath: string = 'ace/mode/javascript' // 同上
  private windowVisible: boolean = false
  private npicon: any
  public options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true /*自动补全*/
  }
  created() {
    this.npicon = npAceEditorIco
  }

  mounted() {
    //启用提示菜单
    //var languageTools = ace.require('ace/ext/language_tools')
  }

  private startEditText() {
    this.windowVisible = true
    //this.currentEditor.val= this.currentCode
    // this.$nextTick(() => {
    //   this.currentEditor = ace.edit(this.$refs.editor as Element, {
    //     maxLines: 30, // 最大行数，超过会自动出现滚动条
    //     minLines: 30, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
    //     fontSize: 14, // 编辑器内字体大小
    //     theme: this.themePath, // 默认设置的主题
    //     mode: this.modePath, // 默认设置的语言模式
    //     tabSize: 4, // 制表符设置为 4 个空格大小
    //   })
    //   //设置只读（true时只读，用于展示代码）
    //   this.currentEditor.setReadOnly(false)
    //   //自动换行,设置为off关闭
    //   this.currentEditor.setOption('wrap', 'free')
    //   //启用提示菜单
    //   this.currentEditor.setOptions({
    //     enableBasicAutocompletion: true,
    //     enableSnippets: true,
    //     enableLiveAutocompletion: true,
    //   })

    //   this.currentEditor.on('change', (e) => {
    //     this.currentEditor.execCommand('startAutocomplete')
    //   })
    //   this.currentEditor.setValue(this.currentCode)
    // })
  }

  private onSure() {
    this.windowVisible = false
    // var val = this.currentEditor.getValue()
    //var val = this.currentEditor.val
    this.UpdateCode_Inner(this.currentCode)
    this.currentEditor.destroy()
  }
  handleCancel() {
    this.windowVisible = false
  }

  //Ace编辑器
  editorInit(editor) {
    require('brace/ext/language_tools') //language extension prerequsite...
    require('brace/mode/html')
    require('brace/mode/javascript') //language
    require('brace/mode/less')
    require('brace/theme/chrome')
    require('brace/snippets/javascript') //snippet
  }
}
</script>
