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
import ComponentBase from '../ComponentBase'
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
  BindingModels_Property,
} from '../../02common/commonClasses/LayoutProperty'
import common from '../../02common/commonMethod'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import npUploadFile from '../../07commonComponents/npUploadFile.vue'
import fileUpload from '../../02common/uploadFile/fileUpload'

import { message } from 'ant-design-vue'

@Component({
  components: { npUploadFile },
})
export default class upLoadComponent extends ComponentBase {
  private get fileList(): fileInfo[] {
    window.console.log('上传文件完成了get')
    var property = this.FindPropertyByName(PropertyGroupName.special, '文件列表')
    if (property) {
      return property.value as fileInfo[]
    } else {
      return []
    }
  }
  private set fileList(filelist: fileInfo[]) {
    window.console.log('上传文件完成了set')
    var propertyId = this.FindPropertyByName(PropertyGroupName.special, '文件列表').id
    this.SetPropertyVal(propertyId, filelist)
  }
  upLoadCallBack(relativePath: String) {
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    para.val = relativePath

    inParams.push(para)
    this.TriggeEvent('文件上传成功', inParams)
  }

  uploadError(error: any) {
    this.$message.error(error + 'file upload failed.')
  }

  get fileType(): string {
    if (this.FindProperties(PropertyGroupName.special, '文件格式')[0]) {
      return this.FindProperties(PropertyGroupName.special, '文件格式')[0].value as any
    } else {
      return 'image'
    }
  }

  get fontColor(): String {
    if (this.FindPropertyByName(PropertyGroupName.special, '前景色')) {
      return this.FindPropertyByName(PropertyGroupName.special, '前景色').value as String
    } else {
      return ''
    }
  }

  get backgroundColor(): String {
    if (this.FindPropertyByName(PropertyGroupName.special, '背景色')) {
      return this.FindPropertyByName(PropertyGroupName.special, '背景色').value as String
    } else {
      return ''
    }
  }

  get imageUrl(): String {
    if (
      this.FindPropertyByName(PropertyGroupName.special, '背景图片') &&
      this.FindPropertyByName(PropertyGroupName.special, '背景图片').value &&
      this.FindPropertyByName(PropertyGroupName.special, '背景图片').value[0]
    ) {
      var address = (CurrentContext.FileServerAddress +
        this.FindPropertyByName(PropertyGroupName.special, '背景图片').value[0].url.split('?')[0]) as String
      window.console.log(address)
      return address
    } else {
      return ''
    }
  }

  get upLoadSize(): number {
    if (this.FindProperties(PropertyGroupName.special, '文件大小不超过')[0]) {
      return this.FindProperties(PropertyGroupName.special, '文件大小不超过')[0].value as any
    } else {
      return 2
    }
  }

  get maxFileLengthParent(): number {
    if (this.FindProperties(PropertyGroupName.special, '文件最大数量')[0]) {
      return this.FindProperties(PropertyGroupName.special, '文件最大数量')[0].value as any
    } else {
      return 10
    }
  }

  get uploadDisable(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否禁用')[0]) {
      if (this.FindProperties(PropertyGroupName.special, '是否禁用')[0].value) {
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
    if (this.FindPropertyByName(PropertyGroupName.special, '列表样式')) {
      return this.FindPropertyByName(PropertyGroupName.special, '列表样式').value
    } else {
      return 'picture-card'
    }
  }

  get showUploadList(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否显示已上传文件列表')[0]) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否显示已上传文件列表')[0].value as boolean
    }
    return true
  }

  mounted() {
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    inParams.push(para)
    this.RegisterEvents('文件上传成功', null, inParams, null)

    this.RegisterProperty('文件格式', PropertyGroupName.special, new Enum_Property(true, ['image', 'file', 'vedio', 'vectorgraph']), 'image')
    this.RegisterProperty('文件列表', PropertyGroupName.special, null, [])
    this.RegisterProperty('文件大小不超过', PropertyGroupName.special, new Number_Property(), 2)

    this.RegisterProperty('文件最大数量', PropertyGroupName.special, new Number_Property(), 10)

    //this.RegisterProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)

    this.RegisterProperty('前景色', PropertyGroupName.special, new Color_Property(), '')

    this.RegisterProperty('背景色', PropertyGroupName.special, new Color_Property(), '')

    this.RegisterProperty('背景图片', PropertyGroupName.special, new UploadFile_Property(1, 'image'))

    this.RegisterProperty('列表样式', PropertyGroupName.special, new Enum_Property(true, ['text', 'picture', 'picture-card']), 'picture-card')

    this.RegisterProperty('是否显示已上传文件列表', PropertyGroupName.special, new Boolean_Property(), true)
  }
}
</script>
