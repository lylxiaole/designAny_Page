<template>
  <geno-modal :maskClosable="false" title="编辑权限" v-model="windowVisible" :width="900" @ok="onOk" :cancelButtonProps="{ props: {icon: 'close'}}"
    :okButtonProps="{ props: {icon: 'check'}}" @cancel="handleCancel" cancelText="取消" okText="确定">
    <a-layout style="height:500px">
      <!-- <a-layout-sider theme="light" :trigger="null" collapsible>
        <a-tree class="draggable-tree" :treeData="controlTreeData" />
      </a-layout-sider> -->

      <a-layout-content :style="{'overflow-x': 'hidden','overflow-y': 'hidden','width':'100%','height':'100%'}">
        <a-layout>
          <a-layout-content>
            <a-radio-group v-model="currentAuthCode">
              <a-radio v-for="codeinfo in authCodes" :key="codeinfo.code" :value="codeinfo.code">{{codeinfo.name}}</a-radio>
            </a-radio-group>
          </a-layout-content>
          <!-- <a-layout-footer :style="{ textAlign: 'center' }">
              <a class="ant-dropdown-link" href="#" @click="addNewAuth"> 添加权限类型 </a>
            </a-layout-footer>-->
        </a-layout>
      </a-layout-content>
    </a-layout>
  </geno-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../05designerLayouts/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
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
@Component
export default class authorityModel extends propertyCellBase {
  // protected get currentComponents(): ComponentBase[] {
  //   if (!this.currentLayouts) {
  //     return null
  //   }
  //   var newlayouts_extra: ComponentBase[] = []
  //   if (this.currentLayouts instanceof ComponentBase) {
  //     newlayouts_extra = [this.currentLayouts as ComponentBase]
  //   } else if (this.currentLayouts instanceof PageBase) {
  //     window.console.log('传入的布局类不能是页面')
  //     return []
  //   } else {
  //     newlayouts_extra = this.currentLayouts as ComponentBase[]
  //   }
  //   return newlayouts_extra
  // }

  public windowVisible: boolean = false
  private controlTreeData: TreeInfo[] = []

  private authCodes: AuthorityCode[] = []
  private pagePermissionList: PagePermissionInfo[] = []
  private currentAuthCode: string = ''
  private dropPageId: string = ''
  private dropData: any

  public startEdit(drop: any, dropPageId: any) {
    this.dropPageId = dropPageId
    this.dropData = drop
    // if (!this.currentComponents) {
    //   return
    // }
    // window.console.log('组件权限设置集合', this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0])
    // var authority = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
    // if (authority) {
    //   this.currentAuthCode = authority.value
    // }
    /**获取当前所有权限码 */
    //参数拼接
    if (drop.AuthorityCode) {
      this.currentAuthCode = drop.AuthorityCode
    }
    let param = {
      filter: [],
      modelCode: 'sys_permission'
    }
    //this.authCodes = CurrentApis.GetAuthorityCodes()
    var permissions = CurrentApis.SimpleListQuery(param).then((res: any) => {
      window.console.log('查询权限码', res)
      this.authCodes = []
      res.forEach((element) => {
        let permission = new AuthorityCode()
        permission.id = element.id
        permission.code = element.permission_code
        permission.name = element.permission_name
        this.authCodes.push(permission)
      })
    })
    // 如果当前组件没有设置权限吗，就给它设置一个默认的
    // if (!this.currentValue) {
    //   this.currentValue = this.authCodes[0].code
    // }
    /** */
    // this.currentAuthCode = this.currentValue
    this.windowVisible = true
    /**根据当前组件，重新计算组件的树结构 */
    // var treeNodes = this.cuteTreeData(this.currentComponents)
    // this.controlTreeData = treeNodes
  }

  /**根据当前所有的组件，计算出组件的树结构 */
  // private cuteTreeData(comps: ComponentBase[]): TreeInfo[] {
  //   var treeNodes: TreeInfo[] = []
  //   comps.filter((comp) => {
  //     var treeNode = new TreeInfo()
  //     treeNode.key = comp.Id
  //     treeNode.title = !comp.name ? '未命名' : comp.name
  //     if (comp.selectedChildren) {
  //       treeNode.children = this.cuteTreeData(comp.selectedChildren as ComponentBase[])
  //     }
  //     treeNodes.push(treeNode)
  //   })
  //   return treeNodes
  // }

  private onOk() {
    // this.currentValue = this.currentAuthCode
    if (!this.currentAuthCode) {
      this.$message.info('请设置权限！')
    }
    //调用后端接口保存权限配置
    window.console.log(
      '设置权限码',
      //this.currentAuthCode,
      this.currentAuthCode
      // this.currentComponents[0].LayoutProperties,
      // this.currentComponents[0].parentPage,
      // this.currentComponents[0].parentPage.Id
    )
    //根据 code 获取 当前权限信息
    var currendtPermission = this.authCodes.filter((p) => p.code === this.currentAuthCode)[0]
    // 获取当前页面的Id
    // if (this.currentComponents && currendtPermission) {
    //   if (this.currentComponents[0].parentPage && this.currentComponents[0].parentPage.Id) {
    //     var id = this.currentComponents[0].parentPage.Id
    //   } else {
    //     var id = this.currentComponents[0].Id
    //   }
    // 根据pageId 获取page已有权限集合
    var id = this.dropPageId
    var pagePermissionDatas = CurrentApis.GetPagePermission(id).then((res: any) => {
      this.pagePermissionList = []
      res.forEach((element) => {
        let permission = new PagePermissionInfo()
        permission.id = element.id
        permission.permissionCode = element.permissionCode
        permission.permissionName = element.permissionName
        this.pagePermissionList.push(permission)
      })
      window.console.log('根据Id 获取page已有权限集合', this.pagePermissionList)
      // 根据pageId 获取page信息
      var pageData = CurrentApis.GetPage(id).then((res: any) => {
        window.console.log('根据Id 获取page信息', res)
        var pagePermission = {
          // groupId: res.parentGroupId,
          id: CurrentApis.GetServerUUID(),
          pageId: res.id,
          permissionId: currendtPermission.id
        }
        //重复去重 根据 pageid 获取 页面已有权限是否包含
        var isExistPermissions = this.pagePermissionList.filter((item) => item.id === pagePermission.permissionId)
        if (!isExistPermissions || isExistPermissions.length === 0) {
          window.console.log('权限不存在', isExistPermissions)
          CurrentApis.AddPermission(pagePermission).then((res: any) => {
            window.console.log('页面权限新增结果反馈', res)
            // var authority = this.currentComponents[0].LayoutProperties.filter((item) => item.propertyName === '权限设置')[0]
            // if (authority) {
            //   authority.value = this.currentAuthCode
            //   this.currentAuthCode = undefined
            // }
            this.dropData.authCodes = this.currentAuthCode

            window.console.info('this.dropData.authCodes', this.dropData.authCodes)
          })
        }
        window.console.log(' pagePermission', pagePermission)
        this.$emit('ok', this.currentAuthCode)
        this.windowVisible = false
      })
    })
  }

  private handleCancel() {
    this.windowVisible = false
  }

  private addNewAuth() {}
}
</script>



<style lang="less" scoped>
@import '../../assets/globlaTheme.less';
</style>