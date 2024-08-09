<template>
  <div style="position:relative;overflow-x:auto:overflow-y:hidden;" @dblclick="onTreeNodeDoubleClick">
    <div style="height:100%;float:left;padding-left:3px;box-sizing:border-box">
      <span v-if="isEdit===false" class="gad-b-tree-node-span" style="display:flex;justify-content:center;align-items:Center;">
        {{ currentValue }}
      </span>
      <el-input v-else ref="currentInput" size="small" v-model="currentValue" @change="onNodevalChanged" @blur="onTreeNodeBlur" style="width:auto" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone } from '@common/utils'
@Options({})
export default class bTreeNode extends Vue {
  @Prop() value: string

  @Emit('update:value')
  private updateValue_Inner(val: any) {}

  private isEdit: boolean = false
  private currentValue: string = ''

  mounted() {
    this.currentValue = deepClone(this.value)
  }

  private onNodevalChanged(e: any) {
    this.updateValue_Inner(this.currentValue)
  }

  private onTreeNodeBlur(e: any) {
    this.updateValue_Inner(this.currentValue)
    this.isEdit = false
  }

  private onTreeNodeDoubleClick() {
    this.isEdit = true
    this.$nextTick(() => {
      ;(this.$refs.currentInput as any).focus()
      ;(this.$refs.currentInput as any).select()
    })
  }
}
</script>


<style lang="less" scoped>
.gad-b-tree-node-span {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  display: block;
}

input {
  border: none;
}
</style>