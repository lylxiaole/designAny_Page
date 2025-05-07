<template>
  <div style="width:100%;height:100%">
    <div style="width:100%;height:100%" ref="drawarea"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { useAttrs, ref } from 'vue'
// ***********************************************
import ace from 'ace-builds'
import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-javascript'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

// ********************************************
@Options({
  components: {}
})
export default class lylJSEditor extends Vue {
  mounted() {
    this.init()
  }

  private editor: ace.Ace.Editor = null
  private async init() {
    ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl)
    ace.require('ace/ext/language_tools')
    this.editor = ace.edit(this.$refs.drawarea as any, {
      mode: 'ace/mode/javascript',
      useWorker: false,
      showGutter: false,
      theme: 'ace/theme/chrome'
    })

    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
    // ******************************
  }

  private onEditorChange(val) {
    this.onValueChanged(this.editor.getValue())
  }

  unmounted() {
    this.editor.off('change', this.onEditorChange)
    this.editor.destroy()
    this.editor.container.remove()
  }

  public setValue(val) {
    this.editor.off('change', this.onEditorChange)

    this.editor.setValue(val)
    this.editor.on('change', this.onEditorChange)
  }
  public getValue() {
    return this.editor.getValue()
  }

  @Emit('onValueChanged')
  private onValueChanged(val) {}
}
</script>
 
<style lang="less" scoped>
</style>