<template>
  <div style="height:100%;width:100%" @dblclick="onTreeNodeDoubleClick">
    <span v-if="isEdit===false" class="gad-b-tree-node-span"> {{ currentValue }} </span>
    <el-input v-else ref="currentInput" size="small" v-model="currentValue" @change="onNodevalChanged" @blur="onTreeNodeBlur" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

@Options({})
export default class bTreeNode extends Vue {
  @Prop() nodeKey: string
  @Prop() value: string

  @Emit('update:value')
  private updateValue_Inner(val: any) {}

  private isEdit: boolean = false
  private currentValue: string = ''
  private oldValue: string = ''

  mounted() {
    this.currentValue = deepClone(this.value)
    this.oldValue = deepClone(this.value)
  }

  private onNodevalChanged(e: any) {
    // window.console.log(this.currentValue)
    this.updateValue_Inner(this.currentValue)
    this.onValueChanged(this.nodeKey, this.currentValue)
  }

  private onTreeNodeBlur(e: any) {
    if (!this.currentValue) {
      alert({
        content: '不能为空'
      })
      this.currentValue = this.oldValue
    } else {
      this.onSureNodeName(this.nodeKey, this.currentValue)
    }
    this.isEdit = false
  }

  private onTreeNodeDoubleClick() {
    this.isEdit = true
    this.$nextTick(() => {
      ;(this.$refs.currentInput as any).focus()
      ;(this.$refs.currentInput as any).select()
    })
  }

  @Emit('onValueChanged')
  private onValueChanged(nodeKey: string, val: string) {}

  @Emit('onSureNodeName')
  private onSureNodeName(nodeKey: string, val: string) {}
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
</style>