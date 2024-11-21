<template>
  <div>
    <lylJSONEditor ref="editor" height="100%" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, watch, reactive } from 'vue'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import { isString } from 'xe-utils'
// import JsonEditor from 'vue3-ts-jsoneditor/dist/index.mjs'
import lylJSONEditor from '@common/components/commonComponents/lylJSONEditor.vue'

@Options({
  components: {
    lylJSONEditor: lylJSONEditor
  }
})
export default class jsonEditorCommon extends Vue {
  private jsonData: any = reactive({})
  // ******************************************
  public setJsonData(val) {
    if (isString(val)) {
      this.jsonData = JSON.parse(val)
    } else {
      this.jsonData = val
    }
    ;(this.$refs.editor as lylJSONEditor).setValue(this.jsonData)
  }
  public getJsonData() {
    let x = (this.$refs.editor as lylJSONEditor).getValue()
    if (!x) {
      x = JSON.stringify(this.jsonData)
    }
    return JSON.parse(x)
  }
  // ******************************************
  mounted() {}
}
</script>

<style lang="less" scoped>
/deep/.jse-button.jse-group-button.jse-first.jse-selected.svelte-7deygj {
  display: none !important;
}
/deep/.jse-button.jse-group-button.svelte-7deygj {
  display: none !important;
}
/deep/.jse-button.jse-group-button.svelte-7deygj {
  display: none !important;
}

/deep/.jse-button.jse-group-button.jse-last.svelte-7deygj {
  display: none !important;
}

/deep/.jse-separator.svelte-7deygj {
  display: none !important;
}

/deep/.jse-button.jse-undo.svelte-7deygj {
  margin-left: 20px !important;
}

/deep/.jse-button.jse-sort.svelte-7deygj {
  display: none !important;
}
/deep/.jse-button.jse-transform.svelte-7deygj {
  display: none !important;
}
/deep/.jse-button.jse-search.svelte-7deygj {
  display: none !important;
}
/deep/.jse-button.jse-compact.svelte-7deygj {
  display: none !important;
}
</style>
