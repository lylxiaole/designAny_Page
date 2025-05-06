<template>
  <div style="padding: 8px; width: 100%; height: 100%; box-sizing: border-box" class="">
    <div style="height: 50px">
      <!-- <el-button type="primary" style="margin-left:600px" @click="onSureHandle">{{$t('opts.sure')}} </el-button> -->
    </div>
    <el-form :model="currentApi" label-width="150px" style="height: calc(100% - 50px); overflow-y: auto">
      <el-form-item :label="$t('tip.description')">
        <el-input style="width: 500px" v-model="currentApi.desc" />
      </el-form-item>
      <el-form-item :label="$t('tip.host')">
        <el-radio-group v-model="currentApi.hostIsDictionary">
          <el-radio :value="true"> {{$t('opts.useDictionary')}} </el-radio>
          <el-radio :value="false"> {{$t('opts.useText')}} </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-select v-if="currentApi.hostIsDictionary" style="width: 500px" v-model="currentApi.host">
          <el-option v-for="dic in allDictorys" :key="dic.id" :label="dic.key + '(' + dic.value + ')'" :value="dic.key" />
        </el-select>
        <el-input v-else style="width: 500px" v-model="currentApi.host" />
      </el-form-item>

      <el-form-item :label="$t('tip.path')">
        <el-input style="width: 500px" v-model="currentApi.path" />
      </el-form-item>
      <el-form-item :label="$t('tip.requestType')">
        <el-select style="width: 500px" v-model="currentApi.requestType">
          <el-option label="Post" value="Post" />
          <el-option label="Get" value="Get" />
          <el-option label="Put" value="Put" />
          <el-option label="Delete" value="Delete" />
          <el-option label="Update" value="Update" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('tip.requestHeaders')">
        <paramsEidtor style="width: 500px" :params="currentApi.headers" />
      </el-form-item>
      <el-form-item :label="$t('tip.urlParams')">
        <paramsEidtor style="width: 500px" :params="currentApi.inParams" />
      </el-form-item>

      <el-form-item :label="$t('tip.bodyParams')" v-show="currentApi.requestType !== 'Get'">
        <el-radio-group style="width: 100%" v-model="currentApi.bodyIsParam">
          <el-radio :value="true">{{$t('opts.splitParams')}} </el-radio>
          <el-radio :value="false">{{$t('opts.notSplit')}} </el-radio>
        </el-radio-group>
        <paramsEidtor v-show="currentApi.bodyIsParam" style="width: 500px" :params="currentApi.bodyContent" />
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ThirtyApiDC, AddOrUpdateAPI } from '@common/apis/designThirtyApi'
import paramsEidtor from './paramsEidtor.vue'
import { GetAll } from '@common/apis/designDictionary'
import { getLocale } from '@common/baseConfigs'

@Options({
  components: { paramsEidtor }
})
export default class apiDetail extends ComponentBase {
  @Prop()
  private allDictorys: any[]
  @Prop()
  private currentApi: ThirtyApiDC

  mounted() {}

  public async onSureHandle() {
    let x = this.currentApi
    let res = await AddOrUpdateAPI(x)
    if (res) {
      alert(getLocale().t('tip.saveSuccess'))
    } else {
      alert(getLocale().t('tip.saveFailed'))
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
