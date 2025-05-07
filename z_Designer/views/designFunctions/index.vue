<template>
  <el-dialog v-model="dialogFormVisible" title="JS方法管理" style="width:95%;height:90%;margin: 0px;" append-to-body :destroyOnClose="true"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="height: calc(100% - 60px);width:100%;position:relative">
      <funcList @onChooseFunc="onChooseFunc" style="width:350px;height:100%;float:left" />
      <funcDetail v-show="currentFuncContent" v-model:needSave="needSave" :currentFunc="currentFuncContent" ref="funcDetail"
        style="width:calc(100% - 350px);height:100%;float:left" />
    </div>
    <template #footer>
      <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
        <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
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
import { JSFuncEntity, GetFuncDetail } from '@common/apis/designJSFunc'

import funcList from './funcList.vue'
import funcDetail from './funcDetail.vue'
import { ElMessageBox } from 'element-plus'

@Options({
  components: {
    funcList: funcList,
    funcDetail: funcDetail
  }
})
export default class index extends PageBase {
  private dialogFormVisible: boolean = false
  private needSave: boolean = false

  // ****************************************************
  public show() {
    this.dialogFormVisible = true
    this.needSave = false
  }
  // ****************************************************
  private currentFuncContent: JSFuncEntity = null
  private async onChooseFunc(funcId) {
    if (!funcId) {
      this.currentFuncContent = null
      return
    }

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

    this.currentFuncContent = await GetFuncDetail(funcId)
    if (!this.currentFuncContent.content) {
      this.currentFuncContent.content = 'function main(val){ return  1}'
    }

    ;(this.$refs.funcDetail as funcDetail).setCurrentFunc(this.currentFuncContent)
    this.needSave = false
  }
  /************************** */
  private async onSave() {
    await (this.$refs.funcDetail as any).onSureHandle()
  }
}
</script>

<style lang="less">
</style>