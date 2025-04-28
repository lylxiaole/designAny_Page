<template>
  <div>
    <!-- ***************************** -->

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

@Options({})
export default class optionBtn extends Vue {
  @Prop()
  private label
}
</script>

<style lang="less" scoped>
</style>
