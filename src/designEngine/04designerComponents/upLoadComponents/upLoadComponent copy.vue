<template>
  <div>
    <npUploadFile ref="npUploadFile" :showUploadList="showUploadList" :listType="listType" :upLoadSize="upLoadSize" :fileList.sync="fileList"
      :fileType="fileType" :maxFileLength="maxFileLengthParent" :disabled="uploadDisable" @upLoadCallBack="upLoadCallBack"
      :backgroundColor="backgroundColor" :fontColor="fontColor" :imageUrl="imageUrl">
      <a-button v-if="'picture-card'!=listType" slot="select">
        <a-icon type="upload" /> upload
      </a-button>
    </npUploadFile>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import { CurrentApis, fileInfo, CurrentContext } from '../../01designerContext'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property,
  Number_Property,
  UploadFile_Property,
  Color_Property,
  BindingModels_Property
} from '../../03designerLayoutBase'
import { getUuid, deepClone } from '@src/utils'
import { param, paramType } from '../../03designerLayoutBase'
import npUploadFile from '../../07commonComponents/npUploadFile.vue'
import fileUpload from '../../02common/uploadFile/fileUpload'

import { message } from 'ant-design-vue'

@Component({
  components: { npUploadFile }
})
export default class upLoadComponent extends ComponentBase {
  private get fileList(): fileInfo[] {
    window.console.log('上传文件完成了get')
    var property = this.findPropertyByName(PropertyGroupName.special, '文件列表')
    if (property) {
      return property.value as fileInfo[]
    } else {
      return []
    }
  }
  private set fileList(filelist: fileInfo[]) {
    window.console.log('上传文件完成了set')
    var propertyId = this.findPropertyByName(PropertyGroupName.special, '文件列表').id
    this.setPropertyVal(propertyId, filelist)
  }
  upLoadCallBack(relativePath: String) {
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    para.val = relativePath

    inParams.push(para)
    this.triggeEvent('文件上传成功', inParams)
  }

  uploadError(error: any) {
    this.$message.error(error + 'file upload failed.')
  }

  get fileType(): string {
    if (this.findProperties(PropertyGroupName.special, '文件格式')[0]) {
      return this.findProperties(PropertyGroupName.special, '文件格式')[0].value as any
    } else {
      return 'image'
    }
  }

  get fontColor(): String {
    if (this.findPropertyByName(PropertyGroupName.special, '前景色')) {
      return this.findPropertyByName(PropertyGroupName.special, '前景色').value as String
    } else {
      return ''
    }
  }

  get backgroundColor(): String {
    if (this.findPropertyByName(PropertyGroupName.special, '背景色')) {
      return this.findPropertyByName(PropertyGroupName.special, '背景色').value as String
    } else {
      return ''
    }
  }

  get imageUrl(): String {
    if (
      this.findPropertyByName(PropertyGroupName.special, '背景图片') &&
      this.findPropertyByName(PropertyGroupName.special, '背景图片').value &&
      this.findPropertyByName(PropertyGroupName.special, '背景图片').value[0]
    ) {
      var address = (CurrentContext.FileServerAddress +
        this.findPropertyByName(PropertyGroupName.special, '背景图片').value[0].url.split('?')[0]) as String
      window.console.log(address)
      return address
    } else {
      return ''
    }
  }

  get upLoadSize(): number {
    if (this.findProperties(PropertyGroupName.special, '文件大小不超过')[0]) {
      return this.findProperties(PropertyGroupName.special, '文件大小不超过')[0].value as any
    } else {
      return 2
    }
  }

  get maxFileLengthParent(): number {
    if (this.findProperties(PropertyGroupName.special, '文件最大数量')[0]) {
      return this.findProperties(PropertyGroupName.special, '文件最大数量')[0].value as any
    } else {
      return 10
    }
  }

  get uploadDisable(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否禁用')[0]) {
      if (this.findProperties(PropertyGroupName.special, '是否禁用')[0].value) {
        return true
      } else {
        if (this.fileList.length < this.maxFileLengthParent) {
          return false
        } else {
          return true
        }
      }
    } else {
      return false
    }
  }

  get listType(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '列表样式')) {
      return this.findPropertyByName(PropertyGroupName.special, '列表样式').value
    } else {
      return 'picture-card'
    }
  }

  get showUploadList(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否显示已上传文件列表')[0]) {
      return this.findPropertyByName(PropertyGroupName.special, '是否显示已上传文件列表')[0].value as boolean
    }
    return true
  }

  mounted() {
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    inParams.push(para)
    this.registerEvents('文件上传成功', null, inParams, null)

    this.registerProperty('文件格式', PropertyGroupName.special, new Enum_Property(true, ['image', 'file', 'vedio', 'vectorgraph']), 'image')
    this.registerProperty('文件列表', PropertyGroupName.special, null, [])
    this.registerProperty('文件大小不超过', PropertyGroupName.special, new Number_Property(), 2)

    this.registerProperty('文件最大数量', PropertyGroupName.special, new Number_Property(), 10)

    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)

    this.registerProperty('前景色', PropertyGroupName.special, new Color_Property(), '')

    this.registerProperty('背景色', PropertyGroupName.special, new Color_Property(), '')

    this.registerProperty('背景图片', PropertyGroupName.special, new UploadFile_Property(1, 'image'))

    this.registerProperty('列表样式', PropertyGroupName.special, new Enum_Property(true, ['text', 'picture', 'picture-card']), 'picture-card')

    this.registerProperty('是否显示已上传文件列表', PropertyGroupName.special, new Boolean_Property(), true)
  }
}
</script>
