<template>
  <div v-if="currentApiContent">
    <el-form :model="currentApiContent" label-width="120px">
      <el-form-item label="描述">
        <el-input v-model="currentApiContent.desc" />
      </el-form-item>

      <el-form-item label="域名">
        <el-input v-model="currentApiContent.host" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="currentApiContent.path" />
      </el-form-item>
      <el-form-item label="请求类型">
        <el-input v-model="currentApiContent.requestType" />
      </el-form-item>

      <el-form-item label="请求头">
        <el-input v-model="currentApiContent.headers" />
      </el-form-item>
      <el-form-item label="链接参数">
        <el-input v-model="currentApiContent.requestType" />
      </el-form-item>
      <el-form-item label="body参数">
        <el-input v-model="currentApiContent.bodyContent" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ThirtyApiDC } from '@common/apis/designThirtyApi'

@Options({
  components: {}
})
export default class apiDetail extends ComponentBase {
  private currentApiContent: ThirtyApiDC

  public setApiContent(data?) {
    debugger
    this.currentApiContent = data
  }

  mounted() {}
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>