<template>
  <el-dialog v-model="dialogFormVisible" title="Http接口管理" style="width:95%;height:90%;margin: 0px;" append-to-body :destroyOnClose="true"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="height: calc(100% - 60px); width: 100%; position: relative">
      <apiList @onChooseApi="onChooseApi" style="width: 350px; height: 100%; float: left" />
      <apiDetail v-if="currentApiContent" v-model:needSave="needSave" :currentApi="currentApiContent" ref="apiDetail" :allDictorys="allDictorys"
        style="width: calc(100% - 350px); height: 100%; float: left" />
    </div>
    <template #footer>
      <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
        <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
        <!-- <el-button type="primary" @click="onSureUpload">
          {{$t('opts.sure')}}
        </el-button> -->
        <el-button type="primary" @click="onSave">
          {{$t('opts.save')}} {{needSave ? '*' : ''}}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ThirtyApiDC, GetApiDetail } from '@common/apis/designThirtyApi'

import apiList from './apiList.vue'
import apiDetail from './apiDetail.vue'
import { GetAll } from '@common/apis/designDictionary'
import { ElMessageBox } from 'element-plus'

@Options({
  components: {
    apiList: apiList,
    apiDetail: apiDetail
  }
})
export default class index extends PageBase {
  private currentApiContent: ThirtyApiDC = null
  private allDictorys: any[] = []
  private dialogFormVisible: boolean = false
  private needSave: boolean = false
  // ********************************
  public show() {
    this.dialogFormVisible = true
    this.needSave = false
    GetAll().then((res) => {
      this.allDictorys = res
    })
  }
  // ********************************
  private async onChooseApi(apiId) {
    if (!apiId) {
      this.currentApiContent = null
      return
    }
    // *******************************
    if (this.needSave) {
      try {
        await ElMessageBox.confirm('当前有内容为保存,是否需要先保存?', 'Warning', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        })
        await this.onSave()
      } catch (error) {}
    }
    // *******************************
    this.currentApiContent = await GetApiDetail(apiId)
    if (!this.currentApiContent.headers) {
      this.currentApiContent.headers = []
    }
    if (!this.currentApiContent.bodyContent) {
      this.currentApiContent.bodyContent = []
    }
    if (!this.currentApiContent.inParams) {
      this.currentApiContent.inParams = []
    }
    this.needSave = false
  }
  /************************** */
  private async onSave() {
    await (this.$refs.apiDetail as any).onSureHandle()
  }
  // *********************************
}
</script>

<style lang="less"></style>
