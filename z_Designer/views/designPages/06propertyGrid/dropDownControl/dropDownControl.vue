<template>
  <div>
    <a-button type="primary" @click="startDropDown" size="small">设置菜单项</a-button>
    <authority-model ref="authorityModel" :permissionCode='permissionCode' @selectAuthorityed="authOk" />
    <geno-modal :maskClosable="false" title="设置菜单项" v-model="windowVisible" :width="1200" @ok="modalSure" @cancel="modalCancel" cancelText="取消"
      okText="确定" :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}">
      <ul>
        <li v-for="(col, i) in dropData" :key="col.key">
          <a-row :gutter="4" style="margin-bottom:5px;">
            <a-col :span="4">
              <a-input size="small" placeholder="请输入" v-model="col.value" />
            </a-col>
            <a-col :span="2">
              前景色:
              <NpColorPicker :color.sync="col.dropTextColor"></NpColorPicker>
            </a-col>
            <a-col :span="1">
              <a-icon size="small" type="minus-circle" @click="removeComp(i,col)" v-if="removeVisible" />
            </a-col>
            <a-col :span="1">
              <a-icon size="small" type="up-circle" @click="upComp(i,col)" />
            </a-col>
            <a-col :span="1">
              <a-icon size="small" type="down-circle" @click="downComp(i,col)" />
            </a-col>
            <a-col :span="2">
              <a-button size="small" @click="startEdit(i,col)">权限设置</a-button>
            </a-col>
            <a-col :span="2">
              <NpUploadFile :upLoadSize='2' :fileList.sync="col.imageUrl" maxFileLength=1 fileType="vectorgraph"></NpUploadFile>
            </a-col>
            <a-col :span="4">
              气泡是否展示：<a-switch checkedChildren="是" unCheckedChildren="否" @change="OnChange" v-model="col.checked"></a-switch>
            </a-col>
            <a-col :span="3">
              气泡提示信息：
              <a-input size="small" style="width:120px;" placeholder="请输入" v-model="col.confirmTitle" />
            </a-col>
            <a-col :span="3">
              点击时间间隔：
              <a-input size="small" style="width:120px;" placeholder="请输入" v-model="col.timeout" />
            </a-col>
          </a-row>
        </li>
      </ul>
      <a-button type="link" @click="addComp" v-if="addVisible">添加</a-button>

    </geno-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import { layoutEvent, layoutMethod, param, paramType } from '../../03designerLayoutBase'
import NpUploadFile from '../../07commonComponents/npUploadFile.vue'
import dropdownAttributeInfo from '../../02common/commonClasses/dropdownAttributeInfo'
import npColorPicker from '../../07commonComponents/npColorPicker.vue'
import authorityModel from '../../../../views/myapplication/modules/authorityModel.vue'
import { CurrentApis, AuthorityCode } from '../../01designerContext'

@propertyCellTypeAttr(PropertyTypeEnum.dropDown)
@Component({ components: { NpColorPicker: npColorPicker, authorityModel: authorityModel, NpUploadFile: NpUploadFile } })
export default class dropDownControl extends propertyCellBase {
  private windowVisible: boolean = false
  public addVisible: boolean = true
  public removeVisible: boolean = true
  private designerEvents: layoutEvent[] = []
  private checked: boolean = false
  private dropData: dropdownAttributeInfo[] = []
  private currentSettingData: dropdownAttributeInfo = null
  private authCodes: AuthorityCode[] = []

  mounted() {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.dropData.length
    if (currentLen <= minCount) {
      this.removeVisible = false
    }
    if (currentLen >= maxCount) {
      this.addVisible = false
    }

    this.refreshAllAuthCodes()
  }

  private async refreshAllAuthCodes() {
    let param = {
      filter: [],
      modelCode: 'sys_permission'
    }
    var res: any = await CurrentApis.SimpleListQuery(param)
    this.authCodes = []
    res.forEach((element) => {
      let permission = new AuthorityCode()
      permission.id = element.id
      permission.code = element.permission_code
      permission.name = element.permission_name
      this.authCodes.push(permission)
    })
  }
  private removeComp(index: number, obj: object) {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.dropData.length

    if (currentLen <= minCount) {
      this.removeVisible = false
      return
    }
    this.dropData.splice(index, 1)

    let newCurrentLen: number = this.dropData.length
    if (newCurrentLen <= minCount) {
      this.removeVisible = false
    }
    if (newCurrentLen < maxCount) {
      this.addVisible = true
    }
  }
  private upComp(index: number, obj: dropdownAttributeInfo) {
    if (index > 0) {
      this.dropData[index] = this.dropData.splice(index - 1, 1, obj)[0]
    }
  }

  private downComp(index: number, obj: dropdownAttributeInfo) {
    if (index < this.dropData.length - 1) {
      this.dropData[index] = this.dropData.splice(index + 1, 1, obj)[0]
    }
  }
  private startDropDown() {
    this.windowVisible = true
    if (!this.currentValue) {
      return
    }
    this.dropData = []
    ;(this.currentValue as dropdownAttributeInfo[]).filter((o) => {
      var newdropinfo = new dropdownAttributeInfo()
      newdropinfo.key = o.key
      newdropinfo.value = o.value
      newdropinfo.checked = o.checked
      newdropinfo.confirmTitle = o.confirmTitle
      newdropinfo.imageUrl = o.imageUrl
      newdropinfo.iconFlag = o.iconFlag
      newdropinfo.dropTextColor = o.dropTextColor
      newdropinfo.url = o.url
      newdropinfo.dropVisable = o.dropVisable
      newdropinfo.authCode = o.authCode
      newdropinfo.timeout = o.timeout ? o.timeout : 1000
      this.dropData.push(newdropinfo)
    })
  }
  private modalSure() {
    this.currentValue = common.clone(this.dropData)
    this.windowVisible = false
  }
  private modalCancel() {
    this.windowVisible = false
  }
  private addComp() {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.dropData.length

    if (maxCount <= currentLen) {
      this.addVisible = false
      return
    }
    let uuid: string = common.getUuid()
    let authority: any[] = []
    this.dropData.push({
      key: uuid,
      value: '111',
      checked: false,
      confirmTitle: '确认要删除吗？',
      imageUrl: [],
      authCode: null,
      iconFlag: false,
      url: '',
      dropTextColor: '',
      dropVisable: true,
      timeout: 1000
    })

    let newCurrentLen: number = this.dropData.length
    if (maxCount <= newCurrentLen) {
      this.addVisible = false
    }
    if (newCurrentLen > minCount) {
      this.removeVisible = true
    }
  }

  private permissionCode: string = ''
  private get authorityModel(): any {
    return this.$refs.authorityModel as any
  }

  private startEdit(index: number, obj: dropdownAttributeInfo) {
    window.console.log('startEdit:', obj)
    this.permissionCode = obj.authCode
    this.currentSettingData = obj
    this.authorityModel.add()
    // this.authorityModel.startEdit(obj, this.currentLayouts[0].parentPage.Id)
  }
  private authOk(value: any) {
    this.refreshAllAuthCodes().then(() => {
      this.currentSettingData.authCode = value

      let id = null
      var page = this.currentPage
      while (page.parentPage) {
        page = page.parentPage
      }
      id = page.Id

      var currendtPermission = this.authCodes.filter((p) => p.code === value)[0]
      var pagePermissionDatas = CurrentApis.GetPagePermission(id).then((res: any) => {
        var pagePermissionList = []
        res.forEach((element) => {
          let permission: any = {}
          permission.id = element.id
          permission.permissionCode = element.permissionCode
          permission.permissionName = element.permissionName
          pagePermissionList.push(permission)
        })
        // window.console.log('根据Id 获取page已有权限集合', this.pagePermissionList)
        // 根据pageId 获取page信息
        var pageData = CurrentApis.GetPage(id).then((res: any) => {
          // window.console.log('根据Id 获取page信息', res)
          var pagePermission = {
            // groupId: res.parentGroupId,
            id: CurrentApis.GetServerUUID(),
            pageId: res.id,
            permissionId: currendtPermission.id
          }
          //重复去重 根据 pageid 获取 页面已有权限是否包含
          var isExistPermissions = pagePermissionList.filter((item) => item.id === pagePermission.permissionId)
          if (!isExistPermissions || isExistPermissions.length === 0) {
            CurrentApis.AddPermission(pagePermission)
          }
        })
      })
    })
  }

  private OnChange() {}
}
</script>