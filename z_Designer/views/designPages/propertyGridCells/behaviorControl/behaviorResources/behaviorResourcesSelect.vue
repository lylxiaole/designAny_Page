/**
 * 行为设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <template v-if="currentObj.objType=='signs'">
      <a-dropdown>
        <a-badge>
          <a-icon v-if="canDeleteObj" slot="count" type="delete" @click="()=> this.onDelete(this.currentObj)" style="color: #f5222d;cursor:pointer" />
          <a-button style="margin-top:4px" @click="()=> this.onFocus(this.currentObj)" class="ant-dropdown-link">
            <span v-if="currentObj==null">请选择</span>
            <span v-else>{{currentObj.name}}</span>
            <a-icon type="down" />
          </a-button>
        </a-badge>
        <a-menu slot="overlay" @select="menuSelected" selectable>
          <a-menu-item v-for="sign in allSigns" :key="sign.resourceId" :value="sign.resourceId"
            style="width:90px;overflow:hideen; white-space:nowrap; text-overflow:ellipsis">
            {{sign.name}}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </template>

    <template v-else>
      <a-tooltip placement="top">
        <template v-if="currentObj.desc" slot="title">
          <span>{{currentObj.desc}}</span>
        </template>
        <a-badge>
          <a-icon v-if="canDeleteObj" slot="count" type="delete" @click="()=>{this.onDelete(this.currentObj)}"
            style="color: #f5222d;cursor:pointer" />
          <!-- // -->
          <a-input v-if="currentObj.objType=='fixedVal'" style="width:190px" v-model="currentObj.val" @click="() =>{ this.onFocus(this.currentObj)}">
            <a-icon slot="addonAfter" type="setting" @click="chooseResource" />
          </a-input>
          <!-- // -->
          <a-input v-if="currentObj.objType=='variable'" style="width:190px" v-model="currentObj.name" @click="() =>{ this.onFocus(this.currentObj)}">
            <a-icon slot="addonAfter" type="setting" @click="chooseResource" />
          </a-input>
          <!-- 弹窗关闭 点击展示行为设置弹窗 -->
          <a-button v-if="currentObj.objType=='callback'" type="primary" class="themeButton" @click="()=>{this.settingCallBack(this.currentObj)}">行为设置
          </a-button>
          <!-- // -->
          <a-button-group v-if="currentObj.objType=='method'" style="margin-top:4px">
            <a-button class="textEllipsis" style="width:160px;" @click="()=> this.onFocus(this.currentObj)">
              <span>{{currentObj.name}}</span>
            </a-button>
            <a-button style="width:30px;margin-top:-20px" @click="chooseResource">
              <a-icon type="setting" style="margin-left:-7px;margin-top:-4px" />
            </a-button>
          </a-button-group>
          <!-- // -->
        </a-badge>
      </a-tooltip>
      <resourceChooseWindow @onChooseObj="onChooseObj" :isVisible.sync="chooseResouceVisible"></resourceChooseWindow>
      <!-- // -->
      <callbackSetting ref="callbackSetting" :isVisible.sync="callbackSettingVisible" @onCompleteSetting="onCompleteSetting" />
    </template>
    <div style="display:none" ref="renderdiv"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'
import {
  groupNode,
  objectBase,
  objectType,
  resourceType,
  resourceSearchType,
  object_Variable,
  object_FixedVal,
  object_callback,
  popupCallback,
  formulaType
} from '@behaviorEngine/index'

import { getSearchClass, pageSearchBase } from '@behaviorEngine/index'
import { layoutEventBehaviors, behavior, action, actionDetail } from '@behaviorEngine/index'
import callbackSetting from './callbackSetting/callbackSetting.vue'

import resourceChooseWindow from './resoucesChooseWindow.vue'
import behaviorListInPageModal from '../behaviorListInPageModal.vue'
class treeNode {
  key: string
  title: string
  isGroup: boolean
  children: treeNode[] = []
}

@Options({
  components: {
    resourceChooseWindow,
    behaviorListInPageModal,
    callbackSetting
  }
})
export default class behaviorResourcesSelect extends Vue {
  @Prop() currentObj: objectBase
  @Prop() resourceTypesNotAllow: string[]
  @Prop() canDeleteObj: boolean
  @Prop() forType: formulaType

  private chooseResouceVisible: boolean = false
  private callbackSettingVisible: boolean = false
  private allSigns: objectBase[] = []
  private callboackbehaviorid: string = ''
  mounted() {
    if (this.forType == formulaType.cute) {
      let scalss = getSearchClass(resourceSearchType.signs)
      scalss.searchNext().then((res) => {
        if (res) {
          this.allSigns = res.childrenObjs
        }
      })
    } else {
      let scalss = getSearchClass(resourceSearchType.filterSigns)
      scalss.searchNext().then((res) => {
        if (res) {
          this.allSigns = res.childrenObjs
        }
      })
    }
  }
  // ********节点操作**********************************************************
  private onRefreshResource() {
    // this.normalResources = actionResources.objectResources.filter((o) => o.title != '运算符')
    // this.signResources = actionResources.objectResources.filter((o) => o.title == '运算符')[0].childrenObjs
  }
  // ********下拉列表操作**********************************************************
  private getSelectedObj(id: string, groups: groupNode[]): objectBase {
    for (let index = 0; index < groups.length; index++) {
      let group = groups[index]
      if (group.childrenObjs) {
        let findObj = group.childrenObjs.find((o) => o.resourceId == id)
        if (findObj) {
          return findObj
        }
      }
      if (group.childrenGroups) {
        let findObj = this.getSelectedObj(id, group.childrenGroups)
        if (findObj) {
          return findObj
        }
      }
    }
    return null
  }
  /**选择了运算符 */
  private menuSelected({ item, key, selectedKeys }: any) {
    if (selectedKeys.length < 1) {
      this.onSelectNodeChanged(null, this.currentObj)
      return
    }
    var currentnode = this.allSigns.find((o) => o.resourceId == key)

    this.onSelectNodeChanged(currentnode, this.currentObj)
  }
  /******************************************************************************** */
  private chooseResource() {
    // window.console.log('显示弹窗')
    this.chooseResouceVisible = true
  }

  private onChooseObj(obj: objectBase) {
    this.onSelectNodeChanged(obj, this.currentObj)
    this.chooseResouceVisible = false
  }

  private settingCallBack(obj: object_callback) {
    /****************************************************** */
    if (obj.isChoosePageSource) {
      var page = new PageBase()
      page.Load(obj.resourceId)
      page.width = 0
      page.height = 0
      ;(this.$refs.callbackSetting as any).page = page
    }
    ;(this.$refs.callbackSetting as any).isChoosePageSource = obj.isChoosePageSource
    ;(this.$refs.callbackSetting as any).allCallbacks = obj.pCallbacks
    this.callbackSettingVisible = true
  }
  private onCompleteSetting(callbacks: popupCallback[]) {
    ;(this.currentObj as object_callback).pCallbacks = callbacks
  }

  // ********对外事件**********************************************************
  @Emit('onSelectNodeChanged')
  private onSelectNodeChanged(newObj: objectBase, oldObj: objectBase) {}
  @Emit('onFocus')
  private onFocus(obj: objectBase) {}
  @Emit('onDelete')
  private onDelete(obj: objectBase) {}
}
</script>

<style lang="less" scoped>
.caaa {
  display: none;
}
</style>
 