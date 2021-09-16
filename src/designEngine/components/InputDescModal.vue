<template>
  <s-modal subtitle="备注" :operationType='this.operation.edit' :visible="visible" :confirmLoading="false" @ok="handleSubmit" width="40%"
    @cancel="handleCancel" :okText="'确认'" :cancelText="'取消'">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item label="备注">
        <a-input v-decorator="['note', { rules: [{ required: true, message: '请输入备注!' }] }]" />
      </a-form-item>
    </a-form>
  </s-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { toString } from 'xe-utils/methods'
import { CurrentApis } from '../01designerContext'
import { SModal, VTable } from '@/components'

@Component({
  components: {
    SModal
  }
})
export default class InputDescModal extends Vue {
  private visible: boolean = false

  private form: any
  beforeCreate() {
    this.form = this.$form.createForm(this)
  }

  public show() {
    this.visible = true
  }

  private handleCancel(e) {
    this.visible = false
  }

  private handleSubmit(e) {
    e.preventDefault()
    this.form.validateFields((err, values) => {
      if (!err) {
        window.console.log('Received values of form: ', values)
        this.onSuccess(values.note)
        this.visible = false
      }
    })
  }

  @Emit('onSuccess')
  private onSuccess(desc: string) {}
}
</script>

<style lang="less" scoped>
</style>