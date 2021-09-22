/**
 * 文件上传设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <UploadFile :fileList.sync="currentValue" backgroundColor="@themeBackground" :maxFileLength="currentPropertyType.maxFileLength"
      :fileType="currentPropertyType.fileType" :upLoadSize="currentPropertyType.fileSize">
    </UploadFile>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import npUploadFile from '../../07commonComponents/npUploadFile.vue'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.uploadFile)
@Component({
  components: {
    UploadFile: npUploadFile
  }
})
export default class upLoadFileControl extends propertyCellBase {
  mounted() {}
}
</script>



<style scoped>
</style>