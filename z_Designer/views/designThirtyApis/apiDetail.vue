<template>
  <div style="padding: 8px; width: 100%; height: 100%; box-sizing: border-box" class="">
    <el-form :model="currentApi" label-width="120px" style="height: calc(100% - 50px); overflow-y: auto">
      <el-form-item label="描述">
        <el-input style="width: 400px" v-model="currentApi.desc" />
      </el-form-item>
      <el-form-item label="域名">
        <el-radio-group v-model="currentApi.hostIsDictionary">
          <el-radio :value="true">使用字典</el-radio>
          <el-radio :value="false">手动填写</el-radio>
        </el-radio-group>
        <br />
        <el-select v-if="currentApi.hostIsDictionary" style="width: 400px" v-model="currentApi.host">
          <el-option v-for="dic in allDictorys" :key="dic.id" :label="dic.value" :value="dic.key" />
        </el-select>
        <el-input v-else style="width: 400px" v-model="currentApi.host" />
      </el-form-item>

      <el-form-item label="路径">
        <el-input style="width: 400px" v-model="currentApi.path" />
      </el-form-item>
      <el-form-item label="请求类型">
        <el-select style="width: 400px" v-model="currentApi.requestType">
          <el-option label="Post" value="Post" />
          <el-option label="Get" value="Get" />
          <el-option label="Put" value="Put" />
          <el-option label="Delete" value="Delete" />
          <el-option label="Update" value="Update" />
        </el-select>
      </el-form-item>

      <el-form-item label="请求头">
        <paramsEidtor style="width: 400px" :params="currentApi.headers" />
      </el-form-item>
      <el-form-item label="链接参数">
        <paramsEidtor style="width: 400px" :params="currentApi.inParams" />
      </el-form-item>

      <el-form-item label="body参数" v-show="currentApi.requestType !== 'Get'">
        <el-radio-group style="width: 100%" v-model="currentApi.bodyIsParam">
          <el-radio :value="true">细分参数</el-radio>
          <el-radio :value="false">不细分参数</el-radio>
        </el-radio-group>
        <paramsEidtor v-show="currentApi.bodyIsParam" style="width: 400px" :params="currentApi.bodyContent" />
      </el-form-item>
    </el-form>
    <div style="height: 50px">
      <el-button type="primary" @click="onSureHandle">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ThirtyApiDC, AddOrUpdateAPI } from '@common/apis/designThirtyApi'
import paramsEidtor from './paramsEidtor.vue'
import { GetAll } from '@common/apis/designDictionary'

@Options({
  components: { paramsEidtor }
})
export default class apiDetail extends ComponentBase {
  @Prop()
  private allDictorys: any[]
  @Prop()
  private currentApi: ThirtyApiDC

  mounted() {}

  private async onSureHandle() {
    let x = this.currentApi
    let res = await AddOrUpdateAPI(x)
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
