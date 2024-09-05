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
import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-javascript?url'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/javascript'

// ********************************************
@Options({
  components: {}
})
export default class lylJSEditor extends Vue {
  mounted() {
    this.init()
  }

  private async init() {
    ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl)
    const editor = ace.edit(this.$refs.drawarea as any, {
      mode: 'ace/mode/javascript',
      useWorker: false
    })
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
  }

  @Emit('getEditorInstance')
  private getEditorInstance(val) {}
}
</script>
 
<style lang="less" scoped>
</style>