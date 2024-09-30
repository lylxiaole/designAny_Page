<template>
  <div style="width: 100%; height: 100%">
    <div style="width: 100%; height: 100%" ref="drawarea"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { useAttrs, ref } from 'vue'
// ***********************************************
import ace from 'ace-builds'
import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-json'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

// ********************************************
@Options({
  components: {}
})
export default class lylJSONEditor extends Vue {
  mounted() {
    this.init()
  }

  private editor: ace.Ace.Editor = null
  private async init() {
    ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl)
    ace.require('ace/ext/language_tools')
    this.editor = ace.edit(this.$refs.drawarea as any, {
      mode: 'ace/mode/json',
      useWorker: false,
      showGutter: false,
      theme: 'ace/theme/chrome'
    })

    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
  }

  unmounted() {
    this.editor.destroy()
    this.editor.container.remove()
  }

  public setValue(val) {
    this.editor.setValue(val)
  }
  public getValue() {
    return this.editor.getValue()
  }

  @Emit('getEditorInstance')
  private getEditorInstance(val) {}
}
</script>

<style lang="less" scoped></style>
