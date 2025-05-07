<template>
  <div style="padding: 8px; width: 100%; height: 100%; box-sizing: border-box" class="">
    <div style="height: 50px">
      <!-- <el-button type="primary" style="margin-left:600px" @click="onSureHandle">{{$t('opts.sure')}}</el-button> -->
    </div>
    <div style="width: 100%; height: calc(100% - 50px)">
      <lylJSEditor ref="lylJSEditor" @onValueChanged="onValueChanged" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { JSFuncEntity, JSFuncGroupDC, AddOrUpdateFunc } from '@common/apis/designJSFunc'
import lylJSEditor from '@common/components/commonComponents/lylJSEditor.vue'
import excuteJS from '@common/components/commonComponents/funcstrExcute'
@Options({
  components: { lylJSEditor: lylJSEditor }
})
export default class funcDetail extends ComponentBase {
  private currentFunc: JSFuncEntity

  public setCurrentFunc(func: JSFuncEntity) {
    this.currentFunc = func
    if (func) {
      ;(this.$refs.lylJSEditor as lylJSEditor).setValue(func.content)
    } else {
      ;(this.$refs.lylJSEditor as lylJSEditor).setValue(null)
    }
  }

  private onValueChanged(val) {
    this.currentFunc.content = val
    this.onNeedSaveChange(true)
  }

  public async onSureHandle() {
    this.currentFunc.content = (this.$refs.lylJSEditor as lylJSEditor).getValue()
    try {
      let excutejs = new excuteJS(this.currentFunc.content)
      excutejs.validate()
    } catch (error: any) {
      alert('保存失败:' + error.message)
      return
    }

    let res = await AddOrUpdateFunc(this.currentFunc)
    if (res) {
      alert('保存成功')
      this.onNeedSaveChange(false)
    } else {
      alert('保存失败')
    }
  }

  @Prop({ type: Boolean, default: false })
  private needSave: boolean

  @Emit('update:needSave')
  private onNeedSaveChange(val) {}
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>
