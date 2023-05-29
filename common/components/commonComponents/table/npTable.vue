<template>
  <div>
    <vxe-toolbar id="np_table_toolbar" style="height:0" :resizable="{storage: true}" auto-resize :setting="{storage: true}"
      :refresh="{query: refreshListPromise}">
      <div slot="buttons">
        <slot name="npbuttons"></slot>
      </div>
      <div slot="tools">
        <slot name="nptools"></slot>
      </div>
    </vxe-toolbar>

    <vxe-table id="np_table_ppap" ref="table" :data="dataSource" :loading="loading" :stripe="stripe" :resizable="resizable"
      :keyboard-config="{isArrow: true}" :setting=" {storage: true}" :show-header="showheader" width="100%" :height="height" :border="border"
      highlight-current-row highlight-hover-row>
      <slot name="npcolumns"></slot>
    </vxe-table>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
// import { columnInfo, tableStyle } from './tableCommonTypes'

@Options({})
export default class npTable extends Vue {
  @Prop() dataSource: any
  /**表格高度---auto|20%|600 */
  @Prop() height: string | number
  /**是否显示多选 */
  @Prop() canChoose: boolean
  /** 是否显示序号 */
  @Prop() showIndex: boolean
  /**是否显示边框 */
  @Prop() border: boolean
  /**是否隔行变色 */
  @Prop() stripe: boolean
  /**是否显示列头 */
  @Prop() showheader: boolean
  /**列是否可以拖拽大小 */
  @Prop() resizable: boolean
  @Prop() loading: boolean

  @Prop() refreshListPromise: Promise<unknown>
}
</script>
 
<style scoped>
.vxe-button--wrapper {
  float: left;
}
</style>