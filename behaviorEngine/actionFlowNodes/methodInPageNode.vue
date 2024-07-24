<template>
  <div style="border:1px solid #cdcdcd;width：100%;height:100%;box-sizing:border-box;background:#fff">
    {{actObj?actObj.name:''}}
  </div>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { object_Method, objectBase } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowDesigner/flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { debug } from 'webpack'

@flowDesignNode(funcCode.methodsInPage)
@Options({
  components: {}
})
export default class methodInPageNode extends Vue {
  // private getNode: Function = inject('getNode')

  @Prop()
  private actObj: object_Method

  mounted() {
    this.actObj.description = 'ni ha ahahhaha'
  }
}
</script>


<style lang="less" scoped>
</style>