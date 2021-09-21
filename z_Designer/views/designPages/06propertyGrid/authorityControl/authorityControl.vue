<template>
  <div>
    <a-button
      style="width:118px;height:34px;background:rgb(24,155,249,0.1);border-color:rgb(24,155,249,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      type="primary" class="themeButton" @click="selectAuthority" size="small">
      <a-icon style="font-size:20px" :component="selectauthicon" />选择权限</a-button>
    <authority-model ref="authorityRef" :permissionCode='permissionCode' @selectAuthorityed="selectAuthorityOk" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import { authorityIco, selectauthIco } from '../../assets/icons.js'
import authorityModel from '../../../../views/myapplication/modules/authorityModel.vue'
class TreeInfo {
  public key: string
  public title: string
  public children: TreeInfo[] = []
}

class PagePermissionInfo {
  public id: string
  public permissionCode: string
  public permissionName: string
}

@propertyCellTypeAttr(PropertyTypeEnum.authority)
@Component({
  components: {
    authorityModel: authorityModel
  }
})
export default class authorityControl extends propertyCellBase {
  created() {
    this.authicon = authorityIco
    this.selectauthicon = selectauthIco
  }
  protected get currentComponents(): ComponentBase[] {
    if (!this.currentLayouts) {
      return null
    }
    var newlayouts_extra: ComponentBase[] = []
    if (this.currentLayouts instanceof ComponentBase) {
      newlayouts_extra = [this.currentLayouts as ComponentBase]
    } else if (this.currentLayouts instanceof PageBase) {
      //window.console.error('传入的布局类不能是页面')
      return []
    } else {
      newlayouts_extra = this.currentLayouts as ComponentBase[]
    }
    return newlayouts_extra
  }

  public windowVisible: boolean = false
  private controlTreeData: TreeInfo[] = []

  private authCodes: AuthorityCode[] = []
  private pagePermissionList: PagePermissionInfo[] = []
  private currentAuthCode: string = ''
  private dataSource: any[] = []
  private callboackbehaviorid: string
  private authicon: any
  private selectauthicon: any
  private selectRadio: any
  private permissionCode: string = ''

  private startEdit() {
    if (!this.currentComponents) {
      return
    }
    var authority = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
    if (authority) {
      this.selectRadio = authority.value
    }
    /**获取当前所有权限码 */
    //参数拼接
    this.refreshAllAuthCodes()
    this.windowVisible = true
    /**根据当前组件，重新计算组件的树结构 */
    var treeNodes = this.cuteTreeData(this.currentComponents)
    this.controlTreeData = treeNodes
  }

  private async refreshAllAuthCodes() {
    let param = {
      filter: [],
      modelCode: 'sys_permission'
    }
    var res: any = await CurrentApis.SimpleListQuery(param)
    this.dataSource = res
    this.authCodes = []
    res.forEach((element) => {
      let permission = new AuthorityCode()
      permission.id = element.id
      permission.code = element.permission_code
      permission.name = element.permission_name
      this.authCodes.push(permission)
    })
  }

  //获取当前选中按钮的权限值
  private getElementPermission() {
    // 获取当前页面的Id
    if (this.currentComponents) {
      //console.info('currentComponents[0]: ', this.currentComponents[0])
      //console.info('权限设置: ', this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0])
      let property = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
      if (property && property.value) {
        this.$set(this, 'permissionCode', property.value)
      } else {
        this.$set(this, 'permissionCode', '')
      }
    }
  }
  /**根据当前所有的组件，计算出组件的树结构 */
  private cuteTreeData(comps: ComponentBase[]): TreeInfo[] {
    var treeNodes: TreeInfo[] = []
    comps.filter((comp) => {
      var treeNode = new TreeInfo()
      treeNode.key = comp.Id
      treeNode.title = !comp.name ? '未命名' : comp.name
      if (comp.selectedChildren) {
        treeNode.children = this.cuteTreeData(comp.selectedChildren as ComponentBase[])
      }
      treeNodes.push(treeNode)
    })
    return treeNodes
  }
  private cellClickEvent() {
    //console.log('单元格点击事件')
  }
  private radioChangeEvent({ row }: any) {
    //this.selectRow = row
    this.selectRadio = row.permission_code
  }

  // private onOk() {
  //   //window.console.info('执行onOK')
  //   //根据 code 获取 当前权限信息
  //   var currendtPermission = this.authCodes.filter((p) => p.code === this.selectRadio)[0]

  //   if (this.currentComponents) {
  //     let property = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
  //     if (property) {
  //       property.value = currendtPermission.code
  //     }
  //   }
  //   // 获取当前页面的Id
  //   if (this.currentComponents && currendtPermission) {
  //     let id = null
  //     if (this.currentComponents[0].parentPage && this.currentComponents[0].parentPage.Id) {
  //       var page = this.currentComponents[0].parentPage
  //       while (page.parentPage) {
  //         page = page.parentPage
  //       }
  //       id = page.Id
  //     } else {
  //       id = this.currentComponents[0].Id
  //     }
  //     // 根据pageId 获取page已有权限集合
  //     var pagePermissionDatas = CurrentApis.GetPagePermission(id).then((res: any) => {
  //       this.pagePermissionList = []
  //       res.forEach((element) => {
  //         let permission = new PagePermissionInfo()
  //         permission.id = element.id
  //         permission.permissionCode = element.permissionCode
  //         permission.permissionName = element.permissionName
  //         this.pagePermissionList.push(permission)
  //       })
  //       // window.console.log('根据Id 获取page已有权限集合', this.pagePermissionList)
  //       // 根据pageId 获取page信息
  //       var pageData = CurrentApis.GetPage(id).then((res: any) => {
  //         // window.console.log('根据Id 获取page信息', res)
  //         var pagePermission = {
  //           // groupId: res.parentGroupId,
  //           id: CurrentApis.GetServerUUID(),
  //           pageId: res.id,
  //           permissionId: currendtPermission.id
  //         }
  //         //重复去重 根据 pageid 获取 页面已有权限是否包含
  //         var isExistPermissions = this.pagePermissionList.filter((item) => item.id === pagePermission.permissionId)
  //         if (!isExistPermissions || isExistPermissions.length === 0) {
  //           // window.console.log('权限不存在', isExistPermissions)
  //           CurrentApis.AddPermission(pagePermission).then((res: any) => {
  //             // window.console.log('页面权限新增结果反馈', res)
  //             var authority = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
  //             if (authority) {
  //               authority.value = this.selectRadio
  //               this.selectRadio = undefined
  //             }
  //           })
  //         }
  //         // window.console.log(' pagePermission', pagePermission)
  //         this.windowVisible = false
  //       })
  //     })
  //   }
  // }

  private onOk() {
    window.console.info('执行onOK', this.selectRadio)
    //根据 code 获取 当前权限信息
    if (!this.selectRadio) {
      this.currentValue = ''
      return
    }
    var currendtPermission = this.authCodes.filter((p) => p.code === this.selectRadio)[0]
    this.currentValue = currendtPermission.code
  }

  private handleCancel() {
    this.windowVisible = false
  }
  private get authorityRef(): any {
    return this.$refs.authorityRef as any
  }

  private selectAuthority() {
    this.startEdit()
    this.getElementPermission()
    //window.console.info('执行了弹窗')
    this.authorityRef.add()
  }
  selectAuthorityOk(authCode) {
    this.refreshAllAuthCodes().then(() => {
      this.selectRadio = authCode
      this.onOk()
    })
  }

  private addNewAuth() {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>