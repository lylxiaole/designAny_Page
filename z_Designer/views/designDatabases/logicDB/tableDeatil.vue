<template>
  <div style="height:100%;width:100%;position:relative">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
@Options({
  components: {}
})
export default class tableDeatil extends PageBase {
  @Prop({ default: null })
  private currentTable: any

  @Watch('currentTable')
  private async oncurrentTableChanged(val) {
    if (!val) {
      return
    }
    console.log('oncurrentTableChanged:', val)
  }

  mounted() {}
}
</script>

<style>
</style>