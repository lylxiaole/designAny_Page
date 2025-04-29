<template>
  <div>
    <el-row style="height: 100%; width: 100%">
      <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
        <div style="background: #18aeb7; width: 6px; height: 26px"></div>
        <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">{{$t('tip.extendsList')}}</span>
        <el-button class="behavior-list-header-button"
          style="width: 104px; height: 30px; background: rgba(245, 166, 35, 1); color: rgba(255, 255, 255, 1); margin-left: 10px"
          @click="onLeadInExtend">{{$t('tip.leadinExtend')}}</el-button>
      </div>

      <div style="height: calc(100% - 30px); width: 100%">
        <el-row style="height: 35px">
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">{{$t('tip.index')}}</el-col>
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">{{$t('tip.name')}}</el-col>
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">{{$t('tip.options')}}</el-col>
        </el-row>

        <div style="height: calc(100% - 35px); overflow-y: auto">
          <el-row v-for="(extandfile, index) in allExtendsFiles" :key="extandfile.id" style="margin-top: 4px">
            <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">
              <span>{{ index + 1 }}</span>
            </el-col>
            <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">
              <span>{{ extandfile.name }}</span>
            </el-col>
            <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">
              <!-- ****************************** -->
              <el-button size="small" @click="deleteExtendFile(extandfile.id)" type="link">{{$t('opts.delete')}}</el-button>
              <!-- ****************************** -->
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { ExtandFile, addExtandFile, getAllExtandFiles, deleteExtandFile } from '@common/apis/designForeExtands'
import uploadFile from './uploadFile.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

@Options({ components: { uploadFile } })
export default class foreExtandsManage extends Vue {
  private allExtendsFiles: ExtandFile[] = []

  mounted() {
    this.refreshdata()
  }

  public async refreshdata() {
    this.allExtendsFiles = await getAllExtandFiles()
  }

  public async deleteExtendFile(id) {
    try {
      await deleteExtandFile(id)
      await this.refreshdata()
      ElMessage.success('插件删除成功,刷新页面后奏效！')
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }
  // *********************************************************

  @Emit('onLeadInExtend')
  private onLeadInExtend() {}
}
</script>

<style lang="less" scoped>
</style>
