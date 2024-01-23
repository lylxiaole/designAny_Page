<template>
  <div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import { behavior } from '@behaviorEngine/index'

@Options({})
export default class index extends Vue {
  currentPage: EnginePage
  /**当前正在设置的行为 */
  currentSettingBehavior: behavior
  public init(page: EnginePage, behavior: behavior) {
    this.currentPage = page
    this.currentSettingBehavior = behavior
  }
}
</script>

<style lang="less" scoped>
</style>
 