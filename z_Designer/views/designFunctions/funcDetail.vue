<template>
  <div style="padding:8px;width:100%;height:100%;box-sizing:border-box" class="">
    阿九阿九阿九阿九
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

@Options({
  components: {}
})
export default class funcDetail extends ComponentBase {
  @Prop()
  private currentFunc: JSFuncEntity

  mounted() {}

  private async onSureHandle() {
    let x = this.currentFunc
    let res = await AddOrUpdateFunc(x)
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