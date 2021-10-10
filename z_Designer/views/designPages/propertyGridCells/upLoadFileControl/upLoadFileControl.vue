/**
 * 文件上传设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <uploadFile :fileList.sync="currentValue" backgroundColor="@themeBackground" :maxFileLength="currentPropertyType.maxFileLength"
      :fileType="currentPropertyType.fileType" :upLoadSize="currentPropertyType.fileSize" />
    <!-- <UploadFile :fileList.sync="currentValue" backgroundColor="@themeBackground" :maxFileLength="currentPropertyType.maxFileLength"
      :fileType="currentPropertyType.fileType" :upLoadSize="currentPropertyType.fileSize">
    </UploadFile> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

import uploadFile from '@src/components/Upload/uploadFile.vue'

@propertyCellTypeAttr(PropertyTypeEnum.uploadFile)
@Component({
  components: {
    uploadFile
  }
})
export default class upLoadFileControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>