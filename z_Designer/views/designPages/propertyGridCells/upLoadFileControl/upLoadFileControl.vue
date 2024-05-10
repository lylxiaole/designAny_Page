/**
 * 文件上传设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <uploadFile v-model:fileList="currentValue" backgroundColor="@themeBackground" :maxFileLength="currentProperty.maxFileLength"
      :fileType="currentProperty.fileType" :upLoadSize="currentProperty.fileSize" />
    <!-- <UploadFile :fileList.sync="currentValue" backgroundColor="@themeBackground" :maxFileLength="currentProperty.maxFileLength"
      :fileType="currentProperty.fileType" :upLoadSize="currentProperty.fileSize">
    </UploadFile> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, UploadFile_Setting } from '@designEngine/03designerLayoutBase'

import uploadFile from './uploadFile.vue'

@CellSettingAttr(PropertyTypeEnum.uploadFile)
@Options({
  components: {
    uploadFile
  }
})
export default class upLoadFileControl extends propertyCellBase<UploadFile_Setting> {
  mounted() {}
}
</script>



<style scoped>
</style>