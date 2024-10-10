<template>
  <div style="padding: 8px; width: 100%; height: 100%; box-sizing: border-box" class="">
    <el-form :model="currentApi" label-width="150px" style="height: calc(100% - 50px); overflow-y: auto">
      <el-form-item label="Description">
        <el-input style="width: 500px" v-model="currentApi.desc" />
      </el-form-item>
      <el-form-item label="Host">
        <el-radio-group v-model="currentApi.hostIsDictionary">
          <el-radio :value="true">Use Dictionary</el-radio>
          <el-radio :value="false">Use Text</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-select v-if="currentApi.hostIsDictionary" style="width: 500px" v-model="currentApi.host">
          <el-option v-for="dic in allDictorys" :key="dic.id" :label="dic.key + '(' + dic.value + ')'" :value="dic.key" />
        </el-select>
        <el-input v-else style="width: 500px" v-model="currentApi.host" />
      </el-form-item>

      <el-form-item label="Path">
        <el-input style="width: 500px" v-model="currentApi.path" />
      </el-form-item>
      <el-form-item label="Request Type">
        <el-select style="width: 500px" v-model="currentApi.requestType">
          <el-option label="Post" value="Post" />
          <el-option label="Get" value="Get" />
          <el-option label="Put" value="Put" />
          <el-option label="Delete" value="Delete" />
          <el-option label="Update" value="Update" />
        </el-select>
      </el-form-item>

      <el-form-item label="Request Headers">
        <paramsEidtor style="width: 500px" :params="currentApi.headers" />
      </el-form-item>
      <el-form-item label="Url Params">
        <paramsEidtor style="width: 500px" :params="currentApi.inParams" />
      </el-form-item>

      <el-form-item label="Body Params" v-show="currentApi.requestType !== 'Get'">
        <el-radio-group style="width: 100%" v-model="currentApi.bodyIsParam">
          <el-radio :value="true">Split Params</el-radio>
          <el-radio :value="false">Not Split</el-radio>
        </el-radio-group>
        <paramsEidtor v-show="currentApi.bodyIsParam" style="width: 500px" :params="currentApi.bodyContent" />
      </el-form-item>
    </el-form>
    <div style="height: 50px">
      <el-button type="primary" @click="onSureHandle">Sure</el-button>
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
