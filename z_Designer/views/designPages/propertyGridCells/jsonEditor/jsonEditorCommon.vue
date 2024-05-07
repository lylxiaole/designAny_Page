 
<template>
  <div>
    <v-ace-editor v-model:value="jsonData" lang="json" theme="chrome" :onChange="handleChange" :options="{
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    }" style="height:100%" class="ace-editor" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, watch } from 'vue'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import { VAceEditor } from 'vue3-ace-editor'
// 加了这个【import "ace-builds/webpack-resolver";】可能会报错
//（若报错 则需要安装node.js的一个包 就是主题）
// 命令：npm install --save-dev file-loader
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'
import { debug } from 'webpack'

@Options({
  components: {
    VAceEditor: VAceEditor
  }
})
export default class jsonEditorCommon extends Vue {
  private jsonData: any = ref('{}')

  private handleChange(newValue, event) {}

  // ******************************************
  public setJsonData(val) {
    this.jsonData = val
  }
  public getJsonData() {
    return JSON.parse(this.jsonData)
  }
  // ******************************************
  private jsonError = (e) => {
    console.log(`JSON字符串错误：${e.message}`)
  }
  private jsonFormat = () => {
    try {
      this.jsonData = JSON.stringify(JSON.parse(this.jsonData), null, 2)
    } catch (e) {
      this.jsonError(e)
    }
  }
  // ******************************************
  mounted() {}
}
</script>



<style scoped>
</style>