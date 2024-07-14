 
<template>
  <div>
    <template v-if="currentObj.objType=='signs'">
      <!-- <a-dropdown>
        <a-badge>
          <a-icon v-if="canDeleteObj" slot="count" type="delete" @click="()=> this.onDelete(this.currentObj)" style="color: #f5222d;cursor:pointer" />
          <el-button style="margin-top:4px" @click="()=> this.onFocus(this.currentObj)" class="ant-dropdown-link">
            <span v-if="currentObj==null">请选择</span>
            <span v-else>{{currentObj.name}}</span>
            <a-icon type="down" />
          </el-button>
        </a-badge>
        <a-menu slot="overlay" @select="menuSelected" selectable>
          <a-menu-item v-for="sign in allSigns" :key="sign.resourceId" :value="sign.resourceId"
            style="width:90px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis">
            {{sign.name}}
          </a-menu-item>
        </a-menu>
      </a-dropdown> -->

      <el-dropdown @command="menuSelected">
        <span class="el-dropdown-link">
          {{currentTitle}}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="sign in allSigns" :key="sign.funcCode" :command="sign.funcCode"
              :value="sign.funcCode">{{sign.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </template>

    <template v-else>
      <el-tooltip placement="top" effect="dark" :content="currentObj.desc">
        <el-badge>
          <!-- <a-icon v-if="canDeleteObj" slot="count" type="delete" @click="()=>{this.$emit('onDelete',this.currentObj) }"
            style="color: #f5222d;cursor:pointer" /> -->
          <!-- // -->
          <el-input v-if="currentObj.objType=='fixedVal'" style="width:190px" v-model="currentObj.val"
            @click="() =>{this.$emit('onFocus',this.currentObj)}">
            <template #suffix>
              <span @click="chooseResource">重新选择</span>
            </template>
          </el-input>
          <!-- // -->
          <el-input v-if="currentObj.objType=='variable'" style="width:190px" v-model="currentObj.name"
            @click="() =>{this.$emit('onFocus',this.currentObj)}">
            <template #suffix>
              <el-icon @click="chooseResource">
                <Tools />
              </el-icon>
            </template>
          </el-input>
          <!-- 弹窗关闭 点击展示行为设置弹窗 -->
          <el-button v-if="currentObj.objType=='callback'" type="primary" class="themeButton"
            @click="()=>{this.settingCallBack(this.currentObj)}">行为绑定
          </el-button>
          <!-- // -->
          <div v-if="currentObj.objType=='method'" style="margin-top:4px">
            <el-button class="textEllipsis" style="width:160px;" @click="()=> this.$emit('onFocus',this.currentObj)">
              <span>{{currentObj.name}}</span>
            </el-button>
            <el-button style="width:30px;margin-top:-20px" @click="chooseResource">
              <el-icon>
                <Tools />
              </el-icon>
            </el-button>
          </div>
          <!-- // -->
        </el-badge>
      </el-tooltip>
      <resourceChooseWindow ref="resourceChooseWindow" @onChooseObj="onChooseObj"></resourceChooseWindow>
      <!-- // -->
      <callbackSetting ref="callbackSetting" @onCompleteSetting="onCompleteSetting" />
    </template>
    <div style="display:none" ref="renderdiv"></div>
  </div>
</template>

<script  >
import { ref } from 'vue'

import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'
import { formulaType } from '@behaviorEngine/index'

import { getSearchClass, pageSearchBase } from '@behaviorEngine/index'
import { behavior, action, actionDetail } from '@behaviorEngine/index'
import { funcCode, funcGroup, getFuncObjByGroup } from '@behaviorEngine/index'

import callbackSetting from './callbackSetting/callbackSetting.vue'
import resourceChooseWindow from './resoucesChooseWindow.vue'

// @Options({
//   components: {
//     resourceChooseWindow,
//     callbackSetting
//   }
// })
export default {
  components: {
    resourceChooseWindow,
    callbackSetting
  },
  data() {
    return {
      allSigns: [],
      callboackbehaviorid: '',
      currentSelectKey: undefined
    }
  },
  props: ['currentObj', 'resourceTypesNotAllow', 'canDeleteObj', 'forType'],
  emits: ['onSelectNodeChanged', 'onFocus', 'onDelete'],
  mounted() {
    if (this.forType == formulaType.cute) {
      this.allSigns = getFuncObjByGroup(funcGroup.cuteSigns)
    } else {
      this.allSigns = getFuncObjByGroup(funcGroup.filterSigns)
    }
  },
  methods: {
    onRefreshResource() {
      // this.normalResources = actionResources.objectResources.filter((o) => o.title != '运算符')
      // this.signResources = actionResources.objectResources.filter((o) => o.title == '运算符')[0].childrenObjs
    },
    getSelectedObj(id, groups) {
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
    },
    menuSelected(key) {
      this.currentSelectKey = key
      var currentnode = this.allSigns.find((o) => o.resourceId == key)
      this.$emit('onSelectNodeChanged', currentnode, this.currentObj)
    },
    chooseResource() {
      // window.console.log('显示弹窗')
      this.$refs.resourceChooseWindow.show()
    },
    onChooseObj(obj) {
      this.$emit('update:currentObj', obj)
      this.$emit('onSelectNodeChanged', obj, this.currentObj)
    },
    settingCallBack(obj) {
      /****************************************************** */
      if (obj.isChoosePageSource) {
        var page = new EnginePage()
        page.loadPageById(obj.resourceId)
        page.width = 0
        page.height = 0
        this.$refs.callbackSetting.page = page
      }
      this.$refs.callbackSetting.isChoosePageSource = obj.isChoosePageSource
      this.$refs.callbackSetting.allCallbacks = obj.pCallbacks
      this.$refs.callbackSetting.show()
    },
    onCompleteSetting(callbacks) {
      this.currentObj.pCallbacks = callbacks
    }
  },
  computed: {
    currentTitle() {
      if (!this.currentSelectKey) {
        return '请选择'
      }
      var currentnode = this.allSigns.find((o) => o.funcCode === this.currentSelectKey)
      return currentnode.name
    }
  }
}
</script>

<style lang="less" scoped>
.caaa {
  display: none;
}
</style>
 