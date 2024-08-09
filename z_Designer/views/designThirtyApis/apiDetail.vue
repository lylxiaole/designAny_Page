<template>
  <div style="padding:8px;width:100%;height:100%;box-sizing:border-box" class="">
    <el-form :model="currentApi" label-width="120px" style="height:calc(100% - 50px)">
      <el-form-item label="描述">
        <el-input style="width:400px" v-model="currentApi.desc" />
      </el-form-item>
      <el-form-item label="域名">
        <el-input style="width:400px" v-model="currentApi.host" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input style="width:400px" v-model="currentApi.path" />

      </el-form-item>
      <el-form-item label="请求类型">
        <el-select v-model="currentApi.requestType">
          <el-option label="Post" value="Post" />
          <el-option label="Get" value="Get" />
          <el-option label="Put" value="Put" />
          <el-option label="Delete" value="Delete" />
          <el-option label="Update" value="Update" />
        </el-select>
      </el-form-item>

      <el-form-item label="请求头">
        <el-input v-model="currentApi.headers" />
      </el-form-item>
      <el-form-item label="链接参数">
        <el-input v-model="currentApi.inParams" />
      </el-form-item>
      <el-form-item label="body参数">
        <el-input v-model="currentApi.bodyContent" />
      </el-form-item>
    </el-form>
    <div style="height:50px">
      <el-button @click="onCancelHandle">取 消</el-button>
      <el-button type="primary" @click="onSureHandle">确定</el-button>
    </div>
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
  private currentApi: ThirtyApiDC = new ThirtyApiDC()

  public setApiContent(data?) {
    this.currentApi = data
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