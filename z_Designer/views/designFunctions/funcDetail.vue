<template>
  <div style="padding:8px;width:100%;height:100%;box-sizing:border-box" class="">
    <div style="width:100%;height:calc(100% - 50px)">
      <lylJSEditor ref="lylJSEditor" />
    </div>

    <div style="height:50px">
      <el-button type="primary" @click="onSureHandle">确定</el-button>
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

  mounted() {}

  private async onSureHandle() {
    this.currentFunc.content = (this.$refs.lylJSEditor as lylJSEditor).getValue()
    try {
      let excutejs = new excuteJS(this.currentFunc.content)
      let res = excutejs.validate()
      debugger
      this.currentFunc.inParams = res.inparams
      this.currentFunc.haveOutput = res.haveOutput
      // ;(function (jscontent) {
      //   jscontent = 'var func=' + jscontent
      //   eval(jscontent)
      //   let x = this
      //   debugger
      // })(this.currentFunc.content)
    } catch (error: any) {
      alert('保存失败:' + error.message)
      return
    }

    let res = await AddOrUpdateFunc(this.currentFunc)
    if (res) {
      alert('保存成功')
    } else {
      alert('保存失败')
    }
  }
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>