<template>
  <div style="border:1px solid #cdcdcd;">
    你好
  </div>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

@Options({
  components: {}
})
export default class methodInPageNode extends Vue {
  private getNode: Function = inject('getNode')

  mounted() {
    var x = this.getNode()
    debugger
  }
}
</script>


<style lang="less" scoped>
</style>